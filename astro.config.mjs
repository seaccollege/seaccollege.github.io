// @ts-check
// @ts-ignore - Tailwind Vite plugin type compatibility
import { defineConfig } from 'astro/config';

import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

import analogjsangular from '@analogjs/astro-angular';

import svelte from '@astrojs/svelte';

// https://astro.build/config
const enableAngular = process.env.ASTRO_ENABLE_ANGULAR !== 'false';

export default defineConfig({
  // Explicit root as a `file:` URL to avoid Windows drive-letter URL schemes (e.g. `g:`)
  // accidentally flowing into `fileURLToPath()` during dev file watching.
  root: /** @type {string} */ (fileURLToPath(new URL('.', import.meta.url))),
  site: 'https://seaccollege.github.io',
  base: '/',

  vite: {
    // @ts-ignore - Tailwind Vite plugin type compatibility
    plugins: [tailwindcss()],
    // Avoid Vite's deps optimizer prebundling which can trigger
    // excessive esbuild worker memory usage for large Angular
    // packages used via the AnalogJS integration. Disabling the
    // optimizer prevents aggressive prebundling and reduces memory
    // pressure during `astro build`.
    optimizeDeps: {
      // Disable the deps optimizer discovery to avoid heavy prebundling
      // (Vite 5.1+ uses `noDiscovery` + an empty `include` to disable)
      noDiscovery: true,
      include: [],
      exclude: [
        '@angular/animations',
        '@angular/build',
        '@angular/common',
        '@angular/compiler',
        '@angular/compiler-cli',
        '@angular/core',
        '@angular/language-service',
        '@angular/platform-browser',
        '@angular/platform-server'
      ]
    },
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress unhandled rejection warnings
          if (warning.code === 'UNRESOLVED_IMPORT') return;
          warn(warning);
        }
      }
    }
  },

  integrations: [vue(), react(), sitemap(), ...(enableAngular ? [analogjsangular()] : []), svelte()]
});