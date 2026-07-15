# CLAUDE.md

> **This is a living document. It will go stale, and stale instructions are worse than
> none — an agent follows them confidently into the wrong thing.**
>
> This project is early and will change a lot. When you change something this file
> describes — a command, a dependency pin, a convention, the infrastructure layout —
> update this file in the same commit. If you find something here that contradicts the
> code, the code is right: fix this file, don't work around it. Treat "CLAUDE.md was
> wrong" as a bug worth reporting to the team, not a papercut to route around.

## What this is

The IQC promotional site. Vue 3 + Vite single-page app, to be deployed on AWS.

## Repository layout

The npm project is **not** at the repo root. It lives at `src/iqc-site/`.

```
promo-site/
├── CLAUDE.md          ← you are here
├── lefthook.yml       ← git hooks (must be at repo root; runs jobs in src/iqc-site)
├── .gitattributes     ← line-ending policy (LF everywhere, all platforms)
├── .editorconfig      ← indentation: tabs, width 4
├── .nvmrc
└── src/iqc-site/      ← the actual app; run all npm commands from here
```

Run every `npm` command from `src/iqc-site/`, not the repo root. Git hooks and
`.editorconfig` are the exceptions — they live at the root because their tools require it.

## Commands

All from `src/iqc-site/`:

| Command                | What it does                             |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Vite dev server                          |
| `npm run build`        | Typecheck then production build          |
| `npm run typecheck`    | `vue-tsc -b` — types only, no emit       |
| `npm run lint`         | ESLint (flat config, `eslint.config.ts`) |
| `npm run lint:fix`     | ESLint with autofix                      |
| `npm run format`       | Prettier write                           |
| `npm run format:check` | Prettier check — what CI should run      |

Git hooks run automatically via lefthook: pre-commit lints and formats staged files,
pre-push typechecks. `npm install` sets them up through the `prepare` script.

## Stack

Vue 3 (Options API only, `defineComponent` SFCs), TypeScript, Vite 8, Tailwind 4
(configured via `@tailwindcss/vite`, not a `tailwind.config.js`), Pinia 3, vue-router 5.

### Pinia is pinned to 3.x on purpose — do not upgrade to 4

Pinia 4.0.x is published as `latest` on npm, and it is tempting to bump. Don't, without
re-verifying both of these first:

1. **Its exports map has no `types` condition.** TypeScript resolves through `exports`
   and ignores the top-level `types` field, so `import { createPinia } from 'pinia'`
   fails to find declarations. Runtime is fine; typecheck is not.
2. **vue-router 5.x declares a peer dep of `pinia@^3.0.4`.** Installing Pinia 4 alongside
   vue-router forces `--legacy-peer-deps`, which suppresses peer checks repo-wide and
   hides genuine conflicts later.

Both are upstream problems. When Pinia ships a release that fixes the exports map _and_
vue-router widens its peer range, upgrading is fine — delete this section when you do.

### jiti is a direct devDependency on purpose

ESLint needs it to load the TypeScript `eslint.config.ts`. It was previously present only
transitively via `@tailwindcss/vite`, which meant lint would have broken if Tailwind ever
restructured its dependencies. Keep it explicit.

## Conventions

- **Options API with `<script lang="ts">`.** This is a deliberate project choice, not
  legacy code to migrate. Do not "modernize" a component to `<script setup>` or the
  Composition API, and do not suggest it in review. No plain-JS SFCs.
    - Always `export default defineComponent({ ... })` — a bare object makes
      `this` implicitly `any` in every method and computed.
    - Annotate computed return types; inference through `this` is unreliable.
    - Imports are not exposed to the template. Asset URLs and the like must be returned
      from `data()`.
    - Never use arrow functions for `data` or methods — they lose the `this` binding.
- **Block order is `<template>` then `<script>`**, matching the existing components.
- **Routing:** routes are declared in `src/router/index.ts`. Route components live in
  `src/views/`, reusable pieces in `src/components/`. Lazy-load every route except the
  landing page (`component: () => import('../views/Foo.vue')`) to keep it out of the
  initial bundle.
- **Formatting is not a code review topic.** Prettier decides; the hook enforces it. If
  you disagree with a rule, change the config and reformat in one commit.
- **Indentation is tabs, displayed 4 wide.** This lives in `.editorconfig`, which the
  Prettier CLI reads by default — `.prettierrc.json` deliberately says nothing about
  `useTabs` / `tabWidth`. Don't add them there: `.prettierrc` _overrides_ `.editorconfig`,
  so the two would silently disagree and the winner wouldn't be the file you edited.
  Note `indent_style` takes `tab`, singular — `tabs` is not a valid value and
  EditorConfig-aware tools ignore it silently rather than erroring.
- **Line endings are LF**, enforced by `.gitattributes` regardless of anyone's local
  `core.autocrlf`. `.gitattributes`, `.editorconfig`, and Prettier must agree — changing
  one alone reintroduces cross-platform diff churn.
- **Styling:** Tailwind utilities plus the design tokens in `src/theme.css`. See
  [Styling](#styling) — the cascade rules there are not optional, and `src/style.css` is
  scaffold on its way out.

## Styling

Three CSS files, all imported from `src/main.ts` (listed by what they're for, not import
order — with cascade layers doing the work, import order barely matters here):

| File               | What it owns                                                                                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/theme.css`    | Design tokens (`@theme`): the `--color-*` palette, and `--font-header` / `--font-subheader` / `--font-body`. Also the `@font-face` rules and the `@source inline(...)` safelists. |
| `src/elements.css` | Bare-element presets (`body`, `h1`–`h6`) so components don't repeat `class="font-header"` on every heading. Font and tracking only — deliberately not a design system.            |
| `src/style.css`    | **Leftover Vite scaffold. It is being deleted — don't build on it or add to it.** Its `--accent` / `--text` / `--bg` tokens go with it, so don't reach for them in new code.      |

Prefer tokens from `theme.css` over hardcoded values.

### Element rules go in `@layer base`, and unlayered CSS silently beats them

Any rule targeting a bare element belongs inside `@layer base`. Tailwind's utilities sit
in a later layer, so a layered preset can always be overridden at the call site —
`<h1 class="font-body">` does what it says. That is the entire reason the presets are a
convenience and not a mandate.

The trap: **an unlayered rule beats every layered rule, regardless of specificity.**
`style.css` is entirely unlayered, and it silently overrode `.font-header`, then heading
`font-variation-settings`, then heading `letter-spacing` — three separate times, each
presenting as "Tailwind is broken" or "`@apply` does nothing". It wasn't; the CSS was
outranked. If a utility or an `elements.css` preset appears to do nothing on a bare
element, grep `style.css` for that property before debugging anything else.

### Font weight comes from the variable axis, not `font-weight`

`--font-header` and `--font-subheader` are the same family at different weights, set with
`--font-*--font-variation-settings: 'wght' N`. Tailwind honours only
`--font-*--font-variation-settings` and `--font-*--font-feature-settings` as token
sub-properties — a `--font-*--font-weight` is accepted and silently ignored.

Because `font-variation-settings` overrides `font-weight`, these tokens _own_ their
weight: `class="font-header font-normal"` still renders at 700. That's intended — the
token is the decision — but it means they don't compose with Tailwind's weight utilities.

### Fonts are Latin-subset WOFF2 built from the `.ttf` masters

`src/assets/fonts/` holds both. The `.ttf` files are the masters and are not shipped; the
`.woff2` files are committed build artifacts (~243 KB total, down from ~2.0 MB).
Regenerate them with the `fontTools` command recorded at the top of `theme.css` whenever
the charset or a source font changes.

Two things that must stay true:

- **`@font-face` URLs are relative** (`./assets/fonts/…`) so Vite fingerprints and emits
  them. A root-relative `/fonts/…` only resolves for files in `public/`; otherwise the
  build prints a "didn't resolve" warning and ships a 404 that merely looks like a
  fallback font.
- **Source Serif keeps `font-weight: 200 900`**, matching the `wght` range in its `fvar`
  table. Without the range the axis pins to 400 and every other weight is silently
  ignored. Re-check the range if the font is ever re-subset.

## Infrastructure (AWS) — direction, not yet built

None of this exists yet. It is recorded here so early decisions don't foreclose it.

**The site will run on a full AWS stack, and it may be handed to a different AWS account
later.** Account portability is a hard requirement, not a nice-to-have. That drives
everything below:

- **Everything is Infrastructure as Code.** If it is not in a template, it does not
  exist. Do not create resources by hand in the console — a console click is invisible to
  the next account and becomes the thing that breaks the migration at 2am.
- **Never hardcode account IDs, ARNs, bucket names, or regions.** Parameterize them and
  resolve at deploy time. Anything that assumes the current account is a migration bug
  waiting to happen.
- **State and secrets must be re-creatable.** Document any manual bootstrap step (domain
  registration, ACM validation, IAM identity-center setup) that IaC genuinely cannot
  own — that list is the real migration runbook.
- **The IaC tool is not chosen yet** (CDK / Terraform / Pulumi / SST are all open). When
  it is picked, record the choice and the reasoning here, and note where state lives.

## Open decisions

Things deliberately not settled. If you resolve one, update this section.

- IaC tool + where its state lives.
- **Avenir's webfont licence.** `Avenir Light.ttf` appears to be a desktop-licensed file,
  and desktop licences typically do not cover `@font-face` embedding. Confirm what BYU's
  licence actually permits before the site goes public — this is the one item here that no
  build will ever warn you about. Source Serif 4 is OFL and fine.
- `theme.css` overrides Tailwind's `hover` variant to a bare `&:hover`, dropping the
  default `@media (hover: hover)` guard that keeps hover styles from sticking after a tap
  on touch devices. Nobody has confirmed whether that's deliberate. Keep it and say why,
  or drop the override.
- Test framework — nothing is installed. Vitest + `@vue/test-utils` is the natural fit
  for this stack, and Playwright for e2e once there are flows worth testing.
- CI — no pipeline yet. It should run `typecheck`, `lint`, `format:check`, and tests.
- Whether `src/iqc-site/` gets hoisted to the repo root. The nesting already forced
  `lefthook.yml` to the root with a `root:` directive, and it means a fresh clone has no
  installable project at the top level.
