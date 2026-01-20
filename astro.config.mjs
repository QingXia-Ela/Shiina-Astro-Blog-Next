import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.shiinafan.top',
  integrations: [mdx()],
  vite: {
    resolve: {
      alias: [{
        find: '@/',
        replacement: 'src/'
      }]
    },

    server: {
      host: true
    },

    plugins: [tailwindcss()],
  },
});