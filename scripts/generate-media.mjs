/**
 * Placeholder image generator.
 *
 * Phase A ships the whole site on generated images so it can be deployed and
 * checked before a single real photograph exists. Phase B replaces them.
 *
 * **Every placeholder is written to exactly the path, format and ratio the real
 * file will use** — `public/media/p-01.jpg`, 1:1, 1024×1024 — so replacing them
 * later is a file swap and nothing else: no content edit, no ratio change, no
 * layout shift, no rebuild of anything but the images themselves. A `.svg`
 * placeholder standing in for a `.jpg` photograph would break that promise at
 * the last moment, which is the worst moment.
 *
 * ### Why this renders through Chromium
 *
 * The site has exactly three runtime dependencies and is not going to gain a
 * fourth to draw a placeholder. Node has no JPEG encoder, and writing one
 * — DCT, quantisation tables, Huffman coding — to fill nine slots would be a
 * silly amount of code to maintain. Playwright is already a devDependency
 * because the smoke suite needs it, its Chromium is already downloaded, and
 * Chromium has a very good JPEG encoder. So each slot is drawn as an SVG,
 * loaded into a 1024×1024 page, and screenshotted as JPEG. Nothing is added to
 * the dependency tree and no encoder is hand-written.
 *
 * ### The art direction
 *
 * Not the defocused tonal studies this engine shipped with — those belong to an
 * editorial site. These are catalogue placeholders: a component silhouette
 * built from primitives, brushed-metal shading, a soft contact shadow, corner
 * registration marks and a centre crosshair. They read as what they are, which
 * is honest, and they sit correctly inside a white Swiss grid.
 *
 * **No text of any kind.** Not a code, not a caption, not a watermark. Partly
 * because the real images are generated under the same rule, and partly because
 * a headless Chromium renders whatever font it happens to find, which for
 * Persian is usually nothing.
 *
 *   node scripts/generate-media.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "public", "media");
mkdirSync(outDir, { recursive: true });

/** Every image on this site is square. All 24 of them. */
const SIZE = 1024;

/** Kept in sync with src/app/tokens.css. */
const C = {
  white: "#FFFFFF",
  scale: "#F4F5F7",
  ink: "#0E1116",
  rule: "#DADDE2",
  metalLight: "#E6E9ED",
  metalMid: "#AFB6C0",
  metalDark: "#7E8794",
  brassLight: "#D8C7A2",
  brassMid: "#B29C6E",
  brassDark: "#8A7648",
};

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                */
/* -------------------------------------------------------------------------- */

/**
 * A cylinder read end-on: light, mid, light across its width, which is what a
 * turned metal surface does under a soft overhead light. `axis` decides whether
 * the highlight runs vertically or horizontally.
 */
const metalGradient = (id, axis = "x", tone = "steel") => {
  const [a, b, c] =
    tone === "brass"
      ? [C.brassLight, C.brassMid, C.brassDark]
      : [C.metalLight, C.metalMid, C.metalDark];
  const coords = axis === "x" ? 'x1="0" y1="0" x2="1" y2="0"' : 'x1="0" y1="0" x2="0" y2="1"';
  return `<linearGradient id="${id}" ${coords}>
      <stop offset="0%" stop-color="${c}"/>
      <stop offset="22%" stop-color="${b}"/>
      <stop offset="46%" stop-color="${a}"/>
      <stop offset="72%" stop-color="${b}"/>
      <stop offset="100%" stop-color="${c}"/>
    </linearGradient>`;
};

const rect = (x, y, w, h, fill, rx = 0) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;

const circle = (cx, cy, r, fill) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;

const ring = (cx, cy, r, width, stroke) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${width}"/>`;

/** The contact shadow. Without one the component floats and reads as clip-art. */
const shadow = (cx, cy, rx, ry = rx * 0.17) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#contact)"/>`;

/** Bolt circle: `n` holes evenly spaced at radius `r`. Flanges and handwheels. */
function bolts(cx, cy, r, n, hole, fill) {
  let out = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    out += circle((cx + Math.cos(a) * r).toFixed(1), (cy + Math.sin(a) * r).toFixed(1), hole, fill);
  }
  return out;
}

/** A pair of pipe flanges either side of a body, on the horizontal axis. */
const pipeRun = (cx, cy, halfSpan, bore, faceW = 26) =>
  rect(cx - halfSpan, cy - bore / 2, halfSpan * 2, bore, "url(#steelY)", 4) +
  rect(cx - halfSpan, cy - bore * 0.78, faceW, bore * 1.56, "url(#steelX)", 3) +
  rect(cx + halfSpan - faceW, cy - bore * 0.78, faceW, bore * 1.56, "url(#steelX)", 3);

/* -------------------------------------------------------------------------- */
/*  The nine component silhouettes                                            */
/* -------------------------------------------------------------------------- */

/**
 * Each takes the canvas centre and returns markup. They are schematic on
 * purpose — a placeholder that tries to be photographic and fails looks worse
 * than one that is plainly a drawing.
 */
const COMPONENTS = {
  /** Globe valve: round body, tall bonnet, handwheel on top. */
  globe: (cx, cy) =>
    shadow(cx, cy + 210, 200) +
    pipeRun(cx, cy + 120, 300, 108) +
    circle(cx, cy + 90, 150, "url(#steelX)") +
    rect(cx - 52, cy - 150, 104, 240, "url(#steelX)", 10) +
    rect(cx - 86, cy - 168, 172, 42, "url(#steelX)", 6) +
    rect(cx - 12, cy - 250, 24, 100, "url(#steelY)", 4) +
    circle(cx, cy - 258, 118, "url(#steelX)") +
    circle(cx, cy - 258, 74, C.white) +
    bolts(cx, cy - 258, 96, 6, 13, C.metalDark),

  /** Ball valve: squat body, wide flanges, a lever lying across the top. */
  ball: (cx, cy) =>
    shadow(cx, cy + 200, 230) +
    pipeRun(cx, cy + 70, 330, 128) +
    rect(cx - 150, cy - 60, 300, 260, "url(#steelX)", 24) +
    rect(cx - 34, cy - 140, 68, 90, "url(#steelX)", 8) +
    rect(cx - 250, cy - 182, 470, 40, "url(#steelY)", 20) +
    circle(cx + 200, cy - 162, 34, "url(#steelX)") +
    bolts(cx, cy + 70, 0, 1, 0, C.white),

  /** Butterfly valve: a disc seen slightly open inside a wafer body. */
  butterfly: (cx, cy) =>
    shadow(cx, cy + 215, 215) +
    rect(cx - 30, cy - 250, 60, 190, "url(#steelX)", 8) +
    rect(cx - 96, cy - 288, 192, 48, "url(#steelX)", 8) +
    circle(cx, cy + 60, 210, "url(#steelX)") +
    circle(cx, cy + 60, 152, C.white) +
    `<ellipse cx="${cx}" cy="${cy + 60}" rx="52" ry="150" fill="url(#steelY)"/>` +
    rect(cx - 8, cy - 100, 16, 330, C.metalDark, 3) +
    bolts(cx, cy + 60, 186, 8, 15, C.metalDark),

  /** Pressure gauge: bezel, dial face, tick ring, needle, hex process nut. */
  gauge: (cx, cy) =>
    shadow(cx, cy + 250, 170) +
    rect(cx - 44, cy + 150, 88, 110, "url(#steelX)", 6) +
    `<path d="M ${cx - 66} ${cy + 236} h 132 l -18 34 h -96 z" fill="url(#steelX)"/>` +
    circle(cx, cy - 20, 260, "url(#steelX)") +
    circle(cx, cy - 20, 218, C.white) +
    ring(cx, cy - 20, 182, 6, C.rule) +
    bolts(cx, cy - 20, 182, 12, 9, C.metalDark) +
    `<path d="M ${cx} ${cy - 20} L ${cx + 118} ${cy - 132}" stroke="${C.ink}" stroke-width="14" stroke-linecap="round"/>` +
    circle(cx, cy - 20, 26, "url(#steelX)"),

  /** Inline flowmeter: a pipe section with a transmitter head on a riser. */
  flow: (cx, cy) =>
    shadow(cx, cy + 230, 250) +
    pipeRun(cx, cy + 130, 340, 150) +
    rect(cx - 170, cy + 40, 340, 180, "url(#steelX)", 12) +
    rect(cx - 40, cy - 60, 80, 110, "url(#steelY)", 6) +
    rect(cx - 160, cy - 260, 320, 210, "url(#steelX)", 16) +
    rect(cx - 116, cy - 214, 232, 120, C.white, 6) +
    ring(cx - 116 + 116, cy - 154, 44, 8, C.rule) +
    bolts(cx, cy - 274, 128, 4, 14, C.metalDark),

  /** Temperature sensor: head, hex union, long slim probe. */
  sensor: (cx, cy) =>
    shadow(cx, cy + 250, 130) +
    circle(cx, cy - 250, 132, "url(#steelX)") +
    circle(cx, cy - 250, 86, C.white) +
    bolts(cx, cy - 250, 108, 4, 12, C.metalDark) +
    rect(cx - 36, cy - 140, 72, 90, "url(#steelY)", 4) +
    `<path d="M ${cx - 78} ${cy - 56} h 156 l -22 66 h -112 z" fill="url(#steelX)"/>` +
    rect(cx - 26, cy + 10, 52, 250, "url(#steelX)", 6) +
    rect(cx - 26, cy + 236, 52, 24, C.metalDark, 6),

  /** Welded elbow: a 90° bend with two plain weld ends. */
  elbow: (cx, cy) =>
    shadow(cx + 40, cy + 250, 220) +
    `<path d="M ${cx - 300} ${cy - 140} h 200 a 240 240 0 0 1 240 240 v 180 h -150 v -180 a 90 90 0 0 0 -90 -90 h -200 z" fill="url(#steelY)"/>` +
    rect(cx - 320, cy - 152, 30, 154, "url(#steelX)", 3) +
    rect(cx + 128, cy + 262, 154, 30, "url(#steelY)", 3) +
    `<path d="M ${cx - 100} ${cy - 140} a 240 240 0 0 1 240 240" fill="none" stroke="${C.white}" stroke-width="10" opacity="0.5"/>`,

  /** Weld-neck flange: face ring, bolt circle, tapered hub. */
  flange: (cx, cy) =>
    shadow(cx, cy + 250, 240) +
    rect(cx - 62, cy + 40, 124, 220, "url(#steelX)", 6) +
    `<path d="M ${cx - 150} ${cy + 40} h 300 l -88 -120 h -124 z" fill="url(#steelX)"/>` +
    circle(cx, cy - 130, 262, "url(#steelX)") +
    circle(cx, cy - 130, 108, C.white) +
    ring(cx, cy - 130, 150, 5, C.rule) +
    bolts(cx, cy - 130, 202, 8, 30, C.white) +
    bolts(cx, cy - 130, 202, 8, 30, "none"),

  /** Y-strainer: body on the run, screen cap on the diagonal. */
  strainer: (cx, cy) =>
    shadow(cx, cy + 230, 250) +
    pipeRun(cx, cy - 40, 330, 120) +
    rect(cx - 160, cy - 110, 320, 140, "url(#steelX)", 30) +
    `<path d="M ${cx - 40} ${cy + 10} l 210 210 l -96 96 l -210 -210 z" fill="url(#steelY)"/>` +
    `<path d="M ${cx + 150} ${cy + 200} l 96 96 l -48 48 l -96 -96 z" fill="url(#steelX)"/>` +
    circle(cx - 6, cy - 40, 34, C.white),
};

/* -------------------------------------------------------------------------- */
/*  The six archive scenes                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Environmental rather than catalogue: these sit on the grey plane, fill the
 * frame, and are arrangements rather than single objects. Same rule about text.
 */
const SCENES = {
  /** Lathe: chuck, jaws, a turned bar and a tool post. */
  machining: () =>
    rect(0, 620, SIZE, 404, C.metalDark) +
    rect(0, 620, SIZE, 18, C.metalMid) +
    circle(300, 470, 250, "url(#steelX)") +
    circle(300, 470, 120, C.scale) +
    bolts(300, 470, 186, 3, 52, C.metalDark) +
    rect(300, 420, 640, 100, "url(#steelY)", 8) +
    rect(690, 560, 180, 240, "url(#steelX)", 10) +
    rect(740, 470, 80, 110, C.metalDark, 4) +
    rect(120, 700, 780, 26, C.metalMid, 6),

  /** Shelving: four ruled shelves, parts sorted along them by size. */
  rack: () => {
    let out = rect(0, 0, SIZE, SIZE, C.scale);
    for (let s = 0; s < 4; s++) {
      const y = 180 + s * 220;
      out += rect(60, y + 150, 904, 22, "url(#steelX)", 4);
      for (let i = 0; i < 6 - s; i++) {
        const w = 60 + s * 22;
        const x = 100 + i * (w + 46);
        out += rect(x, y + 150 - (60 + s * 14), w, 60 + s * 14, "url(#steelY)", 6);
      }
    }
    return out + rect(40, 100, 26, 880, C.metalDark, 4) + rect(958, 100, 26, 880, C.metalDark, 4);
  },

  /** Inspection bench: caliper, micrometer, a gauge block stack. */
  metrology: () =>
    rect(0, 0, SIZE, SIZE, C.scale) +
    rect(0, 640, SIZE, 384, "url(#steelY)") +
    rect(90, 300, 720, 40, "url(#steelX)", 6) +
    rect(150, 250, 44, 150, "url(#steelX)", 4) +
    rect(430, 260, 34, 130, "url(#steelX)", 4) +
    rect(90, 560, 420, 80, "url(#steelX)", 10) +
    circle(210, 600, 52, C.scale) +
    ring(210, 600, 34, 6, C.metalDark) +
    rect(620, 520, 300, 120, "url(#steelY)", 6) +
    rect(620, 520, 300, 14, C.metalDark, 4),

  /** Test rig: manifold header, four drops, two isolating handles. */
  rig: () =>
    rect(0, 0, SIZE, SIZE, C.scale) +
    rect(0, 780, SIZE, 244, C.metalDark) +
    rect(120, 200, 784, 76, "url(#steelY)", 8) +
    [0, 1, 2, 3].map((i) => rect(200 + i * 200, 276, 56, 504, "url(#steelX)", 6)).join("") +
    [0, 2].map((i) => rect(160 + i * 200, 430, 136, 44, "url(#steelY)", 10)).join("") +
    circle(228, 452, 60, "url(#steelX)") +
    circle(628, 452, 60, "url(#steelX)") +
    circle(228, 452, 26, C.scale) +
    circle(628, 452, 26, C.scale),

  /** Store aisle: pipe ends stacked by diameter, seen down the rack. */
  aisle: () => {
    let out = rect(0, 0, SIZE, SIZE, C.scale) + rect(0, 700, SIZE, 324, C.metalDark);
    const rows = [
      { r: 92, y: 610, n: 5 },
      { r: 66, y: 430, n: 7 },
      { r: 46, y: 300, n: 9 },
    ];
    for (const { r, y, n } of rows) {
      const span = (SIZE - 100) / n;
      for (let i = 0; i < n; i++) {
        const cx = 50 + span * (i + 0.5);
        out += circle(cx, y, r, "url(#steelX)") + circle(cx, y, r * 0.58, C.scale);
      }
    }
    return out;
  },

  /** Teardown: one valve opened out, its parts laid in assembly order. */
  teardown: () =>
    rect(0, 0, SIZE, SIZE, C.scale) +
    rect(60, 120, 904, 784, "url(#steelY)", 8) +
    circle(300, 330, 150, "url(#steelX)") +
    circle(300, 330, 84, C.scale) +
    rect(560, 240, 90, 190, "url(#steelX)", 8) +
    rect(730, 250, 40, 170, "url(#steelX)", 4) +
    circle(330, 690, 118, "url(#steelX)") +
    circle(330, 690, 72, C.scale) +
    bolts(330, 690, 96, 6, 14, C.metalDark) +
    rect(560, 620, 300, 44, "url(#steelX)", 10) +
    bolts(700, 780, 90, 5, 26, C.metalMid),
};

/* -------------------------------------------------------------------------- */
/*  The slot table — 24 images, and this is the whole manifest                */
/* -------------------------------------------------------------------------- */

const products = [
  ["p-01", "globe"],
  ["p-02", "ball"],
  ["p-03", "butterfly"],
  ["p-04", "gauge"],
  ["p-05", "flow"],
  ["p-06", "sensor"],
  ["p-07", "elbow"],
  ["p-08", "flange"],
  ["p-09", "strainer"],
];

/**
 * Nine catalogue shots, nine alternative views, six archive scenes.
 *
 * The `-a` view is the same component at a different scale and angle rather
 * than a different component: the real Phase B image is a second angle of the
 * same part, and a placeholder that showed something else would hide a
 * mismatch until the swap.
 */
const slots = [
  ...products.map(([id, kind]) => ({ file: `${id}.jpg`, kind, ground: C.white, scale: 1, angle: 0 })),
  ...products.map(([id, kind]) => ({
    file: `${id}-a.jpg`,
    kind,
    ground: C.white,
    scale: 0.78,
    angle: -14,
  })),
  ...["machining", "rack", "metrology", "rig", "aisle", "teardown"].map((scene, i) => ({
    file: `a-0${i + 1}.jpg`,
    scene,
    ground: C.scale,
  })),
];

/* -------------------------------------------------------------------------- */
/*  Assembly                                                                  */
/* -------------------------------------------------------------------------- */

/** Corner registration marks and a centre crosshair, in the site's hairline. */
const frame = () => {
  const m = 48;
  const len = 56;
  const s = `stroke="${C.rule}" stroke-width="2"`;
  const corner = (x, y, dx, dy) =>
    `<path d="M ${x} ${y + dy * len} L ${x} ${y} L ${x + dx * len} ${y}" fill="none" ${s}/>`;
  const c = SIZE / 2;
  return (
    corner(m, m, 1, 1) +
    corner(SIZE - m, m, -1, 1) +
    corner(m, SIZE - m, 1, -1) +
    corner(SIZE - m, SIZE - m, -1, -1) +
    `<path d="M ${c - 22} ${c} h 44 M ${c} ${c - 22} v 44" fill="none" ${s} opacity="0.55"/>`
  );
};

function svgFor(slot) {
  const c = SIZE / 2;
  const body = slot.scene
    ? SCENES[slot.scene]()
    : `<g transform="translate(${c} ${c}) rotate(${slot.angle}) scale(${slot.scale}) translate(${-c} ${-c})">${COMPONENTS[slot.kind](c, c)}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <defs>
    ${metalGradient("steelX", "x")}
    ${metalGradient("steelY", "y")}
    <radialGradient id="contact" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${C.ink}" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="${C.ink}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" fill="${slot.ground}"/>
  ${body}
  ${frame()}
</svg>`;
}

/* -------------------------------------------------------------------------- */
/*  Render                                                                    */
/* -------------------------------------------------------------------------- */

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: SIZE, height: SIZE },
  deviceScaleFactor: 1,
});

let total = 0;
let largest = 0;
let largestName = "";

for (const slot of slots) {
  await page.setContent(
    `<style>html,body{margin:0;padding:0;overflow:hidden}svg{display:block}</style>${svgFor(slot)}`,
    { waitUntil: "load" },
  );
  const buffer = await page.screenshot({ type: "jpeg", quality: 86 });
  writeFileSync(join(outDir, slot.file), buffer);

  total += buffer.length;
  if (buffer.length > largest) {
    largest = buffer.length;
    largestName = slot.file;
  }
}

await browser.close();

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
console.log(
  `generated ${slots.length} placeholders  ${SIZE}×${SIZE} 1:1  ` +
    `total ${kb(total)}  largest ${largestName} ${kb(largest)}  → public/media/`,
);
