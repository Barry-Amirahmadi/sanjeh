"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { hashTarget, routePath } from "@/lib/nav";
import { Wordmark } from "@/components/ui/Wordmark";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { useActiveSection } from "./useActiveSection";

/**
 * The masthead rule.
 *
 * Deliberately simpler than the editorial engine's header, and one thing is
 * gone on purpose: **there is no scroll state and no backdrop blur.** That
 * header faded a translucent blur in and out and grew a border once the page
 * moved, which on a design made of structural rules would mean the topmost
 * rule appears only after you scroll. Here the rule is always there and the
 * bar is opaque, so there is nothing behind it to blur — which also removes
 * the per-frame blur cost the editorial engine had to measure and work around.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Only the in-page nav targets are observed; a route link has no section to
  // watch, and useActiveSection ignores any id that is not in this document.
  const sectionIds = useMemo(
    () => site.nav.map((item) => hashTarget(item.href)).filter((id): id is string => id !== null),
    [],
  );
  const activeSection = useActiveSection(sectionIds);
  const here = routePath(usePathname() ?? "/");

  /** `page` for the route you are on, `location` for the band you are inside. */
  const currentState = (href: string) => {
    const target = hashTarget(href);
    if (routePath(href) !== here) return undefined;
    if (target === null) return "page" as const;
    return activeSection === target ? ("location" as const) : undefined;
  };

  return (
    <>
      <header className="site-header">
        <div className="container flex items-center justify-between gap-5 py-3">
          <Wordmark />

          <nav aria-label={ui.nav.primary} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nav-link" aria-current={currentState(item.href)}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              href={site.headerCta.href}
              variant="secondary"
              className="hidden md:inline-flex"
            >
              {site.headerCta.label}
            </Button>
            <button
              type="button"
              className="menu-toggle lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label={ui.nav.openMenu}
              aria-expanded={menuOpen}
            >
              <span className="flex w-5 flex-col gap-[5px]">
                <span className="menu-toggle__bar w-full" />
                <span className="menu-toggle__bar w-full" />
                <span className="menu-toggle__bar w-full" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
