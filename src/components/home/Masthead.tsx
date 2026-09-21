import { site } from "@/content/site";
import { masthead } from "@/content/sections";
import { Band } from "@/components/layout/Band";
import { DataList } from "@/components/data/DataList";

/**
 * Band 01 — the company's own specification sheet.
 *
 * There is no hero image here, no statement quote, no brand story and no
 * values band anywhere on this homepage. A page in this trade opens the way a
 * datasheet opens: the name, one sentence saying what this is, then the
 * numbers. A buyer is not persuaded by a photograph across the top; they read
 * a site as evidence of whether the company is organised.
 *
 * The company name is `--text-h1` — `clamp(1.75rem, 3.2vw, 3rem)`, topping out
 * at 48px. It is the largest thing on the site and it is still small.
 *
 * `rules` draws the twelve column hairlines behind this band, which is where a
 * reader first sees that the page is built on a grid rather than centred in
 * space.
 */
export function Masthead() {
  return (
    <Band id="masthead" ground="dial" rhythm="tight" rules aria-labelledby="masthead-heading">
      <div className="grid-12 items-baseline">
        {/* `lg:row-start-1` on both halves is a guard, not tidiness: CSS Grid's
            sparse auto-placement cursor never moves backwards, so a later child
            asking for an earlier column is silently pushed onto a new implicit
            row. These two ascend, so the bug cannot bite here — pinning the row
            keeps it that way if the order is ever edited. */}
        <div className="col-span-12 lg:col-span-5 lg:row-start-1">
          <p className="t-label mb-3" aria-hidden="true">
            {masthead.index}
          </p>
          <h1 id="masthead-heading" className="t-h1">
            {site.brand.name}
          </h1>
          <p className="t-label mt-2">{site.brand.latin}</p>
        </div>

        <p className="t-lead col-span-12 lg:col-span-6 lg:col-start-7 lg:row-start-1">
          {masthead.descriptor}
        </p>
      </div>

      <DataList items={masthead.facts} className="mt-[var(--space-6)]" />
    </Band>
  );
}
