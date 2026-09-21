import next from "eslint-config-next";
import nextTypescript from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

/**
 * Minimal and standard, per the Task 3 ruling — not a bespoke ruleset.
 *
 * TypeScript strict already catches type errors. What it does not catch is the
 * class of defect this project has actually shipped: accessibility regressions
 * (§36 defects 3, 4, 6, and the 20px breadcrumb found in Task 3) and dead code
 * paths (the `next lint` script that had never run). `jsx-a11y` is here for the
 * first of those specifically, and it is worth more on this project than any
 * stylistic rule would be.
 *
 * Note this is the only linter config: `next lint` was removed in Next 16, so
 * ESLint is invoked directly.
 */
const config = [
  { ignores: [".next/**", "out/**", "node_modules/**", "playwright-report/**", "test-results/**"] },

  ...next,
  ...nextTypescript,

  {
    // `eslint-config-next` already registers the jsx-a11y plugin with a partial
    // rule set, and a flat config may not register the same plugin twice. So the
    // recommended rules are spread in rather than the whole config object.
    files: ["**/*.{ts,tsx,js,jsx,mjs}"],
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // The codebase is deliberately comment-heavy and uses void elements and
      // logical properties rather than utility soup; nothing stylistic is
      // configured here on purpose. Only real-defect rules are tightened.
      "jsx-a11y/no-autofocus": "error",
      /**
       * Table elements carry explicit roles in this project, and they are not
       * redundant. Below the md breakpoint the responsive tables set
       * `display: block` on their parts so rows stack — which removes the
       * implicit ARIA table semantics in several browsers. The explicit roles
       * are what survives that. See the `.stacked-table` block in
       * src/app/components.css for the full reasoning.
       *
       * Scoped to exactly the six table elements: everything else is still
       * flagged.
       */
      "jsx-a11y/no-redundant-roles": [
        "error",
        {
          table: ["table"],
          thead: ["rowgroup"],
          tbody: ["rowgroup"],
          tr: ["row"],
          th: ["columnheader", "rowheader"],
          td: ["cell"],
        },
      ],
      /**
       * Same reasoning as `no-redundant-roles` above, from the other direction.
       * jsx-a11y treats `<td>` and `<th>` as interactive elements, so writing
       * the role they already imply trips this rule — but that role is exactly
       * what has to be written down for the stacked tables, because
       * `display: block` strips the implicit one.
       *
       * Scoped to those two elements and to the two roles they may legitimately
       * be given. `tr: ["none", "presentation"]` is the rule's own default and
       * is repeated here because passing options replaces it.
       */
      "jsx-a11y/no-interactive-element-to-noninteractive-role": [
        "error",
        {
          tr: ["none", "presentation"],
          th: ["columnheader", "rowheader"],
          td: ["cell"],
        },
      ],
      /**
       * `.table-scroll` is a scrollable region and carries `tabIndex={0}`
       * deliberately: a region that scrolls but cannot be focused is
       * unreachable by keyboard, which fails WCAG 2.1.1. Allowing `region`
       * here is the rule's documented escape hatch — `tabpanel` is its own
       * default and is repeated because options replace it.
       */
      "jsx-a11y/no-noninteractive-tabindex": [
        "error",
        { tags: [], roles: ["tabpanel", "region"], allowExpressionValues: true },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },

  {
    // Build and verification scripts are Node programs, not app code: they are
    // supposed to print to stdout, and they never render anything.
    files: ["scripts/**/*.mjs"],
    rules: { "no-console": "off" },
  },
];

export default config;
