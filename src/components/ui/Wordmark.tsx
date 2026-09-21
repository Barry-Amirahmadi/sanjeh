import Link from "next/link";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";

/**
 * The company name, locked up with its Latin transliteration across a hairline.
 *
 * Restrained on purpose, and this is where the restraint is most visible: the
 * name in the header is 17px, and even at its largest — on the homepage
 * masthead — it tops out at 3rem. Nothing on this site is set at display scale.
 *
 * One accessible name for the whole lockup, so a screen reader hears
 * «سنجه — صفحهٔ اصلی» once rather than the Persian name and then the Latin one.
 */
export function Wordmark({
  className,
  onClick,
}: {
  className?: string;
  /** Present so the copy inside the mobile panel can close it on the way out. */
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex min-h-11 items-baseline gap-3", className)}
      onClick={onClick}
      aria-label={`${site.brand.name} — ${ui.nav.home}`}
    >
      <span className="t-h3" style={{ fontWeight: 700 }}>
        {site.brand.name}
      </span>
      <span
        className="t-label"
        style={{
          borderInlineStart: "1px solid var(--color-rule-mid)",
          paddingInlineStart: "0.6rem",
        }}
      >
        {site.brand.latin}
      </span>
    </Link>
  );
}
