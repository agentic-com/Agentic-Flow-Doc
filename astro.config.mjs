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
import { nav, topicLabel } from "./src/i18n/nav.ts";
import { nodesSidebar } from "./scripts/nodes/sidebar.mjs";

import svelte from "@astrojs/svelte";

import { loadEnv } from "vite";
import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import { i18nLinks } from "./src/i18n/markdown/links.ts";
import { i18nHeadingIds } from "./src/i18n/markdown/heading-ids.ts";
import { CHROME_WEB_STORE_URL } from "./src/data/stores.ts";
const { DOCS_SITE_URL } = loadEnv(
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
    "/nodes/builtin/node-types/": "/nodes/",
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
    "/usage/getting-started/long-intro/": "/get-started/branch-on-page-content/",
    "/usage/getting-started/quick-intro/": "/get-started/first-workflow/",
    // Getting-started rework (awflow/Agentic-Flow#1318): the intros became lessons.
    "/get-started/quick-intro/": "/get-started/first-workflow/",
    "/get-started/long-intro/": "/get-started/branch-on-page-content/",
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
    "/usage/using-the-app/credentials/": "/app/connections/",
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
    processor: satteri({ features: { rawHtml: true }, hastPlugins: [i18nLinks, i18nHeadingIds] }),
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
    head: [
      // Release notes feed (awflow/Agentic-Flow#1345).
      { tag: "link", attrs: { rel: "alternate", type: "application/rss+xml", title: "AWFlow release notes", href: "/releases/rss.xml" } },
    ],
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
    // Docs in the extension's four languages (spec docs/superpowers/specs/2026-10-11-docs-i18n-design.md).
    // Translated pages mirror English slugs under /fr/, /de/ and /zh-cn/.
    locales: {
      root: { label: "English", lang: "en" },
      fr: { label: "Français", lang: "fr" },
      de: { label: "Deutsch", lang: "de" },
      "zh-cn": { label: "简体中文", lang: "zh-CN" },
    },
    plugins: [
      starlightSidebarTopics([
        // One topic per header tab (awflow/Agentic-Flow#1334). Groups stay at most 3 levels deep.
        {
          label: topicLabel("Get started"),
          link: "/get-started/",
          icon: "rocket",
          items: [
            { ...nav("Overview"), link: "get-started" },
            { ...nav("Learning path"), link: "get-started/learning-path" },
            {
              // Lessons (kind: lesson) get the learning-path rail (awflow/Agentic-Flow#1341).
              ...nav("Level 1 · Your first automations"),
              items: [
                { ...nav("1 · Install AWFlow"), link: "get-started/install" },
                { ...nav("2 · Your first workflow"), link: "get-started/first-workflow" },
                { ...nav("3 · Summarise a page with AI"), link: "get-started/summarize-with-ai" },
                { ...nav("4 · Your first automation"), link: "get-started/first-automation" },
                { ...nav("5 · Ask Aria to build one"), link: "get-started/build-with-aria" },
              ],
            },
            {
              ...nav("Level 2 · Working with data"),
              items: [
                { ...nav("What's in level 2"), link: "get-started/working-with-data" },
                { ...nav("Walkthrough: branch on page content"), link: "get-started/branch-on-page-content" },
              ],
            },
            { ...nav("Level 3 · Agents & knowledge"), link: "get-started/agents-and-knowledge" },
          ],
        },
        {
          label: topicLabel("Use the app"),
          link: "/app/",
          icon: "laptop",
          items: [
            { ...nav("Overview"), link: "app" },
            { ...nav("Side panel"), link: "app/side-panel" },
            {
              ...nav("Chat & agents"),
              items: [
                { ...nav("Chat with Aria"), link: "app/chat-and-agents/chat" },
                { ...nav("Ways to open Aria"), link: "app/chat-and-agents/entry-points" },
                { ...nav("Building workflows in chat"), link: "app/chat-and-agents/building-workflows-in-chat" },
                { ...nav("Following Aria's work"), link: "app/chat-and-agents/seeing-the-work" },
                { ...nav("Agents"), link: "app/chat-and-agents/agents" },
                { ...nav("Agent builder"), link: "app/chat-and-agents/agent-builder" },
                { ...nav("Agent skills"), link: "app/chat-and-agents/agent-skills" },
                { ...nav("Projects"), link: "app/chat-and-agents/projects" },
                { ...nav("Teams"), link: "app/chat-and-agents/teams" },
                { ...nav("Assistant memory"), link: "app/chat-and-agents/memory" },
                { ...nav("Knowledge in chats & agents"), link: "app/chat-and-agents/knowledge" },
                { ...nav("Browser control & safety"), link: "app/chat-and-agents/browser-control" },
                { ...nav("Agent & team templates"), link: "app/chat-and-agents/templates" },
                { ...nav("Turn traces"), link: "app/chat-and-agents/turn-traces" },
              ],
            },
            {
              ...nav("Workflows"),
              items: [
                { ...nav("Create"), link: "app/workflows/create" },
                { ...nav("Notes & story"), link: "app/workflows/narration" },
                { ...nav("Narration style guide"), link: "app/workflows/narration-style" },
                { ...nav("Export/Import"), link: "app/workflows/export-import" },
                { ...nav("History"), link: "app/workflows/history" },
                { ...nav("Publishing"), link: "app/workflows/publishing" },
                { ...nav("Tags"), link: "app/workflows/tags" },
                { ...nav("Filter the list"), link: "app/workflows/filters" },
                { ...nav("Manage the list"), link: "app/workflows/manage-list" },
                { ...nav("Runs"), link: "app/workflows/run-history" },
                { ...nav("Workflow settings"), link: "app/workflows/settings" },
                { ...nav("Keyboard shortcuts"), link: "app/workflows/keyboard-shortcuts" },
                { ...nav("Test runs"), link: "app/workflows/test-runs" },
                { ...nav("Kept results"), link: "app/workflows/kept-results" },
                { ...nav("Run from here"), link: "app/workflows/run-from-here" },
                { ...nav("Step versions"), link: "app/workflows/step-versions" },
                { ...nav("Behaviour versions"), link: "app/workflows/behaviour-versions" },
                {
                  ...nav("Components"),
                  collapsed: true,
                  items: [{ autogenerate: { directory: "app/workflows/components" } }],
                },
                {
                  ...nav("Executions"),
                  collapsed: true,
                  items: [{ autogenerate: { directory: "app/workflows/executions" } }],
                },
              ],
            },
            {
              ...nav("Connections"),
              items: [
                { ...nav("All connections"), link: "app/connections" },
                { ...nav("Create a credential"), link: "app/connections/create" },
                { ...nav("Edit a credential"), link: "app/connections/edit" },
                { ...nav("Create your OAuth client"), link: "app/connections/oauth-client" },
                { ...nav("Find a credential"), link: "app/connections/filters" },
                {
                  ...nav("AI models"),
                  collapsed: true,
                  items: [
                    { ...nav("OpenAI"), link: "app/connections/openai" },
                    { ...nav("Anthropic"), link: "app/connections/anthropic" },
                    { ...nav("Google Gemini"), link: "app/connections/google-gemini" },
                    { ...nav("Azure OpenAI"), link: "app/connections/azure-openai" },
                    { ...nav("Mistral"), link: "app/connections/mistral" },
                    { ...nav("Groq"), link: "app/connections/groq" },
                    { ...nav("DeepSeek"), link: "app/connections/deepseek" },
                    { ...nav("xAI"), link: "app/connections/xai" },
                    { ...nav("OpenRouter"), link: "app/connections/openrouter" },
                    { ...nav("Cohere"), link: "app/connections/cohere" },
                    { ...nav("Voyage AI"), link: "app/connections/voyage" },
                    { ...nav("Hugging Face"), link: "app/connections/hugging-face" },
                  ],
                },
                {
                  ...nav("Google & Microsoft"),
                  collapsed: true,
                  items: [
                    { ...nav("Google"), link: "app/connections/google" },
                    { ...nav("Microsoft 365"), link: "app/connections/microsoft-365" },
                  ],
                },
                {
                  ...nav("Apps"),
                  collapsed: true,
                  items: [
                    { ...nav("Airtable"), link: "app/connections/airtable" },
                    { ...nav("Attio"), link: "app/connections/attio" },
                    { ...nav("Baserow / NocoDB"), link: "app/connections/baserow-nocodb" },
                    { ...nav("Discord"), link: "app/connections/discord" },
                    { ...nav("GitHub"), link: "app/connections/github" },
                    { ...nav("HubSpot"), link: "app/connections/hubspot" },
                    { ...nav("Linear"), link: "app/connections/linear" },
                    { ...nav("Notion"), link: "app/connections/notion" },
                    { ...nav("ntfy / Pushover"), link: "app/connections/push-notifications" },
                    { ...nav("Obsidian"), link: "app/connections/obsidian" },
                    { ...nav("Pipedrive"), link: "app/connections/pipedrive" },
                    { ...nav("Raindrop"), link: "app/connections/raindrop" },
                    { ...nav("Readwise / Reader"), link: "app/connections/readwise" },
                    { ...nav("Slack"), link: "app/connections/slack" },
                    { ...nav("Supabase"), link: "app/connections/supabase" },
                    { ...nav("Telegram"), link: "app/connections/telegram" },
                    { ...nav("Todoist"), link: "app/connections/todoist" },
                    { ...nav("Trello"), link: "app/connections/trello" },
                  ],
                },
                {
                  ...nav("Any other API"),
                  collapsed: true,
                  items: [
                    { ...nav("Any API (HTTP, MCP)"), link: "app/connections/http-and-apis" },
                  ],
                },
              ],
            },
            {
              ...nav("Knowledge bases"),
              items: [
                { ...nav("Overview"), link: "app/knowledge-bases/overview" },
                { ...nav("Create & add sources"), link: "app/knowledge-bases/create" },
                { ...nav("Save from anywhere"), link: "app/knowledge-bases/save-from-anywhere" },
                { ...nav("Test search"), link: "app/knowledge-bases/test-search" },
                { ...nav("Privacy"), link: "app/knowledge-bases/privacy" },
                { ...nav("Re-embed or delete"), link: "app/knowledge-bases/manage" },
                { ...nav("Export & import"), link: "app/knowledge-bases/export-import-backup" },
              ],
            },
            {
              ...nav("Memory"),
              items: [
                { ...nav("Overview"), link: "app/memory/overview" },
                { ...nav("Conversations"), link: "app/memory/conversations" },
                { ...nav("Facts"), link: "app/memory/facts" },
                { ...nav("Free space"), link: "app/memory/free-space" },
                { ...nav("Export & import"), link: "app/memory/export-import" },
                { ...nav("Encryption"), link: "app/memory/encryption" },
                { ...nav("Storage & clean-up"), link: "app/memory/storage" },
              ],
            },
            {
              ...nav("Local AI"),
              items: [
                { ...nav("Overview"), link: "app/local-models" },
                { ...nav("Install & manage"), link: "app/local-models-install" },
                { ...nav("Compare models"), link: "app/local-models-compare" },
                { ...nav("Add a custom model"), link: "app/local-models-custom" },
              ],
            },
            {
              ...nav("More features"),
              collapsed: true,
              items: [
                { ...nav("Assistant Notch"), link: "app/assistant-notch" },
                { ...nav("Data store"), link: "app/data-store" },
                { ...nav("Variables"), link: "app/variables" },
                { ...nav("Insights"), link: "app/insights" },
                { ...nav("Activity"), link: "app/activity" },
                { ...nav("Notifications"), link: "app/notifications" },
                { ...nav("Newsletter"), link: "app/newsletter" },
                { ...nav("Request board"), link: "app/request-board" },
              ],
            },
            {
              ...nav("Settings"),
              collapsed: true,
              items: [{ autogenerate: { directory: "app/settings" } }],
            },
            {
              ...nav("Account"),
              collapsed: true,
              items: [{ autogenerate: { directory: "app/account" } }],
            },
            { ...nav("Privacy & your data"), link: "app/privacy-and-data" },
            { ...nav("Updating AWFlow"), link: "app/updating-awflow" },
            { ...nav("FAQ"), link: "app/faq" },
            {
              ...nav("Troubleshooting"),
              collapsed: true,
              items: [{ autogenerate: { directory: "app/troubleshooting" } }],
            },
            {
              ...nav("Help & community"),
              collapsed: true,
              items: [{ autogenerate: { directory: "app/help" } }],
            },
            {
              ...nav("Admin"),
              collapsed: true,
              items: [{ autogenerate: { directory: "app/admin" } }],
            },
          ],
        },
        {
          label: topicLabel("Recipes"),
          link: "/recipes/",
          icon: "document",
          items: [
            { ...nav("All recipes"), link: "recipes" },
            // One group per goal chip on /recipes/ (awflow/Agentic-Flow#1342).
            { ...nav("Research & reading"), items: [{ autogenerate: { directory: "recipes/research-and-reading" } }] },
            { ...nav("Capture to my apps"), items: [{ autogenerate: { directory: "recipes/capture-to-my-apps" } }] },
            { ...nav("Monitor pages"), items: [{ autogenerate: { directory: "recipes/monitor-pages" } }] },
            { ...nav("Fill forms & click"), items: [{ autogenerate: { directory: "recipes/fill-forms-and-click" } }] },
            { ...nav("Extract data"), items: [{ autogenerate: { directory: "recipes/extract-data" } }] },
            { ...nav("Write with AI"), items: [{ autogenerate: { directory: "recipes/write-with-ai" } }] },
          ],
        },
        {
          label: topicLabel("Nodes"),
          link: "/nodes/",
          icon: "puzzle",
          // Families, integrations by use case, and a collapsed "Deprecated" group (#1337).
          items: nodesSidebar(),
        },
        {
          label: topicLabel("Concepts"),
          link: "/concepts/",
          icon: "open-book",
          items: [
            { ...nav("Overview"), link: "concepts" },
            {
              ...nav("Data"),
              items: [
                { ...nav("Overview"), link: "concepts/data" },
                { ...nav("Items"), link: "concepts/data/data-structure" },
                { ...nav("Mapping in the UI"), link: "concepts/data/data-mapping/data-mapping-ui" },
                { ...nav("Expressions"), link: "concepts/data/data-mapping/data-mapping-expressions" },
                { ...nav("Item linking"), link: "concepts/data/item-linking" },
                { ...nav("Code"), link: "concepts/data/code" },
              ],
            },
            {
              ...nav("Flow"),
              items: [{ autogenerate: { directory: "concepts/flow" } }],
            },
            {
              ...nav("AI"),
              items: [{ autogenerate: { directory: "concepts/ai" } }],
            },
            { ...nav("Glossary"), link: "concepts/glossary" },
          ],
        },
        {
          label: topicLabel("Releases"),
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
        version: { label: "v0.9.0", href: "/releases/" },
        install: {
          label: "Install free",
          href: CHROME_WEB_STORE_URL,
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
        // Translated pages may link to pages not translated yet (Starlight serves the English fallback).
        errorOnFallbackPages: false,
        exclude: ["/og/**", "#ask-aria"],
      }),
      starlightLlmsTxt({
        // Raw MDX: the plugin cannot render components (the home page, src/components/awflow).
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
    },
  },
});