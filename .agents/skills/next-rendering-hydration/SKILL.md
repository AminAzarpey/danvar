---
name: next-rendering-hydration
description: Implement and verify Next.js App Router SSR, SSG, CSR, localized HTML and hydration. Use for rendering strategy, metadata, server/client boundaries, theme initialization or hydration bugs.
---

# Next.js rendering and hydration

Read the installed Next version and local framework documentation before relying on version-sensitive APIs. Consult https://nextjs.org/docs/app when local docs do not resolve the question.

Prerender stable public routes with generateStaticParams. Use request-time rendering only for request-specific content. Use client components for interaction; remember they still receive server-generated initial HTML. Keep browser APIs out of render and server modules.

Render lang, dir, title and description on the server for each locale. Check the raw HTTP HTML with JavaScript disabled, not only the hydrated DOM. Keep the server snapshot deterministic; random palettes and storage belong to the pre-paint bootstrap or subscribed browser state. Use useSyncExternalStore for browser stores. Limit suppressHydrationWarning to the root attributes intentionally changed by the bootstrap.

Choose caches based on freshness and ownership. Never cache personalized or secret data globally. Do not introduce SSR, ISR or CSR merely to claim every rendering mode is used.

Verify invalid locale 404, initial HTML, no-JS content, all locale metadata, blocked storage, dark/light system changes, reduced motion and hydration console errors in production. Run the build to confirm which routes are actually static or dynamic.
