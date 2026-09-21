import type { Product } from "@/types/content";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Schema.org mappings.
 *
 * Every field below reads straight off the content model. Nothing is invented
 * to satisfy a schema, which is the whole discipline here — structured data is
 * the easiest place on a site to assert something false, because no reader ever
 * sees it and the vocabulary invites you to fill in a shape. On an industrial
 * site the invitation is stronger than most: the Product vocabulary has slots
 * for certifications, awards and compliance that this business does not have.
 *
 * What that rules out, specifically:
 *
 * - **No `offers`.** No price, currency, availability or seller exists, and
 *   this site has no commerce at all. Google will not render a product rich
 *   result without one; a fabricated price to earn that snippet would be a lie
 *   told to a search engine about a business.
 * - **No `aggregateRating` or `review`.** There are none.
 * - **No `hasCertification`, `award` or `isAccessibleForFree`-style claims.**
 * - **No `sameAs`.** There are no social accounts to point at.
 * - **No `telephone` or `email`.** Both are deliberately unassigned
 *   placeholders; publishing them as machine-readable contact points asserts
 *   that a real business answers there.
 * - **No `logo`.** No logo asset exists — the mark lives in the favicon and on
 *   the share card, neither of which is a logo file a real company would
 *   supply. `image` carries the share card instead, which is what it is.
 */
export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand.name,
    alternateName: site.brand.latin,
    url: absoluteUrl("/"),
    description: site.seo.description,
    image: absoluteUrl(site.seo.ogImage.src),
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.city,
      addressCountry: "IR",
    },
  };
}

export function productSchema(product: Product): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    /** The catalogue code, which is exactly what `sku` means. It is the one
     *  identifier this product actually has. */
    sku: product.code,
    description: product.seo?.description ?? product.description,
    category: product.category,
    url: absoluteUrl(`/products/${product.slug}/`),
    image: absoluteUrl(product.image.src),
    brand: { "@type": "Brand", name: site.brand.name },
    /**
     * The specification table, as `additionalProperty`. Safe to publish because
     * every row is a physical attribute of the part — see the header comment in
     * `src/content/products.ts` for the line that separates a description from
     * a claim, and why no row here can cross it.
     */
    additionalProperty: (product.details ?? []).map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
  };
}
