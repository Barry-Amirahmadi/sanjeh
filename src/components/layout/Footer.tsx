import Link from "next/link";
import { site } from "@/content/site";
import { ui } from "@/content/ui";

/**
 * The colophon — and the only dark ground on this site.
 *
 * Both of the other families run dark sections mid-page: the editorial one
 * puts its product showcase and its closing call to action on ink, the
 * brutalist one inverts whole bands. Here every band is light and the document
 * simply ends on the bezel colour. That single inversion at the foot is what
 * makes the page read as an instrument face with a dark surround rather than
 * as a sequence of alternating panels.
 *
 * No oversized wordmark, no social row, no newsletter field. The editorial
 * engine's closing wordmark was the one purely graphic element on its page;
 * this site has none, and adding one back here would be the first decorative
 * thing in the document.
 */
export function Footer() {
  return (
    <footer className="ground-dark on-dark">
      <div className="container py-[var(--section-y-tight)]">
        <div className="grid-12">
          {/* Identity */}
          <div className="col-span-12 lg:col-span-4">
            <p className="t-h3" style={{ fontWeight: 700 }}>
              {site.brand.name}
            </p>
            <p className="t-label mt-1">{site.brand.latin}</p>
            <p className="t-body mt-4 max-w-[28ch]">{site.brand.line}</p>
          </div>

          {/* Navigation */}
          <nav className="col-span-6 lg:col-span-3 lg:col-start-7" aria-label={ui.nav.footer}>
            <h2 className="t-label-fa mb-2">{site.footer.navHeading}</h2>
            <ul className="flex flex-col">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="col-span-6 lg:col-span-3 lg:col-start-10">
            <h2 className="t-label-fa mb-2">{site.footer.contactHeading}</h2>
            <ul className="flex flex-col">
              <li className="t-meta flex min-h-11 items-center">{site.contact.address}</li>
              <li>
                <a href={`tel:${site.contact.phoneHref}`} className="footer-link">
                  {site.contact.phone}
                </a>
              </li>
              <li>
                {/* `dir="ltr"` on a Latin address inside an RTL document: without
                    it the bidi algorithm moves the trailing dot to the front. */}
                <a href={`mailto:${site.contact.email}`} className="footer-link" dir="ltr">
                  {site.contact.email}
                </a>
              </li>
              <li className="t-meta flex min-h-11 items-center">{site.contact.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-[var(--space-7)] flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-rule-dark-strong)] pt-4">
          <p className="t-meta">{site.copyright}</p>

          {/* Rendered only when there is something to render — an empty list
              would otherwise leave a bare flex child holding the row open. */}
          {site.legal.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-x-6">
              {site.legal.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="footer-link">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
