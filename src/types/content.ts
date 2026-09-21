/**
 * Content model.
 *
 * These types are the contract between the UI and whatever supplies content.
 * Today the supplier is a set of TypeScript files under `src/content`; every
 * field below maps to a CMS field without a component changing. Per
 * MASTER-HANDOFF §52, every export in `src/content/*.ts` is annotated against
 * an interface here rather than left to inference — that is what makes the
 * "a CMS could supply this" claim checkable: delete a field from a source file
 * and `npm run typecheck` fails.
 */

/** Fixed aspect ratios. Crops are part of the art direction, not per-image
 *  guesswork — an editor picks one, never a raw pixel size.
 *
 *  Note how little this site uses: every photograph is `1/1`, because a
 *  component catalogue photographs parts the same way every time. `8/5` exists
 *  for the one technical figure, which is a drawing rather than a photograph. */
export type Ratio = "1/1" | "4/5" | "3/4" | "4/3" | "8/5" | "16/9";

export interface MediaAsset {
  /** Path today, CMS asset URL later. */
  src: string;
  /** Describes the picture for someone who cannot see it. Never the filename. */
  alt: string;
  ratio: Ratio;
  /** Optional caption shown under the image. Required on the archive, where an
   *  uncaptioned technical image would be decoration. */
  caption?: string;
}

/**
 * A label/value pair. The unit of this whole site: the masthead block, the
 * specification tables, the contact band and the about page are all lists of
 * these, differing only in how densely they are set.
 */
export interface Spec {
  label: string;
  value: string;
  /**
   * Whether the value is a measurement rather than prose. Measurements are set
   * in the mono face with Latin digits, which is the convention in Iranian
   * technical documentation; prose keeps Persian digits. See `src/lib/digits.ts`.
   */
  data?: boolean;
}

export interface Product {
  id: string;
  /** URL segment — /products/[slug]. */
  slug: string;
  /**
   * Catalogue code, e.g. `SJ-1120`. Set in the mono face everywhere it appears.
   * It is the cheapest possible signal that a real catalogue stands behind the
   * site, and it is what the WhatsApp enquiry carries so a buyer never has to
   * retype what the page already knew.
   */
  code: string;
  /** Persian product name. */
  name: string;
  /** Latin transliteration, used only for micro-labels. */
  latin: string;
  /** Persian category label. One of the three in `categories`. */
  category: string;
  /** Short Persian description — one line, used wherever the product is listed. */
  description: string;
  /**
   * Detail-page copy. All optional: a product can be published with nothing but
   * the fields above, and the detail page degrades to the listing copy.
   */
  statement?: string;
  /** Body paragraphs. An array so the editor controls the breaks, not a regex. */
  body?: string[];
  /**
   * The specification table, 6–8 rows.
   *
   * **Every row here is a physical attribute of a fictional part** — nominal
   * size, working pressure, working temperature, body material, connection
   * type, application, limitation. None of it asserts conformity to a named
   * standard, an approval, a certification or a test report, and none of it
   * may. «نوع اتصال: فلنجی» describes a part; «مطابق با استاندارد …» is a
   * claim about a company, and the trade this site is set in is exactly where
   * that line is easiest to cross by accident.
   */
  details?: Spec[];
  /**
   * The product's category colour, carried as the 3px bar on its index cell.
   *
   * Repurposed, not removed: in the editorial engine this drove an ambient
   * colour wash behind the showcase. There is no wash on this site. See
   * `resolveProducts()` for what it does now and what happens when it is unset.
   */
  tone?: string;
  /** The catalogue photograph. Required — every index cell, comparison row,
   *  related row and share card reads it. */
  image: MediaAsset;
  /**
   * Additional angles. One per product here: a second view or a sectional.
   *
   * Deliberately separate from `image` rather than making `image` an array —
   * four surfaces read `image` and none of them should have to know that a
   * product might have more than one picture.
   */
  views?: MediaAsset[];
  status: "published" | "draft";
  seo?: {
    title?: string;
    description?: string;
  };
}

/**
 * A product with every presentation field guaranteed to be present.
 *
 * `Product` is the *authoring* shape, where presentation fields may be absent;
 * `ResolvedProduct` is the *rendering* shape, where they never are. Keeping the
 * two separate means no component carries a `?? fallback` for a missing field.
 *
 * Note what is **not** here, and its absence is part of the design: there is no
 * `layout`. The editorial family gives each product a `tall` / `wide` /
 * `compact` / `feature` arrangement so the spread has a rhythm. This site has
 * nine identical cells and no cell is larger than another, because a register
 * does not rank its entries by how much space they are given.
 */
export interface ResolvedProduct extends Product {
  tone: string;
}

/**
 * What the lightbox renders.
 *
 * Declared separately from `ArchiveItem` because two different surfaces open
 * the same dialog — the technical archive and a product's alternative views —
 * and neither should have to pretend to be the other. `ArchiveItem` satisfies
 * this shape structurally; a product view is mapped into it.
 */
export interface LightboxItem {
  id: string;
  title: string;
  caption: string;
  image: MediaAsset;
}

/** One image in the technical archive. */
export interface ArchiveItem {
  id: string;
  title: string;
  /** Persian category label — the axis a future archive filter would use. */
  category: string;
  /** Required, unlike the editorial engine's gallery: see `MediaAsset.caption`. */
  caption: string;
  image: MediaAsset;
  /** Manual sort position, as an editor would set it. */
  order: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  brand: {
    name: string;
    latin: string;
    /** One line, used in the footer and as the meta description base. */
    line: string;
  };
  seo: {
    /** The homepage <title>, and the fallback for any route without its own. */
    title: string;
    /** `%s` is the route's own title. */
    titleTemplate: string;
    description: string;
    /** The share card. `src` is root-relative; the absolute URL is composed at
     *  build time, because Open Graph requires one. */
    ogImage: { src: string; alt: string; width: number; height: number };
  };
  nav: NavItem[];
  headerCta: NavItem;
  contact: {
    /** Street-level detail is deliberately absent; see `src/content/site.ts`. */
    address: string;
    city: string;
    /** Display string, in Persian digits. */
    phone: string;
    /** Dial string, in Latin digits. Kept separate: Persian digits are not
     *  matched by \d, so a tel: href cannot be derived from `phone`. */
    phoneHref: string;
    /** WhatsApp click-to-chat number, Latin digits only, no punctuation. */
    whatsapp: string;
    email: string;
    /** Working hours, as a display string. */
    hours: string;
  };
  legal: NavItem[];
  /** Column headings in the footer. Brand copy, not structure. */
  footer: {
    navHeading: string;
    contactHeading: string;
  };
  copyright: string;
}

/* -------------------------------------------------------------------------- */
/*  Section copy                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Every band opens the same way: a mono index number, a heading, a lead.
 * The number is what makes the homepage read as a document with numbered
 * sections rather than a scroll with headings.
 */
export interface BandIntro {
  /** Two digits, Latin, set in the mono face: "01" … "06". */
  index: string;
  heading: string;
  lead: string;
}

/** Per-route metadata, on the section that owns the route. */
export interface SeoFields {
  title: string;
  description: string;
}

/** Band 01 — the company's own specification sheet. */
export interface MastheadContent {
  /** Band index, in the mono face. The heading of this band is the company
   *  name itself, which lives on `site.brand`, so there is no `heading` here. */
  index: string;
  /** One sentence beside the company name, ~15 words. */
  descriptor: string;
  /** 4–6 label/value rows directly beneath. */
  facts: Spec[];
}

/** Band 02 — one capability line: what is made, against its ranges. */
export interface CapabilityRow {
  id: string;
  group: string;
  size: string;
  pressure: string;
  material: string;
}

export interface CapabilityContent extends BandIntro {
  /** Column headings, in start-edge order. */
  columns: { group: string; size: string; pressure: string; material: string };
  /** The table's accessible caption. */
  caption: string;
  rows: CapabilityRow[];
}

/** Band 03 — the uniform nine-cell index, and the labels its cells carry. */
export interface IndexContent extends BandIntro {
  /** Accessible name of the product list. */
  listLabel: string;
  /** Prefixes a cell's link: «مشخصات کامل — شیر کنترلی گلوب». */
  detailLabel: string;
  /** Follows the rendered product count, e.g. «۹ محصول». */
  countLabel: string;
  /**
   * The three spec labels shown on every cell, in order. Authored rather than
   * derived: which three of a product's seven specifications matter at a glance
   * is an editorial decision, not something a component should guess.
   */
  cellSpecs: string[];
  allLabel: string;
  allHref: string;
}

/** Band 04 — four numbered steps. */
export interface MethodStep {
  id: string;
  title: string;
  body: string;
}

export interface MethodContent extends BandIntro {
  steps: MethodStep[];
}

/** Band 05 — the technical note. */
export interface NoteContent extends BandIntro {
  /** 250–350 words across 3–5 paragraphs. */
  body: string[];
  figure: MediaAsset;
  /** The Persian word before the number — «شکل». Set in the body face.
   *  IBM Plex Mono carries no Arabic glyphs, so a Persian word set in it would
   *  silently fall back to another face; the label and the numeral are two
   *  spans for that reason, which is also how a technical document sets them. */
  figureLabel: string;
  /** The numeral alone, Latin, set in the mono face: "01". */
  figureNumber: string;
}

/** Band 06 — contact, as a definition list. */
export interface ContactContent extends BandIntro {
  labels: {
    address: string;
    phone: string;
    email: string;
    hours: string;
    route: string;
  };
  /** What the enquiry row says before the WhatsApp link. */
  routeNote: string;
}

export interface CollectionContent extends BandIntro {
  /** Accessible name of the wide comparison table's scroll region. */
  tableLabel: string;
  tableCaption: string;
  /** Shown above the table wherever it is narrower than its content. */
  tableHint: string;
  /** Column headings for the two non-spec columns. */
  codeColumn: string;
  nameColumn: string;
  /**
   * Which of a product's `details` labels become comparison columns, in order.
   * A deliberate subset: «کاربرد» and «محدودیت» are sentences and belong on the
   * detail page, not in a cell.
   */
  comparisonLabels: string[];
  /** Band index of the grouped list below the table — the page is a document
   *  with numbered sections, same as the homepage. */
  groupsIndex: string;
  /** Heading and accessible name of the grouped index below the table. */
  groupsLabel: string;
  seo: SeoFields;
}

export interface ProductPageContent {
  detailsIndex: string;
  detailsHeading: string;
  detailsCaption: string;
  descriptionIndex: string;
  descriptionHeading: string;
  viewsIndex: string;
  viewsHeading: string;
  relatedIndex: string;
  relatedHeading: string;
  relatedCaption: string;
  relatedColumns: { code: string; name: string; category: string };
  backLabel: string;
  breadcrumbHome: string;
  breadcrumbCollection: string;
  breadcrumbLabel: string;
  /** Label on the row-level link out of the related table. */
  openLabel: string;
}

export interface InquiryContent {
  label: string;
  /** `{product}` and `{code}` are substituted at render time. */
  message: string;
  /** The same channel with no product in hand. */
  generalLabel: string;
  generalMessage: string;
  /** Appended for screen readers to any link that leaves the site. */
  newWindow: string;
}

export interface ArchiveContent extends BandIntro {
  /** Accessible name of each tile's zoom button. */
  viewLabel: string;
  /** Prefixes each figure number: «شکل». */
  figureLabel: string;
  seo: SeoFields;
}

export interface AboutContent extends BandIntro {
  /** 4–5 paragraphs, set in columns. */
  body: string[];
  /** The capability data block beside the text. */
  facts: Spec[];
  factsHeading: string;
  contactHeading: string;
  seo: SeoFields;
}

export interface NotFoundContent {
  index: string;
  heading: string;
  lead: string;
  action: NavItem;
}

/* -------------------------------------------------------------------------- */
/*  Interface strings                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Accessible names, and the few words the interface says on its own behalf
 * rather than the company's.
 *
 * Separate from `sections.ts` because the two are edited by different people
 * for different reasons: that file is the copy deck, this is what the interface
 * is called. §28 has no exception for text only a screen reader hears, and a
 * hardcoded label is one no editor and no translator can reach.
 */
export interface UiStrings {
  /** First focusable element on every page. */
  skipToContent: string;
  nav: {
    primary: string;
    footer: string;
    /** Trailing half of the wordmark's accessible name, after the company name. */
    home: string;
    openMenu: string;
    closeMenu: string;
    menuDialog: string;
  };
  lightbox: {
    label: string;
    close: string;
    previous: string;
    next: string;
    /** Joins position and total, e.g. «۳ از ۶». */
    counterJoin: string;
  };
  /** Stands in for a value a product does not carry. */
  emptyCell: string;
}
