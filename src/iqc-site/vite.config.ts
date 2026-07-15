/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
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
