# سنجه / SANJEH

RTL-first Persian catalogue for fluid-control components and instrumentation —
nine products in three categories, a full specification comparison, a technical
archive and no commerce of any kind. Static export, deployed to GitHub Pages.

**Live:** https://barry-amirahmadi.github.io/sanjeh/

Built on the engine from `parnian-cosmetics`: same Next.js static-export setup,
same typed content layer, same accessibility and RTL rules, entirely different
design. See the note at the top of `docs/MASTER-HANDOFF.md`.

## Stack

Next.js 16 App Router · React 19 · Tailwind CSS v4 · TypeScript.
**Exactly three runtime dependencies** — `next`, `react`, `react-dom`. No table,
grid, icon, animation or carousel library. Do not add a fourth without asking.

## Commands

```
npm run dev            # localhost:3210 — convenient, but never the thing you verify
npm run build          # production build, no base path
npm run build:pages    # build as deployed, base path /sanjeh
npm run preview:pages  # serve out/ at localhost:4321/sanjeh — verify here
npm run typecheck      # tsc --noEmit
npm run lint           # eslint, jsx-a11y findings are errors
npm run test:smoke     # playwright against the served static export
npm run media          # regenerate placeholder images
npm run og             # regenerate the social card
```

On Git Bash, `export MSYS_NO_PATHCONV=1` before any of these: without it a
leading-slash argument is rewritten into a Windows path and the base path is
silently wrong.

**Verify against `npm run preview:pages`, never `npm run dev`.** The dev server
does not apply the base path, does not export, and has hidden base-path bugs
that only appear in `out/`.

## Where things live

```
src/content/    all copy and data, typed against src/types/content.ts
src/components/ render content, never author it
src/app/        routes: / /products/ /products/[slug]/ /gallery/ /about/ 404
src/app/tokens.css    palette, type scale, spacing — every measured contrast
                      ratio is in a comment beside the colour it belongs to
scripts/        build, static server, media generation, viewport checks
docs/           MASTER-HANDOFF.md (inherited) · CMS-INTEGRATION-PLAN.md
public/media/   24 product and archive images, all 1:1 at 1024×1024
```

## Rules that are not obvious

* **No claims.** Physical attributes of a product are fine — size, pressure,
  temperature, body material, connection type. Conformity to a named standard,
  a certification, an approval, a test report, a client name, a founding year:
  all forbidden. This is a fictional company.
* **No commerce.** No price, no cart, no form. Enquiry is phone, email and a
  WhatsApp link carrying the product code.
* **No parentheses in Persian text**, anywhere. They break RTL rendering.
* **Ascending grid column starts only.** CSS Grid's sparse auto-placement
  cursor never moves backwards: a block asking for an earlier column than the
  one placed before it is pushed silently onto a new implicit row. See the
  comment in `src/app/products/[slug]/page.tsx`.
* **`robots` is set to `noindex` in root metadata.** The generated `robots.txt`
  is never read on a Pages project site — the meta tag is what does the work.

## Images

All 24 are 1:1 at 1024×1024 under `public/media/`. Product images sit on pure
white; archive images are environmental. Placeholders and real files use the
same paths and the same ratio, so replacing them is a file swap and nothing
else. Regenerate placeholders with `npm run media`.
