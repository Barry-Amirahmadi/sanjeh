/**
 * Open Graph card generator.
 *
 * **No social crawler renders an SVG `og:image`** — Facebook, X, LinkedIn and
 * Telegram all ignore it and show no preview at all — so the share card has to
 * be a raster. It is drawn as an SVG and screenshotted through the Chromium
 * that Playwright already installs for the smoke suite, exactly like the
 * placeholders in `generate-media.mjs`. Nothing is added to the dependency tree
 * and no PNG encoder is hand-written.
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
 *   node scripts/generate-og.mjs
 */
import { mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "media");
mkdirSync(outDir, { recursive: true });

/** Open Graph's expected card size. 1.91:1, which is what every consumer crops to. */
const W = 1200;
const H = 630;

/** Kept in sync with src/app/tokens.css. */
const INK = "#0E1116";
const INK_2 = "#5A6270";
const RULE = "#DADDE2";
const RULE_MID = "#B9BEC7";
const ACCENT = "#0047FF";

/** The same twelve columns the site draws, at the same hairline weight. */
const GUTTER = 72;
const columns = () => {
  const inner = W - GUTTER * 2;
  const step = inner / 12;
  let out = "";
  for (let i = 0; i <= 12; i++) {
    const x = (GUTTER + step * i).toFixed(1);
    out += `<path d="M${x} 0 V${H}" stroke="${RULE}" stroke-width="1"/>`;
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

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  ${columns()}

  <path d="M${GUTTER} 108 H${W - GUTTER}" stroke="${RULE_MID}" stroke-width="1"/>
  <path d="M${GUTTER} ${H - 108} H${W - GUTTER}" stroke="${RULE_MID}" stroke-width="1"/>

  <!-- The 3px category bar, the one piece of colour the product cells carry. -->
  <rect x="${GUTTER}" y="248" width="120" height="3" fill="${ACCENT}"/>

  <text x="${GUTTER}" y="368" fill="${INK}"
        font-family="'Segoe UI', Arial, Helvetica, sans-serif" font-size="128" font-weight="700"
        letter-spacing="2">SANJEH</text>

  <text x="${GUTTER}" y="424" fill="${INK_2}"
        font-family="Consolas, 'Courier New', ui-monospace, monospace" font-size="27"
        letter-spacing="7">FLUID CONTROL / INSTRUMENTATION</text>

  ${mark(W - GUTTER - 150, H / 2 - 6, 300)}
</svg>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.setContent(
  `<style>html,body{margin:0;padding:0;overflow:hidden}svg{display:block}</style>${svg}`,
  { waitUntil: "load" },
);
const file = join(outDir, "og-card.png");
await page.screenshot({ path: file, type: "png" });
await browser.close();

console.log(
  `generated og-card.png  ${W}×${H}  ${(statSync(file).size / 1024).toFixed(0)} KB → public/media/`,
);
