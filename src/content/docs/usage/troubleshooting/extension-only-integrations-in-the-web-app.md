---
title: Running Extension-Only Integrations in the Web App
description: When the browser extension is installed, the web app can run integrations that normally only work in the extension — such as Notion — by delegating their network calls to the extension, gated by per-host consent.
---

Some integrations (for example **Notion**) call third-party APIs that do not allow
cross-origin browser requests. In the **web app** those integrations are normally
**blocked**, and the node shows a message telling you it only works in the browser
extension.

If you also have the **awflow browser extension installed**, the web app can run
those integrations anyway by asking the extension to make the network call on its
behalf. The extension holds the browser permissions the web app lacks, so the node
works — without the web app becoming an open proxy.

---

## When it applies

- You are using the **web app** (not the extension), **and**
- The **awflow extension is installed and enabled** in the same browser, **and**
- The integration's target host is **consented for that workflow**.

If any of these is not true, the node keeps the normal "extension only" block. This
is deliberate — the feature never weakens the block, it only lifts it when it is
safe to.

<aside>
In this first release, **Notion** is the integration wired for delegated running.
More extension-only integrations will follow.
</aside>

---

## How consent works

Delegated calls are gated **per host, per workflow**. A call to an integration's
API host is only allowed when that host is covered by the workflow's approved
network access — the domains you consented to when installing the workflow, or a
host you granted to the workflow (including a broad "allow any site" grant).

A host that has not been consented for the workflow is **never** contacted. The
extension re-checks every delegated request independently — the request's origin,
that the URL is a normal public `https` address, and that the host is consented —
and refuses anything that does not pass. Cookies are never attached to a delegated
request; only the integration's own credential (its `Authorization` header) is sent.

---

## If a delegated integration does not run

1. Confirm the **extension is installed and enabled** (`chrome://extensions/` or
   `edge://extensions/`), then reload the web app tab.
2. Confirm the workflow has **access to the integration's host** (Settings →
   Site access), or re-approve the workflow's permissions.
3. If it still does not run, use the integration **inside the extension**, which
   never needs delegation.

See also:
- [Browser Compatibility](/usage/troubleshooting/browser-compatibility/)
- [Notion node](/nodes/builtin/integration/notion/)
