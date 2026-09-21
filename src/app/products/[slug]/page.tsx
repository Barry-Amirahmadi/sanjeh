import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, publishedProducts } from "@/content/products";
import { relatedProducts } from "@/content/relatedProducts";
import { productSchema } from "@/content/schema";
import { productPage } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";
import { Band } from "@/components/layout/Band";
import { Plate } from "@/components/ui/Plate";
import { SpecValue } from "@/components/data/SpecValue";
import { ProductInquiry } from "@/components/products/InquiryLink";
import { ProductViews } from "@/components/products/ProductViews";
import { RelatedTable } from "@/components/products/RelatedTable";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * Product detail — a two-column split on the twelve-column grid.
 *
 * The photograph takes four columns and stays put while the data column
 * scrolls; the data column takes the remaining eight and is the document:
 * code and name, the full specification table, the technical description set
 * in two columns, the alternative view, and the related products as two more
 * rows of a table.
 *
 * **Never as cards.** A card grid at the foot of a specification page would be
 * a different design language arriving in the last screen — the only place on
 * this site where a product is presented as something other than a row or a
 * uniform cell.
 *
 * Every row of the specification table is a physical attribute, including the
 * one that says what the part is *not* for. A stated limitation is the most
 * credible line on a business-to-business page, and almost nobody writes one.
 */
export function generateStaticParams() {
  return publishedProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};

  return pageMetadata({
    title: product.seo?.title ?? `${product.name} — ${product.code}`,
    description:
      product.seo?.description ??
      [product.description, product.statement].filter(Boolean).join(" "),
    path: `/products/${product.slug}/`,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = publishedProducts.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = relatedProducts(product, publishedProducts);
  const details = product.details ?? [];

  return (
    <>
      <Band ground="dial" rhythm="none" className="pt-[var(--space-5)]">
        <nav aria-label={productPage.breadcrumbLabel}>
          <ol className="t-meta flex flex-wrap items-center gap-x-2">
            <li>
              <Link href="/" className="crumb">
                {productPage.breadcrumbHome}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/products/" className="crumb">
                {productPage.breadcrumbCollection}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[var(--color-ink)]">
              {product.name}
            </li>
          </ol>
        </nav>
      </Band>

      <Band ground="dial" rhythm="tight" aria-labelledby="product-heading">
        <div className="grid-12">
          {/* Image column: four of twelve, and it stays put. Ascending column
              starts throughout this grid — grid's sparse auto-placement cursor
              never moves backwards, so a block asking for an earlier column
              than the one beside it is pushed onto a new implicit row. */}
          <div className="col-span-12 lg:col-span-4 lg:row-start-1">
            <div className="lg:sticky lg:top-[5.5rem]">
              <Plate
                media={product.image}
                sizes="(max-width: 1024px) 100vw, 30vw"
                priority
              />
            </div>
          </div>

          {/* Data column: the remaining eight. */}
          <div className="col-span-12 lg:col-span-8 lg:col-start-5 lg:row-start-1">
            <p className="product-cell__code" dir="ltr">
              {product.code}
            </p>
            <h1 id="product-heading" className="t-h1 mt-1">
              {product.name}
            </h1>
            <p className="t-label mt-2">{product.category}</p>

            {product.statement ? <p className="t-lead mt-[var(--space-5)]">{product.statement}</p> : null}

            {/* ---- Specifications ---- */}
            <section aria-labelledby="spec-heading" className="mt-[var(--space-7)]">
              <div className="band-head">
                <span className="band-head__index" aria-hidden="true">
                  {productPage.detailsIndex}
                </span>
                <h2 id="spec-heading" className="t-h2">
                  {productPage.detailsHeading}
                </h2>
              </div>

              <table className="data-table stacked-table" role="table">
                <caption className="sr-only">{productPage.detailsCaption}</caption>
                <tbody role="rowgroup">
                  {details.map((spec) => (
                    <tr key={spec.label} role="row">
                      <th role="rowheader" scope="row" className="lg:w-[14rem]">
                        {spec.label}
                      </th>
                      <td role="cell" className={spec.data ? "cell-data" : undefined}>
                        <SpecValue spec={spec} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ProductInquiry
                name={product.name}
                code={product.code}
                className="mt-[var(--space-5)]"
              />
            </section>

            {/* ---- Technical description ---- */}
            {product.body && product.body.length > 0 ? (
              <section aria-labelledby="description-heading" className="mt-[var(--space-7)]">
                <div className="band-head">
                  <span className="band-head__index" aria-hidden="true">
                    {productPage.descriptionIndex}
                  </span>
                  <h2 id="description-heading" className="t-h2">
                    {productPage.descriptionHeading}
                  </h2>
                </div>
                <div className="note-columns">
                  {product.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ) : null}

            {/* ---- Alternative views ---- */}
            {product.views && product.views.length > 0 ? (
              <section aria-labelledby="views-heading" className="mt-[var(--space-7)]">
                <div className="band-head">
                  <span className="band-head__index" aria-hidden="true">
                    {productPage.viewsIndex}
                  </span>
                  <h2 id="views-heading" className="t-h2">
                    {productPage.viewsHeading}
                  </h2>
                </div>
                <ProductViews product={product} />
              </section>
            ) : null}

            {/* ---- Related, as rows ---- */}
            <section aria-labelledby="related-heading" className="mt-[var(--space-7)]">
              <div className="band-head">
                <span className="band-head__index" aria-hidden="true">
                  {productPage.relatedIndex}
                </span>
                <h2 id="related-heading" className="t-h2">
                  {productPage.relatedHeading}
                </h2>
              </div>
              <RelatedTable products={related} />

              <Link href="/products/" className="link-signal mt-[var(--space-4)]">
                {productPage.backLabel}
              </Link>
            </section>
          </div>
        </div>
      </Band>

      {/* Product structured data. Deliberately carries no `offers` — see
          src/content/schema.ts for what is left out and why. */}
      <JsonLd data={productSchema(product)} />
    </>
  );
}
