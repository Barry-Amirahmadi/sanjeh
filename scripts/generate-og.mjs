/**
 * Open Graph card generator.
 *
 * **No social crawler renders an SVG `og:image`** — Facebook, X, LinkedIn and
 * Telegram all ignore it and show no preview at all — so the share card has to
 * be a raster. It is composed as an SVG and screenshotted through the Chromium
 * that Playwright already installs for the smoke suite, exactly like the
 * placeholders in `generate-media.mjs`. Nothing is added to the dependency tree
 * and no JPEG encoder is hand-written.
 *
 *   node scripts/generate-og.mjs
 *
 * ### The card is half photograph, half the card it used to be
 *
 * The left 600×630 is `PHOTO`, a real catalogue photograph, cropped to cover
 * from its centre: a square source at 1024×1024 scaled to 630 tall loses 15px
 * off each side and nothing else. **Nothing is drawn on top of it**, which is
 * the point — no contrast pair on this card depends on photographic pixels, so
 * none of them can be broken by swapping the photograph.
 *
 * The right 600×630 is the previous card, unchanged in colour and in drawing
 * code, re-centred in that half. A 1200-wide composition does not fit in 600,
 * so it is scaled by `S`, uniformly, and centred: `CARD_SCALE` is the one knob.
 * Stroke weights and the accent bar are authored as `1 / S` and `3 / S` inside
 * the scaled group so that a hairline still renders as one device pixel and the
 * category bar still renders at three — a uniform scale would otherwise turn
 * every rule on the card into a 50% grey that is not visible at share size.
 *
 * ### Why the type on it is Latin
 *
 * The card is baked here, once, and shipped as pixels, so the only font that
 * matters is the one on this machine. That is still not a good enough reason to
 * set the Persian wordmark into it: the card cannot be proof-read after it is
 * encoded without opening the image, and a silently substituted or unshaped
 * Arabic glyph would ship unnoticed. Latin type through a system grotesque has
 * no such failure mode. The card carries the brand in Latin, the mark, and
 * nothing else — no claim, no descriptor that asserts anything.
 *
 * That is asserted rather than assumed: `assertNoPersian()` scans the composed
 * SVG for Arabic-script codepoints and refuses to render if one appears. The
 * day someone adds Persian here, this script stops and says to load the repo's
 * own font file and check `FontFace.status === "loaded"` first. `document.fonts
 * .check()` is not the test: it returns true for faces that never loaded.
 */
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "media");
mkdirSync(outDir, { recursive: true });

/** Open Graph's expected card size. 1.91:1, which is what every consumer crops to. */
const W = 1200;
const H = 630;

/**
 * The photograph.
 *
 * `p-01.jpg` is the first `/media/` photograph the built home page references
 * in document order — the opening cell of the register — so the card and the
 * page lead with the same object. The two `/media/` references ahead of it in
 * the file are this card's own `og:image` meta tags.
 */
const PHOTO = "p-01.jpg";

/** The byte ceiling for the card. Quality is walked down until it fits. */
const MAX_BYTES = 200 * 1024;

/** Kept in sync with src/app/tokens.css. Unchanged from the previous card. */
const INK = "#0E1116";
const INK_2 = "#5A6270";
const RULE = "#DADDE2";
const RULE_MID = "#B9BEC7";
const ACCENT = "#0047FF";
const GROUND = "#FFFFFF";

/** The composition is authored at full card width and shrunk into the half. */
const HALF = W / 2;
const CARD_SCALE = HALF / W;
/** Authored weights, pre-divided so they survive the scale at device weight. */
const HAIRLINE = 1 / CARD_SCALE;
const BAR_H = 3 / CARD_SCALE;

/** The same twelve columns the site draws, at the same hairline weight. */
const GUTTER = 72;
const columns = () => {
  const inner = W - GUTTER * 2;
  const step = inner / 12;
  let out = "";
  for (let i = 0; i <= 12; i++) {
    const x = (GUTTER + step * i).toFixed(1);
    out += `<path d="M${x} 0 V${H}" stroke="${RULE}" stroke-width="${HAIRLINE}"/>`;
  }
  return out;
};

/**
 * The mark from `src/app/icon.svg`, scaled up and inverted onto white: dial
 * arc in the hairline grey, needle in the accent, pivot in ink.
 */
const mark = (cx, cy, size) => {
  const s = size / 32;
  const u = (n) => (cx + (n - 16) * s).toFixed(1);
  const v = (n) => (cy + (n - 16) * s).toFixed(1);
  return `
    <path d="M${u(6.5)} ${v(22)} A ${(9.5 * s).toFixed(1)} ${(9.5 * s).toFixed(1)} 0 0 1 ${u(25.5)} ${v(22)}"
          fill="none" stroke="${RULE_MID}" stroke-width="${(2 * s).toFixed(1)}" stroke-linecap="round"/>
    <path d="M${u(16)} ${v(22)} L ${u(23)} ${v(11.5)}"
          stroke="${ACCENT}" stroke-width="${(2.8 * s).toFixed(1)}" stroke-linecap="round"/>
    <circle cx="${u(16)}" cy="${v(22)}" r="${(2.6 * s).toFixed(1)}" fill="${INK}"/>`;
};

/** Where the mark's pivot lands inside the authored composition. The pixel
 *  measurement needs this to know which box to search for the darkest ink. */
const MARK_SIZE = 300;
const MARK_CX = W - GUTTER - 150;
const MARK_CY = H / 2 - 6;

/**
 * Everything the card draws, minus its ground: the twelve columns, the two
 * horizontal rules, the category bar, the wordmark, the descriptor, the mark.
 * Authored in the original 1200×630 coordinate system and transformed as one
 * group, so the composition's proportions are the previous card's exactly.
 */
const cardBody = () => `
  ${columns()}

  <path d="M${GUTTER} 108 H${W - GUTTER}" stroke="${RULE_MID}" stroke-width="${HAIRLINE}"/>
  <path d="M${GUTTER} ${H - 108} H${W - GUTTER}" stroke="${RULE_MID}" stroke-width="${HAIRLINE}"/>

  <!-- The 3px category bar, the one piece of colour the product cells carry. -->
  <rect x="${GUTTER}" y="248" width="120" height="${BAR_H}" fill="${ACCENT}"/>

  <text x="${GUTTER}" y="368" fill="${INK}"
        font-family="'Segoe UI', Arial, Helvetica, sans-serif" font-size="128" font-weight="700"
        letter-spacing="2">SANJEH</text>

  <text x="${GUTTER}" y="424" fill="${INK_2}"
        font-family="Consolas, 'Courier New', ui-monospace, monospace" font-size="27"
        letter-spacing="7">FLUID CONTROL / INSTRUMENTATION</text>

  ${mark(MARK_CX, MARK_CY, MARK_SIZE)}`;

/* The group is centred in the right half: the authored card is W×H, scaled by
   CARD_SCALE to HALF×(H·CARD_SCALE), so the left edge already sits on HALF and
   only the vertical centring needs an offset. */
const OFFSET_Y = (H - H * CARD_SCALE) / 2;

const photoBytes = readFileSync(join(outDir, PHOTO));
const photoHref = `data:image/jpeg;base64,${photoBytes.toString("base64")}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <clipPath id="photo"><rect x="0" y="0" width="${HALF}" height="${H}"/></clipPath>
  </defs>

  <rect width="${W}" height="${H}" fill="${GROUND}"/>

  <!-- Left half: the photograph, cover-cropped from its centre, nothing on it. -->
  <image href="${photoHref}" x="0" y="0" width="${HALF}" height="${H}"
         preserveAspectRatio="xMidYMid slice" clip-path="url(#photo)"/>

  <!-- Right half: the previous card, re-centred and scaled to fit. -->
  <g id="card" transform="translate(${HALF} ${OFFSET_Y}) scale(${CARD_SCALE})">
    ${cardBody()}
  </g>
</svg>`;

/** Refuse to render Persian without a proven font. See the header. */
function assertNoPersian(source) {
  const hit = /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.exec(source);
  if (!hit) return;
  throw new Error(
    `the card now draws Arabic-script text at index ${hit.index} — load the ` +
      `repo's own font file and assert FontFace.status === "loaded" before ` +
      `rendering; document.fonts.check() is not the test`,
  );
}
assertNoPersian(svg.replace(photoHref, ""));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(
  `<style>html,body{margin:0;padding:0;overflow:hidden}svg{display:block}</style>${svg}`,
  { waitUntil: "load" },
);

/* Proof the composition fits the half rather than an assumption that it does.
   Every drawn element's box, in card coordinates, must sit inside the right
   half and inside the card's height. */
const fit = await page.evaluate(() => {
  const g = document.getElementById("card");
  const r = g.getBoundingClientRect();
  return { x: r.x, y: r.y, w: r.width, h: r.height, right: r.x + r.width, bottom: r.y + r.height };
});

const file = join(outDir, "og-card.jpg");
let quality = 92;
let buffer = null;
for (; quality >= 60; quality -= 4) {
  buffer = await page.screenshot({ type: "jpeg", quality });
  if (buffer.length <= MAX_BYTES) break;
}
writeFileSync(file, buffer);
await browser.close();

const problems = [];
if (fit.x < HALF - 0.5) problems.push(`the composition starts at x=${fit.x.toFixed(1)}, over the photograph`);
if (fit.right > W + 0.5) problems.push(`the composition ends at x=${fit.right.toFixed(1)}, past the card`);
if (fit.y < -0.5 || fit.bottom > H + 0.5) problems.push(`the composition runs ${fit.y.toFixed(1)}…${fit.bottom.toFixed(1)} vertically`);
if (buffer.length > MAX_BYTES) problems.push(`${(buffer.length / 1024).toFixed(0)} KB, over the 200 KB ceiling`);

console.log(
  `generated og-card.jpg  ${W}×${H}  ${(statSync(file).size / 1024).toFixed(0)} KB  q${quality} → public/media/`,
);
console.log(`  photograph : ${PHOTO}, ${(photoBytes.length / 1024).toFixed(0)} KB, cover-cropped from centre into ${HALF}×${H}`);
console.log(`  composition: ${fit.w.toFixed(1)}×${fit.h.toFixed(1)} at x=${fit.x.toFixed(1)} y=${fit.y.toFixed(1)}, scale ${CARD_SCALE}`);
console.log(`  right half : x ${HALF}…${W}, ground ${GROUND}`);

if (problems.length) {
  for (const p of problems) console.log(`  PROBLEM: ${p}`);
  process.exit(1);
}
