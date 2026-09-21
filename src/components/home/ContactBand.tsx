import { site } from "@/content/site";
import { contact } from "@/content/sections";
import { Band } from "@/components/layout/Band";
import { BandHeading } from "@/components/layout/BandHeading";
import { DataRow } from "@/components/data/DataList";
import { GeneralInquiry } from "@/components/products/InquiryLink";

/**
 * Band 06 — contact, as a definition list and nothing else.
 *
 * No large type, no full-screen gesture, no closing call-to-action band. The
 * editorial family ends its homepage on display type over a photograph; this
 * one ends on five ruled rows, because the last thing a buyer in this trade
 * wants from a supplier's site is a flourish. They want the phone number.
 *
 * There is deliberately no contact form. A form on a static host has to post
 * to a third-party backend, and there is none to post to for a company that
 * does not exist — shipping one with `action="#"` would put the visitor's
 * typed address into the URL and show no confirmation at all.
 */
export function ContactBand() {
  return (
    <Band id="contact" ground="dial" rhythm="tight" aria-labelledby="contact-heading">
      <BandHeading
        id="contact-heading"
        index={contact.index}
        heading={contact.heading}
        lead={contact.lead}
      />

      <div className="grid-12">
        <dl className="data-list col-span-12 lg:col-span-8">
          <DataRow label={contact.labels.address}>{site.contact.address}</DataRow>

          <DataRow label={contact.labels.phone}>
            <a href={`tel:${site.contact.phoneHref}`} className="link-signal">
              {site.contact.phone}
            </a>
          </DataRow>

          <DataRow label={contact.labels.email}>
            {/* `dir="ltr"` on a Latin address inside an RTL document: without it
                the bidi algorithm moves the trailing dot to the front. */}
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
  );
}
