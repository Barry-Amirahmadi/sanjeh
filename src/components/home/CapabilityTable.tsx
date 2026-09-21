import { capability } from "@/content/sections";
import { Band } from "@/components/layout/Band";
import { BandHeading } from "@/components/layout/BandHeading";
import { DataText } from "@/components/data/SpecValue";

/**
 * Band 02 — the capability table, and the page's centrepiece.
 *
 * Eleven rows of what is made against the size range, pressure range and body
 * material each is made in. This is the band a business-to-business buyer
 * actually reads: it answers "can you make the thing I need" before any
 * individual product does.
 *
 * At small widths the table restructures into stacked label/value rows rather
 * than scrolling — four columns of Persian at 390px would be four words wide.
 * Only one table on this site scrolls, and it is not this one.
 *
 * The restructure is done with `display: block` on the table parts plus
 * `data-label` attributes, which keeps a single `<table>` in the markup: the
 * relationship between a value and its column is carried by the DOM for
 * assistive technology regardless of how the CSS lays it out.
 */
export function CapabilityTable() {
  return (
    <Band ground="dial" rhythm="tight" rules aria-labelledby="capability-heading">
      <BandHeading
        id="capability-heading"
        index={capability.index}
        heading={capability.heading}
        lead={capability.lead}
      />

      <table className="data-table stacked-table" role="table">
        <caption className="sr-only">{capability.caption}</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader" scope="col">{capability.columns.group}</th>
            <th role="columnheader" scope="col">{capability.columns.size}</th>
            <th role="columnheader" scope="col">{capability.columns.pressure}</th>
            <th role="columnheader" scope="col">{capability.columns.material}</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {capability.rows.map((row) => (
            <tr key={row.id} role="row">
              <th role="rowheader" scope="row">{row.group}</th>
              <td role="cell" className="cell-data" data-label={capability.columns.size}>
                <DataText>{row.size}</DataText>
              </td>
              <td role="cell" className="cell-data" data-label={capability.columns.pressure}>
                <DataText>{row.pressure}</DataText>
              </td>
              <td role="cell" data-label={capability.columns.material}>{row.material}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Band>
  );
}
