import { site } from "@/content/site";
import { about, contact } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";
import { Band } from "@/components/layout/Band";
import { BandHeading } from "@/components/layout/BandHeading";
import { DataList, DataRow } from "@/components/data/DataList";
import { GeneralInquiry } from "@/components/products/InquiryLink";

/**
 * About — running text in columns, a capability block, and the contact list.
 *
 * **No portrait and no studio photograph.** The editorial family puts a face or
 * a workbench here; this page has no image at all. What it has instead is the
 * operating range as data and a paragraph saying plainly what the site does not
 * claim, which is the more useful thing for the reader this site is aimed at.
 *
 * The text sets in two columns above 48rem and one below — the same
 * `.note-columns` rule the homepage's technical note uses, so the two long
 * prose passages on the site are set identically.
 */
export const metadata = pageMetadata({
  title: about.seo.title,
  description: about.seo.description,
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <Band ground="dial" rhythm="tight" rules aria-labelledby="about-heading">
        <BandHeading
          id="about-heading"
          index={about.index}
          heading={about.heading}
          lead={about.lead}
          level={1}
        />

        <div className="grid-12">
          <div className="col-span-12 lg:col-span-8 lg:row-start-1">
            <div className="note-columns">
              {about.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Ascending column start — see ProductRow's note on grid's
              auto-placement cursor. This block asks for column 10 of 12 and the
              text above it starts at column 1, so the order is safe. */}
          <aside className="col-span-12 lg:col-span-3 lg:col-start-10 lg:row-start-1">
            <div className="plane-raised p-[var(--space-5)]">
              <h2 className="t-label mb-[var(--space-4)]">{about.factsHeading}</h2>
              <DataList items={about.facts} />
            </div>
          </aside>
        </div>
      </Band>

      <Band ground="dial" rhythm="tight" aria-labelledby="about-contact-heading">
        <div className="band-head">
          <span className="band-head__index" aria-hidden="true">
            {contact.index}
          </span>
          <h2 id="about-contact-heading" className="t-h2">
            {about.contactHeading}
          </h2>
        </div>

        <div className="grid-12">
          <dl className="data-list col-span-12 lg:col-span-8">
            <DataRow label={contact.labels.address}>{site.contact.address}</DataRow>
            <DataRow label={contact.labels.phone}>
              <a href={`tel:${site.contact.phoneHref}`} className="link-signal">
                {site.contact.phone}
              </a>
            </DataRow>
            <DataRow label={contact.labels.email}>
              {/* `dir="ltr"`: without it the bidi algorithm moves the trailing
                  dot of a Latin address to the front of the run. */}
              <a href={`mailto:${site.contact.email}`} className="link-signal" dir="ltr">
                {site.contact.email}
              </a>
            </DataRow>
            <DataRow label={contact.labels.hours}>{site.contact.hours}</DataRow>
            <DataRow label={contact.labels.route}>
              <span className="block">{contact.routeNote}</span>
              <GeneralInquiry variant="secondary" className="mt-3" />
            </DataRow>
          </dl>
        </div>
      </Band>
    </>
  );
}
