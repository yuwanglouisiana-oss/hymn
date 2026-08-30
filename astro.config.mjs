// @ts-check
import { defineConfig } from 'astro/config';

// Served under https://yuwanglouisiana-oss.github.io/hymn/ — GitHub Actions sets
// CI=true automatically, so local `npm run dev` still runs at the root.
// https://astro.build/config
export default defineConfig({
  site: 'https://yuwanglouisiana-oss.github.io',
  base: process.env.CI ? '/hymn/' : '/',
});
