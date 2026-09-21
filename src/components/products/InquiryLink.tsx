import { site } from "@/content/site";
import { inquiry } from "@/content/sections";
import { fillTemplate, whatsappLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

/**
 * The site's conversion point.
 *
 * There is no cart, no price and no form. A business-to-business buyer asks
 * for a quotation; they do not check out, and a price quoted without knowing
 * the fluid, the pressure and the connection type would only be corrected
 * later. So the whole mechanism is an enquiry that arrives already knowing what
 * it is about — **the message carries the catalogue code**, which is the one
 * thing the buyer would otherwise have to retype from the page they are
 * looking at.
 *
 * A plain `https://wa.me/...` link. Nothing behind it, which is what makes it
 * work on a static host.
 */
export function ProductInquiry({
  name,
  code,
  variant = "primary",
  className,
}: {
  name: string;
  code: string;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const message = fillTemplate(inquiry.message, { product: name, code });

  return (
    <Button
      href={whatsappLink(site.contact.whatsapp, message)}
      variant={variant}
      external
      className={className}
    >
      {inquiry.label}
    </Button>
  );
}

/** The same channel with no product in hand — the contact band and the about
 *  page, where the reader has not chosen a part yet. */
export function GeneralInquiry({
  variant = "primary",
  className,
}: {
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Button
      href={whatsappLink(site.contact.whatsapp, inquiry.generalMessage)}
      variant={variant}
      external
      className={className}
    >
      {inquiry.generalLabel}
    </Button>
  );
}
