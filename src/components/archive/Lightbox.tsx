"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { LightboxItem } from "@/types/content";
import { ui } from "@/content/ui";
import { toFa } from "@/lib/digits";
import { withBasePath } from "@/lib/basePath";

interface LightboxProps {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}

/**
 * The enlarged view, shared by the technical archive and a product's
 * alternative views.
 *
 * A native `<dialog>` opened with `showModal()`, which gives the top layer, the
 * backdrop, the inert page beneath and Escape-to-close for free rather than
 * reimplementing four things browsers already do correctly.
 *
 * Behaviour kept from the editorial engine because it was right:
 *
 * - Clicking the backdrop closes it. The click target *is* the dialog element
 *   when the press lands outside its content box, which is what the listener
 *   below tests for.
 * - The body stops scrolling while it is open. `showModal()` makes the page
 *   inert but does not stop it scrolling behind the dialog.
 * - **ArrowLeft advances.** Left is forward in a right-to-left document, and
 *   matching the reading direction is the precedent for every keyboard
 *   interaction in this project.
 * - No `autoFocus`: `showModal()` already focuses the first focusable
 *   descendant, which is the close button.
 *
 * One thing is new: the stepper is not rendered for a single-item set. A
 * product with one alternative view opens a dialog where "next" and "previous"
 * would both be itself, and a control that does nothing is worse than no
 * control.
 */
export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const item = open ? items[index] : null;
  const steppable = items.length > 1;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) onClose();
    };
    dialog.addEventListener("click", onBackdropClick);
    return () => dialog.removeEventListener("click", onBackdropClick);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + items.length) % items.length);
    },
    [index, items.length, onNavigate],
  );

  useEffect(() => {
    if (!open || !steppable) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(1); // left is forward in RTL
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(-1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, steppable, step]);

  return (
    <dialog ref={dialogRef} className="lightbox on-dark" aria-label={ui.lightbox.label} onClose={onClose}>
      {item ? (
        <div className="flex h-full flex-col">
          <div className="container flex items-center justify-between gap-4 border-b border-[var(--color-rule-dark)] py-3">
            <p className="t-meta">
              {toFa(index! + 1)} {ui.lightbox.counterJoin} {toFa(items.length)}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="menu-toggle"
              aria-label={ui.lightbox.close}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              key={item.id}
              src={withBasePath(item.image.src)}
              alt={item.image.alt}
              fill
              sizes="100vw"
              className="object-contain p-4"
            />
          </div>

          <div className="container flex items-center justify-between gap-4 border-t border-[var(--color-rule-dark)] py-4">
            <div>
              <p className="t-h3">{item.title}</p>
              <p className="t-meta pt-1">{item.caption}</p>
            </div>

            {steppable ? (
              <div className="flex flex-none items-center gap-1">
                {/* Previous sits at the start edge, next at the end — the order
                    a Persian reader expects from a pair of stepper controls. */}
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="menu-toggle"
                  aria-label={ui.lightbox.previous}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" fill="none">
                    <path d="M2 8h12M14 8l-5-5M14 8l-5 5" stroke="currentColor" strokeWidth="1.25" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="menu-toggle"
                  aria-label={ui.lightbox.next}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" fill="none">
                    <path d="M14 8H2M2 8l5-5M2 8l5 5" stroke="currentColor" strokeWidth="1.25" />
                  </svg>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
