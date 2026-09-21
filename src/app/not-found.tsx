import { notFound } from "@/content/sections";
import { Band } from "@/components/layout/Band";
import { Button } from "@/components/ui/Button";

/**
 * 404 — the same masthead construction as every other page, with "404" where
 * the band number goes. No illustration, no apology, one way out.
 */
export default function NotFound() {
  return (
    <Band ground="dial" rules aria-labelledby="notfound-heading">
      <div className="grid-12">
        <div className="col-span-12 lg:col-span-8">
          <div className="band-head">
            <span className="band-head__index" aria-hidden="true">
              {notFound.index}
            </span>
            <h1 id="notfound-heading" className="t-h1">
              {notFound.heading}
            </h1>
          </div>

          <p className="t-lead mt-[var(--space-5)] max-w-[var(--measure-wide)]">{notFound.lead}</p>

          <Button href={notFound.action.href} className="mt-[var(--space-6)]">
            {notFound.action.label}
          </Button>
        </div>
      </div>
    </Band>
  );
}
