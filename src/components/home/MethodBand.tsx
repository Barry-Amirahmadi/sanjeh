import { method } from "@/content/sections";
import { Band } from "@/components/layout/Band";
import { BandHeading } from "@/components/layout/BandHeading";

/**
 * Band 04 — four numbered steps on one hairline row.
 *
 * **No icons.** An icon here would be decoration standing in for the sentence
 * that does the work, and on a page whose argument is "this company is
 * organised", a row of little pictograms is the first thing that would read as
 * a template.
 *
 * The steps are an ordered list, because they are one: the order is the
 * content, and an assistive technology should be told there are four of them
 * and which is which.
 */
export function MethodBand() {
  return (
    <Band ground="dial" rhythm="tight" aria-labelledby="method-heading">
      <BandHeading
        id="method-heading"
        index={method.index}
        heading={method.heading}
        lead={method.lead}
      />

      <ol className="grid-12">
        {method.steps.map((step, i) => (
          <li key={step.id} className="method-step col-span-12 md:col-span-6 lg:col-span-3">
            <span className="method-step__index" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="t-h3">{step.title}</h3>
            <p className="t-body">{step.body}</p>
          </li>
        ))}
      </ol>
    </Band>
  );
}
