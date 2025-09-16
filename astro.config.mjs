// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwindcss from "@tailwindcss/vite";
import starlightSidebarTopics from "starlight-sidebar-topics";

import starlightLlmsTxt from "starlight-llms-txt";

// Load environment variables from .env file
import "dotenv/config";
const { VITE_SITE_URL } = import.meta.env;

// https://astro.build/config
export default defineConfig({
  site: VITE_SITE_URL,
  integrations: [
    starlight({
      title: "Agentic Flow",
      description:
        "Agentic Flow is a framework for building AI-powered workflows that runs inside your Browser.",
      logo: {
        src: "./src/assets/logo-beige.png",
      },
      favicon: "./src/assets/logo.png",
      social: [
        {
          icon: "codeberg",
          label: "Codeberg",
          href: "https://codeberg.org/knut",
        },
        { icon: "discord", label: "Discord", href: "https://astro.build/chat" },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro",
        },
        { icon: "gitlab", label: "GitLab", href: "https://gitlab.com/delucis" },
        {
          icon: "mastodon",
          label: "Mastodon",
          href: "https://m.webtoo.ls/@astro",
        },
      ],
      defaultLocale: "root",
      locales: {
        // English docs in `src/content/docs/en/`
        root: {
          label: "English",
          lang: "en",
        },
        fr: {
          label: "Français",
        },
      },
      plugins: [
        starlightSidebarTopics([
          {
            label: "How To Use",
            link: "/usage/",
            icon: "rocket",
            items: [
              {
                label: "Guides",
                autogenerate: { directory: "usage/guides" },
              },
              {
                label: "Reference",
                autogenerate: { directory: "usage/reference" },
              },
            ],
          },
          {
            label: {
              en: "Integrations",
              fr: "Integrations",
            },
            link: "/integration/",
            icon: "puzzle",
            items: [
              {
                label: "Guides",
                autogenerate: { directory: "integration/guides" },
              },
              {
                label: "Reference",
                autogenerate: { directory: "integration/reference" },
              },
            ],
          },
          {
            label: {
              en: "Advanced AI",
              fr: "Marché",
            },
            link: "/advanced-ai/",
            icon: "seti:illustrator",
            items: [],
          },
          {
            label: {
              en: "Learning",
              fr: "Apprendre",
            },
            link: "/Learning/",
            icon: "open-book",
            items: [],
          },
        ]),
        starlightLlmsTxt(),
      ],
      components: {
        // Override the default `Sidebar` component with a custom one.
        Sidebar: "./src/components/(override)/Sidebar.astro",
        Pagination: "./src/components/(override)/Pagination.astro",
      },
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
