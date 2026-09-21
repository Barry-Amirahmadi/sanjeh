import type { ResolvedProduct } from "@/types/content";

/**
 * What to show at the bottom of a product page — two more rows of the same
 * table, never a set of cards.
 *
 * The rule, in order:
 *
 * 1. Start reading from the product *after* this one and wrap around, so each
 *    page shows a different pair. Taking the first two of the list every time
 *    would make most pages recommend the same two products.
 * 2. Prefer the same category.
 *
 * Rule 2 was inert in the editorial engine, where five products sat in five
 * categories and no category had a second member. Here it does real work:
 * three categories of three each mean a valve page always offers the other two
 * valves, which is what a buyer comparing parts actually wants.
 */
export function relatedProducts(
  product: ResolvedProduct,
  all: readonly ResolvedProduct[],
  count = 2,
): ResolvedProduct[] {
  const position = all.findIndex((candidate) => candidate.id === product.id);
  if (position === -1) return all.slice(0, count);

  const following = [...all.slice(position + 1), ...all.slice(0, position)];

  return [
    ...following.filter((candidate) => candidate.category === product.category),
    ...following.filter((candidate) => candidate.category !== product.category),
  ].slice(0, count);
}
