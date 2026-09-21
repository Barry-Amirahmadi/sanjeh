const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * Renders a number in Persian digits.
 *
 * **This site deliberately does not put every numeral through here, and that is
 * a decision rather than an oversight — do not "fix" it.** The split:
 *
 * - **Running prose keeps Persian digits.** A Latin digit inside an otherwise
 *   Persian sentence reads as a translation artefact. Counts, figure numbers
 *   and the lightbox position all go through `toFa()`.
 * - **Specifications, measurements and catalogue codes stay in Latin digits,
 *   set in the mono face.** `1/2" … 8"`, `0 … 40 bar`, `-20 … +200 °C`,
 *   `SJ-1120`. This is the convention in Iranian technical documentation, not
 *   a shortcut: an engineer reading a datasheet expects Latin numerals beside
 *   a unit symbol, and a size written as «۱⁄۲ اینچ» is harder to scan in a
 *   column, harder to copy into an enquiry and harder to compare across rows.
 *
 * The rendering side of the same decision lives in `Data.tsx`: a measurement is
 * wrapped with `dir="ltr"` so the bidirectional algorithm cannot reorder a
 * range into `8" … 1/2"`, which it otherwise will inside an RTL paragraph.
 */
export function toFa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA[Number(d)]);
}
