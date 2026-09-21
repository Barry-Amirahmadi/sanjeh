import Link from "next/link";
import type { ResolvedProduct, Spec } from "@/types/content";
import { productIndex } from "@/content/sections";
import { productAnchor, specByLabel } from "@/content/categories";
import { Plate } from "@/components/ui/Plate";
import { SpecValue } from "@/components/data/SpecValue";

/**
 * One cell of the product index, and every cell is identical.
 *
 * A square photograph, a 3px category bar, the catalogue code in the mono face,
 * the name, the category in words, and exactly three specifications. **No cell
 * is larger than another** — the editorial family's `tall` / `wide` /
 * `compact` / `feature` rhythm does not exist here, and saying so is part of
 * the design: a register does not rank its entries by how much space each is
 * given.
 *
 * Colour never carries meaning on its own. The bar is `aria-hidden`; the
 * category is printed underneath in words and is also part of the link's
 * accessible name, so a reader who cannot distinguish the three blues loses
 * nothing at all.
 */
export function ProductCell({ product, sizes }: { product: ResolvedProduct; sizes: string }) {
  const headingId = productAnchor(product.slug);
  const href = `/products/${product.slug}/`;

  const specs = productIndex.cellSpecs
    .map((label) => specByLabel(product, label))
    .filter((spec): spec is Spec => spec !== undefined);

  return (
    <article className="product-cell h-full" aria-labelledby={headingId}>
      <span
        className="product-cell__bar"
        style={{ backgroundColor: product.tone }}
        aria-hidden="true"
      />

      <Plate media={product.image} sizes={sizes} className="border-0 border-b" />

      <div className="product-cell__body">
        {/* `dir="ltr"` for the same reason every measurement carries it: a code
            of Latin letters, a hyphen and digits is reordered by the bidi
            algorithm inside an RTL paragraph. */}
        <p className="product-cell__code" dir="ltr">
          {product.code}
        </p>

        <h3 id={headingId} className="t-h3">
          <Link href={href} className="product-cell__name">
            {product.name}
            <span className="sr-only">
              {" "}
              — {productIndex.detailLabel} — {product.category}
            </span>
          </Link>
        </h3>

        <p className="t-meta">{product.category}</p>

        <dl className="product-cell__specs">
          {specs.map((spec) => (
            <div key={spec.label} className="product-cell__spec">
              <dt>{spec.label}</dt>
              <dd>
                <SpecValue spec={spec} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
