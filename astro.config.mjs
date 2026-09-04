// @ts-check
import { defineConfig, envField } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwindcss from "@tailwindcss/vite";
import starlightSidebarTopics from "starlight-sidebar-topics";

import starlightVideos from "starlight-videos";
import mermaid from "astro-mermaid";

import svelte from "@astrojs/svelte";

// Load environment variables from .env file
//import "dotenv/config";
//const { PUBLIC_SITE_URL } = import.meta.env;
import { loadEnv } from "vite";
import mdx from "@astrojs/mdx";
const { DOCS_SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), "");
//const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL;

// https://astro.build/config
export default defineConfig({
  site: DOCS_SITE_URL,
  integrations: [mermaid({
    theme: "forest",
    autoTheme: true,
    mermaidConfig: {
      startOnLoad: false,
      logLevel: "error",
      securityLevel: "strict",
    },

    iconPacks: [
      {
        name: "fa",
        loader: () =>
          fetch(
            "https://unpkg.com/@iconify-json/fa6-solid@1.2.4/icons.json",
          ).then((res) => res.json()),
      },
    ],
  }), starlight({
    title: "Agentic WorkFlow",
    description:
      "Agentic WorkFlow - Build AI-powered workflows directly in your browser with intelligent automation and web content manipulation capabilities.",
    logo: {
      src: "./src/assets/logo.png",
    },
    favicon: "./src/assets/logo.png",
    social: [
      {
        icon: "x.com",
        label: "X.com",
        href: "https://x.com/awflow_io",
      },
      {
        icon: "blueSky",
        label: "BlueSky",
        href: "https://bsky.app/profile/awflow.io",
      },
      {
        icon: "github",
        label: "GitHub",
        href: "https://github.com/awflow",
      },
      {
        icon: "youtube",
        label: "YouTube",
        href: "https://www.youtube.com/@awflow",
      },
      {
        icon: "mastodon",
        label: "Mastodon",
        href: "https://mastodon.social/@awflow",
      },
    ],
    defaultLocale: "root",
    locales: {
      // English docs in `src/content/docs/en/`
      root: {
        label: "English",
        lang: "en",
      },
      /*fr: {
        label: "Français",
      },*/
    },
    plugins: [
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
              items: [
                {
                  label: "Workflows",
                  items: [
                    {
                      label: "Create",
                      link: "usage/using-the-app/workflows/create",
                    },
                    {
                      label: "Notes & story",
                      link: "usage/using-the-app/workflows/narration",
                    },
                    {
                      label: "Export/Import",
                      link: "usage/using-the-app/workflows/export-import",
                    },
                    {
                      label: "History",
                      link: "usage/using-the-app/workflows/history",
                    },
                    {
                      label: "Publishing",
                      link: "usage/using-the-app/workflows/publishing",
                    },
                    {
                      label: "Tags",
                      link: "usage/using-the-app/workflows/tags",
                    },
                    {
                      label: "Components",
                      autogenerate: {
                        directory: "usage/using-the-app/workflows/components",
                        collapsed: true,
                      },
                    },
                    {
                      label: "Executions",
                      autogenerate: {
                        directory: "usage/using-the-app/workflows/executions",
                        collapsed: true,
                      },
                    },
                  ],
                },
                {
                  label: "Credentials",
                  autogenerate: {
                    directory: "usage/using-the-app/credentials",
                    collapsed: true,
                  },
                },
                {
                  label: "Assistant Notch",
                  link: "usage/using-the-app/assistant-notch",
                },
                {
                  label: "Data store",
                  link: "usage/using-the-app/data-store",
                },
              ],
            },
            {
              label: "Key concepts",
              items: [
                {
                  label: "Overview",
                  link: "usage/key-concepts",
                },
                {
                  label: "Data",
                  items: [
                    {
                      label: "Data Mapping",
                      autogenerate: {
                        directory: "usage/key-concepts/data/data-mapping",
                        collapsed: true,
                      },
                    },
                    {
                      label: "Code",
                      link: "usage/key-concepts/data/code",
                    },
                    {
                      label: "Data Structure",
                      link: "usage/key-concepts/data/data-structure",
                    },
                    {
                      label: "Item Linking",
                      link: "usage/key-concepts/data/item-linking",
                    },
                  ],
                },
                {
                  label: "Flow Logic",
                  autogenerate: {
                    directory: "usage/key-concepts/flow-logic",
                    collapsed: true,
                  },
                },
                {
                  label: "Glossary",
                  link: "usage/key-concepts/glossary",
                },
              ],
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
              autogenerate: {
                directory: "usage/troubleshooting",
                collapsed: false,
              },
            },
          ],
        },
        {
          label: {
            en: "Nodes",
            fr: "Nœuds",
          },
          link: "/nodes/",
          icon: "puzzle",
          items: [
            {
              label: "Built-in Overview",
              link: "nodes/builtin",
            },
            {
              label: "Trigger",
              autogenerate: {
                directory: "nodes/builtin/trigger",
                collapsed: true,
              },
            },
            {
              label: "Lambda",
              autogenerate: {
                directory: "nodes/builtin/lambda",
                collapsed: true,
              },
            },
            {
              label: "In Page Action",
              autogenerate: {
                directory: "nodes/extension",
                collapsed: true,
              },
            },
            {
              label: "Flow",
              autogenerate: {
                directory: "nodes/builtin/flow",
                collapsed: true,
              },
            },
            {
              label: "Data Transformation",
              autogenerate: {
                directory: "nodes/builtin/datatransformation",
                collapsed: true,
              },
            },
            {
              label: "Core",
              autogenerate: {
                directory: "nodes/builtin/core",
                collapsed: true,
              },
            },
            {
              label: "AI",
              autogenerate: {
                directory: "nodes/builtin/ai",
                collapsed: true,
              },
            },
            {
              label: "Integrations",
              autogenerate: {
                directory: "nodes/builtin/integration",
                collapsed: true,
              },
            },
            {
              label: "Node Types Overview",
              link: "nodes/builtin/node-types",
            },
            {
              label: "Rate Limits",
              link: "nodes/builtin/rate-limits",
            },
            {
              label: "Unknown Node",
              link: "nodes/builtin/unknownode",
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
              label: "Concepts",
              autogenerate: {
                directory: "advanced-ai/concepts",
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
          ],
        },
      ]),
      starlightVideos(),
    ],
    components: {
      // Override the default `Sidebar` component with a custom one.
      //Sidebar: "./src/components/(override)/Sidebar.astro",
      Pagination: "./src/components/(override)/Pagination.astro",
    },
    customCss: [
      // Path to your Tailwind base styles:
      "./src/styles/global.css",
    ],
    lastUpdated: true,
  }), svelte(), mdx()],

  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      DOCS_SITE_URL: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
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