import { publishedProducts } from "@/content/products";
import { collectCategories } from "@/content/categories";
import { collection, productIndex } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";
import { toFa } from "@/lib/digits";
import { Band } from "@/components/layout/Band";
import { BandHeading } from "@/components/layout/BandHeading";
import { ComparisonTable } from "@/components/products/ComparisonTable";
import { ProductGrid } from "@/components/products/ProductIndex";

/**
 * Collection page — two things stacked, in this order.
 *
 *   01 the full specification comparison, one row per product
 *   02 the same uniform nine-cell grid as the homepage, grouped by category
 *
 * The comparison comes first because it is the thing a buyer came for and the
 * thing no other site in this family offers. The grid below is the same
 * register read a second way: it is not re-styled, not re-sized and not
 * re-ordered, because the register looking identical wherever it appears is
 * part of what the design is arguing.
 *
 * Unlike the editorial family's collection page this one *does* group by
 * category, and the reason is arithmetic rather than principle: three
 * categories of three produce three real groups, where five single-product
 * categories would have produced five headed groups of one.
 */
export const metadata = pageMetadata({
  title: collection.seo.title,
  description: collection.seo.description,
  path: "/products/",
});

export default function CollectionPage() {
  const products = publishedProducts;
  const categories = collectCategories(products);

  return (
    <>
      <Band ground="dial" rhythm="tight" rules aria-labelledby="collection-heading">
        <BandHeading
          id="collection-heading"
          index={collection.index}
          heading={collection.heading}
          lead={collection.lead}
          level={1}
        />

        <ComparisonTable products={products} />

        <p className="t-meta mt-[var(--space-4)]">
          {toFa(products.length)} {productIndex.countLabel}
        </p>
      </Band>

      <Band ground="dial" rhythm="tight" aria-labelledby="groups-heading">
        <BandHeading
          id="groups-heading"
          index={collection.groupsIndex}
          heading={collection.groupsLabel}
        />

        {categories.map((category) => (
          <section
            key={category.name}
            id={category.anchor}
            aria-labelledby={`${category.anchor}-heading`}
            className="mb-[var(--space-8)] last:mb-0"
          >
            <div className="mb-[var(--space-5)] flex items-baseline gap-3 border-b border-[var(--color-rule)] pb-[var(--space-2)]">
              {/* The category's own colour, shown as the same 3px bar its
                  products carry. Decorative here too: the heading beside it
                  says the category in words. */}
              <span
                className="block h-[3px] w-8 flex-none"
                style={{ backgroundColor: category.tone }}
                aria-hidden="true"
              />
              <h3 id={`${category.anchor}-heading`} className="t-h3">
                {category.name}
              </h3>
              <span className="t-meta">
                {toFa(category.count)} {productIndex.countLabel}
              </span>
            </div>

            <ProductGrid products={category.members} label={category.name} />
          </section>
        ))}
      </Band>
    </>
  );
}
