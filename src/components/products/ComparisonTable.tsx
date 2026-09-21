import Link from "next/link";
import type { ResolvedProduct } from "@/types/content";
import { collection } from "@/content/sections";
import { ui } from "@/content/ui";
import { specByLabel } from "@/content/categories";
import { ScrollTable } from "@/components/data/ScrollTable";
import { SpecValue } from "@/components/data/SpecValue";

/**
 * The full specification comparison — nine rows, seven columns.
 *
 * This is the feature a real industrial buyer wants and the one no other site
 * in this family has anything like: every product against every measurable
 * specification, on one surface, in one glance. It is also the only table here
 * that scrolls rather than restructuring — stacking it would turn the
 * comparison back into nine separate lists, which is the thing it exists to
 * replace. See `ScrollTable` for how that is made keyboard-reachable.
 *
 * The columns are authored (`collection.comparisonLabels`), not derived from
 * whichever `details` the first product happens to carry. Two of a product's
 * seven specifications — «کاربرد» and «محدودیت» — are sentences and belong on
 * the product's own page, not in a cell.
 *
 * A product with no value for a column renders the interface's empty-cell
 * string rather than a blank, because a blank in a pressure column could be
 * read as a measured zero.
 */
/* No explicit ARIA roles on this one, unlike every other table here: it never
   stacks. It scrolls inside `.table-scroll`, keeps `display: table` at every
   width, and therefore keeps its implicit semantics. Roles are added only
   where `display: block` takes them away. */
export function ComparisonTable({ products }: { products: readonly ResolvedProduct[] }) {
  return (
    <ScrollTable label={collection.tableLabel} hint={collection.tableHint}>
      <table className="data-table">
        <caption className="sr-only">{collection.tableCaption}</caption>

        <thead>
          <tr>
            <th scope="col">
              {collection.codeColumn}
            </th>
            <th scope="col">
              {collection.nameColumn}
            </th>
            {collection.comparisonLabels.map((label) => (
              <th key={label} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="cell-data">
                <span className="t-data" dir="ltr">
                  {product.code}
                </span>
              </td>

              {/* The name is the row header — it is what every other cell in
                  the row is a measurement *of*, and it is what a screen reader
                  should repeat when reading across. */}
              <th scope="row">
                <Link href={`/products/${product.slug}/`} className="link-signal">
                  {product.name}
                </Link>
              </th>

              {collection.comparisonLabels.map((label) => {
                const spec = specByLabel(product, label);
                return (
                  <td key={label} className={spec?.data ? "cell-data" : undefined}>
                    {spec ? <SpecValue spec={spec} /> : ui.emptyCell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollTable>
  );
}
