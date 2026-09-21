import type { ReactNode } from "react";
import type { Spec } from "@/types/content";
import { SpecValue } from "./SpecValue";
import { cn } from "@/lib/cn";

/**
 * A hairline definition list: label at the start edge, value at the end, one
 * rule per row.
 *
 * The same object appears four times on this site — the company's own fact
 * block in the masthead, the contact band, the capability block on the about
 * page, and a product's specifications where they are read rather than
 * compared. It is a `<dl>` in every one of them, because that is what it is:
 * an assistive technology should hear a term and its definition, not a
 * two-column table with no headers.
 */
export function DataList({ items, className }: { items: Spec[]; className?: string }) {
  return (
    <dl className={cn("data-list", className)}>
      {items.map((item) => (
        /* `<div>` wrapping a dt/dd pair is valid inside `<dl>` and is what
           makes each pair a grid row rather than two independent children. */
        <div key={item.label} className="data-list__row">
          <dt>{item.label}</dt>
          <dd>
            <SpecValue spec={item} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The same surface, for rows whose value is a link or other markup rather than
 * a plain string — the contact band's phone, email and enquiry rows.
 */
export function DataRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="data-list__row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
