import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Noto_Sans_Arabic } from "next/font/google";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { organizationSchema } from "@/content/schema";
import { siteRoot } from "@/lib/seo";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

/**
 * Two faces, and one of them only sets numbers.
 *
 * **`Noto Sans Arabic` is the only text face on this site — there is no display
 * face at all.** Every other repository in this family pairs a display face
 * against a body face; using a single grotesque at four sizes is the authentic
 * Swiss move and is also the strongest possible separation from them. A heading
 * here is this face, larger and heavier. That is the whole type system.
 *
 * `IBM Plex Mono` carries data only: catalogue codes, sizes, pressures,
 * temperatures, figure numbers and every numeral inside a table. It has no
 * Arabic coverage, which is why any Persian label beside a numeral is a
 * separate span in the body face rather than being set in the mono by mistake.
 *
 * **Both subsets on the Arabic face. Do not "optimise" it down to `arabic`** —
 * Google splits these files by unicode range and the `arabic` subset does not
 * contain `U+0020`. The space character, the em-dash and the rest of general
 * punctuation live in the `latin` subset, and every Persian heading on this
 * site has spaces in it, so the browser downloads that file either way.
 * Dropping the subset only removes its `<link rel="preload">`, turning an early
 * parallel fetch into a late one discovered after layout.
 *
 * Both faces are fetched at build time and served from this origin — next/font
 * self-hosts rather than linking to Google. That matters for a site aimed at
 * Iranian users: no third-party font request to be slow or blocked, and no
 * layout shift while a webfont negotiates.
 */
const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

/**
 * Site-wide defaults only. Every route composes its own title, description,
 * canonical and social card through `pageMetadata` — see `src/lib/seo.ts`.
 *
 * `metadataBase` carries the base path, unlike the bare origin the deploy
 * workflow supplies, so any relative URL Next resolves for itself lands inside
 * the deployed site rather than at the root of the host.
 *
 * **`robots` is the half of the no-index instruction that actually works.**
 * `robots.ts` generates a correct `robots.txt`, but a crawler only ever fetches
 * that file from the *origin root* — on a GitHub Pages project site this
 * deployment owns `user.github.io/sanjeh/`, not `user.github.io/`, so nothing
 * will ever read it there. The meta tag below travels with the page and is
 * what keeps a fictional supplier out of search results. Both are set; the meta
 * is the one relied on.
 */
export const metadata: Metadata = {
  metadataBase: new URL(`${siteRoot}/`),
  title: {
    default: site.seo.title,
    template: site.seo.titleTemplate,
  },
  description: site.seo.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${notoArabic.variable} ${plexMono.variable}`}
      /* The inline script below stamps data-js before React hydrates; that is
         the point of it, so the resulting attribute difference is expected. */
      suppressHydrationWarning
    >
      <body>
        {/* Marks the document as scripted before first paint. Scroll reveals
            are hidden only under [data-js="on"], so a failed or blocked bundle
            leaves a fully readable page instead of a blank one. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute("data-js","on")`,
          }}
        />

        <a href="#main" className="skip-link">
          {ui.skipToContent}
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />

        {/* Company-level structured data, on every page because the
            organisation is a property of the site rather than of any route. */}
        <JsonLd data={organizationSchema()} />
      </body>
    </html>
  );
}
