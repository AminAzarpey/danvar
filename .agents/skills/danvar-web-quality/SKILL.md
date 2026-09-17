---
name: danvar-web-quality
description: Implement and review clean Next.js code in Danvar. Use for components, state, formatting, lint, quality gates and web performance changes.
---

# Danvar web quality

Read package.json and the smallest relevant module. Keep data, browser state, rendering, and layout responsibilities separate; extract cohesive components instead of creating generic abstraction layers. Use named types and constants rather than unexplained indexes. Use the installed Vercel React and composition skills when relevant.

Run Prettier and ESLint with zero warnings. Fix causes; never suppress hydration, accessibility or hook findings merely to pass. Preserve all locales, the centered Amin card and verified experience provenance.

Keep animation ticks in refs or the animation engine, not state that rerenders the whole application. Load GSAP only when motion is enabled. Scope and revert every animation. Keep critical content visible while optional animation code loads.

Use local fonts, dimensioned images and deferred below-fold assets. Measure production builds. Record Lighthouse environment and actual results; distinguish lab data from field Core Web Vitals. Audit with axe plus keyboard, reduced motion and RTL checks. For a user flow change run npm run check, npm run build and npm run test:preview.

Adapted from the reference workspace's melal-site-development skill: app ownership, semantic palette tokens, localized content and rendering verification. Its Angular generators and Nx commands do not apply here.
