# Polly

A browser app that listens to your MIDI controller input (starting with keyboard input) and
helps you practice polymeter rhythms, adapting your next practice session based
on how the current one went.

This project exists primarily as a fullstack learning exercise — the stack was
chosen to maximize transferable skills (real data modeling, auth, an actual LLM
integration, precise audio timing) while keeping deployment low-friction.

## Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Timing / audio | Tone.js |
| Backend | NestJS (TypeScript) |
| Auth | Email + password, plus Google OAuth via `@nestjs/passport` |
| Database | PostgreSQL |
| ORM | Prisma |
| Shared types | npm workspaces monorepo, `packages/schemas` (Zod) |
| AI suggestions | Gemini API |
| Testing | Vitest + React Testing Library, colocated per unit |
| Deployment | Netlify (frontend), Railway (backend + Postgres) |

## Why these choices

### React + Vite + TypeScript + Tailwind
Fast dev loop with no framework-level routing/rendering complexity. This app only requires a plain SPA. Vite keeps the frontend simple.

### Tone.js
Precise rhythm playback needs sample-accurate scheduling (`AudioContext.currentTime` lookahead scheduling), not `setTimeout`, which drifts and gets throttled in background tabs. Tone.js wraps this scheduling in a much friendlier API (loops, transport, synths) so the project can move faster while still exercising the underlying Web Audio concepts through Tone's abstractions.

### NestJS
While Express is the most widely used Node framework, NestJS has become the default choice for new enterprise Node services in 2026. Its module/DI/decorator patterns map closely to patterns used in larger backend codebases (Angular, Spring).

### Auth: email+password + Google OAuth
`@nestjs/passport` is the idiomatic Nest way to do auth (strategies + guards). It uses real auth concepts while following the framework's own conventions. Google OAuth uses the OAuth2 authorization-code flow.

### PostgreSQL + Prisma
The data model is genuinely relational — users, patterns, practice sessions, and per-beat timing results — so a real SQL database earns its place. Prisma was chosen over Drizzle for its migration workflow and documentation, and because it's the more common pairing alongside a structured framework like NestJS. Drizzle (closer to raw SQL, pairs natively with Zod) remains a reasonable alternative if the ORM ever needs revisiting.

### Shared Zod schemas in an npm workspace
Keeping frontend and backend in one monorepo with a shared `packages/schemas` package means the shape of a `Pattern`, `Session`, or `BeatResult` is defined exactly once and validated identically on both client and server — extending the "Zod as source of truth" convention across the client/server boundary instead of duplicating or manually syncing types across two repos. npm workspaces was chosen over pnpm specifically to avoid adding a tool that isn't already bundled with Node. pnpm's main advantages of disk efficiency and stricter dependency resolution matter more at a scale this project won't reach.

### Gemini API for AI-driven suggestions
Anthropic's Claude API has no permanent free tier (only occasional, non-guaranteed trial credits), while Google's Gemini 2.5 Pro is free indefinitely via Google AI Studio (1M token context, 100 requests/day, no card required) — comfortably enough for one recommendation call per practice session. The actual learning content here — calling an LLM with structured context and validating its response against a Zod schema — is identical regardless of provider, so Gemini was chosen purely to avoid a recurring bill on this project.

### Netlify + Railway
The frontend is a static SPA, so either Netlify or Vercel would work; Netlify was chosen for its more generous free tier and included extras (form handling, identity), since Vercel's main advantage (faster edge delivery for SSR/Next.js) doesn't apply to a plain Vite build. GitHub Pages was considered but ruled out even for the frontend in favor of Netlify's smoother SPA routing and preview deploys. The backend can't live on GitHub Pages (no server runtime) or Netlify Functions without awkwardly adapting Nest to a serverless entry point, so it needs a host that runs a persistent Node process with a real Postgres connection. Railway was chosen for the lowest-friction path to a working deployment.

### Vitest + React Testing Library, colocated
Uses the project convention of colocating tests per unit. The scoring/timing logic in particular (turning raw keypress timestamps into an accuracy score against an expected beat grid) is a clean, pure-function target for unit tests.
