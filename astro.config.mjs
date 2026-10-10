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
import { satteri } from "@astrojs/markdown-satteri";
const { DOCS_SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), "");
//const PUBLIC_SITE_URL = process.env.PUBLIC_SITE_URL;

// https://astro.build/config
export default defineConfig({
  site: DOCS_SITE_URL,
  // Renamed or removed pages keep working (epic awflow/Agentic-Flow#1308).
  redirects: {
    "/advanced-ai/langchain/": "/advanced-ai/concepts/",
    "/advanced-ai/langchain/getting-started/": "/advanced-ai/concepts/",
    "/advanced-ai/langchain/components/": "/advanced-ai/concepts/model-dependencies/",
    "/advanced-ai/langchain/workflow-patterns/": "/advanced-ai/concepts/ai-agents/",
    "/advanced-ai/langchain/advanced-patterns/": "/advanced-ai/concepts/ai-agents/",
    "/advanced-ai/langchain/browser-integration-guide/": "/advanced-ai/concepts/tool-selection/",
    "/advanced-ai/langchain/langchain-learning-resources/": "/advanced-ai/",
    "/usage/troubleshooting/troubleshooting-decision-guide/": "/usage/troubleshooting/",
    "/usage/using-the-app/workflows/executions/execute-from-dnd-designer/": "/usage/using-the-app/workflows/executions/run-from-the-canvas/",
    "/usage/using-the-app/workflows/executions/execute-from-webpage-contextual-menu/": "/usage/using-the-app/workflows/executions/run-from-the-right-click-menu/",
    "/usage/using-the-app/workflows/executions/execute-from-workflow-list-table/": "/usage/using-the-app/workflows/executions/run-from-the-workflow-list/",
  },
  markdown: {
    // Astro 7's default Sätteri processor rejects raw `html` nodes in MDX;
    // astro-mermaid emits one per ```mermaid block, so let MDX parse them.
    processor: satteri({ features: { rawHtml: true } }),
  },
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
        url: "https://unpkg.com/@iconify-json/fa6-solid@1.2.4/icons.json",
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
              items: [{ autogenerate: {
                directory: "usage/getting-started",
                collapsed: true,
              } }],
            },
            {
              label: "Using the app",
              items: [
                {
                  label: "Side panel",
                  link: "usage/using-the-app/side-panel",
                },
                {
                  label: "Chat & agents",
                  items: [
                    { label: "Chat with Aria", link: "usage/using-the-app/chat-and-agents/chat" },
                    { label: "Ways to open Aria", link: "usage/using-the-app/chat-and-agents/entry-points" },
                    { label: "Building workflows in chat", link: "usage/using-the-app/chat-and-agents/building-workflows-in-chat" },
                    { label: "Following Aria's work", link: "usage/using-the-app/chat-and-agents/seeing-the-work" },
                    { label: "Agents", link: "usage/using-the-app/chat-and-agents/agents" },
                    { label: "Projects", link: "usage/using-the-app/chat-and-agents/projects" },
                    { label: "Teams", link: "usage/using-the-app/chat-and-agents/teams" },
                    { label: "Assistant memory", link: "usage/using-the-app/chat-and-agents/memory" },
                    { label: "Knowledge in chats & agents", link: "usage/using-the-app/chat-and-agents/knowledge" },
                    { label: "Browser control & safety", link: "usage/using-the-app/chat-and-agents/browser-control" },
                    { label: "Agent & team templates", link: "usage/using-the-app/chat-and-agents/templates" },
                    { label: "Turn traces", link: "usage/using-the-app/chat-and-agents/turn-traces" },
                  ],
                },
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
                      label: "Narration style guide",
                      link: "usage/using-the-app/workflows/narration-style",
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
                      label: "Filter the list",
                      link: "usage/using-the-app/workflows/filters",
                    },
                    { label: "Manage the list", link: "usage/using-the-app/workflows/manage-list" },
                    { label: "Run history", link: "usage/using-the-app/workflows/run-history" },
                    {
                      label: "Components",
                      items: [{ autogenerate: {
                        directory: "usage/using-the-app/workflows/components",
                        collapsed: true,
                      } }],
                    },
                    {
                      label: "Executions",
                      items: [{ autogenerate: {
                        directory: "usage/using-the-app/workflows/executions",
                        collapsed: true,
                      } }],
                    },
                  ],
                },
                {
                  label: "Credentials",
                  items: [{ autogenerate: {
                    directory: "usage/using-the-app/credentials",
                    collapsed: true,
                  } }],
                },
                {
                  label: "Knowledge bases",
                  items: [
                    { label: "Overview", link: "usage/using-the-app/knowledge-bases/overview" },
                    { label: "Save from anywhere", link: "usage/using-the-app/knowledge-bases/save-from-anywhere" },
                    { label: "Export & import", link: "usage/using-the-app/knowledge-bases/export-import-backup" },
                  ],
                },
                {
                  label: "Memory",
                  items: [
                    { label: "Memory page", link: "usage/using-the-app/memory/overview" },
                    { label: "Storage & clean-up", link: "usage/using-the-app/memory/storage" },
                  ],
                },
                {
                  label: "Assistant Notch",
                  link: "usage/using-the-app/assistant-notch",
                },
                {
                  label: "Data store",
                  link: "usage/using-the-app/data-store",
                },
                {
                  label: "Local AI",
                  link: "usage/using-the-app/local-models",
                },
                { label: "Compare models", link: "usage/using-the-app/local-models-compare" },
                { label: "Activity", link: "usage/using-the-app/activity" },
                { label: "Notifications", link: "usage/using-the-app/notifications" },
                {
                  label: "Settings",
                  collapsed: true,
                  items: [{ autogenerate: { directory: "usage/using-the-app/settings", collapsed: true } }],
                },
                {
                  label: "Account",
                  collapsed: true,
                  items: [{ autogenerate: { directory: "usage/using-the-app/account", collapsed: true } }],
                },
                {
                  label: "Newsletter",
                  link: "usage/using-the-app/newsletter",
                },
                {
                  label: "Request board",
                  link: "usage/using-the-app/request-board",
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
                      items: [{ autogenerate: {
                        directory: "usage/key-concepts/data/data-mapping",
                        collapsed: true,
                      } }],
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
                  items: [{ autogenerate: {
                    directory: "usage/key-concepts/flow-logic",
                    collapsed: true,
                  } }],
                },
                {
                  label: "Glossary",
                  link: "usage/key-concepts/glossary",
                },
              ],
            },
            { label: "Privacy & your data", link: "usage/privacy-and-data" },
            { label: "FAQ", link: "usage/faq" },
            {
              label: "Admin",
              collapsed: true,
              items: [{ autogenerate: { directory: "usage/admin", collapsed: true } }],
            },
            {
              label: "Releases",
              collapsed: true,
              items: [{ autogenerate: { directory: "usage/releases", collapsed: true } }],
            },
            {
              label: "Help and Community",
              collapsed: true,
              items: [{ autogenerate: {
                directory: "usage/help-and-community",
                collapsed: true,
              } }],
            },
            {
              label: "Troubleshooting",
              collapsed: true,
              items: [{ autogenerate: {
                directory: "usage/troubleshooting",
                collapsed: false,
              } }],
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
              items: [{ autogenerate: {
                directory: "nodes/builtin/trigger",
                collapsed: true,
              } }],
            },
            {
              label: "Lambda",
              items: [{ autogenerate: {
                directory: "nodes/builtin/lambda",
                collapsed: true,
              } }],
            },
            {
              label: "In Page Action",
              items: [{ autogenerate: {
                directory: "nodes/extension",
                collapsed: true,
              } }],
            },
            {
              label: "Flow",
              items: [{ autogenerate: {
                directory: "nodes/builtin/flow",
                collapsed: true,
              } }],
            },
            {
              label: "Data Transformation",
              items: [{ autogenerate: {
                directory: "nodes/builtin/datatransformation",
                collapsed: true,
              } }],
            },
            {
              label: "Core",
              items: [{ autogenerate: {
                directory: "nodes/builtin/core",
                collapsed: true,
              } }],
            },
            {
              label: "AI",
              items: [{ autogenerate: {
                directory: "nodes/builtin/ai",
                collapsed: true,
              } }],
            },
            {
              label: "Integrations",
              items: [{ autogenerate: {
                directory: "nodes/builtin/integration",
                collapsed: true,
              } }],
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
            en: "AI concepts",
            fr: "Concepts IA",
          },
          link: "/advanced-ai/",
          icon: "seti:illustrator",
          items: [
            {
              label: "Concepts",
              items: [{ autogenerate: {
                directory: "advanced-ai/concepts",
                collapsed: true,
              } }],
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