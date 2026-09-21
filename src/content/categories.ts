import type { ResolvedProduct, Spec } from "@/types/content";

/**
 * Category taxonomy and spec lookup — both derived rather than authored.
 *
 * `category` already exists on every product as free Persian text, and that is
 * deliberately left alone: a parallel `categorySlug`, a category registry and
 * category landing routes would be a taxonomy system built for nine products.
 * What the pages actually need is the list of categories in editorial order,
 * how many products are in each, and the members of each — all three readable
 * off the product list itself.
 *
 * The shapes returned here are the shapes a real category system would expose,
 * so growing into one later is an implementation change behind these functions
 * rather than a redesign of the pages that consume them.
 */

export interface CategoryEntry {
  /** The Persian label exactly as an editor wrote it on the product. */
  name: string;
  /** The category's bar colour, taken from its first member. */
  tone: string;
  count: number;
  /** Element id of the group's heading, so an index entry can jump to it. */
  anchor: string;
  members: ResolvedProduct[];
}

/** The one place a product's on-page element id is spelled. */
export function productAnchor(slug: string): string {
  return `product-${slug}`;
}

/** The one place a category group's element id is spelled. Derived from the
 *  first member's slug rather than from the Persian label, which would need
 *  transliterating to be a valid, stable fragment. */
export function categoryAnchor(entry: { members: ResolvedProduct[] }): string {
  return `group-${entry.members[0]?.slug ?? "unknown"}`;
}

/**
 * Categories in the order the editor's own sequence introduces them — never
 * alphabetical. Unlike the editorial engine, the collection page *does* group
 * by category here, because with three categories of three this produces three
 * real groups rather than nine headed groups of one.
 */
export function collectCategories(list: readonly ResolvedProduct[]): CategoryEntry[] {
  const entries = new Map<string, CategoryEntry>();

  for (const product of list) {
    const existing = entries.get(product.category);
    if (existing) {
      existing.count += 1;
      existing.members.push(product);
      continue;
    }
    entries.set(product.category, {
      name: product.category,
      tone: product.tone,
      count: 1,
      anchor: "",
      members: [product],
    });
  }

  // The anchor needs the group's first member, which is only known once the
  // pass is finished — so it is filled in here rather than guessed above.
  return [...entries.values()].map((entry) => ({ ...entry, anchor: categoryAnchor(entry) }));
}

/**
 * One product's value for a named specification, or `undefined`.
 *
 * The comparison table asks every product for the same ordered set of labels
 * (`collection.comparisonLabels`), and an uneven `details` list is a normal
 * authoring state rather than an error — so the miss is returned as `undefined`
 * and rendered as the interface's own empty-cell string, never as a blank that
 * a reader could mistake for a measured zero.
 */
export function specByLabel(product: ResolvedProduct, label: string): Spec | undefined {
  return product.details?.find((spec) => spec.label === label);
}
