import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * One horizontal band of the document.
 *
 * Replaces the editorial engine's `Section`, and the differences are the
 * design: there are only two light grounds and one dark, the dark one is the
 * footer, and a band can draw the twelve-column grid behind itself.
 *
 * `rules` is not decoration. On this site the grid is visible in the masthead
 * and the capability band, which is what makes every later block read as
 * sitting *on* a system rather than being centred in space.
 */

type Ground = "dial" | "scale" | "dark" | "none";

interface BandProps {
  children: ReactNode;
  id?: string;
  ground?: Ground;
  /** Vertical rhythm. Bands deliberately do not all breathe the same. */
  rhythm?: "default" | "tight" | "none";
  /** Draws the twelve column hairlines behind this band's content. */
  rules?: boolean;
  /** Set false when the band manages its own horizontal padding. */
  contained?: boolean;
  className?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}

const grounds: Record<Ground, string> = {
  dial: "ground-dial",
  scale: "ground-scale",
  dark: "ground-dark on-dark",
  none: "",
};

/**
 * Twelve inert hairlines, laid out on the *same* grid the content uses, so a
 * line cannot drift off a column boundary as the gap flexes. Absolutely
 * positioned inside a `relative` container, so it can neither affect layout
 * nor make the page scroll sideways.
 */
function GridRules() {
  return (
    <div className="grid-rules" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  );
}

export function Band({
  children,
  id,
  ground = "dial",
  rhythm = "default",
  rules = false,
  contained = true,
  className,
  ...rest
}: BandProps) {
  const body = rules ? (
    <>
      <GridRules />
      <div className="relative">{children}</div>
    </>
  ) : (
    children
  );

  return (
    <section
      id={id}
      className={cn(grounds[ground], className)}
      style={{
        paddingBlock:
          rhythm === "none" ? undefined : `var(--section-y${rhythm === "tight" ? "-tight" : ""})`,
      }}
      {...rest}
    >
      {contained ? <div className="container relative">{body}</div> : body}
    </section>
  );
}
