import type { Product, ResolvedProduct } from "@/types/content";

/**
 * Fills in the presentation field a CMS editor can leave empty.
 *
 * **`tone` is repurposed on this site, not removed, and this is the one place
 * that is documented — do not "restore" the old behaviour.** In the editorial
 * engine this colour drove an ambient wash that bled behind the product
 * showcase as each product scrolled into view. There is no wash here and no
 * dark showcase for one to sit behind. `tone` now supplies the 3px category bar
 * across the top of a product's cell in the index: one colour per category,
 * three colours in total, chosen for a measured 3:1 against the cell ground.
 *
 * Because it is a *category* colour rather than a *product* colour, the
 * fallback below is a neutral rather than an invented hue — a product whose
 * category nobody set should read as uncategorised, not as belonging to one of
 * the three.
 *
 * Note what this function no longer does: there is no `layout` resolution.
 * The editorial family cycles `tall → wide → feature → compact` so a spread has
 * rhythm. This site's nine cells are identical and none is larger than another,
 * so the field does not exist on the model at all — see the comment on
 * `ResolvedProduct` in src/types/content.ts.
 */

/** Kept as a token-adjacent constant: a mid grey that is legible as a bar
 *  (3.85:1 against the cell ground) and belongs to none of the categories. */
export const FALLBACK_TONE = "#7A8296";

export function resolveProduct(product: Product): ResolvedProduct {
  return {
    ...product,
    tone: product.tone ?? FALLBACK_TONE,
  };
}

/**
 * Unlike the editorial engine's version, position no longer matters — nothing
 * here falls back by index — so a filtered list and an unfiltered one resolve
 * identically. The list handed in is still the one that renders, which keeps
 * the call sites honest if a positional rule is ever added back.
 */
export function resolveProducts(list: readonly Product[]): ResolvedProduct[] {
  return list.map(resolveProduct);
}
