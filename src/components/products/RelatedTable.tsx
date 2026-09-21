import Link from "next/link";
import type { ResolvedProduct } from "@/types/content";
import { productPage } from "@/content/sections";

/**
 * What comes after a product page — **two more rows of a table, never cards.**
 *
 * That is the instruction and it is also the right answer: a card grid at the
 * foot of a specification page is a different design language arriving in the
 * last screen, and it would be the only place on this site where a product is
 * presented as something other than a row or a uniform cell.
 */
export function RelatedTable({ products }: { products: readonly ResolvedProduct[] }) {
  if (products.length === 0) return null;

  return (
    <table className="data-table stacked-table" role="table">
      <caption className="sr-only">{productPage.relatedCaption}</caption>

      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader" scope="col">
            {productPage.relatedColumns.code}
          </th>
          <th role="columnheader" scope="col">
            {productPage.relatedColumns.name}
          </th>
          <th role="columnheader" scope="col">
            {productPage.relatedColumns.category}
          </th>
        </tr>
      </thead>

      <tbody role="rowgroup">
        {products.map((product) => (
          <tr key={product.id} role="row">
            <td role="cell" className="cell-data" data-label={productPage.relatedColumns.code}>
              <span className="t-data" dir="ltr">
                {product.code}
              </span>
            </td>

            <th role="rowheader" scope="row">
              <Link href={`/products/${product.slug}/`} className="link-signal">
                {product.name}
                <span className="sr-only"> — {productPage.openLabel}</span>
              </Link>
            </th>

            <td role="cell" data-label={productPage.relatedColumns.category}>
              {product.category}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
