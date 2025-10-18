// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwindcss from "@tailwindcss/vite";
import starlightSidebarTopics from "starlight-sidebar-topics";

import starlightLlmsTxt from "starlight-llms-txt";
import starlightAutoSidebar from 'starlight-auto-sidebar'
import starlightVideos from 'starlight-videos'

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
        starlightAutoSidebar(),
        starlightSidebarTopics([
          {
            label: "How To Use",
            link: "/usage/",
            icon: "rocket",
            items: [
              {
                label: "Getting started",
                autogenerate: { directory: "usage/getting-started", collapsed: true },
              },
              {
                label: "Using the app",
                autogenerate: { directory: "usage/using-the-app", collapsed: true },
              },
              {
                label: "Key concepts",
                autogenerate: { directory: "usage/key-concepts", collapsed: true },
              },
              {
                label: "Releases",
                autogenerate: { directory: "usage/releases", collapsed: true },
              },
              {
                label: "Help and Community",
                autogenerate: { directory: "usage/help-and-community", collapsed: true },
              },
              {
                label: "Licenses and privacy",
                autogenerate: { directory: "usage/licenses-and-privacy", collapsed: true },
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
                label: "Built-in nodes",
                autogenerate: { directory: "integration/builtin", collapsed: true },
              },
              {
                label: "Applications",
                autogenerate: { directory: "integration/applications", collapsed: true },
              },
              {
                label: "Extension specific",
                autogenerate: { directory: "integration/extension", collapsed: true },
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
            items: [
              {
                label: "Basics",
                autogenerate: { directory: "advanced-ai/basics", collapsed: true },
              },
              {
                label: "LangChain",
                autogenerate: { directory: "advanced-ai/langchain", collapsed: true },
              },
              {
                label: "Evaluations",
                autogenerate: { directory: "advanced-ai/evaluations", collapsed: true },
              },
              {
                label: "Examples",
                autogenerate: { directory: "advanced-ai/examples", collapsed: true },
              },
            ],
          },
          {
            label: {
              en: "Learning",
              fr: "Apprendre",
            },
            link: "/learning/",
            icon: "open-book",
            items: [
              {
                label: "Examples",
                autogenerate: { directory: "learning/examples", collapsed: true },
              },
              {
                label: "Video Courses",
                autogenerate: { directory: "learning/video-courses", collapsed: true },
              },
              {
                label: "Text Courses",
                autogenerate: { directory: "learning/text-courses", collapsed: true },
              },
            ],
          },
        ]),
        starlightVideos(),
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
