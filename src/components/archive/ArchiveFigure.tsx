import type { LightboxItem } from "@/types/content";
import { archive } from "@/content/sections";
import { Plate } from "@/components/ui/Plate";

interface ArchiveFigureProps {
  item: LightboxItem;
  /** Two digits, Latin, mono: "01". */
  number: string;
  sizes: string;
  onOpen: () => void;
}

/**
 * One numbered figure in the technical archive, and the same object on a
 * product page's alternative views.
 *
 * **A caption is required, not optional.** The editorial family's gallery tiles
 * fall back to a category label when no caption is written; here the type makes
 * the caption mandatory, because an uncaptioned technical image is a
 * decoration and this site does not decorate.
 *
 * The trigger is a real `<button>` with its own accessible name, and it
 * computes `cursor: pointer` — asserted in the smoke suite. The editorial
 * engine shipped these computing `default`, a known open defect, and this
 * build does not inherit it.
 */
export function ArchiveFigure({ item, number, sizes, onOpen }: ArchiveFigureProps) {
  return (
    <figure>
      <button type="button" onClick={onOpen} className="figure-tile">
        <Plate media={item.image} sizes={sizes} />
        {/* The button's whole accessible name: the tile is an image and a
            button, so it has to say what pressing it does. */}
        <span className="sr-only">
          {archive.viewLabel} — {item.title}
        </span>
      </button>

      <figcaption className="figure-tile__meta">
        <span className="t-label-fa whitespace-nowrap">
          {archive.figureLabel}{" "}
          <span className="figure-tile__number" dir="ltr">
            {number}
          </span>
        </span>
        <span className="t-meta">
          <b className="block font-medium text-[var(--color-ink)]">{item.title}</b>
          {item.caption}
        </span>
      </figcaption>
    </figure>
  );
}
