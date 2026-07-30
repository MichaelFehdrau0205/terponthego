# TERP / on the go — Build Plan

Phase-based milestones, no fixed dates. Work top to bottom; a ticket is done only when its acceptance criteria pass.

**Ticket sizing:** S ≈ half a session · M ≈ one session · L ≈ two or more sessions. If an L can't be split, it's probably under-specified.

**Definition of Done (every ticket):**
- Acceptance criteria met
- No console errors or warnings
- Keyboard-operable, labeled, visible focus
- Loading / empty / error states handled where applicable
- `npm run lint` clean
- Committed with a message describing the change, not the file

---

## Milestone 0 — Foundation

Goal: the codebase can be built on. No user-visible features.

| ID | Ticket | Size | Blocked by |
|---|---|---|---|
| F-00 | Provision Neon: create project, `main` + `dev` branches, set spend limit, pull connection strings | S | — |
| F-01 | Write canonical schema (`users`, `profiles`, `credentials`, `requests`, `cancellations`, `reviews`) per PRD §9; apply to both Neon branches | M | F-00 |
| F-01b | Verify SSL connection from the local `pg` Pool to Neon (`sslmode=require`) | S | F-00 |
| F-02 | Config module: load and validate env vars, fail loudly at boot; commit `.env.example` for both packages | S | — |
| F-03 | Restructure backend into `routes → controllers → services`; move all SQL into services | L | F-01 |
| F-04 | Central error handler + `{success, data\|error}` envelope + error code constants | M | F-03 |
| F-05 | Rewrite `authController` against the new schema (single `users` table, `role` column) | M | F-01, F-03 |
| F-06 | `verifyToken` + `requireRole` middleware; apply to every protected route | M | F-05 |
| F-07 | Stub every PRD §10 endpoint (501 where unimplemented) so the contract is verifiable | M | F-03 |
| F-08 | Vitest setup; first tests on the auth service | M | F-05 |
| F-09 | Delete duplicate frontend components (`components/DeafDashboard`, `InterpreterDashboard`, `CreateRequestForm`, `ViewRequestsPage`, `LoginForm`, `LoginPage`, `DeafSignupForm`, `InterpreterSignupForm`) | S | — |
| F-10 | Single axios client in `lib/api.js` from `VITE_API_URL`, matching PRD §10 exactly; remove all raw `fetch` and hardcoded ports | M | F-07, F-09 |
| F-11 | `AuthContext` — login, logout, current user, token refresh on load | M | F-10 |
| F-12 | `ProtectedRoute` + `RoleRoute`; replace the empty `PrivateRoute.jsx` | S | F-11 |
| F-13 | Rewrite `App.jsx` route table: every page reachable, no duplicate paths, no unused imports | S | F-12 |
| F-14 | **Mobile-first** design tokens (`tokens.css` + Tailwind theme), designed at 375px first: color, type scale, spacing, radius, shadow, focus ring. Delete `styles.css`, `App.css`, `styles/HomePage.css`, per-page CSS | L | — |
| F-15 | App shell: header, role-aware nav, **bottom tab bar on mobile**, skip link, focus moved to `<h1>` on route change | M | F-14 |
| F-16 | **PWA shell:** manifest, service worker, app icon, installable, offline shell. Required before iOS push in M2 | M | F-15 |
| F-17 | Repo hygiene: drop `bcryptjs`, delete `backend/nodemon` and `backend/terp-on-the-go-backend@1.0.0`, strip debug logs, register or delete `routes/users.js`, lock CORS | S | — |

**Exit:** [SCOPE.md — Phase 0](./SCOPE.md#exit-criteria).

---

## Milestone 1 — Core loop + verification gate

Goal: full request lifecycle works end to end on a deployed URL, with a hard credential gate.

### 1A · Auth & profile

| ID | Ticket | Size | Blocked by |
|---|---|---|---|
| A-01 | Signup page: role selection → form → account created → redirected to profile setup | M | F-13 |
| A-02 | Login page: email + password, role-based redirect, inline error handling | M | F-13 |
| A-03 | Logout from the app shell; clears token and context | S | F-11 |
| A-04 | `GET /api/auth/me` + profile-completeness gate (incomplete profile → forced to setup) | M | F-05 |
| A-05 | Deaf profile setup: address, unit, city, state, ZIP, preferred language, access notes | M | A-01 |
| A-06 | Interpreter profile setup: address, languages, service radius, bio, **face photo (required)** | M | A-01 |
| A-07 | Photo upload to object storage — never a blob in Postgres (Neon 0.5 GB ceiling) | M | A-06 |
| A-08 | Server-side geocoding of address → lat/lng on profile save | M | A-05, A-06 |
| A-09 | Profile edit page reusing the setup forms | S | A-05, A-06 |

### 1V · Credential + background gate

Blocks all of 1B for interpreters. **Build this before the accept flow, not after** — retrofitting a gate onto a working accept path is how gates end up client-side only.

| ID | Ticket | Size | Blocked by |
|---|---|---|---|
| V-01 | `credentials` table + `profiles.verification_status` + `background_check_status`; add `admin` to the role enum | S | F-01 |
| V-02 | `POST /api/credentials` — submit credential (type, number, issuing body, issue/expiry dates) with validation | M | V-01 |
| V-03 | Credential submission step in interpreter onboarding, with plain-language copy on what gets checked | M | V-02 |
| V-04 | `GET /api/credentials` + interpreter-facing status view: pending / verified / rejected with reason | M | V-02 |
| V-05 | **`requireVerifiedInterpreter` middleware** — 403 `INTERPRETER_NOT_VERIFIED`. Applied to `/requests/pending`, `/requests/:id/accept`, and inclusion in `/interpreters/nearby` | M | V-01 |
| V-06 | Admin review queue: `GET /api/admin/credentials?status=pending` + `requireRole('admin')` | M | V-01 |
| V-07 | Admin review page: submission details, link out to the RID registry lookup, approve/reject with a **required** note | L | V-06 |
| V-08 | Pending-verification dashboard state for interpreters — explains status, no request access, no dead end | M | V-04 |
| V-09 | Daily expiry job: expired credentials → `expired`; owners with no valid credential → `pending` | M | V-01 |
| V-10 | Expiry warning notifications at 60 and 30 days | S | V-09 |
| V-11 | Verification badge component — states credential type and verification date, never a bare "Verified" | S | V-05 |
| V-12 | **Gate tests:** unverified interpreter is 403'd on accept and on pending-list, is absent from nearby results, and cannot be reinstated by client-side tampering | M | V-05 |
| V-13 | Background check flow: consent form, FCRA-compliant disclosure copy, status tracking, gate on `cleared`. **Vendor call stubbed** — wired live in M6 | L | V-01 |
| V-14 | Seed one admin account and one fully-cleared interpreter for demo purposes | S | V-01 |

### 1B · Requests

| ID | Ticket | Size | Blocked by |
|---|---|---|---|
| B-01 | `POST /api/requests` + validation service (includes `setting` and `visibility_mode`) | M | F-03 |
| B-02 | Create Request page: all fields, now-vs-scheduled toggle, setting selector, **visible-vs-private mode selector**, inline validation, success redirect | L | B-01 |
| B-03 | **Location privacy layer:** store fuzzed `approx_*` coordinates alongside exact; API returns approximate to unassigned interpreters, exact only to the assigned traveling one | M | B-01 |
| B-04 | `GET /api/requests/mine` with status filter | S | B-01 |
| B-05 | Deaf dashboard: requests grouped by status, empty state, create CTA | L | B-04 |
| B-06 | `GET /api/requests/pending` with haversine distance and radius filter, **behind `requireVerifiedInterpreter`** | M | A-08, V-05 |
| B-07 | Interpreter dashboard: nearby pending requests sorted by distance, plus today's accepted jobs | L | B-06 |
| B-08 | `POST /api/requests/:id/accept` — atomic conditional update, 409 on loss, **403 if unverified** | M | B-06, V-05 |
| B-09 | Accept UI: optimistic action, confirmation, graceful 409 message | M | B-08 |
| B-10 | `PATCH /api/requests/:id/status` — `in_progress` / `completed`, transition validation | M | B-08 |
| B-11 | `PATCH /api/requests/:id/cancel` + cancel UI with confirmation | S | B-04 |
| B-12 | Request Detail page: full info, counterparty card, status timeline, role-appropriate actions | L | B-08 |

### 1C · Map & contact

| ID | Ticket | Size | Blocked by |
|---|---|---|---|
| C-01 | `useGeolocation` hook: permission request, profile-address fallback, no hardcoded coords | M | A-08 |
| C-02 | `GET /api/interpreters/nearby` with distance — **verified interpreters only** | M | A-08, V-05 |
| C-03 | Shared `<Map>` component: tiles, accessible marker names, popup cards, clustering | L | C-01 |
| C-04 | **`<MapMarker>` system** — **plain solid dots only**: blue = Deaf user, red = available interpreter. No inner circle, hole, icon, or pin shape. ~16px visual, 44px tap target. One implementation, used everywhere | M | C-03 |
| C-05 | **`<MapLegend>`** — always visible, never behind an info button | S | C-04 |
| C-06 | **Privacy rendering:** private-mode requests never render; visible-mode requests render as fuzzy ~½mi circles until accepted. Fuzzing computed server-side | M | C-04, B-03 |
| C-07 | **The accept flip:** on acceptance, remove the interpreter's dot from all other users' maps; render it live **only** for the assigned Deaf user. Enforced server-side — unassigned users never receive those coordinates | M | C-04, B-08 |
| C-08 | `availability_state` service: auto `on_job` on accept, auto `available` on complete, heartbeat with 5-minute staleness → `offline` | M | B-08 |
| C-09 | Availability counts as text — "2 available nearby · 3 more on jobs" — replacing busy-interpreter markers | S | C-08 |
| C-10 | Paired `<NearbyList>` — full information parity with the map (PRD A6) | M | C-02 |
| C-11 | Verify list-view parity carries the colorblind fallback — role is never map-only information | S | C-04, C-10 |
| C-12 | Verify marker legibility on a **real iPhone, outdoors, one-handed** — not a desktop browser at 375px | S | C-04 |
| C-13 | Find Interpreters page: map + list toggle, available-count above both views, distance and credential shown | M | C-03, C-10 |
| C-14 | **Reach-out modal** on tapping a red dot: large face photo, distance/ETA, credential, reliability, and two actions — **Video now** and **Send message** | L | C-13 |
| C-15 | Direct request API: `origin='direct'`, `targeted_interpreter_id`, `direct_expires_at` | M | B-01 |
| C-16 | Interpreter-side direct request: incoming video ring / message, accept or decline | L | C-15 |
| C-17 | **Auto-escalation job:** unanswered direct request goes broadcast at expiry — 60s video, 3min message | M | C-15 |
| C-18 | Escalation UI: visible countdown, plain status copy, "ask everyone now" skip button | M | C-17 |
| C-19 | Declining a direct request applies **no reliability penalty** — enforced in the scoring service | S | C-16 |
| C-20 | **Escalation test:** direct request with no response reaches broadcast automatically and still fills | M | C-17 |
| C-21 | **Reachability service:** derive `full` / `text_only` / `unreachable` from socket heartbeat latency, drops, and failed deliveries. **Not** `navigator.connection` — unavailable on iOS Safari | L | C-08 |
| C-22 | Manual "I'm driving" and "low signal" toggles on the interpreter dashboard; driving **forces** `text_only` | M | C-21 |
| C-23 | Modal adapts to reachability: Video disabled **with a stated reason**, message offered instead | M | C-14, C-21 |
| C-24 | Text request payload carries everything needed to decide on one screen — what, where, when, duration, setting, language, distance, pay | M | C-15 |
| C-25 | Interpreter accept/reject on a text request; **reject applies no reliability penalty** | M | C-24, C-19 |
| C-26 | Matching rule: `text_only` interpreters are **not** alerted for video-only requests | S | C-21 |
| C-27 | **Safety test:** driving mode never surfaces a video offer, at any signal strength | S | C-22 |

### 1D · Quality & ship

| ID | Ticket | Size | Blocked by |
|---|---|---|---|
| D-01 | Loading / empty / error state components applied to every page | M | 1A–1C |
| D-02 | Error boundary per route with a recovery action | S | F-13 |
| D-03 | Accessibility pass: axe on every page, fix all critical and serious findings | L | 1A–1C |
| D-04 | Keyboard-only walkthrough of the full loop; log and fix every trap | M | D-03 |
| D-05 | Service tests: auth, request creation, accept-race, status transitions, **verification gate** | L | B-10, V-12 |
| D-06 | Copy review: every verification string states what was checked; nothing implies competence the platform hasn't verified | S | V-11 |
| D-07 | Seed script: demo accounts per role (incl. admin and a cleared interpreter), realistic NYC data, run against Neon `main` | S | F-01, V-14 |
| D-08 | Deploy: API to Railway (root `backend/`), frontend to Vercel, `DATABASE_URL` → Neon `main`, all env vars set | M | D-01 |
| D-09 | Lock CORS to the Vercel origin; confirm the API rejects requests from other origins | S | D-08 |
| D-10 | Confirm spend limits are active on Neon and Railway; note baseline usage after one week | S | D-08 |
| D-11 | Deaf user testing on the deployed build, across ages and tech comfort; feedback logged as issues | M | D-08 |

**Exit:** [SCOPE.md — Phase 1](./SCOPE.md#exit-criteria-1).

---

## Milestone 2 — Instant alerts + live GPS

Goal: an interpreter learns about a nearby request within seconds, without checking anything. The one-hour promise is impossible without this.

| ID | Ticket | Size | Blocked by |
|---|---|---|---|
| R-01 | Socket.IO server mounted on the Express HTTP server; JWT handshake auth | M | M1 |
| R-02 | Room strategy: `user:{id}` and nearby-interpreter broadcast rooms | M | R-01 |
| R-03 | `SocketContext` with reconnect/backoff and a visible connection indicator | M | R-01 |
| R-04 | **Twilio SMS alerts to nearby verified interpreters on request creation — the primary channel** | L | R-02 |
| R-05 | Mandatory phone verification for interpreters (SMS code) | M | — |
| R-06 | Web push for interpreters who installed the PWA | L | F-16 |
| R-07 | "Add to Home Screen" onboarding walkthrough, framed as how you get work | M | R-06 |
| R-08 | Alert delivery monitoring — undelivered alerts surface as incidents, not silent failures | M | R-04 |
| R-09 | `request:created` → nearby interpreters; list updates live | M | R-02 |
| R-10 | `request:accepted` → requester sees interpreter photo, name, credential | M | R-02 |
| R-11 | `request:status_changed` → both parties update | M | R-02 |
| R-12 | Notification center: visual + haptic, unread badge, `aria-live` | L | R-03 |
| R-13 | Interpreter location publishing: 15s throttle, active requests only, **visible mode only**, auto-stop on completion | M | R-02 |
| R-14 | Tracking page: live marker, distance, ETA, arrival state. **Staleness is stated explicitly** — "Last updated 3 minutes ago" — never a frozen dot implying all is well | L | R-13 |
| R-15 | **Privacy test:** an unassigned Deaf user's API response contains no coordinates for an on-job interpreter. Verified on the wire, not the screen | M | C-07 |
| R-16 | **Privacy test:** private-mode requests emit zero live GPS — verified on the wire | M | R-13 |
| R-17 | Turn-by-turn navigation (OpenRouteService) | L | R-13 |
| R-18 | Availability toggle reflected live | M | R-03 |
| R-19 | REST fallback verification: disable sockets, confirm every screen works | M | R-09–R-18 |
| R-20 | Accessibility pass: live regions, `prefers-reduced-motion`, no motion-only cues | M | R-12, R-14 |

**Exit:** [SCOPE.md — Phase 2](./SCOPE.md#exit-criteria-2).

---

## Milestone 3 — Video connection

Goal: interpreting starts the moment someone accepts — before they arrive.

| ID | Ticket | Size | Blocked by |
|---|---|---|---|
| V2-01 | Provider decision + spike: Daily vs Twilio vs raw WebRTC (PRD open question 3) | M | — |
| V2-02 | Session creation on accept; both parties get a join path | L | V2-01, M2 |
| V2-03 | Video room UI: self view, remote view, controls, mobile-first at 375px | L | V2-02 |
| V2-04 | Camera/mic pre-flight permission check with recoverable denial | M | V2-03 |
| V2-05 | **Interpreting continues over video while the interpreter travels**, then transitions to in-person without a session break | M | V2-02 |
| V2-06 | Video-only requests (private mode, or nobody can travel) | M | V2-02 |
| V2-07 | **Bandwidth degradation preserves video over audio** — invert the normal priority | L | V2-03 |
| V2-08 | Waiting room + session timer + reconnect handling | M | V2-03 |
| V2-09 | Verify no session data is persisted anywhere | S | V2-02 |

**Exit:** [SCOPE.md — Phase 3](./SCOPE.md#exit-criteria-3).

---

## Milestone 4 — The guarantee

Goal: an interpreter cancelling is a non-event for the Deaf user. **This is the product.**

| ID | Ticket | Size | Blocked by |
|---|---|---|---|
| G-01 | `cancellations` table + classification logic (`early`/`late`/`last_minute`/`no_show`/`excused`) | M | F-01 |
| G-02 | Interpreter cancel flow: reason required, **consequence shown before confirming** | M | G-01 |
| G-03 | **Automatic backfill** — cancellation instantly re-broadcasts at elevated priority | L | G-01, M2 |
| G-04 | Requester recovery UI: "finding someone else" with live status — never a bare failure | M | G-03 |
| G-05 | Backfill metrics: success rate and duration recorded per cancellation | S | G-03 |
| G-06 | `is_high_stakes` derivation from `setting`; backup interpreter assignment at acceptance | M | G-01 |
| G-07 | Backup activation: primary drops → backup promoted automatically, both notified | L | G-06 |
| G-08 | **Video auto-fallback** — no in-person interpreter secured in time → offer video | L | G-03, M3 |
| G-09 | Reliability scoring service: recency-weighted, recomputed on each cancellation | L | G-01 |
| G-10 | Interpreter-facing reliability page — score, history, **plain explanation of the calculation** | M | G-09 |
| G-11 | Graduated enforcement: warning → reduced priority → suspension → removal, never silent | L | G-09 |
| G-12 | Appeals flow + admin `excused` reclassification | M | G-11 |
| G-13 | Requester-side cancellation tracking (symmetry) | M | G-01 |
| G-14 | `unfulfilled` status + admin review queue for every occurrence | M | G-03 |
| G-15 | **End-to-end guarantee test:** request → accept → cancel → auto-backfill → complete, no human intervention | L | G-03–G-08 |
| G-16 | Demo script: staged cancellation that visibly recovers, for the portfolio walkthrough | S | G-15 |

**Exit:** [SCOPE.md — Phase 4](./SCOPE.md#exit-criteria-4). **Portfolio v2 ships here.**

---

## Deferred milestones

Detailed in [SCOPE.md](./SCOPE.md). Not ticketed until the preceding milestone closes.

- **Milestone 5 — Payments (test mode) + reviews:** Stripe Connect, 75/25 split, three payer types, cost estimates, earnings dashboard, ratings
- **Milestone 6 — Real-service readiness:** live background-check vendor, ACCES-VR vendor status, live Stripe, state-license enforcement, setting-based matching, legal review, supply recruiting

> **Start the ACCES-VR vendor application during Milestone 1.** It's paperwork with a months-long lead time and no code dependency. Waiting until Milestone 6 idles the whole project.

---

## Working agreements

- **One ticket at a time.** No parallel half-finished branches — that's how v1 ended up with two of everything.
- **Contract before implementation.** Endpoint shape agreed (PRD §10) before either side is built.
- **Delete aggressively.** Dead code, unused imports, commented-out blocks go immediately. Git remembers.
- **Accessibility is not a milestone.** It's part of Done on every ticket; D-03 and R-20 are audits, not the first time it gets considered.
- **Gates are server-side or they don't exist.** The verification check lives in middleware. Hiding a button is UX; it is not enforcement. V-12 exists to prove this by attacking the API directly.
- **Never display an unverified claim as verified.** If the platform hasn't checked it, the UI either hides it or labels it "self-reported."
- **Privacy is tested on the wire, not in the UI.** B-03, R-15, and R-16 verify that exact coordinates never leave the server for unassigned viewers. Looking at the screen proves nothing.
- **Mobile first, literally.** Build every screen at 375px before widening. Both users are on phones, in the field, often one-handed and under stress.
- **The guarantee is the product.** When a Milestone 4 ticket competes with polish elsewhere, the guarantee wins.
- **Design decisions get made once.** Tokens land in F-14 and don't get relitigated per page. v1 changed themes three times.
- **If a ticket grows past its size, stop and split it.** Log the new tickets rather than pushing through.
