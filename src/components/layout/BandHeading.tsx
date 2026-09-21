import { cn } from "@/lib/cn";

interface BandHeadingProps {
  id: string;
  /** Two digits in the mono face, e.g. "03". Decorative — see below. */
  index: string;
  heading: string;
  lead?: string;
  /** Keeps the document outline correct even where the visual size of a
   *  heading does not track its level. */
  level?: 1 | 2 | 3;
  className?: string;
}

const tags = { 1: "h1", 2: "h2", 3: "h3" } as const;

/**
 * Every band opens the same way: a mono index, the heading, a full-strength
 * rule beneath both, then the lead.
 *
 * The index is what makes the homepage read as a numbered document rather than
 * a scroll with headings — and it is `aria-hidden`, because a screen reader
 * should hear «فهرست محصولات», not «۰۳ فهرست محصولات». The number is a
 * navigational aid for the eye and carries nothing the heading does not.
 *
 * The heading itself stays at `--text-h2` regardless of level. Nothing on this
 * site announces itself by size.
 */
export function BandHeading({
  id,
  index,
  heading,
  lead,
  level = 2,
  className,
}: BandHeadingProps) {
  const Tag = tags[level];

  return (
    <header className={cn("mb-[var(--space-6)]", className)}>
      <div className="band-head mb-0">
        <span className="band-head__index" aria-hidden="true">
          {index}
        </span>
        <Tag id={id} className={level === 1 ? "t-h1" : "t-h2"}>
          {heading}
        </Tag>
      </div>
      {lead ? <p className="t-lead mt-[var(--space-4)]">{lead}</p> : null}
    </header>
  );
}
