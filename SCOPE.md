# TERP / on the go — Scope

Phase-based. No calendar dates — a phase ships when its exit criteria pass, and the next doesn't start until it does.

**Build target:** a deployed, demonstrable service that proves the guarantee works. Test-mode payments, demo accounts, no real bookings. Structured so going live is the *next step*, not a rewrite.

**The organizing principle:** the product is reliability. Anything that serves "a Deaf person is never left without an interpreter" comes early. Anything that doesn't, waits.

```
Phase 0   Foundation
   │
Phase 1   Core loop + verification gate
   │
Phase 2   Instant alerts + live GPS        ─┐
   │                                        │  These three
Phase 3   Video connection                  │  are the guarantee.
   │                                        │  v2 is not real
Phase 4   The guarantee (backfill,          │  without all three.
          backup, reliability)             ─┘
   │
   ▼   ◀── portfolio v2 ships here
   │
Phase 5   Payments (test mode) + reviews
   │
Phase 6   Real-service readiness
```

---

## Phase 0 — Foundation

Clear the wreckage from v1 and set the contracts everything depends on. No user-visible features. Most likely phase to skip; most costly to skip.

### In scope

- Single canonical Postgres schema per [PRD §9](./PRD.md#9-data-model)
- **Hosted Postgres on Neon**, `main` and `dev` branches; spend limits set before any card is attached
- `.env.example` for both packages; config module validating required vars at boot
- Backend restructure: `routes → controllers → services`, all SQL in services
- Central error handler; consistent `{success, data|error}` envelope
- `verifyToken` + `requireRole` middleware on every protected route
- Delete duplicate frontend components; establish `pages/` vs `components/` boundary
- One axios client from `VITE_API_URL` — remove every raw `fetch` and hardcoded port
- `ProtectedRoute` / `RoleRoute`; `AuthContext`
- **PWA shell**: manifest, service worker, installable, app icon — required for iOS push later
- **Mobile-first design tokens.** One `tokens.css` + Tailwind theme, designed at 375px first. Delete `styles.css`, `App.css`, `HomePage.css`, per-page CSS
- App shell: header, role-aware nav, skip link, focus management, bottom tab bar on mobile
- Vitest set up; `npm test` runs
- Repo hygiene: remove `bcryptjs`, stray `backend/nodemon` and `terp-on-the-go-backend@1.0.0`, debug logs; register or delete `routes/users.js`; lock CORS

> **Deferred decision — migration tooling.** `node-pg-migrate`, Prisma, or numbered SQL files is not yet decided. Phase 0 uses `database_schema.sql` as canonical. Decide before the first schema change after Phase 1 — retrofitting migrations onto live data is much harder. PRD open question 6.

### Exit criteria

- [ ] Neon project with `main` and `dev`; schema applied to both; SSL connection verified
- [ ] `psql "$DATABASE_URL" -f backend/database_schema.sql` runs clean, and every query matches
- [ ] Server refuses to boot on a missing env var, naming it
- [ ] Every PRD §10 endpoint has a route, controller, and service — 501 where unimplemented
- [ ] Zero hardcoded URLs, ports, or coordinates in `frontend/src`
- [ ] `/deaf` with no token redirects to `/login`
- [ ] App installs to an iPhone home screen and launches standalone
- [ ] Every screen usable at 375px
- [ ] `npm test` passes; `npm run lint` clean in both packages

---

## Phase 1 — Core loop + verification gate

The simplest honest version: a Deaf user posts a request, a **verified** interpreter accepts, it completes.

### In scope

- **Auth:** signup with role, login, logout, session persistence
- **Profiles:** both roles; address geocoded; **interpreter face photo required**
- **Credential verification gate (hard):** interpreters submit a national certification; an admin verifies against the [public RID registry](https://myaccount.rid.org/Public/Search/Member.aspx); **no unverified interpreter sees or accepts anything** — enforced server-side. Admin review queue, approve/reject with required note, interpreter status page, daily expiry job
- **Background check flow** — form, consent, status tracking, gate. **Vendor call stubbed** in v2; wired up in Phase 6
- **Create request:** details, timing, duration, language, setting, **visible vs private mode** ([PRD §5.0b](./PRD.md#50b-two-request-modes-visible-and-private))
- **Location privacy from day one:** approximate coordinates before acceptance, exact only to the assigned traveling interpreter
- Deaf dashboard, interpreter dashboard, browse requests, request detail
- Atomic accept with 409 handling; status transitions; requester cancel
- **Live map with the marker system:** **plain solid dots** — blue for Deaf users, red for available interpreters only. No inner detail; legible at phone size. Always-visible legend, 44px tap targets. Paired list view with full information parity. Real geolocation with profile fallback — no hardcoded coordinates
- **The accept flip:** on acceptance an interpreter's dot leaves every other map and becomes visible only to their assigned Deaf user — enforced server-side
- **Direct pick from the map:** tapping a red dot opens a reach-out modal offering **video now** or **send message** to that specific interpreter, with **automatic escalation to broadcast** if they don't answer (60s video / 3min message). Declining carries no reliability penalty
- **Reachability-adaptive contact:** interpreters on weak signal or driving are reachable by **text only**; the Deaf user is told this *before* trying, with the reason stated. Driving never surfaces a video offer. Text requests carry everything needed to accept or reject on one screen
- **Live availability states** (`available` / `on_job` / `offline`) computed server-side with heartbeat staleness, so the map never shows phantom supply
- Loading, empty, and error states everywhere; error boundary per route
- Accessibility pass against PRD A1–A14
- Deployed with seeded demo accounts for all three roles

### Out of scope

Instant alerts (interpreters check the dashboard). Video. Backfill. Reliability scoring. Payments.

**Captured but not enforced:** state licenses, request `setting` as a matching filter.

### Exit criteria

- [ ] Signup → profile → credential submitted → admin verifies → request created → accepted → completed, on the deployed URL, without a developer present
- [ ] An unverified interpreter calling `POST /api/requests/:id/accept` **directly** gets a 403. Tested, not assumed
- [ ] An unverified interpreter is absent from `/api/interpreters/nearby`
- [ ] Every `verified` credential has `verified_by`, `verified_at`, and `verification_note`
- [ ] A private-mode request never exposes exact coordinates to unassigned interpreters — verified by inspecting the API response, not the UI
- [ ] Private-mode requests never render on any map at all
- [ ] Markers are plain solid dots, legible and tappable on a real iPhone held outdoors
- [ ] An interpreter who accepts a job flips to `on_job` automatically and stops receiving alerts
- [ ] **An on-job interpreter's dot is gone from every unassigned user's map, and their coordinates are absent from those users' API responses** — verified on the wire
- [ ] The assigned Deaf user sees that dot live and moving
- [ ] Tapping a red dot offers both video and message contact with that interpreter
- [ ] **An unanswered direct request escalates to broadcast on its own and still gets filled** — tested end to end
- [ ] The escalation countdown is visible, and the user can skip it and broadcast immediately
- [ ] Declining a direct request leaves the interpreter's reliability score untouched
- [ ] A `text_only` interpreter shows a disabled Video button **with a stated reason**, and message still works
- [ ] **Driving mode never surfaces a video offer at any signal strength** — safety test
- [ ] A `text_only` interpreter is not alerted for video-only requests
- [ ] The text request contains enough to accept or reject without asking a follow-up question
- [ ] A phone that goes dark for 5 minutes shows as `offline`, not phantom available supply
- [ ] Two interpreters accepting simultaneously → one winner, one clear 409
- [ ] Every page has designed loading, empty, and error states
- [ ] axe: zero critical/serious violations; Lighthouse Accessibility ≥ 95 every page
- [ ] Keyboard-only walkthrough with no traps
- [ ] Deaf users across a range of ages and tech comfort have walked the flow; feedback logged

---

## Phase 2 — Instant alerts + live GPS

Without this, the one-hour promise is impossible. An interpreter cannot respond to a request they don't know exists.

### In scope

- Socket.IO server, JWT-authenticated; `SocketContext` with reconnect and visible connection state
- **SMS alerts via Twilio — the primary channel.** [iOS web push requires home-screen installation](https://www.mobiloud.com/blog/progressive-web-apps-ios), so SMS is the guarantee and push is the fast path
- Web push for interpreters who have installed the PWA
- Interpreter onboarding: guided "Add to Home Screen" walkthrough, framed as how you get work
- Mandatory phone verification for interpreters
- Live events: `request:created` to nearby interpreters, `request:accepted` to requester, `request:status_changed` to both
- In-app notification center — visual and haptic, never audio-only
- **Live GPS in visible mode:** interpreter location during active requests, 15s throttle, counterparty-only, auto-stops on completion
- Tracking view: interpreter marker, distance, ETA
- Turn-by-turn navigation (OpenRouteService)
- Availability toggle reflected live
- Alert delivery monitoring — undelivered alerts surface as incidents
- REST fallback for every socket-delivered state

### Exit criteria

- [ ] Posting a request delivers an SMS to a nearby verified interpreter within 30 seconds
- [ ] Accepting updates the requester's screen within 2 seconds, no refresh
- [ ] Killing the socket leaves the app fully usable via REST; indicator shows disconnected; reconnects automatically
- [ ] Location sharing stops on `completed` or `cancelled` — verified in the DB and on the wire
- [ ] **Private-mode requests never emit live GPS**
- [ ] Notifications perceivable without sound
- [ ] Accessibility gates pass on new surfaces: live regions announce, no motion-only cues

---

## Phase 3 — Video connection

Video is not a later "remote interpreting" feature. It's first contact, and it's the floor under the guarantee.

### In scope

- Video session opens **the moment an interpreter accepts** — including when they're also traveling
- Interpreting begins over video while the interpreter is en route, continues in person on arrival
- Video-only requests for private mode and for when nobody can travel
- Provider integration (Daily or Twilio — PRD open question 3)
- Waiting room, join links, session timer, reconnect handling
- **Bandwidth degradation preserves video over audio** — the video *is* the language. This inverts a normal call app's default
- Camera/mic permission flow with a clear pre-flight check

### Out of scope

**Session recording — permanently.** Interpreted conversations are medical, legal, and employment matters. Recording creates privacy, consent, and liability exposure with no offsetting benefit.

### Exit criteria

- [ ] Accepting a request opens video for both parties in under 10 seconds
- [ ] Interpreting can start on video and continue in person without a session break
- [ ] Video holds usable quality on a constrained connection; audio degrades first
- [ ] Permission denial is explained and recoverable, not a dead end
- [ ] No session data is written to storage — verified

---

## Phase 4 — The guarantee

Everything so far makes a request *fillable*. This phase makes it *guaranteed*.

### In scope

- **Automatic backfill:** an interpreter cancellation instantly re-broadcasts at elevated priority. The requester sees "finding someone else," never "sorry"
- **Cancellation classification** — `early` / `late` / `last_minute` / `no_show` / `excused`, with reason capture
- **Pre-assigned backup** for high-stakes requests (medical, legal, employment): standby assigned at acceptance, activated automatically if the primary drops
- **Video auto-fallback:** if no in-person interpreter is secured in time, offer video immediately
- **Reliability scoring:** per-interpreter, recency-weighted, visible to them with a plain explanation of the calculation
- **Graduated enforcement:** warning → reduced priority → suspension → removal. Transparent at every step, never silent
- Appeals path; `excused` classification for genuine emergencies
- Requester-side cancellation tracking (symmetry — interpreters lose income too)
- `unfulfilled` status and an admin review flow for every occurrence

### Exit criteria

- [ ] A staged interpreter cancellation triggers re-broadcast within 5 seconds, and the requester's screen shows the recovery state, not a failure
- [ ] A high-stakes request has a backup assigned at acceptance; primary cancellation activates them automatically
- [ ] With no in-person interpreter available, the requester is offered video without asking
- [ ] Reliability score is visible to the interpreter with an explanation they can act on
- [ ] Enforcement never happens silently — every consequence is communicated
- [ ] `unfulfilled` requests are logged and reviewable
- [ ] End-to-end demo: request → accept → cancel → auto-backfill → complete, with no human intervention

**Portfolio v2 ships here.** The guarantee is demonstrable.

---

## Phase 5 — Payments (test mode) + reviews

### In scope

- Stripe Connect onboarding for interpreters; **75/25 split** ([PRD §7](./PRD.md#7-money))
- Three payer types: `self_pay`, `vr_agency`, `grant` — with authorization references
- Cost estimate at request time; hold on accept, capture on completion
- Late-cancellation fees, both directions
- Backup interpreter compensation for holding a slot
- Interpreter earnings dashboard
- Post-completion reviews, 1–5 plus comment; public interpreter profiles
- Report/flag flow with admin queue

**All in Stripe test mode.** No real money in v2.

### Exit criteria

- [ ] Full booking with a test-mode charge, split, and payout
- [ ] A `vr_agency` request records its authorization reference and bills separately from the requester
- [ ] Ratings visible on every interpreter card; one review prompt per completed request

---

## Phase 6 — Real-service readiness

Everything required before a real Deaf person depends on this. Not portfolio work — launch work.

- **Live background check vendor** (Checkr/Sterling/Accurate) replacing the Phase 1 stub, with FCRA-compliant disclosure, consent, and adverse-action process
- **ACCES-VR vendor application** — a procurement process, not code. [Approved-vendor status](https://www.acces.nysed.gov/vr/sign-language-interpreter-referral-service-procedures) is required before VR money moves. **Start this early; it runs in parallel and is measured in months**
- Live Stripe; real payouts; tax reporting (1099s)
- State license enforcement for states requiring it
- Setting-based matching — medical, legal, and mental-health requests reach only appropriately credentialed interpreters
- Terms of service, privacy policy, liability review by an actual lawyer
- Interpreter supply recruiting sufficient to honor 24/7 coverage
- Incident response process for the first time the guarantee fails

### Exit criteria

- [ ] Coverage data shows no hour with zero available interpreters in the launch market
- [ ] A lawyer has reviewed the guarantee language, terms, and liability position
- [ ] Background checks run against a real vendor with a compliant adverse-action path
- [ ] There is a written answer to "what happens when we fail?"

---

## Deferred beyond v2

- Recurring bookings and availability calendars
- Institutional accounts — one payer, many requesters, consolidated invoicing
- Calendar export (`.ics`)
- Team interpreting for long assignments (PRD open question 10)
- Expansion beyond the launch metro

---

## Permanently out of scope

- **Spoken-language interpreting** — signed language only. Different supply, different credentialing, different product
- Automated / AI sign language translation
- **Recording interpreted sessions** — privacy, consent, and liability, with no offsetting benefit
- An agency-facing admin console
- Native iOS/Android apps (revisit only if PWA limits prove blocking)
- Running background checks ourselves rather than through a licensed vendor
- Issuing or adjudicating credentials — we verify against the issuing body, we are not a credentialing authority

---

## Phase gate rule

No work begins on Phase N+1 until every exit-criteria box in Phase N is checked. If an item slips, it gets cut or the phase doesn't close — it does **not** carry forward silently. That carry-forward is exactly how v1 ended up with two dashboards and four styling systems.

**One exception:** the ACCES-VR vendor application (Phase 6) should start during Phase 1. It's paperwork with a long lead time and no code dependency, and waiting until Phase 6 to begin would idle the whole project.
