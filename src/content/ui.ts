import type { UiStrings } from "@/types/content";

/**
 * Interface strings — accessible names, and the few words the interface says on
 * its own behalf rather than the company's.
 *
 * Separate from `sections.ts` because the two are edited by different people
 * for different reasons: that file is the copy deck a company rewrites, this is
 * what the interface is called. Most of these are read only by a screen reader,
 * which is not a reason to leave them in the markup: §28 has no exception for
 * text a sighted reader never sees, and a hardcoded string is one no editor and
 * no translator can reach.
 *
 * On this site the trade's own vocabulary reaches in here too — the lightbox is
 * «نمای بزرگ شکل», not «نمای بزرگ تصویر», because what it enlarges is a
 * numbered figure in a technical archive.
 */
export const ui: UiStrings = {
  skipToContent: "پرش به محتوای اصلی",

  nav: {
    primary: "پیمایش اصلی",
    footer: "پیمایش پانوشت",
    /** Follows the company name: «سنجه — صفحهٔ اصلی». */
    home: "صفحهٔ اصلی",
    openMenu: "گشودن فهرست",
    closeMenu: "بستن فهرست",
    menuDialog: "فهرست اصلی",
  },

  lightbox: {
    label: "نمای بزرگ شکل",
    close: "بستن نمای بزرگ",
    previous: "شکل قبلی",
    next: "شکل بعدی",
    /** Between position and total: «۳ از ۶». */
    counterJoin: "از",
  },

  /**
   * Rendered wherever a product carries no value for a comparison column. An
   * en-dash rather than an empty cell: a blank could be read as a measured zero,
   * and in a pressure or temperature column that is a meaningful difference.
   */
  emptyCell: "—",
};
