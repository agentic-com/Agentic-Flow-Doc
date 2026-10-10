// @ts-check
import { defineConfig, envField } from "astro/config";
import starlight from "@astrojs/starlight";

import tailwindcss from "@tailwindcss/vite";
import starlightSidebarTopics from "starlight-sidebar-topics";

import starlightLinksValidator from "starlight-links-validator";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightMdTxt from "starlight-md-txt";
import starlightImageZoom from "starlight-image-zoom";
import starlightKbd from "starlight-kbd";
import starlightHeadingBadges from "starlight-heading-badges";
import mermaid from "astro-mermaid";
import starlightAwflow from "./plugins/starlight-awflow/index.ts";

import svelte from "@astrojs/svelte";

import { loadEnv } from "vite";
import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
const { DOCS_SITE_URL, PUBLIC_CHROME_EXTENSION_URL } = loadEnv(
  process.env.NODE_ENV ?? "production",
  process.cwd(),
  "",
);

/**
 * Mermaid (awflow/Agentic-Flow#1316): Mermaid's `base` theme, with every colour pointing at CSS
 * variables defined in plugins/starlight-awflow/styles/mermaid.css. The SVG is inlined in the page,
 * so `var(--awf-mm-*)` follows the light/dark switch without re-rendering.
 */
const mermaidThemeCSS = `
  .node rect, .node polygon, .node circle, .node ellipse, .node path, .node .label-container {
    fill: var(--awf-mm-node); stroke: var(--awf-mm-border);
  }
  .nodeLabel, .nodeLabel p, .label, .label text, text.actor, .messageText, .loopText, .noteText, .labelText {
    color: var(--awf-mm-text); fill: var(--awf-mm-text);
  }
  .edgePath .path, .flowchart-link, .messageLine0, .messageLine1, .relation, .transition {
    stroke: var(--awf-mm-line);
  }
  .arrowheadPath, marker path, .arrowhead, #arrowhead path { fill: var(--awf-mm-line); stroke: var(--awf-mm-line); }
  .edgeLabel, .edgeLabel p, .edgeLabel rect, .labelBkg {
    background-color: var(--awf-mm-label-bg); fill: var(--awf-mm-label-bg); color: var(--awf-mm-text);
  }
  .cluster rect { fill: var(--awf-mm-cluster); stroke: var(--awf-mm-cluster-border); }
  .cluster .nodeLabel, .cluster-label .nodeLabel, .cluster text { color: var(--awf-mm-text); fill: var(--awf-mm-text); }
  .note, rect.note { fill: var(--awf-mm-note); stroke: var(--awf-mm-border); }
  .actor { fill: var(--awf-mm-node); stroke: var(--awf-mm-border); }
  .actor-line { stroke: var(--awf-mm-line); }
  .node.awf-trigger > * { fill: var(--awf-mm-trigger); }
  .node.awf-ai > * { fill: var(--awf-mm-ai); }
  .node.awf-data > * { fill: var(--awf-mm-data); }
  .node.awf-flow > * { fill: var(--awf-mm-flow); }
  .node.awf-io > * { fill: var(--awf-mm-io); }
  .node.awf-ok > * { fill: var(--awf-mm-ok); }
  .node.awf-warn > * { fill: var(--awf-mm-warn); }
  .node.awf-err > * { fill: var(--awf-mm-err); }
`;

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
    theme: "base",
    // Colours follow the page theme through CSS variables (see mermaidThemeCSS), so no re-render.
    autoTheme: false,
    mermaidConfig: {
      startOnLoad: false,
      logLevel: "error",
      securityLevel: "strict",
      fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif",
      // Fallback values for anything themeCSS doesn't reach (Mermaid needs concrete colours here).
      themeVariables: {
        fontFamily: "'Geist Variable', 'Geist', ui-sans-serif, system-ui, sans-serif",
        primaryColor: "#FFF3E3",
        primaryBorderColor: "#C9A27A",
        primaryTextColor: "#1C1917",
        secondaryColor: "#E0E7FF",
        tertiaryColor: "#F5F0E8",
        lineColor: "#78716C",
        textColor: "#1C1917",
        noteBkgColor: "#FEF3E2",
        noteTextColor: "#1C1917",
      },
      themeCSS: mermaidThemeCSS,
    },

    iconPacks: [
      {
        name: "fa",
        url: "https://unpkg.com/@iconify-json/fa6-solid@1.2.4/icons.json",
      },
    ],
  }), starlight({
    title: "AWFlow Docs",
    description:
      "AWFlow (Agentic Workflow) documentation — build AI-powered browser workflows: guides, recipes and a reference for every node.",
    logo: {
      src: "./src/assets/logo.svg",
      alt: "Agentic Workflow",
    },
    // Must be a path under public/. The old "./src/assets/logo.png" value 404'd (awflow/Agentic-Flow#1330).
    favicon: "/favicon.svg",
    editLink: {
      baseUrl: "https://github.com/agentic-com/Agentic-Flow-Doc/edit/Dev/",
    },
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
      // English only for now (decision in awflow/Agentic-Flow#1332, see CONTRIBUTING.md).
      root: {
        label: "English",
        lang: "en",
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
      // starlight-videos is no longer registered: no page uses `video` frontmatter, and its PageTitle /
      // MarkdownContent overrides blocked starlight-awflow and starlight-image-zoom. The package stays
      // installed because src/content.config.ts still extends `videosSchema`.
      // AWFlow chrome: section tabs, banners, node header, at-a-glance, Ask Aria pill, tokens.
      starlightAwflow({
        sections: [
          // Today's three sidebar topics, labelled and coloured as their target tabs.
          // awflow/Agentic-Flow#1334 grows this to six: get-started · app · recipes · nodes · concepts · releases.
          { id: "app", label: "Use the app", link: "/usage/", topic: "/usage/" },
          { id: "nodes", label: "Nodes", link: "/nodes/", topic: "/nodes/" },
          { id: "concepts", label: "AI concepts", link: "/advanced-ai/", topic: "/advanced-ai/" },
        ],
        version: { label: "v0.8.2", href: "/usage/releases/" },
        install: {
          label: "Install free",
          href: PUBLIC_CHROME_EXTENSION_URL || "https://awflow.io",
        },
        askAria: { href: "#ask-aria" },
        // Node reference pages are listed A–Z, so prev/next there is noise (awflow/Agentic-Flow#1330).
        noPagination: ["/nodes/builtin/", "/nodes/extension/"],
      }),
      starlightLinksValidator({
        // Checks internal links and anchors (awflow/Agentic-Flow#1311). Warn-only until the content
        // fixes land (4 broken links + 14 relative links today); then flip to `failOnError: true`.
        failOnError: false,
        exclude: ["/og/**", "#ask-aria"],
      }),
      starlightLlmsTxt({
        // Raw MDX: the plugin cannot render Svelte components (SiteHero, src/components/awflow).
        rawContent: true,
        projectName: "Agentic Workflow",
        description:
          "Agentic Workflow (AWFlow) is a browser extension and web app for building AI-powered automations with visual nodes.",
      }),
      starlightMdTxt({ format: ".md" }),
      starlightImageZoom(),
      starlightKbd({
        globalPicker: false,
        types: [
          { id: "mac", label: "macOS", detector: "apple", default: true },
          { id: "windows", label: "Windows / Linux" },
        ],
      }),
      starlightHeadingBadges(),
    ],
    components: {
      // Keeps the feedback widget above prev/next. Prev/next themselves are scoped to the
      // current sidebar group by the starlight-awflow route middleware.
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