import type { ReactNode } from "react";

interface ScrollTableProps {
  /** Accessible name of the scroll region. Required — an unnamed region is
   *  announced as "region" and tells a reader nothing. */
  label: string;
  /** Visual note shown where the table is narrower than its content. */
  hint: string;
  children: ReactNode;
}

/**
 * The one table on this site too wide to restructure.
 *
 * Every other table on SANJEH collapses into stacked label/value rows on a
 * phone. The full specification comparison cannot: comparing nine products
 * across five measurements *is* the feature, and stacking it turns the
 * comparison back into nine separate lists. So it scrolls inside its own
 * region rather than pushing the page body sideways — the page must never
 * scroll horizontally, and this is how that holds.
 *
 * Three things make the region usable rather than merely present:
 *
 * - `overflow-x: auto` on a container that is *not* the page body.
 * - `tabIndex={0}`, so a keyboard can scroll it. A scroll container only a
 *   mouse can reach hides content from anybody navigating by keyboard, and
 *   the browser does not make it focusable on its own.
 * - `role="region"` plus a name, so the focus stop announces what it is
 *   instead of landing on an anonymous `div`.
 *
 * The hint stays in the accessibility tree deliberately. It is one short true
 * sentence, and a reader who cannot see the clipped edge benefits from being
 * told the table continues.
 */
export function ScrollTable({ label, hint, children }: ScrollTableProps) {
  return (
    <>
      <p className="table-scroll__hint lg:hidden">
        <span aria-hidden="true">↔</span>
        {hint}
      </p>
      <div className="table-scroll" tabIndex={0} role="region" aria-label={label}>
        {children}
      </div>
    </>
  );
}
