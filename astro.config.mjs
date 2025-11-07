// @ts-check
import { defineConfig, envField } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwindcss from "@tailwindcss/vite";
import starlightSidebarTopics from "starlight-sidebar-topics";

import starlightLlmsTxt from "starlight-llms-txt";
import starlightAutoSidebar from "starlight-auto-sidebar";
import starlightVideos from "starlight-videos";
import mermaid from "astro-mermaid";

import svelte from "@astrojs/svelte";

// Load environment variables from .env file
//import "dotenv/config";
//const { PUBLIC_SITE_URL } = import.meta.env;
import { loadEnv } from "vite";
const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), "");
//const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL;


// https://astro.build/config
export default defineConfig({
  site: PUBLIC_SITE_URL,
  integrations: [
    mermaid({
      theme: "forest",
      autoTheme: true,
      mermaidConfig: {
        startOnLoad: false,
        logLevel: "error",
        securityLevel: "strict",
      },

      iconPacks: [
        {
          name: 'fa',
          loader: () => fetch('https://unpkg.com/@iconify-json/fa6-solid@1.2.4/icons.json').then(res => res.json())
        }
      ]
    }),
    starlight({
      title: "Agentic WorkFlow",
      description:
        "Agentic WorkFlow - Build AI-powered workflows directly in your browser with intelligent automation and web content manipulation capabilities.",
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
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/agentic-workflow-studio",
        },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/agentic-workflow-studio",
        },
        { icon: "gitlab", label: "GitLab", href: "https://gitlab.com/delucis" },
        {
          icon: "mastodon",
          label: "Mastodon",
          href: "https://mastodon.social/@agentic-workflow-studio",
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
                autogenerate: {
                  directory: "usage/getting-started",
                  collapsed: true,
                },
              },
              {
                label: "Using the app",
                autogenerate: {
                  directory: "usage/using-the-app",
                  collapsed: true,
                },
              },
              {
                label: "Key concepts",
                autogenerate: {
                  directory: "usage/key-concepts",
                  collapsed: true,
                },
              },
              {
                label: "Quick Wins",
                collapsed: true,
                autogenerate: {
                  directory: "usage/quick-wins",
                  collapsed: false,
                },
              },
              {
                label: "How-To Guides",
                collapsed: true,
                autogenerate: {
                  directory: "usage/how-to",
                  collapsed: false,
                },
              },
              {
                label: "Releases",
                collapsed: true,
                autogenerate: { directory: "usage/releases", collapsed: true },
              },
              {
                label: "Help and Community",
                collapsed: true,
                autogenerate: {
                  directory: "usage/help-and-community",
                  collapsed: true,
                },
              },
              {
                label: "Troubleshooting",
                collapsed: true,
                items: [
                  "usage/troubleshooting-decision-guide",
                  {
                    label: "Common Issues",
                    autogenerate: {
                      directory: "usage/troubleshooting",
                      collapsed: false,
                    },
                  },
                ],
              },
              {
                label: "Licenses and privacy",
                collapsed: true,
                autogenerate: {
                  directory: "usage/licenses-and-privacy",
                  collapsed: true,
                },
              },
            ],
          },
          {
            label: {
              en: "Integrations",
              fr: "Integrations",
            },
            link: "/integrations/",
            icon: "puzzle",
            items: [
              {
                label: "Built-in nodes",
                autogenerate: {
                  directory: "integrations/builtin",
                  collapsed: true,
                },
              },
              {
                label: "Applications",
                autogenerate: {
                  directory: "integrations/apps",
                  collapsed: true,
                },
              },
              {
                label: "Extension specific",
                autogenerate: {
                  directory: "integrations/extension",
                  collapsed: true,
                },
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
                autogenerate: {
                  directory: "advanced-ai/basics",
                  collapsed: true,
                },
              },
              {
                label: "LangChain",
                autogenerate: {
                  directory: "advanced-ai/langchain",
                  collapsed: true,
                },
              },
              {
                label: "Evaluations",
                autogenerate: {
                  directory: "advanced-ai/evaluations",
                  collapsed: true,
                },
              },
              {
                label: "Examples",
                collapsed: true,
                autogenerate: {
                  directory: "advanced-ai/examples",
                  collapsed: true,
                },
              },
              {
                label: "Performance & Troubleshooting",
                collapsed: true,
                items: [
                  "advanced-ai/performance-optimization",
                  "advanced-ai/troubleshooting-guide",
                  "advanced-ai/browser-ai-limitations",
                ],
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
                label: "Video Courses",
                autogenerate: {
                  directory: "learning/video-courses",
                  collapsed: true,
                },
              },
              {
                label: "Text Courses",
                autogenerate: {
                  directory: "learning/text-courses",
                  collapsed: true,
                },
              },
              {
                label: "Workflow Patterns",
                autogenerate: {
                  directory: "learning/workflow-patterns",
                  collapsed: true,
                },
              },
              {
                label: "Examples",
                collapsed: true,
                autogenerate: {
                  directory: "learning/examples",
                  collapsed: true,
                },
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
        "./src/styles/global.css"
      ],
      lastUpdated: true,
    }),
    svelte(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      PUBLIC_SITE_URL: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_CHROME_EXTENSION_URL: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_FIREFOX_EXTENSION_URL: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
    },
  },
});
