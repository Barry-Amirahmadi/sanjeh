"use client";

import { useState } from "react";
import type { ArchiveItem } from "@/types/content";
import { ArchiveFigure } from "./ArchiveFigure";
import { Lightbox } from "./Lightbox";

/**
 * The technical archive: six figures at one ratio, in a uniform grid.
 *
 * Uniform is the whole point, and it is the same argument as the product
 * index: no figure is larger than another, none is featured, and the grid does
 * not stagger. The editorial family's gallery shifts its plates' top edges to
 * make the page feel composed; a document that records a process does not.
 */
const FIGURE_CLASS = "col-span-12 md:col-span-6 lg:col-span-4";
const FIGURE_SIZES = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 32vw";

export function ArchiveGrid({ items }: { items: ArchiveItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid-12">
        {items.map((item, index) => (
          <li key={item.id} className={FIGURE_CLASS}>
            <ArchiveFigure
              item={item}
              number={String(index + 1).padStart(2, "0")}
              sizes={FIGURE_SIZES}
              onOpen={() => setOpenIndex(index)}
            />
          </li>
        ))}
      </ul>

      <Lightbox
        items={items}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
