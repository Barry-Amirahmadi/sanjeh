import { site } from "@/content/site";
import { publishedProducts } from "@/content/products";
import { pageMetadata } from "@/lib/seo";
import { Masthead } from "@/components/home/Masthead";
import { CapabilityTable } from "@/components/home/CapabilityTable";
import { ProductIndex } from "@/components/products/ProductIndex";
import { MethodBand } from "@/components/home/MethodBand";
import { TechnicalNote } from "@/components/home/TechnicalNote";
import { ContactBand } from "@/components/home/ContactBand";

/**
 * Homepage — six bands, all on the light ground, all numbered.
 *
 *   01 MASTHEAD    the company's own specification sheet, grid visible
 *   02 CAPABILITY  what is made, against size, pressure and material
 *   03 INDEX       nine identical cells, no cell larger than another
 *   04 METHOD      four numbered steps, hairline-separated, no icons
 *   05 NOTE        one engineering principle, set like a journal article
 *   06 CONTACT     five ruled rows and a phone number
 *
 * **What this page does not have is as deliberate as what it does.** No hero
 * image, no statement quote, no brand story, no values band, no closing
 * call-to-action band, and no dark section anywhere above the footer. Neither
 * the editorial family's sequence nor the brutalist one's survives here: the
 * argument this page makes is that the company is organised, and order is how
 * it makes it.
 */
export const metadata = pageMetadata({
  description: site.seo.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Masthead />
      <CapabilityTable />
      <ProductIndex products={publishedProducts} />
      <MethodBand />
      <TechnicalNote />
      <ContactBand />
    </>
  );
}
