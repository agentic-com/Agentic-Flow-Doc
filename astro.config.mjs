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
  // Renamed or moved pages keep working (epic awflow/Agentic-Flow#1308, IA v2 #1334).
  redirects: {
    // Generated from the awflow/Agentic-Flow#1334 move list: every old URL points straight at its final page.
    "/advanced-ai/": "/concepts/ai/",
    "/advanced-ai/concepts/": "/concepts/ai/",
    "/advanced-ai/concepts/action-approval/": "/concepts/ai/action-approval/",
    "/advanced-ai/concepts/ai-agents/": "/concepts/ai/ai-agents/",
    "/advanced-ai/concepts/embeddings-vectors/": "/concepts/ai/embeddings-vectors/",
    "/advanced-ai/concepts/evaluation-testing/": "/concepts/ai/evaluation-testing/",
    "/advanced-ai/concepts/memory-context/": "/concepts/ai/memory-context/",
    "/advanced-ai/concepts/model-dependencies/": "/concepts/ai/model-dependencies/",
    "/advanced-ai/concepts/prompting-and-outputs/": "/concepts/ai/prompting-and-outputs/",
    "/advanced-ai/concepts/rag/": "/concepts/ai/rag/",
    "/advanced-ai/concepts/tool-selection/": "/concepts/ai/tool-selection/",
    "/advanced-ai/concepts/workflow-intelligence/": "/concepts/ai/workflow-intelligence/",
    "/advanced-ai/langchain/": "/concepts/ai/",
    "/advanced-ai/langchain/advanced-patterns/": "/concepts/ai/ai-agents/",
    "/advanced-ai/langchain/browser-integration-guide/": "/concepts/ai/tool-selection/",
    "/advanced-ai/langchain/components/": "/concepts/ai/model-dependencies/",
    "/advanced-ai/langchain/getting-started/": "/concepts/ai/",
    "/advanced-ai/langchain/langchain-learning-resources/": "/concepts/ai/",
    "/advanced-ai/langchain/workflow-patterns/": "/concepts/ai/ai-agents/",
    "/usage/": "/get-started/",
    "/usage/admin/": "/app/admin/",
    "/usage/admin/agent-templates/": "/app/admin/agent-templates/",
    "/usage/admin/audit-log/": "/app/admin/audit-log/",
    "/usage/admin/batch-import/": "/app/admin/batch-import/",
    "/usage/admin/categories/": "/app/admin/categories/",
    "/usage/admin/insights/": "/app/admin/insights/",
    "/usage/admin/moderation/": "/app/admin/moderation/",
    "/usage/admin/newsletter/": "/app/admin/newsletter/",
    "/usage/admin/reports/": "/app/admin/reports/",
    "/usage/admin/requests/": "/app/admin/requests/",
    "/usage/admin/templates/": "/app/admin/templates/",
    "/usage/admin/users/": "/app/admin/users/",
    "/usage/faq/": "/app/faq/",
    "/usage/getting-started/": "/get-started/",
    "/usage/getting-started/learning-path/": "/get-started/learning-path/",
    "/usage/getting-started/long-intro/": "/get-started/long-intro/",
    "/usage/getting-started/quick-intro/": "/get-started/quick-intro/",
    "/usage/help-and-community/": "/app/help/help/",
    "/usage/help-and-community/contributing/": "/app/help/contributing/",
    "/usage/help-and-community/help/": "/app/help/help/",
    "/usage/key-concepts/": "/concepts/",
    "/usage/key-concepts/data/": "/concepts/data/",
    "/usage/key-concepts/data/code/": "/concepts/data/code/",
    "/usage/key-concepts/data/data-mapping/data-mapping-expressions/": "/concepts/data/data-mapping/data-mapping-expressions/",
    "/usage/key-concepts/data/data-mapping/data-mapping-ui/": "/concepts/data/data-mapping/data-mapping-ui/",
    "/usage/key-concepts/data/data-structure/": "/concepts/data/data-structure/",
    "/usage/key-concepts/data/item-linking/": "/concepts/data/item-linking/",
    "/usage/key-concepts/flow-logic/": "/concepts/flow/",
    "/usage/key-concepts/flow-logic/browser-context/": "/concepts/flow/browser-context/",
    "/usage/key-concepts/flow-logic/error-handling/": "/concepts/flow/error-handling/",
    "/usage/key-concepts/flow-logic/execution-order/": "/concepts/flow/execution-order/",
    "/usage/key-concepts/flow-logic/lambdaworkflows/": "/concepts/flow/lambdaworkflows/",
    "/usage/key-concepts/flow-logic/looping/": "/concepts/flow/looping/",
    "/usage/key-concepts/flow-logic/merging/": "/concepts/flow/merging/",
    "/usage/key-concepts/flow-logic/splitting/": "/concepts/flow/splitting/",
    "/usage/key-concepts/flow-logic/waiting/": "/concepts/flow/waiting/",
    "/usage/key-concepts/flow-logic/workflow-lifecycle/": "/concepts/flow/workflow-lifecycle/",
    "/usage/key-concepts/glossary/": "/concepts/glossary/",
    "/usage/privacy-and-data/": "/app/privacy-and-data/",
    "/usage/releases/": "/releases/",
    "/usage/releases/releases-notes/": "/releases/",
    "/usage/releases/releases-notes/v0-0-2/": "/releases/v0-0-2/",
    "/usage/releases/releases-notes/v0-2-1/": "/releases/v0-2-1/",
    "/usage/releases/releases-notes/v0-2-2/": "/releases/v0-2-2/",
    "/usage/releases/releases-notes/v0-2-3/": "/releases/v0-2-3/",
    "/usage/releases/releases-notes/v0-2-4/": "/releases/v0-2-4/",
    "/usage/releases/releases-notes/v0-3-0/": "/releases/v0-3-0/",
    "/usage/releases/releases-notes/v0-4-0/": "/releases/v0-4-0/",
    "/usage/releases/releases-notes/v0-6-0/": "/releases/v0-6-0/",
    "/usage/releases/releases-notes/v0-8-0/": "/releases/v0-8-0/",
    "/usage/releases/releases-notes/v0-8-1/": "/releases/v0-8-1/",
    "/usage/releases/releases-notes/v0-8-2/": "/releases/v0-8-2/",
    "/usage/troubleshooting/": "/app/troubleshooting/",
    "/usage/troubleshooting/browser-compatibility/": "/app/troubleshooting/browser-compatibility/",
    "/usage/troubleshooting/data-extraction/": "/app/troubleshooting/data-extraction/",
    "/usage/troubleshooting/extension-only-integrations-in-the-web-app/": "/app/troubleshooting/extension-only-integrations-in-the-web-app/",
    "/usage/troubleshooting/performance-optimization/": "/app/troubleshooting/performance-optimization/",
    "/usage/troubleshooting/permissions-security/": "/app/troubleshooting/permissions-security/",
    "/usage/troubleshooting/troubleshooting-decision-guide/": "/app/troubleshooting/",
    "/usage/troubleshooting/workflow-connections/": "/app/troubleshooting/workflow-connections/",
    "/usage/using-the-app/": "/app/",
    "/usage/using-the-app/account/local-vs-cloud/": "/app/account/local-vs-cloud/",
    "/usage/using-the-app/account/reset-password/": "/app/account/reset-password/",
    "/usage/using-the-app/account/secret-vault/": "/app/account/secret-vault/",
    "/usage/using-the-app/account/sign-up-and-login/": "/app/account/sign-up-and-login/",
    "/usage/using-the-app/account/welcome/": "/app/account/welcome/",
    "/usage/using-the-app/activity/": "/app/activity/",
    "/usage/using-the-app/assistant-notch/": "/app/assistant-notch/",
    "/usage/using-the-app/chat-and-agents/agents/": "/app/chat-and-agents/agents/",
    "/usage/using-the-app/chat-and-agents/browser-control/": "/app/chat-and-agents/browser-control/",
    "/usage/using-the-app/chat-and-agents/building-workflows-in-chat/": "/app/chat-and-agents/building-workflows-in-chat/",
    "/usage/using-the-app/chat-and-agents/chat/": "/app/chat-and-agents/chat/",
    "/usage/using-the-app/chat-and-agents/entry-points/": "/app/chat-and-agents/entry-points/",
    "/usage/using-the-app/chat-and-agents/knowledge/": "/app/chat-and-agents/knowledge/",
    "/usage/using-the-app/chat-and-agents/memory/": "/app/chat-and-agents/memory/",
    "/usage/using-the-app/chat-and-agents/projects/": "/app/chat-and-agents/projects/",
    "/usage/using-the-app/chat-and-agents/seeing-the-work/": "/app/chat-and-agents/seeing-the-work/",
    "/usage/using-the-app/chat-and-agents/teams/": "/app/chat-and-agents/teams/",
    "/usage/using-the-app/chat-and-agents/templates/": "/app/chat-and-agents/templates/",
    "/usage/using-the-app/chat-and-agents/turn-traces/": "/app/chat-and-agents/turn-traces/",
    "/usage/using-the-app/credentials/": "/app/connections/create/",
    "/usage/using-the-app/credentials/create/": "/app/connections/create/",
    "/usage/using-the-app/credentials/edit/": "/app/connections/edit/",
    "/usage/using-the-app/credentials/filters/": "/app/connections/filters/",
    "/usage/using-the-app/credentials/oauth-client/": "/app/connections/oauth-client/",
    "/usage/using-the-app/data-store/": "/app/data-store/",
    "/usage/using-the-app/knowledge-bases/export-import-backup/": "/app/knowledge-bases/export-import-backup/",
    "/usage/using-the-app/knowledge-bases/overview/": "/app/knowledge-bases/overview/",
    "/usage/using-the-app/knowledge-bases/save-from-anywhere/": "/app/knowledge-bases/save-from-anywhere/",
    "/usage/using-the-app/local-models-compare/": "/app/local-models-compare/",
    "/usage/using-the-app/local-models/": "/app/local-models/",
    "/usage/using-the-app/memory/overview/": "/app/memory/overview/",
    "/usage/using-the-app/memory/storage/": "/app/memory/storage/",
    "/usage/using-the-app/newsletter/": "/app/newsletter/",
    "/usage/using-the-app/notifications/": "/app/notifications/",
    "/usage/using-the-app/request-board/": "/app/request-board/",
    "/usage/using-the-app/settings/": "/app/settings/",
    "/usage/using-the-app/settings/access/": "/app/settings/access/",
    "/usage/using-the-app/settings/general/": "/app/settings/general/",
    "/usage/using-the-app/settings/notch/": "/app/settings/notch/",
    "/usage/using-the-app/settings/plan/": "/app/settings/plan/",
    "/usage/using-the-app/settings/preferences/": "/app/settings/preferences/",
    "/usage/using-the-app/settings/privacy/": "/app/settings/privacy/",
    "/usage/using-the-app/settings/providers/": "/app/settings/providers/",
    "/usage/using-the-app/settings/security/": "/app/settings/security/",
    "/usage/using-the-app/settings/storage/": "/app/settings/storage/",
    "/usage/using-the-app/side-panel/": "/app/side-panel/",
    "/usage/using-the-app/workflows/components/connections/": "/app/workflows/components/connections/",
    "/usage/using-the-app/workflows/components/nodes/": "/app/workflows/components/nodes/",
    "/usage/using-the-app/workflows/components/sticky-notes/": "/app/workflows/components/sticky-notes/",
    "/usage/using-the-app/workflows/create/": "/app/workflows/create/",
    "/usage/using-the-app/workflows/executions/execute-from-dnd-designer/": "/app/workflows/executions/run-from-the-canvas/",
    "/usage/using-the-app/workflows/executions/execute-from-webpage-contextual-menu/": "/app/workflows/executions/run-from-the-right-click-menu/",
    "/usage/using-the-app/workflows/executions/execute-from-workflow-list-table/": "/app/workflows/executions/run-from-the-workflow-list/",
    "/usage/using-the-app/workflows/executions/run-from-the-canvas/": "/app/workflows/executions/run-from-the-canvas/",
    "/usage/using-the-app/workflows/executions/run-from-the-right-click-menu/": "/app/workflows/executions/run-from-the-right-click-menu/",
    "/usage/using-the-app/workflows/executions/run-from-the-workflow-list/": "/app/workflows/executions/run-from-the-workflow-list/",
    "/usage/using-the-app/workflows/export-import/": "/app/workflows/export-import/",
    "/usage/using-the-app/workflows/filters/": "/app/workflows/filters/",
    "/usage/using-the-app/workflows/history/": "/app/workflows/history/",
    "/usage/using-the-app/workflows/manage-list/": "/app/workflows/manage-list/",
    "/usage/using-the-app/workflows/narration-style/": "/app/workflows/narration-style/",
    "/usage/using-the-app/workflows/narration/": "/app/workflows/narration/",
    "/usage/using-the-app/workflows/publishing/": "/app/workflows/publishing/",
    "/usage/using-the-app/workflows/run-history/": "/app/workflows/run-history/",
    "/usage/using-the-app/workflows/tags/": "/app/workflows/tags/",
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
        // One topic per header tab (awflow/Agentic-Flow#1334). Groups stay at most 3 levels deep.
        {
          label: "Get started",
          link: "/get-started/",
          icon: "rocket",
          items: [
            { label: "Overview", link: "get-started" },
            { label: "Learning path", link: "get-started/learning-path" },
            { label: "Quick intro", link: "get-started/quick-intro" },
            { label: "Long intro", link: "get-started/long-intro" },
          ],
        },
        {
          label: "Use the app",
          link: "/app/",
          icon: "laptop",
          items: [
            { label: "Overview", link: "app" },
            { label: "Side panel", link: "app/side-panel" },
            {
              label: "Chat & agents",
              items: [
                { label: "Chat with Aria", link: "app/chat-and-agents/chat" },
                { label: "Ways to open Aria", link: "app/chat-and-agents/entry-points" },
                { label: "Building workflows in chat", link: "app/chat-and-agents/building-workflows-in-chat" },
                { label: "Following Aria's work", link: "app/chat-and-agents/seeing-the-work" },
                { label: "Agents", link: "app/chat-and-agents/agents" },
                { label: "Projects", link: "app/chat-and-agents/projects" },
                { label: "Teams", link: "app/chat-and-agents/teams" },
                { label: "Assistant memory", link: "app/chat-and-agents/memory" },
                { label: "Knowledge in chats & agents", link: "app/chat-and-agents/knowledge" },
                { label: "Browser control & safety", link: "app/chat-and-agents/browser-control" },
                { label: "Agent & team templates", link: "app/chat-and-agents/templates" },
                { label: "Turn traces", link: "app/chat-and-agents/turn-traces" },
              ],
            },
            {
              label: "Workflows",
              items: [
                { label: "Create", link: "app/workflows/create" },
                { label: "Notes & story", link: "app/workflows/narration" },
                { label: "Narration style guide", link: "app/workflows/narration-style" },
                { label: "Export/Import", link: "app/workflows/export-import" },
                { label: "History", link: "app/workflows/history" },
                { label: "Publishing", link: "app/workflows/publishing" },
                { label: "Tags", link: "app/workflows/tags" },
                { label: "Filter the list", link: "app/workflows/filters" },
                { label: "Manage the list", link: "app/workflows/manage-list" },
                { label: "Run history", link: "app/workflows/run-history" },
                {
                  label: "Components",
                  collapsed: true,
                  items: [{ autogenerate: { directory: "app/workflows/components" } }],
                },
                {
                  label: "Executions",
                  collapsed: true,
                  items: [{ autogenerate: { directory: "app/workflows/executions" } }],
                },
              ],
            },
            {
              label: "Connections",
              items: [{ autogenerate: { directory: "app/connections" } }],
            },
            {
              label: "Knowledge bases",
              items: [
                { label: "Overview", link: "app/knowledge-bases/overview" },
                { label: "Save from anywhere", link: "app/knowledge-bases/save-from-anywhere" },
                { label: "Export & import", link: "app/knowledge-bases/export-import-backup" },
              ],
            },
            {
              label: "Memory",
              items: [
                { label: "Memory page", link: "app/memory/overview" },
                { label: "Storage & clean-up", link: "app/memory/storage" },
              ],
            },
            {
              label: "Local AI",
              items: [
                { label: "Local models", link: "app/local-models" },
                { label: "Compare models", link: "app/local-models-compare" },
              ],
            },
            {
              label: "More features",
              collapsed: true,
              items: [
                { label: "Assistant Notch", link: "app/assistant-notch" },
                { label: "Data store", link: "app/data-store" },
                { label: "Activity", link: "app/activity" },
                { label: "Notifications", link: "app/notifications" },
                { label: "Newsletter", link: "app/newsletter" },
                { label: "Request board", link: "app/request-board" },
              ],
            },
            {
              label: "Settings",
              collapsed: true,
              items: [{ autogenerate: { directory: "app/settings" } }],
            },
            {
              label: "Account",
              collapsed: true,
              items: [{ autogenerate: { directory: "app/account" } }],
            },
            { label: "Privacy & your data", link: "app/privacy-and-data" },
            { label: "FAQ", link: "app/faq" },
            {
              label: "Troubleshooting",
              collapsed: true,
              items: [{ autogenerate: { directory: "app/troubleshooting" } }],
            },
            {
              label: "Help & community",
              collapsed: true,
              items: [{ autogenerate: { directory: "app/help" } }],
            },
            {
              label: "Admin",
              collapsed: true,
              items: [{ autogenerate: { directory: "app/admin" } }],
            },
          ],
        },
        {
          label: "Recipes",
          link: "/recipes/",
          icon: "document",
          items: [{ label: "Overview", link: "recipes" }],
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
          label: "Concepts",
          link: "/concepts/",
          icon: "open-book",
          items: [
            { label: "Overview", link: "concepts" },
            {
              label: "Data",
              items: [
                { label: "Overview", link: "concepts/data" },
                { label: "Items", link: "concepts/data/data-structure" },
                { label: "Mapping in the UI", link: "concepts/data/data-mapping/data-mapping-ui" },
                { label: "Expressions", link: "concepts/data/data-mapping/data-mapping-expressions" },
                { label: "Item linking", link: "concepts/data/item-linking" },
                { label: "Code", link: "concepts/data/code" },
              ],
            },
            {
              label: "Flow",
              items: [{ autogenerate: { directory: "concepts/flow" } }],
            },
            {
              label: "AI",
              items: [{ autogenerate: { directory: "concepts/ai" } }],
            },
            { label: "Glossary", link: "concepts/glossary" },
          ],
        },
        {
          label: "Releases",
          link: "/releases/",
          icon: "list-format",
          items: [{ autogenerate: { directory: "releases" } }],
        },
      ]),
      // starlight-videos is no longer registered: no page uses `video` frontmatter, and its PageTitle /
      // MarkdownContent overrides blocked starlight-awflow and starlight-image-zoom. The package stays
      // installed because src/content.config.ts still extends `videosSchema`.
      // AWFlow chrome: section tabs, banners, node header, at-a-glance, Ask Aria pill, tokens.
      starlightAwflow({
        sections: [
          // Six header tabs, one per sidebar topic (awflow/Agentic-Flow#1334).
          { id: "get-started", label: "Get started", link: "/get-started/", topic: "/get-started/", color: "#B45309" },
          { id: "app", label: "Use the app", link: "/app/", topic: "/app/", color: "#BE185D" },
          { id: "recipes", label: "Recipes", link: "/recipes/", topic: "/recipes/", color: "#15803D" },
          { id: "nodes", label: "Nodes", link: "/nodes/", topic: "/nodes/", color: "#4338CA" },
          { id: "concepts", label: "Concepts", link: "/concepts/", topic: "/concepts/", color: "#0F766E" },
          { id: "releases", label: "Releases", link: "/releases/", topic: "/releases/", color: "#6D28D9" },
        ],
        version: { label: "v0.8.2", href: "/releases/" },
        install: {
          label: "Install free",
          href: PUBLIC_CHROME_EXTENSION_URL || "https://awflow.io",
        },
        askAria: { href: "#ask-aria" },
        // Node reference pages are listed A–Z, so prev/next there is noise (awflow/Agentic-Flow#1330).
        noPagination: ["/nodes/builtin/", "/nodes/extension/"],
      }),
      starlightLinksValidator({
        // Checks internal links and anchors (awflow/Agentic-Flow#1311); a broken link fails the build.
        // Local links are allowed: self-hosted app pages (Obsidian, Baserow) document localhost URLs.
        failOnError: true,
        errorOnLocalLinks: false,
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