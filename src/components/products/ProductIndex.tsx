import Link from "next/link";
import type { ResolvedProduct } from "@/types/content";
import { productIndex } from "@/content/sections";
import { toFa } from "@/lib/digits";
import { Band } from "@/components/layout/Band";
import { BandHeading } from "@/components/layout/BandHeading";
import { ProductCell } from "./ProductCell";

/** One cell per column at 1024 and up, two from 768, one below. */
const CELL_CLASS = "col-span-12 md:col-span-6 lg:col-span-4";
const CELL_SIZES = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 32vw";

/**
 * The uniform grid of nine. Reused verbatim by the collection page's grouped
 * listing, which is the point of having it as a component: the register looks
 * the same wherever it is read.
 */
export function ProductGrid({
  products,
  label,
}: {
  products: readonly ResolvedProduct[];
  label: string;
}) {
  return (
    <ul className="grid-12" aria-label={label}>
      {products.map((product) => (
        <li key={product.id} className={CELL_CLASS}>
          <ProductCell product={product} sizes={CELL_SIZES} />
        </li>
      ))}
    </ul>
  );
}

/** Band 03 — the whole index on the homepage, with the way through to the
 *  full comparison underneath. */
export function ProductIndex({ products }: { products: readonly ResolvedProduct[] }) {
  return (
    <Band ground="dial" rhythm="tight" aria-labelledby="index-heading">
      <BandHeading
        id="index-heading"
        index={productIndex.index}
        heading={productIndex.heading}
        lead={productIndex.lead}
      />

      <ProductGrid products={products} label={productIndex.listLabel} />

      <div className="mt-[var(--space-6)] flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-rule-strong)] pt-[var(--space-3)]">
        {/* Persian digits: this is a sentence, not a measurement. The split is
            documented in src/lib/digits.ts. */}
        <p className="t-meta">
          {toFa(products.length)} {productIndex.countLabel}
        </p>
        <Link href={productIndex.allHref} className="link-signal">
          {productIndex.allLabel}
        </Link>
      </div>
    </Band>
  );
}
