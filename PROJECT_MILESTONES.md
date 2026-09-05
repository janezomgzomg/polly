# Polly — Project Milestones

Stack rationale lives in [`STACK_DECISIONS.md`](./STACK_DECISIONS.md). This file
tracks the build sequence, broken into concrete tasks per milestone. Work
top-to-bottom; the stretch goal at the end is optional.

## 1. Repo scaffold

Goal: an empty-but-working fullstack skeleton, nothing rhythm-related yet.

- [ ] Init pnpm workspace at the repo root (`pnpm-workspace.yaml`, root `package.json`)
- [ ] Scaffold `apps/web` with Vite + React + TypeScript
- [ ] Add Tailwind CSS to `apps/web`
- [ ] Scaffold `apps/api` with the Nest CLI
- [ ] Create `packages/schemas` (its own `package.json` + `tsconfig.json`, `zod` as a dependency)
- [ ] Wire `apps/web` and `apps/api` to depend on `packages/schemas` via the workspace protocol
- [ ] Share root-level ESLint/Prettier/TS config, extended by each package
- [ ] Add Vitest config to `apps/web` (+ React Testing Library) and `apps/api`
- [ ] Add a `GET /health` endpoint in Nest; call it from React on load to confirm the two apps talk to each other
- [ ] Set up GitHub Actions CI: install, lint, typecheck, test on push/PR

## 2. Polymeter engine (frontend-only)

Goal: correct, drift-free polymeter playback with no input handling yet.

- [ ] Define a `Pattern` Zod schema in `packages/schemas` (e.g. `{ id, label, beatsA, beatsB, tempo }`)
- [ ] Add a small fixed pattern library as data (3:4, 5:4, 2:3) validated against the schema
- [ ] Build the Tone.js scheduler: one loop per meter, both driven by a shared `Tone.Transport`
- [ ] Build a visual metronome component — a flash/pulse per meter, in sync with audio
- [ ] Build a pattern + tempo selector UI
- [ ] Manually verify playback stays in sync over a longer run (~60s) at a few tempos

## 3. Keyboard capture + scoring

Goal: score a live practice attempt, client-side only, no backend involved yet.

- [ ] Capture `keydown` timestamps aligned to the Tone/AudioContext clock (not wall-clock `Date.now()`)
- [ ] Define a `BeatResult` schema (`expectedTime`, `actualTime`, `delta`, `hit` | `miss`)
- [ ] Implement the scoring algorithm as a pure function: expected beat times + tap times → accuracy metrics
- [ ] Unit test the scoring function: on-time hits, early, late, missed beats, extra/spurious taps
- [ ] Build a results view: per-meter accuracy, overall score, timing distribution
- [ ] Hold the most recent session result in local component state (no persistence yet)

## 4. Auth

Goal: real accounts, both email+password and Google OAuth.

- [ ] Design the Prisma `User` model (`id`, `email`, `passwordHash` nullable, `googleId` nullable, `createdAt`)
- [ ] Implement signup/login endpoints with bcrypt password hashing
- [ ] Implement a JWT strategy via `@nestjs/passport` + `passport-jwt`
- [ ] Implement Google OAuth via `passport-google-oauth20`, including the callback route
- [ ] Add a `JwtAuthGuard` and protect the routes that need a logged-in user
- [ ] Build signup/login pages in `apps/web` (folder-per-unit), plus a "Sign in with Google" button
- [ ] Add an auth context/hook in React to hold the current user + token
- [ ] Unit test the auth service (hashing/verification, token issuance) and guard behavior

## 5. Persistence

Goal: practice sessions survive across visits and devices.

- [ ] Extend the Prisma schema: `Pattern`, `Session`, `BeatResult`, related to `User`
- [ ] Run the migration (`prisma migrate dev`)
- [ ] `POST /sessions` — save a completed practice session with its beat results
- [ ] `GET /sessions` — list the current user's session history
- [ ] Wire the frontend to POST results after a practice run instead of only keeping local state
- [ ] Build a history page: past sessions, accuracy over time
- [ ] Unit test the sessions service; add an e2e test for the POST/GET round trip against a test database

## 6. Rule-based recommendation

Goal: the app suggests the next session without any AI call yet.

- [ ] Write the heuristic rules (e.g. "accuracy > 90% twice in a row on this pattern → raise tempo"; "consistent drift on the 5-side of 5:4 → repeat at same tempo")
- [ ] Define a `Recommendation` Zod schema (`pattern`, `tempo`, `reason`)
- [ ] `GET /recommendations/next` — apply the heuristic to the user's recent sessions
- [ ] Show a "suggested next session" card in the UI with a one-click start
- [ ] Unit test the heuristic against a range of constructed session histories

## 7. AI-driven recommendation

Goal: swap the heuristic for a real LLM call, same contract.

- [ ] Set up the Gemini API client in Nest (API key via env var, never committed)
- [ ] Build a prompt that summarizes recent session history (patterns, tempos, accuracy, drift direction)
- [ ] Validate Gemini's response against the same `Recommendation` Zod schema used by the rule-based path
- [ ] Fall back to the rule-based recommendation if the AI response fails validation or the call errors
- [ ] Point `/recommendations/next` at the AI path
- [ ] Test with a mocked Gemini client: valid response, malformed response (triggers fallback), API error (triggers fallback)

## 8. Stretch: MIDI controller input

Goal: play beats on a MIDI controller instead of (or alongside) the keyboard.

- [ ] Request Web MIDI access (`navigator.requestMIDIAccess`); handle the unsupported-browser case (no Firefox/Safari support)
- [ ] List connected MIDI input devices and let the user pick one
- [ ] Listen for `noteon` messages and feed their timestamps into the existing scoring pipeline
- [ ] Add an input-source selector (keyboard vs. MIDI) in the UI
- [ ] Unit test the MIDI message parsing (raw message bytes → tap timestamp)
