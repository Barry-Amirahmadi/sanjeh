"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The navigation panel below the `lg` breakpoint.
 *
 * Kept from the editorial engine because the behaviour is right — focus moves
 * in on open and is restored on close, Escape closes, Tab is trapped inside,
 * the body stops scrolling, and every control that leaves the panel closes it
 * first. What changed is the look: the links are `--text-h3`, not a display
 * scale, and each carries its index in the mono face, so the panel reads as a
 * numbered contents page rather than a splash screen.
 *
 * There is no social row any more: this company's enquiry route is a phone
 * call, an email or a WhatsApp message with a part code in it.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      className="menu-panel on-dark"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label={ui.nav.menuDialog}
    >
      <div className="container flex items-center justify-between border-b border-[var(--color-rule-dark)] py-3">
        {/* Every control that leaves the panel closes it — the lockup and the
            CTA included, not just the nav links. */}
        <Wordmark onClick={onClose} />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="menu-toggle"
          aria-label={ui.nav.closeMenu}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.25" />
          </svg>
        </button>
      </div>

      {/* Same accessible name as the header's nav, and correctly so: the panel
          carries `visibility: hidden` while closed, so only ever one of the two
          is in the accessibility tree. */}
      <nav className="container flex-1 overflow-y-auto pt-6" aria-label={ui.nav.primary}>
        <ul>
          {site.nav.map((item, i) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onClose}
                className="menu-panel__link"
                /* Rendered by CSS as the row's trailing index. Decorative, and
                   it stays out of the text content so it is never read aloud
                   before the destination it numbers. */
                data-index={String(i + 1).padStart(2, "0")}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container pb-8 pt-6">
        <Button href={site.headerCta.href} variant="primary" className="w-full" onClick={onClose}>
          {site.headerCta.label}
        </Button>
      </div>
    </div>
  );
}
