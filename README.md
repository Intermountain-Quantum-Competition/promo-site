# IQC Promo Site

The promotional site for the Institute for Quantum Computing. It's a Vue 3 single-page
app built with Vite, and it will be deployed on AWS.

If you're new to the stack, the [Stack tour](#stack-tour) below explains what each piece
does and links to its docs. You don't need to know all of it to be useful — start with
Vue and the router.

> **Two docs, two audiences.** This README onboards humans. [CLAUDE.md](CLAUDE.md) tells
> AI coding agents the same things plus the sharp edges they'd otherwise trip over. If
> you change a command or a convention, update both.

## Quick start

You need **Node 20.19+, 22.13+, or 24+**. There's an [.nvmrc](.nvmrc) pinning 24, so
`nvm use` picks the right one if you use nvm.

```sh
cd src/iqc-site   # the npm project is NOT at the repo root
npm install       # also installs the git hooks, via the "prepare" script
npm run dev       # http://localhost:5173
```

**The frontend npm project lives at `src/iqc-site/`, not the repo root.** Every `npm` command in
this README runs from there. If you get `ENOENT: package.json`, that's why.

## Commands

All from `src/iqc-site/`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Typecheck, then production build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally — check a build before shipping |
| `npm run typecheck` | Types only, no output files |
| `npm run lint` | Find code problems |
| `npm run lint:fix` | Fix the ones that can be fixed automatically |
| `npm run format` | Reformat everything |
| `npm run format:check` | Fail if anything is unformatted |

## Repository layout

```
promo-site/
├── README.md          ← you are here
├── CLAUDE.md          ← guide for AI agents
├── lefthook.yml       ← git hooks (must be at repo root)
├── .editorconfig      ← indentation: tabs, 4 wide
├── .gitattributes     ← line endings: LF everywhere, all platforms
├── .nvmrc
└── src/iqc-site/      ← the app — run npm commands here
    ├── index.html     ← the page shell; Vite's entry point
    ├── public/        ← served as-is at the site root, never bundled
    └── src/
        ├── main.ts        ← app bootstrap: creates the app, installs plugins
        ├── App.vue        ← root component; just hosts <RouterView />
        ├── style.css      ← global styles + the CSS custom properties
        ├── router/        ← route table
        ├── views/         ← one component per route
        ├── components/    ← reusable pieces
        └── assets/        ← images/styles imported by code (hashed at build)
```

`assets/` vs `public/`: import from `assets/` when you want the build to optimize and
cache-bust the file (almost always). Use `public/` only when the file needs a stable,
predictable URL — `favicon.svg`, `robots.txt`.

## Stack tour

Each of these links to the official docs. The one-liners are what the library does *for
this project*, not a full summary.

### [Vue 3](https://vuejs.org/guide/introduction.html) — the UI framework

Components live in `.vue` single-file components: template, script, and styles in one
file.

**We use the Options API, not the Composition API.** Vue supports both, and this is the
one where a component is an object of options — `data`, `computed`, `methods`. The Vue
docs default to showing Composition API examples; there's an **API Preference** toggle at
the top left of the sidebar. Set it to *Options* and the examples will match our code.

```vue
<template>
	<button @click="increment">{{ count }} → {{ doubled }}</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'CounterButton',
	data() {
		return { count: 0 } // reactive state
	},
	computed: {
		doubled(): number {
			return this.count * 2; // derived, auto-updates
		},
	},
	methods: {
		increment() {
			this.count++;
		},
	},
})
</script>
```

Four things that bite newcomers:

- **Always wrap in `defineComponent()`.** It's what gives TypeScript the type of `this`.
  Export a bare object and `this` silently becomes `any` inside every method. There is a Snippet
  available that will scaffold this for you. Just start typing "vue component" in a new file
  and it should auto-complete and generate a boilerplate for you with all of this.
- **Annotate computed return types** (`doubled(): number`). TypeScript can't always infer
  them through `this`, and it fails in confusing ways when it can't.
- **Imports aren't visible to the template.** Import an image and use it in the template
  directly and you get a blank — the value has to be returned from `data()` first. See
  [HelloWorld.vue](src/iqc-site/src/components/HelloWorld.vue).
- **Don't use arrow functions for options.** `data: () => ...` or an arrow method loses
  `this`. Use method shorthand, as above.

Start with [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
(toggle to Options) and
[TypeScript with the Options API](https://vuejs.org/guide/typescript/options-api.html).

### [Vite](https://vite.dev/guide/) — dev server and build tool

Runs the dev server and bundles for production. Fast because it serves your source
directly to the browser during development instead of pre-bundling it. Config is in
`vite.config.ts`; you'll rarely touch it.

### [vue-router](https://router.vuejs.org/) — client-side routing

Maps URLs to components without a server round trip. Routes are declared in
[src/router/index.ts](src/iqc-site/src/router/index.ts). To add a page: create a component
in `views/`, then add an entry.

```ts
{
	path: '/research',
	name: 'research',
	component: () => import('../views/ResearchView.vue'),
}
```

**Lazy-load every route except the landing page** — that `() => import(...)` arrow is what
splits the component into its own chunk, so visitors don't download the whole site to see
the first page.

Link with `<RouterLink to="/research">`, not `<a href>` — an `<a>` triggers a full page
reload and throws away the app state.

### [Tailwind CSS 4](https://tailwindcss.com/docs/styling-with-utility-classes) — styling

Style by composing utility classes in the template (`class="flex gap-4 text-lg"`) rather
than writing CSS rules.

Note for anyone who's used Tailwind before: **v4 has no `tailwind.config.js`.** It's
configured through the Vite plugin and CSS itself. Config snippets you find online are
probably v3 and won't apply.

Prefer the existing custom properties in
[src/style.css](src/iqc-site/src/style.css) — `--accent`, `--text`, `--bg` — over new
hardcoded colors. They're already wired for dark mode.

### [Pinia](https://pinia.vuejs.org/introduction.html) — shared state

For state that several unrelated components need. A component's own `data()` is fine for
local state — reach for Pinia only when prop-drilling starts to hurt. Nothing uses it yet;
it's installed and registered in `main.ts` for when something does.

Pinia's docs lead with the Composition API. With the Options API you connect a store to a
component through the
[`mapState` / `mapActions` helpers](https://pinia.vuejs.org/cookbook/options-api.html)
rather than calling `useStore()` in `setup`.

**Pinia is pinned to 3.x deliberately — don't upgrade to 4.** npm will tell you 4 is
available. It breaks TypeScript resolution and conflicts with vue-router's peer
dependency. The reasoning is in [CLAUDE.md](CLAUDE.md).

### [TypeScript](https://www.typescriptlang.org/docs/handbook/2/basic-types.html) — types

All SFCs use `<script lang="ts">` with `defineComponent()`. `npm run build` typechecks
first and fails the build on type errors.

## Conventions

Most of these are enforced by tooling, so you mainly need to know they exist.

- **Formatting is not a code review topic.** Prettier decides. The pre-commit hook
  reformats staged files automatically, so don't hand-format and don't comment on
  formatting in reviews. Disagree with a rule? Change the config and reformat in one
  commit.
- **Indentation is tabs, displayed 4 wide**, from [.editorconfig](.editorconfig). Install
  the EditorConfig extension and your editor does the right thing.
- **Line endings are LF on every platform**, enforced by
  [.gitattributes](.gitattributes) regardless of your local `core.autocrlf`. This is why
  you won't see phantom whole-file diffs on Windows.
- **Options API with `<script lang="ts">` and `defineComponent()`.** No `<script setup>`,
  no plain-JS SFCs — `lang="ts"` is a lint error if you forget it.
- **Block order is `<template>` first, then `<script>`.**
- **Route components in `views/`, reusable pieces in `components/`.**

### Git hooks

`npm install` sets these up via lefthook. They run automatically:

- **pre-commit** — lints and formats your staged files, and re-stages the fixes.
- **pre-push** — typechecks. Catches what your editor might not have.

If a hook seems broken, run `npx lefthook run pre-commit` from the repo root to see the
real output. Don't reach for `--no-verify` without saying so in the PR.

### Editor setup

VS Code is what the repo is configured for. Open `src/iqc-site/` and it'll recommend the
extensions ([.vscode/extensions.json](src/iqc-site/.vscode/extensions.json)); take all of
them. Format-on-save and ESLint autofix are already wired up in
[.vscode/settings.json](src/iqc-site/.vscode/settings.json).

**Install Vue's official extension (Volar) and disable Vetur** if you have it. Vetur is
the old Vue 2 extension, and having both enabled produces confusing errors.

## Deployment

Not built yet. The site will run on a full AWS stack, defined as Infrastructure as Code,
because it may be handed to a different AWS account later. Two rules that already apply:

- **No console clicks.** If a resource isn't in a template, it doesn't exist. Anything
  created by hand is invisible to the next account and becomes the thing that breaks the
  migration.
- **Never hardcode account IDs, ARNs, bucket names, or regions.**

The IaC tool isn't chosen yet. See [CLAUDE.md](CLAUDE.md) for the full reasoning and the
other open decisions (test framework, CI).

## Troubleshooting

**`npm error Missing script: "dev"`** — you're at the repo root. `cd src/iqc-site`.

**Editor shows type errors that `npm run typecheck` doesn't** — the TS server is stale.
In VS Code: <kbd>Ctrl+Shift+P</kbd> → *TypeScript: Restart TS Server*. If errors are only
in `.vue` files, it's usually Volar missing or Vetur still enabled.

**`npm install` wants `--legacy-peer-deps`** — don't. It silences peer checks repo-wide
and hides real conflicts later. It usually means something pulled in Pinia 4; check
`package.json` says `"pinia": "^3.0.4"`.

**Stale weirdness after switching branches** — `rm -rf node_modules && npm install`. Vite
also caches in `node_modules/.vite`, which that clears.
