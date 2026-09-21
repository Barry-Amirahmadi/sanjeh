import { note } from "@/content/sections";
import { Band } from "@/components/layout/Band";
import { BandHeading } from "@/components/layout/BandHeading";
import { Plate } from "@/components/ui/Plate";

/**
 * Band 05 — the technical note, set like a journal article.
 *
 * **This is the band that does the selling, and it is the band most likely to
 * be cut for looking boring.** It is not a blog post and not a brochure: it
 * explains one engineering principle a reader of this site has to make a
 * decision about — how a control valve's characteristic curve interacts with a
 * line's own pressure drop — and explaining it clearly is the only credential
 * this page offers. Nothing else here asks to be believed.
 *
 * The figure is a hand-authored SVG rather than a generated photograph, which
 * is a deliberate departure: a chart is the one thing on this site that must be
 * read rather than looked at, and an image model asked for a chart produces
 * garbled axis text and invented numbers. It is also the only image here that
 * will never be swapped for a real photograph, so it is a permanent asset
 * rather than a placeholder.
 */
export function TechnicalNote() {
  return (
    <Band ground="dial" rhythm="tight" aria-labelledby="note-heading">
      <BandHeading id="note-heading" index={note.index} heading={note.heading} lead={note.lead} />

      <div className="grid-12">
        {/* Ascending column starts, and both rows pinned: grid's sparse
            auto-placement cursor never moves backwards, so a block asking for
            an earlier column than the one beside it is silently pushed onto a
            new implicit row. Pinning is what keeps an edit from reintroducing
            that. */}
        <div className="col-span-12 lg:col-span-7 lg:row-start-1">
          <div className="note-columns">
            {note.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        <figure className="col-span-12 lg:col-span-4 lg:col-start-9 lg:row-start-1">
          <Plate
            media={note.figure}
            sizes="(max-width: 1024px) 100vw, 30vw"
            fit="contain"
            className="bg-[var(--color-safheh)]"
          />
          <figcaption className="figure-tile__meta">
            <span className="t-label-fa whitespace-nowrap">
              {note.figureLabel}{" "}
              <span className="figure-tile__number" dir="ltr">
                {note.figureNumber}
              </span>
            </span>
            <span className="t-meta">{note.figure.caption}</span>
          </figcaption>
        </figure>
      </div>
    </Band>
  );
}
