// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Agentic Flow",
	  description: "Agentic Flow is a framework for building AI-powered workflows that runs inside your Browser.",
	  logo: {
        src: './src/assets/logo-beige.png',
      },
	  favicon: './src/assets/logo.png',
      social: [
        { icon: 'codeberg', label: 'Codeberg', href: 'https://codeberg.org/knut' },
        { icon: 'discord', label: 'Discord', href: 'https://astro.build/chat' },
        { icon: 'github', label: 'GitHub', href: 'https://github.com/withastro' },
        { icon: 'gitlab', label: 'GitLab', href: 'https://gitlab.com/delucis' },
        { icon: 'mastodon', label: 'Mastodon', href: 'https://m.webtoo.ls/@astro' },
      ],
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
	  defaultLocale: 'root',
      locales: {
        // English docs in `src/content/docs/en/`
        root: {
          label: 'English',
		  lang: 'en',
        },
		fr: {
          label: 'Français',
        },
      },
      plugins: [],
      customCss: [
        // Path to your Tailwind base styles:
        "./src/styles/global.css",
      ],
	  lastUpdated: true,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
