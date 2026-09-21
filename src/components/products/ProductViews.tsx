"use client";

import { useState } from "react";
import type { LightboxItem, ResolvedProduct } from "@/types/content";
import { ArchiveFigure } from "@/components/archive/ArchiveFigure";
import { Lightbox } from "@/components/archive/Lightbox";

/**
 * A product's alternative views.
 *
 * Each product carries exactly one `view` — a second angle or a sectional.
 * A component catalogue does not need three angles of a valve, and every extra
 * image is one more to generate.
 *
 * The **lightbox holds the catalogue photograph as well as the views**, even
 * though only the views are shown as figures here: a reader who opens the
 * sectional can step back to the main photograph, which is the comparison they
 * are actually making. The figure's `onOpen` therefore offsets by one.
 *
 * Renders nothing at all when a product has no views — an empty band with a
 * heading over it is worse than no band.
 */
const FIGURE_CLASS = "col-span-12 md:col-span-6";
const FIGURE_SIZES = "(max-width: 768px) 100vw, 45vw";

export function ProductViews({ product }: { product: ResolvedProduct }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const views = product.views ?? [];
  const items: LightboxItem[] = [product.image, ...views].map((image, i) => ({
    id: `${product.id}-${i}`,
    title: product.name,
    caption: image.alt,
    image,
  }));

  if (views.length === 0) return null;

  return (
    <>
      <ul className="grid-12">
        {views.map((view, index) => (
          <li key={view.src} className={FIGURE_CLASS}>
            <ArchiveFigure
              item={{
                id: `${product.id}-view-${index}`,
                title: product.name,
                caption: view.alt,
                image: view,
              }}
              number={String(index + 2).padStart(2, "0")}
              sizes={FIGURE_SIZES}
              /* +1: index 0 in the dialog is the catalogue photograph. */
              onOpen={() => setOpenIndex(index + 1)}
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
