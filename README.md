# Danvar

Danvar is an independent five-person product design and software engineering
studio. This repository holds the source for our team website: a cinematic,
multilingual (English, Persian, Arabic) introduction to who we are, the
companies our experience comes from, the tools we use, and how to reach us.

**Live demo:** <https://aminazarpey.github.io/danvar/>

## The team

| Member          | Role                          |
| --------------- | ----------------------------- |
| Zahra Arafati   | Product Designer              |
| Parham Hatanian | Mobile Engineer               |
| Amin Azarpey    | Team Lead · Software Engineer |
| Erfan Ehsany    | Software Engineer             |
| Ali Baratloo    | Site Reliability Engineer     |

Five complementary perspectives — product design, web, mobile, backend and
infrastructure — working as one team.

## Tech stack

Next.js (App Router) and TypeScript, with GSAP for motion. Content is
statically generated per locale (`en`, `fa`, `ar`); the site is
production-checked for accessibility (axe), performance (Lighthouse), and
hydration correctness on every change. See `AGENTS.md` for the engineering
guidelines this project follows.

## Running locally

```bash
npm install
npm run dev
```

Then open <http://127.0.0.1:3000/en> (also `/fa` and `/ar`).

- `npm run check` — format, lint and typecheck
- `npm run build` — production build
- `npm run test:preview` — browser verification against the running production server
- `npm run audit:web` / `npm run audit:performance` — accessibility and Lighthouse audits

## Contact

Have a project in mind, spotted a bug, or want to contribute? Email
**aminazarpey@gmail.com**.
