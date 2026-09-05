# Polly

Practice polymeter rhythms in the browser, starting with keyboard input and
working up to a MIDI controller. Polly scores each practice session and
suggests what to practice next based on how you did.

This is a personal fullstack learning project — see [`STACK_DECISIONS.md`](./STACK_DECISIONS.md)
for the stack and why each piece was chosen, and [`PROJECT_MILESTONES.md`](./PROJECT_MILESTONES.md)
for the build plan.

## Development

```bash
npm install       # also builds the shared schemas package
npm run dev:api   # NestJS on http://localhost:3000
npm run dev:web   # Vite on http://localhost:5173
```

```bash
npm run lint      # oxlint across all workspaces
npm test          # unit tests across all workspaces
npm run test:e2e  # NestJS e2e tests
npm run build     # build schemas, then web, then api
```

If you change `packages/schemas`, rebuild it (`npm run build -w schemas`)
before the change is picked up by `apps/web` or `apps/api`.

## Status

Milestone 1 (repo scaffold) complete — an npm workspace with `apps/web`,
`apps/api`, and `packages/schemas`, wired end-to-end through a health check,
with lint/test/build passing in CI. See `PROJECT_MILESTONES.md` for what's
next.
