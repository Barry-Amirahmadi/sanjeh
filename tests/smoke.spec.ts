import { test, expect, type Page } from "@playwright/test";

/**
 * Smoke pass — deliberately small, and every assertion earns its place.
 *
 * Scope: the site renders, it is genuinely RTL, the lightbox opens, a product
 * route survives a hard load under the base path, nothing 404s, and the three
 * things this particular design can actually break — dense tables at phone
 * width, Persian glyph coverage under a mono face that has none, and type
 * dropping below legible size — are measured rather than eyeballed.
 *
 * Nothing here was deleted to make the suite green. The cases that came from
 * the editorial site were re-pointed at this architecture; the ones that no
 * longer have a subject (an Instagram link on a site with no social accounts)
 * were replaced by the assertion that now matters in their place.
 */

/**
 * The deployment base path. Spelled out rather than folded into `baseURL`:
 * these tests exist largely to catch base-path regressions, so it should be
 * visible at every call site.
 */
const rawBase = process.env.SMOKE_BASE_PATH ?? "/sanjeh";
const BASE = rawBase === "/" ? "" : rawBase.replace(/\/+$/, "");

/** Every route the export produces, minus the 404. */
const ROUTES = [
  "/",
  "/products/",
  "/gallery/",
  "/about/",
  "/products/shir-globe/",
  "/products/shir-toopi/",
  "/products/shir-parvanei/",
  "/products/gauge-feshar/",
  "/products/flowmeter-khatti/",
  "/products/sensor-dama/",
  "/products/zanooyi-jooshi/",
  "/products/flange-gloodar/",
  "/products/safi-khat/",
];

/** Persian digits back to a number, so a rendered count can be compared. */
function fromFa(text: string): number {
  return Number(text.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/\D/g, ""));
}

/**
 * Every control on the page must have a non-empty accessible name.
 *
 * This exists because the interface strings moved out of the components and
 * into `src/content/ui.ts`. A mistyped path there does not throw and does not
 * render visibly wrong — the button still draws, still works, and simply stops
 * announcing itself, or announces the word "undefined". That is invisible to
 * every other check in this file and to anyone looking at the screen.
 */
async function namelessControls(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll("button, a[href]")]
      .filter((el) => (el as HTMLElement).checkVisibility({ visibilityProperty: true }))
      .filter((el) => el.closest('[aria-hidden="true"]') === null)
      .filter((el) => {
        const label = el.getAttribute("aria-label");
        const name = label === null ? (el.textContent ?? "") : label;
        return name.trim() === "" || name.includes("undefined");
      })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className || "(no class)"}`),
  );
}

/** Collects console errors and failed responses for the lifetime of a page. */
function watch(page: Page) {
  const consoleErrors: string[] = [];
  const failed: string[] = [];

  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });

  return { consoleErrors, failed };
}

/** Walks the page so every lazy image and scroll reveal has fired. */
async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += 400) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

async function brokenImages(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0).length,
  );
}

/* ========================================================================== */
/*  Pages                                                                     */
/* ========================================================================== */

test("homepage renders, is RTL, and loads every asset", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  await page.goto(`${BASE}/`);

  await expect(page.locator("h1")).toHaveText("سنجه");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");

  const direction = await page.evaluate(() => getComputedStyle(document.body).direction);
  expect(direction).toBe("rtl");

  // The six bands, in order, and nothing else. This is the assertion that
  // stops the editorial site's sequence creeping back in.
  const bandHeadings = await page
    .locator("main section > .container h1, main section > .container h2")
    .allInnerTexts();
  expect(bandHeadings, "the homepage's six bands").toEqual([
    "سنجه",
    "چه چیزی ساخته می‌شود",
    "فهرست محصولات",
    "مسیر کار",
    "منحنی مشخصه و رفتار حلقهٔ کنترلی",
    "تماس",
  ]);

  // No hero image, no dark band above the footer: both are §15 prohibitions
  // and both are the kind of thing that returns during a late edit.
  const darkBands = await page.locator("main .ground-dark").count();
  expect(darkBands, "dark bands outside the footer").toBe(0);

  await scrollThrough(page);

  expect(await brokenImages(page), "images failing to load").toBe(0);

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflows, "horizontal overflow").toBe(false);

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("the product index is nine identical cells", async ({ page }) => {
  await page.goto(`${BASE}/`);

  const cells = page.locator("article.product-cell");
  await expect(cells).toHaveCount(9);

  await cells.first().scrollIntoViewIfNeeded();
  await scrollThrough(page);

  // "No cell larger than another" is a load-bearing claim of this design, so
  // it is measured rather than trusted: every cell's box, to the pixel.
  const boxes = await cells.evaluateAll((els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return `${Math.round(r.width)}×${Math.round(r.height)}`;
    }),
  );
  const widths = new Set(boxes.map((b) => b.split("×")[0]));
  const heights = new Set(boxes.map((b) => b.split("×")[1]));
  expect([...widths], "every cell the same width").toHaveLength(1);
  expect([...heights], "every cell the same height").toHaveLength(1);

  // Colour is never the only carrier of meaning: the category bar is hidden
  // from the accessibility tree and the category is also written out.
  const bars = page.locator(".product-cell__bar");
  await expect(bars).toHaveCount(9);
  const hidden = await bars.evaluateAll((els) =>
    els.every((el) => el.getAttribute("aria-hidden") === "true"),
  );
  expect(hidden, "category bars must be decorative").toBe(true);
  for (const cell of await cells.all()) {
    await expect(cell.locator("p.t-meta")).not.toBeEmpty();
  }
});

test("the homepage lightbox opens, closes, and its triggers look clickable", async ({ page }) => {
  await page.goto(`${BASE}/gallery/`);

  expect(await namelessControls(page), "controls with no accessible name").toEqual([]);

  const firstTile = page.locator("button.figure-tile").first();
  await firstTile.scrollIntoViewIfNeeded();

  // PARNIAN shipped gallery tiles computing `cursor: default` — a button that
  // does not look like one. Known defect there; asserted against here.
  const cursor = await firstTile.evaluate((el) => getComputedStyle(el).cursor);
  expect(cursor, "lightbox trigger must compute cursor: pointer").toBe("pointer");

  await firstTile.click();

  const dialog = page.locator("dialog.lightbox");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(dialog).toHaveAttribute("aria-label", /\S/);
  expect(await namelessControls(page), "lightbox controls with no name").toEqual([]);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);
});

test("a product route survives a hard load under the base path", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  const response = await page.goto(`${BASE}/products/shir-globe/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("شیر کنترلی گلوب");

  const homeLink = page.locator('nav[aria-label="مسیر صفحه"] a').first();
  await expect(homeLink).toHaveAttribute("href", `${BASE}/`);

  // 6–8 rows of physical attributes, one of which says what the part is not
  // for. The count is asserted because "say what it is not for" is the rule
  // most likely to be quietly dropped when a product is added.
  const specRows = page.locator('section[aria-labelledby="spec-heading"] tbody tr');
  const rowCount = await specRows.count();
  expect(rowCount, "specification rows").toBeGreaterThanOrEqual(6);
  expect(rowCount, "specification rows").toBeLessThanOrEqual(8);
  await expect(page.locator('th:has-text("محدودیت")')).toHaveCount(1);

  const inquiry = page.locator('a[href^="https://wa.me/"]');
  const inquiryHref = await inquiry.first().getAttribute("href");
  expect(inquiryHref, "WhatsApp inquiry link").toBeTruthy();
  expect(decodeURIComponent(inquiryHref!), "product name prefilled").toContain("شیر کنترلی گلوب");
  expect(decodeURIComponent(inquiryHref!), "product code prefilled").toContain("SJ-1120");
  expect(inquiryHref!, "digits only in the wa.me path").toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  await expect(inquiry.first()).toHaveAttribute("rel", /noopener/);

  // Related products are rows of a table, never cards. Asserted both ways:
  // the rows exist, and no product cell was smuggled onto this page.
  const relatedRows = page.locator('section[aria-labelledby="related-heading"] tbody tr');
  await expect(relatedRows).toHaveCount(2);
  await expect(page.locator("article.product-cell")).toHaveCount(0);

  const relatedLinks = await page
    .locator('section[aria-labelledby="related-heading"] tbody a[href]')
    .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  expect(relatedLinks.length).toBeGreaterThan(0);
  expect(relatedLinks.some((href) => href.includes("/products/shir-globe"))).toBe(false);

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("the collection page compares every product and groups them", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  const response = await page.goto(`${BASE}/products/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("مقایسهٔ کامل مشخصات");
  await expect(
    page.locator('header nav[aria-label="پیمایش اصلی"] a[aria-current="page"]'),
  ).toHaveText("فهرست محصولات");

  // One row per product, every spec a column.
  const comparisonRows = page.locator(".table-scroll tbody tr");
  await expect(comparisonRows).toHaveCount(9);
  const columns = await page.locator(".table-scroll thead th").count();
  expect(columns, "code + name + five specs").toBe(7);

  // The wide table is allowed to scroll, but only inside its own region, and
  // that region has to be reachable by keyboard and have a name.
  const region = page.locator(".table-scroll");
  await expect(region).toHaveAttribute("role", "region");
  await expect(region).toHaveAttribute("tabindex", "0");
  await expect(region).toHaveAttribute("aria-label", /\S/);

  const cells = page.locator("article.product-cell");
  const count = await cells.count();
  expect(count).toBe(9);

  // Three groups of three, each with a section the page can be linked into.
  const groups = page.locator('section[id^="group-"]');
  await expect(groups).toHaveCount(3);

  const printed = await page
    .locator('section[aria-labelledby="collection-heading"] p.t-meta')
    .innerText();
  expect(fromFa(printed)).toBe(count);

  await scrollThrough(page);
  expect(await brokenImages(page), "images failing to load").toBe(0);

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  expect(overflows, "horizontal overflow").toBe(false);

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("the archive numbers and captions every figure", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  const response = await page.goto(`${BASE}/gallery/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("آرشیو فنی");
  await expect(
    page.locator('header nav[aria-label="پیمایش اصلی"] a[aria-current="page"]'),
  ).toHaveText("آرشیو فنی");

  const figures = page.locator("figure");
  await expect(figures).toHaveCount(6);

  // A caption is required on every figure — an uncaptioned photograph is
  // decoration, and this archive does not have decoration in it.
  for (const figure of await figures.all()) {
    await expect(figure.locator("figcaption")).not.toBeEmpty();
    await expect(figure.locator(".figure-tile__number")).toHaveText(/^\d{2}$/);
  }

  const third = page.locator("button.figure-tile").nth(2);
  await third.scrollIntoViewIfNeeded();
  await third.click();

  const dialog = page.locator("dialog.lightbox");
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(dialog).toContainText("ابزار اندازه‌گیری");

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);

  expect(await brokenImages(page), "images failing to load").toBe(0);
  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("the about page states the range and carries no portrait", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  const response = await page.goto(`${BASE}/about/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("دربارهٔ سنجه");

  // No portrait, no studio photograph: this page has no image at all.
  await expect(page.locator("main img")).toHaveCount(0);

  const chat = page.locator('a[href^="https://wa.me/"]');
  await expect(chat).toHaveCount(1);
  await expect(chat).toHaveAttribute("rel", /noopener/);

  // There are no social accounts on this site, so the old Instagram assertion
  // has no subject. What replaces it is the conversion route that does exist.
  await expect(page.locator('a[href^="mailto:"]')).not.toHaveCount(0);
  await expect(page.locator('a[href^="tel:"]')).not.toHaveCount(0);
  await expect(page.locator('main a[href*="instagram.com"]')).toHaveCount(0);

  const deadLinks = await page
    .locator('a[href="#"]')
    .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim()));
  expect(deadLinks, "links pointing at #").toEqual([]);

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("the contact anchor the navigation points at exists", async ({ page }) => {
  await page.goto(`${BASE}/`);
  await expect(page.locator("#contact")).toHaveCount(1);
  await expect(page.locator('#contact a[href^="https://wa.me/"]')).toHaveCount(1);
});

/* ========================================================================== */
/*  Measurements — the things this design can actually break                  */
/* ========================================================================== */

/**
 * The page body must never scroll sideways, at any width, on any route.
 *
 * Measured on `document.body` rather than by eye, and reported as two numbers
 * so a failure says how far over it went rather than merely that it did. The
 * comparison table is exempt by construction: it scrolls inside
 * `.table-scroll`, which is a separate scroll container and does not widen
 * its ancestors.
 */
for (const width of [390, 1440]) {
  test(`no route scrolls horizontally at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });

    const over: string[] = [];
    for (const route of ROUTES) {
      await page.goto(`${BASE}${route}`);
      await scrollThrough(page);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.body.scrollWidth,
        clientWidth: document.body.clientWidth,
      }));
      if (scrollWidth > clientWidth) {
        over.push(`${route}  scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`);
      }
    }

    expect(over, `routes overflowing at ${width}px`).toEqual([]);
  });
}

/**
 * At phone width every table except the wide comparison must restructure into
 * stacked label-value rows.
 *
 * `display: block` is what does the stacking, and it is also what strips the
 * implicit ARIA table semantics — which is why the markup carries explicit
 * roles. Both halves are checked here: the layout changed, and the semantics
 * survived it.
 */
test("tables stack at 390px and keep their semantics", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });

  for (const route of ["/", "/products/shir-globe/"]) {
    await page.goto(`${BASE}${route}`);

    const stacked = page.locator("table.stacked-table");
    expect(await stacked.count(), `${route} has a stacked table`).toBeGreaterThan(0);

    const display = await stacked
      .first()
      .locator("tbody td")
      .first()
      .evaluate((el) => getComputedStyle(el).display);
    expect(display, `${route} cells must stack at 390px`).toBe("block");

    const roles = await stacked.first().evaluate((table) => ({
      table: table.getAttribute("role"),
      cell: table.querySelector("tbody td")?.getAttribute("role"),
      rowheader: table.querySelector("tbody th")?.getAttribute("role"),
    }));
    expect(roles.table, `${route} table role survives display:block`).toBe("table");
    expect(roles.cell, `${route} cell role survives display:block`).toBe("cell");
    expect(roles.rowheader, `${route} rowheader role survives display:block`).toBe("rowheader");

    // A stacked cell loses its column heading, so it has to carry its own
    // label — but only where there was a column heading to lose. The product
    // specification table is two columns of label and value, and its label is
    // the row header, which stacking keeps and repeats.
    const hasHead = await stacked.first().locator("thead").count();
    if (hasHead > 0) {
      const unlabelled = await stacked
        .first()
        .locator("tbody td")
        .evaluateAll((els) => els.filter((el) => !el.getAttribute("data-label")).length);
      expect(unlabelled, `${route} stacked cells without a data-label`).toBe(0);
    } else {
      const rowHeaders = await stacked.first().locator("tbody th[scope=\"row\"]").count();
      const rows = await stacked.first().locator("tbody tr").count();
      expect(rowHeaders, `${route} every row keeps its label`).toBe(rows);
    }
  }
});

/**
 * Nothing on any route may set body text below 14px.
 *
 * Checked on elements that own text directly, so a container's inherited size
 * is not counted twice, and skipping `.sr-only`, which is off-screen by design.
 */
test("no visible text is set below 14px", async ({ page }) => {
  const small: string[] = [];

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`);
    const found = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((el) => el.closest(".sr-only") === null && !el.classList.contains("sr-only"))
        .filter((el) => (el as HTMLElement).checkVisibility({ visibilityProperty: true }))
        .filter((el) =>
          [...el.childNodes].some((n) => n.nodeType === 3 && (n.textContent ?? "").trim() !== ""),
        )
        .map((el) => ({
          size: parseFloat(getComputedStyle(el).fontSize),
          what: `${el.tagName.toLowerCase()}.${el.className || "(no class)"}`,
        }))
        .filter((e) => e.size < 14)
        .map((e) => `${e.what} @ ${e.size}px`),
    );
    small.push(...found.map((f) => `${route}  ${f}`));
  }

  expect([...new Set(small)], "text below 14px").toEqual([]);
});

/**
 * Persian glyph coverage, checked against the font that actually loaded.
 *
 * `FontFaceSet.check` answers exactly the right question: are the faces for
 * this family loaded, and do they cover this text. The family name is read off
 * the computed style rather than hard-coded, because next/font mangles it at
 * build time.
 *
 * The second half catches the failure this project is actually exposed to:
 * `IBM Plex Mono` has no Arabic coverage at all, so any Persian word that ends
 * up in a `.t-data` span falls back silently to whatever the system offers.
 */
test("the body face covers Persian, and no Persian is set in the mono", async ({ page }) => {
  await page.goto(`${BASE}/`);

  const result = await page.evaluate(() => {
    const family = getComputedStyle(document.body).fontFamily.split(",")[0].trim();
    const covered = document.fonts.check(`16px ${family}`, "گچپژ سنجه ۱۲۳۴");

    // Anything in the mono face holding an Arabic-script character.
    const persianInMono = [...document.querySelectorAll(".t-data, .t-label, .band-head__index")]
      .filter((el) => /[؀-ۿ]/.test(el.textContent ?? ""))
      .map((el) => `${el.className}: ${el.textContent}`);

    return { family, covered, persianInMono };
  });

  expect(result.family, "a real family is resolved, not a fallback keyword").not.toBe("");
  expect(result.covered, `${result.family} must cover گچپژ سنجه ۱۲۳۴`).toBe(true);
  expect(result.persianInMono, "Persian text set in IBM Plex Mono").toEqual([]);
});

/* ========================================================================== */
/*  Metadata, structured data, and the things that must not exist             */
/* ========================================================================== */

test("every route carries its own metadata, under the deployed base path", async ({ page }) => {
  const routes = ["/", "/products/", "/gallery/", "/about/", "/products/shir-globe/", "/products/safi-khat/"];
  const seen = new Map<string, string[]>();

  for (const route of routes) {
    await page.goto(`${BASE}${route}`);

    const meta = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content"),
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content"),
    }));

    expect(meta.title, `${route} title`).toBeTruthy();
    expect(meta.description, `${route} description`).toBeTruthy();
    expect(meta.ogTitle, `${route} og:title matches the page title`).toBe(meta.title);

    // The half of the no-index instruction that a crawler actually reads on a
    // Pages project site. Without this the fictional supplier gets indexed.
    expect(meta.robots, `${route} robots meta`).toContain("noindex");

    for (const [name, value] of [
      ["canonical", meta.canonical],
      ["og:url", meta.ogUrl],
      ["og:image", meta.ogImage],
    ] as const) {
      expect(value, `${route} ${name} is absolute`).toMatch(/^https?:\/\//);
      if (BASE) expect(value, `${route} ${name} carries the base path`).toContain(`${BASE}/`);
    }

    expect(new URL(meta.canonical!).pathname, `${route} canonical points at itself`).toBe(
      `${BASE}${route}`,
    );

    for (const [field, value] of Object.entries(meta)) {
      if (field === "ogImage" || field === "robots") continue; // shared by every route on purpose
      const list = seen.get(field) ?? [];
      expect(list, `${route} ${field} is unique across routes`).not.toContain(value);
      list.push(value as string);
      seen.set(field, list);
    }
  }
});

test("the sitemap and robots.txt are exported and absolute", async ({ page }) => {
  const sitemap = await page.request.get(`${BASE}/sitemap.xml`);
  expect(sitemap.status()).toBe(200);

  const xml = await sitemap.text();
  for (const route of ROUTES) {
    expect(xml, `sitemap lists ${route}`).toContain(`${BASE}${route}</loc>`);
  }
  expect(xml.match(/<loc>/g)?.length, "sitemap entry count").toBe(13);
  expect(xml, "no relative loc").not.toMatch(/<loc>\//);
  expect(xml, "no 404 in the sitemap").not.toContain("/404");

  const robots = await page.request.get(`${BASE}/robots.txt`);
  expect(robots.status()).toBe(200);
  const text = await robots.text();
  expect(text, "robots points at the sitemap").toContain(`${BASE}/sitemap.xml`);
  expect(text, "this site is not for indexing").toContain("Disallow:");
});

test("structured data parses and claims nothing invented", async ({ page }) => {
  await page.goto(`${BASE}/products/shir-globe/`);

  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
  expect(blocks.length, "Organization + Product").toBe(2);

  const parsed = blocks.map((b) => JSON.parse(b) as Record<string, unknown>);
  const product = parsed.find((p) => p["@type"] === "Product")!;
  const organization = parsed.find((p) => p["@type"] === "Organization")!;

  expect(product.name).toBe("شیر کنترلی گلوب");
  expect(String(product.url)).toContain(`${BASE}/products/shir-globe/`);

  // `sku` is now asserted — it is the catalogue code, a fact about the listing
  // rather than a claim about the company. `gtin` stays forbidden: that is a
  // registered global identifier and inventing one would be a real lie.
  expect(product.sku, "the catalogue code").toBe("SJ-1120");
  // `brand` stays: naming the maker of a listing is not a claim about the
  // maker. `gtin` is forbidden because it is a registered global identifier
  // and inventing one would be a real lie rather than a fiction.
  expect((product.brand as { name?: string })?.name, "the maker").toBe("سنجه");
  for (const field of ["offers", "aggregateRating", "review", "gtin"]) {
    expect(product[field], `Product must not assert ${field}`).toBeUndefined();
  }
  expect(organization.sameAs, "Organization must not assert sameAs").toBeUndefined();
  for (const field of ["foundingDate", "numberOfEmployees", "award", "hasCredential"]) {
    expect(organization[field], `Organization must not assert ${field}`).toBeUndefined();
  }
});

test("the site says on the record that it claims no certification", async ({ page }) => {
  // A keyword sweep cannot run here: the sentence that disclaims certifications
  // necessarily contains the words «گواهی», «تأییدیه» and «استاندارد», so any
  // such check flags the one paragraph that should exist. What is assertable is
  // that the paragraph is still there — it is the site's whole defence against
  // a reader assuming an approval that was never claimed.
  await page.goto(`${BASE}/about/`);
  const text = await page.evaluate(() => document.body.innerText);
  expect(text, "the no-claims paragraph").toContain("هیچ ادعایی");
  expect(text, "the no-claims paragraph names what is not claimed").toMatch(/گواهی|تأییدیه|استاندارد/);
});

test("every control that leaves the mobile menu closes it", async ({ page }, testInfo) => {
  test.skip(
    (testInfo.project.use.viewport?.width ?? 0) >= 1024,
    "the mobile panel does not exist at desktop widths",
  );

  await page.goto(`${BASE}/`);
  const panel = page.locator(".menu-panel");
  const internal = page.locator('.menu-panel a[href^="/"]');

  await page.locator(".menu-toggle").first().click();
  await expect(panel).toHaveAttribute("data-open", "true");

  const count = await internal.count();
  expect(count, "the panel's own links").toBeGreaterThan(3);

  for (let i = 0; i < count; i += 1) {
    await page.goto(`${BASE}/`);
    await page.locator(".menu-toggle").first().click();
    await expect(panel).toHaveAttribute("data-open", "true");

    const href = await internal.nth(i).getAttribute("href");
    await internal.nth(i).click();

    await expect(panel, `${href} left the panel open`).toHaveAttribute("data-open", "false");
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow), {
        message: `${href} left the page scroll-locked`,
      })
      .not.toBe("hidden");
  }
});

test("an unknown path serves the styled 404", async ({ page }) => {
  const response = await page.goto(`${BASE}/definitely-not-a-page/`);
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("این نشانی در فهرست نیست.");
});

test("no route carries a form, a price, or a cart", async ({ page }) => {
  for (const route of ["/", "/products/", "/gallery/", "/about/", "/products/shir-globe/"]) {
    await page.goto(`${BASE}${route}`);

    // §4: no commerce anywhere. A form is the usual way it creeps back in.
    await expect(page.locator("form"), `${route} has a form`).toHaveCount(0);
    await expect(page.locator("input, select, textarea"), `${route} has a field`).toHaveCount(0);

    // Narrowed to an actual price — a figure with a currency after it. The
    // bare words appear in honest copy: the contact band says in so many words
    // that there is no online price and no cart, and that sentence should stay.
    const text = await page.evaluate(() => document.body.innerText);
    expect(text, `${route} shows a price`).not.toMatch(/[\d۰-۹][\d۰-۹,٬.\s]*\s*(تومان|ریال)/);
  }
});
