import type { Spec } from "@/types/content";

/**
 * One specification value.
 *
 * **The `dir="ltr"` is load-bearing and must not be removed.** A measurement
 * like `1/2" … 8"` or `-20 … +200 °C` is a run of Latin digits separated by
 * neutral characters — the quote mark, the ellipsis, the sign. Inside an
 * RTL paragraph the bidirectional algorithm resolves those neutrals against the
 * paragraph direction and renders the range backwards: `8" … 1/2"`. It looks
 * like a typo in the content and is not one.
 *
 * Isolating the span is the fix. Prose values — «فولاد زنگ‌نزن», «فلنجی» — are
 * Persian and take no wrapper at all, which is why `Spec.data` exists: it marks
 * which values are measurements, and only those get the mono face, the tabular
 * figures and the isolation.
 *
 * See `src/lib/digits.ts` for the Latin-versus-Persian numeral decision this
 * implements.
 */
export function SpecValue({ spec }: { spec: Spec }) {
  if (!spec.data) return <>{spec.value}</>;

  return (
    <span className="t-data" dir="ltr">
      {spec.value}
    </span>
  );
}

/** The same isolation for a bare measurement string with no `Spec` around it. */
export function DataText({ children }: { children: string }) {
  return (
    <span className="t-data" dir="ltr">
      {children}
    </span>
  );
}
