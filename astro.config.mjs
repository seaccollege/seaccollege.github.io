// @ts-check
// @ts-ignore - Tailwind Vite plugin type compatibility
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

import analogjsangular from '@analogjs/astro-angular';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  site: 'https://seaccollege.github.io',
  base: '/',

  vite: {
    // @ts-ignore - Tailwind Vite plugin type compatibility
    plugins: [tailwindcss()],
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

  integrations: [vue(), react(), sitemap(), analogjsangular(), svelte()]
});