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

The IQC promotional site. Vue 3 + Vite single-page app, deployed as a static site on
GitHub Pages at **intermountainquantum.org**, with a move to AWS planned later.

Pages is the deliberate starting point, not a stopgap someone forgot to replace: the
domain is registered outside AWS, so Route 53 and ACM would have to be wired up before
anything could ship. Pages serves a static SPA off a domain registered anywhere. AWS is
still the destination once the site needs more than static hosting — see
[Infrastructure](#infrastructure-aws--direction-not-yet-built). Nothing in the Pages setup
forecloses it; the build output is a plain `dist/` directory that any static host serves.

## Repository layout

The npm project is **not** at the repo root. It lives at `src/iqc-site/`.

```
promo-site/
├── CLAUDE.md          ← you are here
├── lefthook.yml       ← git hooks (must be at repo root; runs jobs in src/iqc-site)
├── .gitattributes     ← line-ending policy (LF everywhere, all platforms)
├── .editorconfig      ← indentation: tabs, width 4
├── .prettierrc.json   ← formatting rules; at the root so they reach the whole repo
├── .prettierignore
├── .gitignore         ← root-level ignores (src/iqc-site/ has its own for the app)
├── .nvmrc
├── .github/workflows/ ← ci.yml (checks) + deploy.yml (Pages)
├── .vscode/           ← shared editor config + snippets; VS Code opens at the repo root
├── infra/             ← AWS IaC (placeholder, not built)
└── src/
    ├── backend/       ← placeholder, not built
    └── iqc-site/      ← the frontend app; run all npm commands from here
```

Run every `npm` command from `src/iqc-site/`, not the repo root.

Things that live at the root do so because their tool requires it, and each one is load
bearing: git hooks (`lefthook.yml`), `.editorconfig`, `.gitattributes`, the CI workflow,
the VS Code config — and **the Prettier config, which is at the root specifically so that
root-level files are formatted with the project's rules.** Prettier searches _upward_ from
each file for its config; when `.prettierrc.json` lived in `src/iqc-site/`, everything
above it silently fell back to Prettier's defaults rather than erroring. Don't move it
back.

## Commands

All from `src/iqc-site/`:

| Command                | What it does                                      |
| ---------------------- | ------------------------------------------------- |
| `npm run dev`          | Vite dev server                                   |
| `npm run build`        | Typecheck then production build                   |
| `npm run typecheck`    | `vue-tsc -b` — types only, no emit                |
| `npm run test`         | Vitest, single run                                |
| `npm run test:watch`   | Vitest in watch mode                              |
| `npm run lint`         | ESLint (flat config, `eslint.config.ts`)          |
| `npm run lint:fix`     | ESLint with autofix                               |
| `npm run format`       | Prettier write — **whole repo**, not just the app |
| `npm run format:check` | Prettier check — **whole repo**                   |

`format` and `format:check` deliberately target `../..` with an explicit `--ignore-path`.
They are the only scripts that reach outside `src/iqc-site/`, because the Prettier config
is repo-wide and root-level files (this file, the README, `lefthook.yml`, CI) need
formatting too. Don't "fix" them back to `.`.

Git hooks run automatically via lefthook: pre-commit lints and formats staged files,
pre-push typechecks. `npm install` sets them up through the `prepare` script.

**The pre-commit Prettier job has no `root:` on purpose.** In lefthook, `root:` doesn't
just set the working directory — it also _filters_ `{staged_files}` to that subtree. With
`root: src/iqc-site/` the job never saw root-level files, which is how the README and
`lefthook.yml` itself drifted out of format unnoticed. Because the job therefore runs from
the repo root, where there is no `node_modules`, it resolves the binary with
`npx --prefix src/iqc-site`. Plain `npx --no-install prettier` appears to work from the
root, but only via npx's machine-local cache; it fails on a fresh clone.

## CI

`.github/workflows/ci.yml` runs `format:check`, `lint`, `typecheck`, `test`, and `build`
on every PR and on pushes to `main` and `live`. It uses `npm ci` and takes its Node
version from `.nvmrc`.

The hooks are a convenience; CI is the enforcement, since hooks are per-machine and
`--no-verify` bypasses them. If you add a check, add it in both places.

`build` overlaps `typecheck` but is kept because it's the only step that exercises
bundling and asset resolution — an unresolved `@font-face` URL is a build warning and a
runtime 404 that nothing else here would catch.

## Tests

Vitest + `@vue/test-utils`, jsdom environment. Tests are co-located with the code they
cover as `*.test.ts`. Coverage is deliberately narrow: `WaveField` and `HeroSection`, the
two pieces with behaviour that isn't obvious from reading them. Everything else is
presentational and untested so far.

`tsconfig.app.json` includes `src/**/*.ts`, so **test files are typechecked** and a broken
test fails `npm run typecheck` and `npm run build`, not just `npm run test`. Vitest globals
are not in `types`, so import `describe` / `it` / `expect` / `vi` from `vitest` explicitly.

### Testing anything that measures itself needs a stubbed layout

**jsdom reports every box as 0×0.** `WaveField` sizes its grid from
`getBoundingClientRect`, so under jsdom it correctly draws nothing — and a suite that
forgets this passes vacuously while asserting over empty strings. `WaveField.test.ts`
stubs `Element.prototype.getBoundingClientRect` before mount and derives the expected row
and column counts from those same numbers. It also stubs `requestAnimationFrame` into a
manually-driven queue, which is what makes the time-dependent assertions deterministic
instead of timing-dependent.

`ResizeObserver` and `IntersectionObserver` don't exist in jsdom either, and `WaveField`
constructs both in `mounted()` — without stubs the mount throws.

Prefer `shallowMount` when the component under test merely _contains_ `WaveField`
(`HeroSection.test.ts` does this) — it stubs the field out and avoids needing any of the
above.

`vite.config.ts` aliases root-absolute asset URLs to `public/` **for tests only**. Vue's
template compiler rewrites things like `<use href="/icons.svg#id">` into imports; Vite
resolves those from `publicDir` when serving and building, but Vitest has no public dir,
so without the alias the suite fails at import time with a `file:///icons.svg` error that
names neither the component nor `public/`.

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
- **Avenir's master is the Monotype `Avenir Light.ttf` — don't swap in another build.**
  In July 2026 an `Avenir (CXL Headings).ttc` was offered as "the official licensed font".
  It was the Avenir that ships with macOS (Linotype 2007), and it was deleted rather than
  committed. It is not in the history; nothing is lost, since a copy sits on every Mac at
  `/System/Library/Fonts/Avenir.ttc`. This entry exists because the offer will probably
  recur — Avenir is everywhere, and most copies of it are somebody's system font.

    Why that one lost on the merits, briefly: it subsets to 19.5 KB against the current
    12.7 KB (TrueType outlines plus hinting tables, versus CFF), and it drops 15
    codepoints the Monotype build has — the typographic spaces, ZWNJ and ZWJ, the bidi
    controls, and U+2011 non-breaking hyphen.

    **The trap, which generalizes to any Avenir build you are offered:** it was
    **metrically identical horizontally** — every advance width matched to the unit, same
    708 cap height and 462 x-height — so a swap looks clean in a side-by-side of a word or
    a line, and you would conclude it's the same font. The vertical metrics are where they
    differ. Ascender/descender went 1084/−458 to 1000/−366 (hhea; typo descender −325),
    shrinking the default line box from 1.542em to 1.366em and moving the baseline within
    it. Since `--font-body` is set on `body` in `elements.css` and nothing sets an explicit
    `line-height` for body text, that shifts vertical rhythm site-wide. So: compare
    `hhea`/`OS/2` ascender and descender, not a screenshot.

    Avenir is body text only; headings are Source Serif. If Avenir headings are ever
    wanted, the Monotype build is Light 300 only — source a Monotype _web_ build of the
    weight you need rather than pulling one out of a system `.ttc`, because mixing foundry
    builds mixes vertical metrics, per above.

## Icons

Two separate icon systems coexist on purpose — pick based on where the icon comes from,
don't standardize on one:

- **`SimpleIcon` (`src/components/common/SimpleIcon.vue`) + `tools/convert-icon.js`** —
  for one-off / brand / hand-picked SVGs. `convert-icon.js` wraps a raw SVG into the
  shared `<symbol id="icon">` format and drops it in `public/icons/`; `SimpleIcon` renders
  it via `<use xlink:href="icons/{name}.svg#icon">` and normalizes `fill` to
  `currentColor` so the `color`/`size` props work. No JS bundle cost beyond the SVG file
  itself.
- **`@fortawesome/*` packages** — for pulling from FontAwesome's free set without
  hand-converting each SVG. Only `fontawesome-svg-core`, `free-solid-svg-icons`, and
  `vue-fontawesome` are installed; add `free-regular-svg-icons` / `free-brands-svg-icons`
  if a component needs an outline or logo icon. This is the paid-tier-adjacent free set —
  see the licensing note below before assuming an icon is available.

`src/lib/fontawesome.ts` turns off `autoAddCss` and imports FontAwesome's stylesheet
explicitly instead, so the CSS lands at a known point in the cascade rather than as a
`<style>` tag injected on first icon render; it's pulled in once via a side-effect import
in `main.ts`. It intentionally does not call `library.add()` for any icon — nothing uses
one yet, and pre-registering icons nobody renders is dead weight.

When a component needs a FontAwesome icon, follow the Options API convention (no global
registration, no bare imports referenced from the template): import the icon and
`library`, call `library.add()`, and register `FontAwesomeIcon` in that component's own
`components: {}`, then reference the icon by its kebab-case name string in the template:

```ts
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

library.add(faMagnifyingGlass);

export default defineComponent({
	components: { FontAwesomeIcon },
	// ...
});
```

```html
<FontAwesomeIcon icon="magnifying-glass" />
```

`library.add()` is idempotent per icon, so calling it again in a second component that
uses the same icon is fine — don't build a central icon registry file to avoid it.

FontAwesome Free (`free-solid-svg-icons` et al.) is genuinely free and unrelated to the
Avenir licensing situation below — no account, key, or attribution is required for the
icons themselves. It's a subset of Pro, though: most icons with a "regular" (outline)
variant in Pro don't have one in Free, only solid.

## Deployment (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages. It triggers on pushes
to **`live`** and on `workflow_dispatch` (an Actions-tab button, for republishing without a
commit).

**`live` is the deploy branch; `main` is trunk.** Promote by opening a PR from `main` into
`live`. That PR is the gate — it runs CI, and it is the _only_ gate, because `live` has no
branch protection (same gap as `main`; see [Open decisions](#open-decisions)). A direct
push to `live` publishes immediately.

The deploy job runs only `npm run build` (which typechecks), not the full check suite, on
the assumption that the PR into `live` already ran it. If you add a check to CI, think
about whether a deploy should be blocked on it — and note that today nothing _blocks_ a
deploy at all.

Concurrency is `group: pages` with **`cancel-in-progress: false`**, unlike CI, which
cancels. Cancelling a deploy mid-publish leaves the live site on the previous build with
nothing explaining why, so deploys queue instead.

### The custom domain is a repo setting, and no file in this repo controls it

`intermountainquantum.org` is configured at **Settings → Pages → Custom domain**, plus DNS
records at the registrar. Neither lives in version control.

**Do not add a `CNAME` file to `public/`.** It is the answer everyone finds first, and it
is wrong here: a `CNAME` file only configures the domain when Pages publishes _from a
branch_. When publishing from a custom Actions workflow, [GitHub ignores it
entirely](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
— it is not created, not read, not required. Committing one produces a file that looks
authoritative, does nothing, and will be trusted by whoever reads it next.

### `base` is `/` only because of the custom domain

`vite.config.ts` sets `base: '/'`, correct for serving from the root of a domain. If the
site is ever served from the project Pages URL instead
(`intermountain-quantum-competition.github.io/promo-site/`), `base` must become
`'/promo-site/'`. The router derives its base from `import.meta.env.BASE_URL`, so
`vite.config.ts` is the single place to change — don't also hardcode it in
`router/index.ts`.

Getting this wrong builds cleanly and fails at runtime: every asset 404s and the page is
blank.

### `404.html` is what makes deep links work

Pages is a plain static file server with no SPA rewrite. A request for `/research` looks
for `/research/index.html`, doesn't find it, and serves `404.html`. The deploy workflow
copies `dist/index.html` to `dist/404.html` so that fallback _is_ the app shell —
vue-router then boots and resolves the path normally. Without it, every deep link and
every refresh on a non-root route is a bare 404.

**That copy happens only in the workflow, so `npm run build` does not produce it, and
`npm run preview` will not reveal a regression.** Vite's preview server has its own history
fallback and serves deep links whether or not the step exists. The only honest local check
is a dumb static server over `dist/` (`npx serve dist`), which is what Pages actually
behaves like.

### Manual bootstrap steps (not in IaC, not in this repo)

The list that a fresh clone can't reproduce, and that a future migration has to redo:

1. **Settings → Pages → Source: GitHub Actions.** Without this the workflow runs green and
   publishes nothing.
2. **Settings → Pages → Custom domain: `intermountainquantum.org`**, then enable _Enforce
   HTTPS_ once the certificate is issued.
3. **DNS at the registrar** — apex `A` records to `185.199.108-111.153` (and/or `AAAA` to
   `2606:50c0:800{0,1,2,3}::153`), or an `ALIAS`/`ANAME` to
   `intermountain-quantum-competition.github.io`.
4. **The `live` branch must exist** and be created from `main`.

## Infrastructure (AWS) — direction, not yet built

None of this exists yet, and Pages is serving the site in the meantime — see
[Deployment](#deployment-github-pages). It is recorded here so early decisions don't
foreclose it.

**The site will eventually run on a full AWS stack, and it may be handed to a different
AWS account later.** Account portability is a hard requirement, not a nice-to-have. That
drives everything below:

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
- **Avenir's webfont licence — reported as covered, not verified in writing.** As of
  2026-07-15 the font's supplier says a licence exists, and we are proceeding on that
  basis. Nobody working on this repo has seen the agreement, so the terms are still
  unknown. To close this out, record here: **who confirmed it**, **which licence it is**
  (a Monotype _web_ licence is the one that permits `@font-face`; a desktop licence is
  not), and **what it covers** — permitted domains and any pageview cap, since Monotype
  web licences are metered. Then move this out of Open decisions. It stays here until
  then, because it is the one item in this file that no build will ever warn you about.
  Source Serif 4 is OFL and fine.

    What the binary itself says, so it need not be re-derived: the in-use
    `Avenir Light.ttf` is a Monotype 2018 build, `fsType: 0` (installable embedding), and
    its embedded notice defers to "the actual license agreement you have entered into with
    Monotype" — i.e. the file grants nothing by itself. Note `fsType` bits are the
    foundry's technical hint, not the licence; do not read `fsType: 0` as permission.
    A different Avenir was offered as the licensed one and turned out to be the macOS
    system font — see [Fonts](#fonts-are-latin-subset-woff2-built-from-the-ttf-masters).

- `theme.css` overrides Tailwind's `hover` variant to a bare `&:hover`, dropping the
  default `@media (hover: hover)` guard that keeps hover styles from sticking after a tap
  on touch devices. Nobody has confirmed whether that's deliberate. Keep it and say why,
  or drop the override.
- E2E tests. Vitest covers units; Playwright is the natural fit once there are flows worth
  testing. Nothing is installed.
- Branch protection on `main` **and `live`**. CI exists but nothing yet _requires_ it to
  pass, so it is advisory until the checks are marked required in the repo settings.
  That's a GitHub setting, not a file, so it can't live in this repo — which is exactly
  why it's easy to forget. `live` raises the stakes: unprotected, it means an accidental
  `git push origin live` publishes to the real domain with no check in between.
- **When AWS takes over, and what actually forces it.** Pages is a real answer for a
  static SPA, not a countdown — so name the trigger rather than migrating on vibes. The
  things Pages genuinely can't do: server-side anything (the `src/backend/` placeholder is
  the obvious one), non-public content, redirects/headers beyond static files, and
  server-side analytics. Whichever of those lands first is the trigger. Write down which
  one it was.
- Whether `src/iqc-site/` gets hoisted to the repo root. The nesting keeps leaking: it
  forced `lefthook.yml` to the root with per-job `root:` directives, forced the Prettier
  config to the root and the `format` scripts to point at `../..`, forced
  `eslint.workingDirectories` into the VS Code settings, and a fresh clone still has no
  installable project at the top level.
