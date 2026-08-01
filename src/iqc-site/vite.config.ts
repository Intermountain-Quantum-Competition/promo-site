/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	// Vite's default, set explicitly because it's a deploy-target decision, not a default
	// to leave alone. '/' is correct only because the site is served from the root of a
	// custom domain (intermountainquantum.org). Served from the project Pages URL instead
	// -- intermountain-quantum-competition.github.io/promo-site/ -- every asset URL and
	// every router path would be wrong by a '/promo-site' prefix, and the failure is a
	// blank page with 404s, not a build error. The router reads this via
	// import.meta.env.BASE_URL, so changing it here is enough; don't also hardcode it there.
	base: '/',

	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},

	plugins: [vue(), tailwindcss()],
	test: {
		// Components touch the DOM, so tests need one. Node's default environment has no
		// document and mount() fails with a confusing error.
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.ts'],
		alias: [
			// Vue's template compiler rewrites asset URLs into imports -- including the
			// root-absolute ones that point at public/, like <use href="/icons.svg#id">.
			// Vite resolves those from publicDir when serving and building, but Vitest has
			// no public dir, so they resolve to a nonexistent file:///icons.svg and the
			// suite fails at import time with an error that names neither the component nor
			// public/. This restores Vite's publicDir semantics for tests.
			{
				find: /^\/([^/].*\.(?:svg|png|jpe?g|webp|avif|gif|ico))$/,
				replacement: fileURLToPath(new URL('./public/$1', import.meta.url)),
			},
		],
	},
});
