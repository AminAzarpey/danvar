# Danvar engineering

This is a standalone Next.js App Router project, not the Angular/Nx reference workspace.

- Use `.agents/skills/danvar-web-quality/SKILL.md` for implementation and clean code.
- Use `.agents/skills/next-rendering-hydration/SKILL.md` for SSR, SSG, CSR and hydration changes.
- Use `.agents/skills/product-design-quality/SKILL.md` for product and interaction changes.
- Installed global skills cover Vercel React performance, web interface design, GSAP, accessibility, SEO and Core Web Vitals. Read only relevant skills for the task; do not load every skill on every edit.
- Preserve the user's design constraints in `design/FINAL-REVIEW.fa.md` and all three languages.
- Use RTK and targeted discovery. If a Graphify graph exists, query it first and update after meaningful changes.
- Keep dependencies in the lockfile. Do not disable lint rules or accessibility checks to make a check pass.
- Run `npm run check`, `npm run build`, then `npm run test:preview` against the running production server for changes to interactive behavior. Use `npm run audit:web` for measured accessibility and performance changes.
- Keep production indexation off until the real domain, assets and contact destination are confirmed. Do not claim SEO/GEO 100, universal WCAG conformance or field performance based on lab scores.
- Never add analytics or transmit project briefs without an explicitly configured destination and the user's authorization.
