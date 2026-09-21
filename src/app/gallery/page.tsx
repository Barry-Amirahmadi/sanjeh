import { sortedArchive } from "@/content/archive";
import { archive } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";
import { toFa } from "@/lib/digits";
import { Band } from "@/components/layout/Band";
import { BandHeading } from "@/components/layout/BandHeading";
import { ArchiveGrid } from "@/components/archive/ArchiveGrid";

/**
 * Technical archive — six figures at one ratio, every one captioned.
 *
 * The route keeps its original path. It is no longer a gallery in the
 * editorial sense: nothing here is full-bleed, nothing is larger than anything
 * else, and no tile is allowed in without a figure number and a caption saying
 * what is being looked at. An uncaptioned photograph on a supplier's site is
 * decoration; a numbered one is a reference.
 *
 * The lightbox is the one inherited interaction that survives unchanged,
 * because looking closer at a machined surface is a real thing to want.
 */
export const metadata = pageMetadata({
  title: archive.seo.title,
  description: archive.seo.description,
  path: "/gallery/",
});

export default function ArchivePage() {
  return (
    <Band ground="dial" rhythm="tight" rules aria-labelledby="archive-heading">
      <BandHeading
        id="archive-heading"
        index={archive.index}
        heading={archive.heading}
        lead={archive.lead}
        level={1}
      />

      <ArchiveGrid items={sortedArchive} />

      <p className="t-meta mt-[var(--space-6)]">
        {toFa(sortedArchive.length)} {archive.figureLabel}
      </p>
    </Band>
  );
}
