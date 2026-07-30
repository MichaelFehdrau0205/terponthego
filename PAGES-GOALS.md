# TERP / on the go — Pages & Goals

One spec per page. Each page has exactly **one** component file, exactly one job, and explicit acceptance criteria. This document is the contract that prevents v1's duplicate-dashboard problem from recurring.

---

## Route map

| Route | Page component | Access | Phase |
|---|---|---|---|
| `/` | `pages/shared/Landing.jsx` | public | 1 |
| `/signup` | `pages/auth/Signup.jsx` | public only | 1 |
| `/login` | `pages/auth/Login.jsx` | public only | 1 |
| `/onboarding/profile` | `pages/auth/ProfileSetup.jsx` | any auth | 1 |
| `/onboarding/credentials` | `pages/interpreter/SubmitCredentials.jsx` | interpreter | 1 |
| `/interpreter/verification` | `pages/interpreter/VerificationStatus.jsx` | interpreter | 1 |
| `/admin/credentials` | `pages/admin/CredentialQueue.jsx` | admin | 1 |
| `/deaf` | `pages/deaf/Dashboard.jsx` | deaf | 1 |
| `/deaf/request/new` | `pages/deaf/CreateRequest.jsx` | deaf | 1 |
| `/deaf/interpreters` | `pages/deaf/FindInterpreters.jsx` | deaf | 1 |
| `/interpreter` | `pages/interpreter/Dashboard.jsx` | interpreter | 1 |
| `/interpreter/requests` | `pages/interpreter/BrowseRequests.jsx` | interpreter | 1 |
| `/requests/:id` | `pages/shared/RequestDetail.jsx` | request parties | 1 |
| `/profile` | `pages/shared/Profile.jsx` | any auth | 1 |
| `/requests/:id/track` | `pages/shared/TrackRequest.jsx` | request parties | 2 |
| `/notifications` | `pages/shared/Notifications.jsx` | any auth | 2 |
| `/requests/:id/session` | `pages/shared/VideoSession.jsx` | request parties | 3 |
| `/interpreter/reliability` | `pages/interpreter/Reliability.jsx` | interpreter | 4 |
| `/requests/:id/cancel` | `pages/shared/CancelRequest.jsx` | request parties | 4 |
| `/interpreters/:id` | `pages/shared/InterpreterProfile.jsx` | any auth | 5 |
| `*` | `pages/shared/NotFound.jsx` | public | 1 |

**Every page is designed at 375px first.** Both parties use this on a phone, in the field, often one-handed and under stress. Desktop is the adaptation, not the baseline.

**Redirect rules**

- Not authenticated + protected route → `/login?next=<path>`
- Authenticated + `/login` or `/signup` → own dashboard
- Authenticated + incomplete profile → `/onboarding/profile` (only `/profile` and logout escape)
- Interpreter + complete profile + **no credential submitted** → `/onboarding/credentials`
- Interpreter + credential submitted but not verified → dashboard in its pending state; `/interpreter/requests` redirects to `/interpreter/verification`
- Wrong role for the route → own dashboard with an explanatory message
- After login → `next` param if present, otherwise `/deaf`, `/interpreter`, or `/admin/credentials` by role

> **These redirects are convenience, not security.** The server enforces the verification gate independently via `requireVerifiedInterpreter`. An interpreter who edits their client state still gets a 403 from the API.

---

## The live map — marker system

One visual language, used identically on every map in the product. Defined once here so it never drifts (v1 had interpreters rendered green on one screen and red on another).

### Marker semantics

Two markers. Both plain solid dots. Nothing inside them.

| Who | Marker |
|---|---|
| **Deaf user / request** | **Solid blue dot** |
| **Interpreter (available)** | **Solid red dot** |

**No inner circles, no holes, no teardrop pins, no icons inside.** At phone size a marker with an inner shape turns to mush — the detail is smaller than the eye can resolve on a 375px screen held at arm's length, often outdoors, often in a hurry. A flat filled dot is legible at every size and on every screen.

Rules:

- Solid fill, one flat color, no gradient, no shadow, no stroke
- Roughly 16px visual diameter, **44×44px tap target** — the touch area is bigger than the dot, always
- Your own position: same dot, plus a thin outer ring so you can find yourself
- No animation except the en-route dot, which may move

**On color as the only differentiator.** This drops the shape channel, so role is carried by hue alone. Blue vs. red is one of the more robust pairs — it survives the common red-green deficiencies far better than, say, red vs. green would. The remaining gap is covered by the two things that were already required: **the paired list view carries 100% of the same information** (PRD A6), and **every dot has a spoken label** ("Interpreter, 0.4 miles away, available now"). A user who can't distinguish the hues is not blocked; they use the list.

### Availability — who appears at all

There is no dimming, hollowing, or greying. A red dot on the map means **one thing**: an interpreter who can take a job right now.

| Interpreter state | What renders on the public map |
|---|---|
| **Available** | **Solid red dot.** Tappable, requestable |
| **On a job** | **Nothing.** Removed from the public map entirely |
| **Offline** | **Nothing** |

**The accept flip.** The moment an interpreter accepts a request, their dot disappears for everyone else and reappears — live and moving — **only for their assigned Deaf user**, who follows it to the meeting location.

```
BEFORE ACCEPT                          AFTER ACCEPT
─────────────────                      ─────────────────
Every nearby Deaf user                 Gone from the public map
sees a solid red dot                   Visible only to the assigned
                                       Deaf user, as a live moving
                                       dot they follow to the location
```

Three things this gets right:

1. **No misleading supply.** Every red dot is a real, actionable option. A user never taps a dot and finds out that person is busy.
2. **Interpreter location privacy.** While working, an interpreter's position is shared with exactly one person — the one they're helping — and nobody else. Strangers can't watch an interpreter move around the city.
3. **Tracking is a trust mechanism.** After repeated cancellations elsewhere, the assigned user's real question is *"are they actually coming?"* — not *"where are they?"* Watching the dot move closer is a promise being kept in real time. That makes this a reliability feature, and it sets a hard requirement: **a stale dot reads as abandonment.** If updates stop, say so — *"Last updated 3 minutes ago"* — never leave a frozen dot implying all is well.

**Preserving the useful context without the dots.** Knowing "supply exists but is momentarily busy" is genuinely different from an empty map — it tells you whether to wait or switch to video. So that information appears as **text, not markers**:

> 2 interpreters available nearby · 3 more currently on jobs

A number conveys it without exposing anyone's position.

### Privacy rendering — non-negotiable

This is where the map intersects [PRD §5.0b](./PRD.md#50b-two-request-modes-visible-and-private). Getting it wrong exposes people's homes.

| Situation | What renders | Who can see it |
|---|---|---|
| Request in **private mode** | **Nothing, ever** | Nobody |
| Visible-mode request, before acceptance | Fuzzy blue circle (~½ mile) — an area, not a point | Nearby verified interpreters |
| Visible-mode request, after acceptance | Exact blue dot | **Assigned interpreter only** |
| Available interpreter | Solid red dot, approximate position | Nearby Deaf users |
| **Interpreter on a job** | **Exact red dot, live and moving** | **Assigned Deaf user only** |

Both sides go from approximate-and-public to exact-and-private at the same moment: acceptance. Before it, nobody's precise position is exposed to anybody. After it, the two people who need to find each other can — and no one else can watch.

The fuzzing happens **server-side**. Exact coordinates never leave the server for an unassigned viewer, so this can't be defeated by inspecting network traffic.

### Accessibility requirements

- Every marker has an accessible name: *"Interpreter, 0.4 miles away, RID NIC certified, available now"*
- The en-route dot announces movement meaningfully: *"Your interpreter, 0.8 miles away, arriving in about 6 minutes"* — not a coordinate stream
- Markers are keyboard-reachable in distance order; Enter opens the popup
- **A paired list view carries 100% of the same information** (PRD A6) — the map is never the only channel
- A visible legend, always on screen, not hidden behind an info button
- Movement animation respects `prefers-reduced-motion`
- **Minimum 44×44px tap target, always** — even though the dot is ~16px. Used one-handed, on a phone, under stress
- Marker clustering at low zoom with a count label, not a pile of overlapping dots
- **Test on a real iPhone outdoors**, not just a desktop browser at 375px. Sunlight, motion, and a thumb are the actual conditions

> **A note on red.** Red conventionally signals danger, so "red = available interpreter" runs against habit. Because every red dot now means available — there are no other red states — the ambiguity mostly disappears. Watch for it in user testing; if it reads wrong, swap the two colors rather than adding detail to the dot.

---

## Global shell

Applies to every authenticated page.

- **Skip link** to `#main` as the first focusable element
- **Header:** logo (links to dashboard), role-aware nav, notification bell (Phase 2), avatar menu with Profile and Log out
- **Focus management:** on route change, focus moves to the page `<h1>`; route name announced via `aria-live="polite"`
- **Connection indicator** (Phase 2): visible, text-labeled, not color-only
- **Error boundary** wrapping each route with a "Try again" action and a link home
- **Bottom tab bar on mobile** (< 768px) replacing the header nav

---

## 1. Landing — `/`

**Goal:** explain the product in five seconds and route the visitor into signup by role.

**Content:** headline, one-sentence explanation, two primary CTAs ("I need an interpreter" → `/signup?role=deaf`, "I am an interpreter" → `/signup?role=interpreter`), three-step how-it-works, link to log in.

**States:** static only.

**Acceptance criteria**

- [ ] Both CTAs prefill the role on the signup page
- [ ] Reads clearly at 320px width
- [ ] Copy is plain language — short sentences, no idioms (PRD A7)
- [ ] Authenticated visitors are redirected to their dashboard

---

## 2. Signup — `/signup`

**Goal:** create an account with as little friction as possible. Profile details come later.

**Fields:** role (segmented control, prefillable from query), first name, last name, email, password (min 8, strength hint), confirm password.

**API:** `POST /api/auth/signup` → `{token, user}` → store in `AuthContext` → redirect `/onboarding/profile`.

**States:** idle · submitting (button disabled + spinner) · field errors · server error (409 email exists, 500).

**Acceptance criteria**

- [ ] Validation runs on blur and on submit; errors sit next to their field and are announced via `aria-live`
- [ ] Duplicate email produces "An account with this email already exists. Log in instead?" with a link — not a raw 409
- [ ] Password field has a show/hide toggle with an accessible name
- [ ] Double-submit is impossible
- [ ] Every field has a persistent visible `<label>` (PRD A5)
- [ ] Role choice is keyboard-operable as a radio group

**v1 problems fixed:** two signup components (`DeafSignupForm`, `InterpreterSignupForm`) plus a third form inside `pages/auth/Signup.jsx` — collapsed to one page with a role field.

---

## 3. Login — `/login`

**Goal:** get a returning user to their dashboard in one screen.

**Fields:** email, password. Role is derived server-side from the account — never asked.

**API:** `POST /api/auth/login` → redirect by role, or to `next`.

**States:** idle · submitting · invalid credentials · server error.

**Acceptance criteria**

- [ ] Invalid credentials show one generic message ("Email or password is incorrect") — never reveal which was wrong
- [ ] `next` param is honored after login
- [ ] "Don't have an account? Sign up" link present
- [ ] A user whose profile is incomplete lands on `/onboarding/profile`

**v1 problems fixed:** three login implementations (`components/LoginForm.jsx`, `components/LoginPage.jsx`, `pages/auth/Login.jsx`), and an API client calling separate `/auth/login/deaf` and `/auth/login/interpreter` endpoints the backend never had.

---

## 4. Profile setup — `/onboarding/profile`

**Goal:** collect the minimum needed for matching, with fields that differ by role.

**Shared fields:** street, apt/unit, city, state (dropdown), ZIP, phone, avatar (optional), bio.

**Deaf-only:** preferred language (ASL / PSE / SEE / other), access notes ("what should an interpreter know before arriving?").

**Interpreter-only:** languages (multi-select), service radius (slider, 5–50 miles), **face photo (required)**. Availability toggle is **not** shown here — it's meaningless until verified. Credentials are a separate step (§4b), not a free-text field on this form.

**API:** `PUT /api/profile` (upsert). Server geocodes the address to lat/lng.

**States:** idle · submitting · validation errors · geocoding failure ("We couldn't find that address — check it or enter coordinates manually").

**Acceptance criteria**

- [ ] Fields are grouped in labeled `<fieldset>`s with a progress indicator
- [ ] State is a searchable `<select>`, not free text
- [ ] `spellcheck="false"` on address and name fields
- [ ] Successful save produces lat/lng in `profiles` — verified in the DB
- [ ] Geocoding failure never silently produces null coordinates
- [ ] Interpreter face photo is required and uploaded to object storage, never a DB blob
- [ ] Skippable fields are labeled "(optional)"; nothing is silently required

**v1 problems fixed:** `DeafProfileSetup` (264 lines) and `InterpreterProfileSetup` (352 lines) shared roughly 80% of their markup with drifting validation. Now one page, role-conditional sections.

---

## 4b. Submit credentials — `/onboarding/credentials`

**Goal:** collect a verifiable credential and set expectations about what happens next.

**Fields:** credential type (RID NIC · RID CDI · BEI · NAD · State license · Other), credential number, issuing body, issuing state (shown only for state licenses), issue date, expiry date. "Other" requires a free-text description of what should be checked.

**Copy requirements** — this page sets the honesty baseline for the whole product:

- Explain plainly that a human will look the number up in the issuing body's public registry
- State the review target (48 hours) and that they'll be notified either way
- State what the background check covers and who runs it — TERP uses a third-party vendor and does not screen people itself
- Do not imply the platform issues, endorses, or guarantees credentials

**API:** `POST /api/credentials` → redirect to `/interpreter/verification`.

**States:** idle · submitting · validation errors · duplicate credential number (409 — that number is already registered to another account) · error.

**Acceptance criteria**

- [ ] Expiry date in the past is rejected client- and server-side
- [ ] Issuing-state field appears only for `STATE_LICENSE`
- [ ] Copy passes the D-06 review — no claim the platform hasn't earned
- [ ] Submitting does not grant any access; the interpreter lands on the pending status page
- [ ] Multiple credentials can be submitted (an interpreter may hold both a national cert and a state license)

---

## 4c. Verification status — `/interpreter/verification`

**Goal:** tell a waiting interpreter exactly where they stand and what to do next. This page prevents the most likely churn moment in the product.

**Layout:** status banner (Pending review · Verified · Needs correction) · submitted credentials list with per-credential status · background check status · expected turnaround · what they can and can't do right now · resubmit action when rejected.

**States**

| Status | What the page shows |
|---|---|
| No credential yet | Prompt to submit, link to §4b |
| Pending | "Under review — submitted 12 March. We aim to review within 48 hours." No request access |
| Verified | Confirmation with credential type and verification date; link to browse requests |
| Rejected | The `rejection_reason` verbatim, plus a resubmit action |
| Expired | Which credential lapsed, when, and how to renew |

**Acceptance criteria**

- [ ] A rejected interpreter sees the actual reason, not a generic failure
- [ ] The page is never a dead end — every state has a next action
- [ ] Status changes are announced via `aria-live`
- [ ] Copy avoids blame; a rejection is usually a typo, not fraud
- [ ] Both gates are shown separately — credential and background check can be at different stages

---

## 4d. Admin credential queue — `/admin/credentials`

**Goal:** let a reviewer verify a credential correctly in under two minutes, and leave an audit trail.

**Access:** `role = 'admin'` only, enforced server-side. Not linked from any public navigation.

**Layout:** filter tabs (Pending · Verified · Rejected · Expired) over a queue. Selecting a submission opens a detail panel: submitted values, the interpreter's name and account details for name-matching, a **deep link to the issuing body's public registry**, and approve/reject controls.

**Reviewer checklist rendered on the page** (so the process is followed, not remembered):

1. Number found in the public registry
2. Name on the credential matches the account name
3. Credential is unexpired
4. Credential does **not** appear on the revoked-certifications list

**API:** `GET /api/admin/credentials?status=`, `PATCH /api/admin/credentials/:id`.

**Acceptance criteria**

- [ ] Approving or rejecting **requires** a `verification_note` — the form cannot submit without one
- [ ] Rejection requires a `rejection_reason` written for the interpreter to read
- [ ] The registry lookup link opens in a new tab, prefilled with the credential number where the registry supports it
- [ ] Every decision records `verified_by` and `verified_at`
- [ ] Approving flips the interpreter to `verified` and grants request access immediately
- [ ] Decisions are not silently reversible — a change of status writes a new note rather than overwriting the old one

---

## 5. Deaf dashboard — `/deaf`

**Goal:** answer "what's happening with my requests?" and make creating a new one obvious.

**Layout**

1. Greeting + "Request an interpreter" primary CTA
2. **Active** section — pending and accepted requests as cards showing title, when, status pill (text + color), and the interpreter's name once accepted
3. **Upcoming** — future scheduled requests
4. **Past** — last 5 completed/cancelled, with a link to all
5. Secondary link: "Find interpreters near me" → `/deaf/interpreters`

**Card contents:** title · date/time (or "Now") · duration · location · status pill · counterparty (if any) · contextual action (View · Cancel · Track).

**API:** `GET /api/auth/me`, `GET /api/requests/mine`.

**States:** loading (skeleton cards) · empty ("You haven't made any requests yet" + illustration + CTA) · loaded · error (retry).

**Phase 2:** cards update live on `request:accepted` and `request:status_changed`; a Track button appears on in-progress requests.

**Acceptance criteria**

- [ ] Status is conveyed by text *and* color, never color alone (PRD A3)
- [ ] Empty state is designed, not a blank region
- [ ] Cards are keyboard-reachable; the whole card is not a single ambiguous link — actions are explicit buttons
- [ ] No `localStorage.getItem('user')` parsing in the component — data comes from `AuthContext`
- [ ] Single fetch on mount, through `lib/api.js`

**v1 problems fixed:** two dashboards (227-line CSS-variable version, 73-line Tailwind version) both existed; the active one fetched from a hardcoded `localhost:3001` while the server ran on 5000, so it never loaded data.

---

## 6. Create request — `/deaf/request/new`

**Goal:** post a request in under 90 seconds.

**First question on the page — it changes everything below it:**

> **Where are you?**
> **I'm out somewhere** (visible mode) — shares live GPS so nearby interpreters can reach you fast
> **I'm at home** (private mode) — your address is not shared with anyone until someone accepts

**Fields:** location mode (above) · title · description · timing (Now / Schedule) · duration (30/60/90/120/custom) · setting (general / medical / legal / educational / employment / mental health) · language · location (visible mode: live GPS with manual override; private mode: profile address, never broadcast).

**Privacy behavior** — see [PRD §5.0b](./PRD.md#50b-two-request-modes-visible-and-private):

- Interpreters browsing requests see an **approximate area only**, in both modes
- Exact location is released only to the assigned interpreter, and only if they're traveling
- Video-only requests never disclose location at all
- The page states plainly what will and won't be shared, before the user submits

**API:** `POST /api/requests` → redirect to `/requests/:id` with a success banner.

**States:** idle · validating · submitting · error.

**Acceptance criteria**

- [ ] "Now" hides the date/time picker and sets `is_immediate`
- [ ] Scheduled times in the past are rejected client- and server-side
- [ ] **Private mode never writes live GPS and never broadcasts exact coordinates** — verified in the API response, not the UI
- [ ] The privacy explanation is visible before submission, not buried in a policy link
- [ ] Location defaults from the profile — zero typing for the common case
- [ ] Map preview updates as the address changes and has a text equivalent below it
- [ ] Leaving with unsaved input triggers a confirmation
- [ ] Submitting produces exactly one request (no double-post)

**v1 problems fixed:** `components/CreateRequestForm.jsx` (145 lines) and `pages/deaf/CreateRequest.jsx` (191 lines) were competing implementations, neither routed in `App.jsx`.

---

## 7. Find interpreters — `/deaf/interpreters`

**Goal:** show that real interpreters exist nearby — build confidence before requesting.

**Layout:** view toggle (Map / List), both showing identical data.

**Map:** your position as a blue dot with a thin ring; available interpreters as solid red dots per the [marker system](#the-live-map--marker-system). Busy and offline interpreters don't render at all. Legend always visible.

**List:** identical information as accessible cards, sorted by distance.

**The at-a-glance question this page answers:** *how many interpreters can help me right now?* A count sits above both views — "4 interpreters available within 5 miles" — because scanning dots is slower than reading a number, and slower still under stress.

**API:** `GET /api/interpreters/nearby?radius=`.

**States:** requesting location permission · location denied (falls back to profile address, banner explains) · loading · empty ("No interpreters within 25 miles" + radius control) · loaded · error.

### Tapping a red dot — the reach-out modal

This is the direct-pick path: you saw a specific interpreter and you want *that* one.

**The modal shows:** face photo (large — you're deciding whether to trust this person), name, distance and travel ETA, verified credential with date, languages, reliability record, completed job count.

**Two ways to reach them — availability depends on their connection:**

| Action | What happens | When you'd use it |
|---|---|---|
| **📹 Video now** | Opens a live video call to that interpreter. You ask in ASL whether they're free; they answer face to face. If yes, the job is reserved on the spot | You want to confirm with a person, not a form. Fastest to certainty |
| **💬 Send message** | Sends a text request with your details. They reply yes or no | Their signal is bad, they're driving, or it's a scheduled job that doesn't need live confirmation |

Once they confirm, the request is created and assigned to them — no separate booking step. **All set.**

**When video isn't possible** ([reachability](./PRD.md#50e-reachability--adapting-to-the-connection)): the Video button is disabled **with a stated reason**, before the user tries it.

> 📶 *Dana can't take video right now — weak signal.*
> **[ Send a message instead ]**

Never a greyed-out button with no explanation. That reads as a broken app; this reads as a system being honest. Causes shown in plain words: *weak signal · on the subway · driving · connection dropped.*

**The message request carries everything needed to decide on one screen** — what's needed, where, when, how long, setting, language, distance, pay — because someone in a dead zone can't ask follow-up questions.

**States and the escalation rule**

| State | What the user sees |
|---|---|
| Sending | "Reaching [name]…" |
| Ringing (video) | Live call attempt, with a cancel option |
| Waiting (message) | "Waiting for [name] to reply" with a visible countdown |
| **Accepted** | Confirmed — assigned, tracking begins |
| **Declined** | "[Name] isn't available." **Immediately offers: broadcast to everyone nearby** |
| **No response** | **Auto-escalates to broadcast.** 60 seconds for video, 3 minutes for a message |

> **The escalation is not optional.** Picking one interpreter must never become a dead end — that's exactly the "waiting and hoping" experience this product exists to replace. If they don't answer, the request goes wide automatically and the user is told plainly: *"No answer from [name] — we're asking everyone nearby now."* The user can always skip the wait and broadcast immediately.

**Acceptance criteria**

- [ ] Markers are **plain solid dots** — no inner circle, hole, icon, or pin shape
- [ ] Legible and tappable on a real iPhone, outdoors, one-handed
- [ ] Tap target is 44×44px even though the dot is ~16px
- [ ] The legend is always on screen, not behind an info button
- [ ] Only available interpreters render; there is no such thing as a non-actionable red dot
- [ ] Available-interpreter count is shown as a number above both views
- [ ] List view contains 100% of the map's information (PRD A6)
- [ ] The view toggle persists across navigation
- [ ] Location comes from geolocation or profile — **no hardcoded coordinates**
- [ ] Markers have accessible names; popups are keyboard-reachable
- [ ] Distances are real haversine calculations from live profile coordinates
- [ ] Radius control re-queries and updates both views
- [ ] Face photo is prominent in the modal — this is a trust decision, not a data lookup
- [ ] Both contact actions are reachable one-handed; 44px minimum targets
- [ ] Video opens without leaving the map context
- [ ] **A `text_only` interpreter shows a disabled Video button with a stated reason** — never a silent grey button
- [ ] **A driving interpreter is never offered video**, regardless of signal strength
- [ ] **A direct request with no response escalates to broadcast automatically** — verified by test, with the timer visible throughout
- [ ] Declining costs the interpreter nothing — no reliability penalty for an unaccepted direct request
- [ ] The user can broadcast immediately instead of waiting out the timer
- [ ] The interpreter's exact location is **not** revealed by opening this modal — only distance and ETA, per [privacy rules](#privacy-rendering--non-negotiable)

**v1 problems fixed:** `MapView.jsx` hardcoded `42.8864, -78.8784` (Buffalo) as "Your Location" while seed data was New York City, and had no list equivalent.

---

## 8. Interpreter dashboard — `/interpreter`

**Goal:** answer "what work do I have, and what's available right now?"

**Layout**

1. Availability toggle (prominent, top) + **connection status** ("Video ready" / "Text only — weak signal" / "Driving") with a manual driving toggle + stats strip: today's jobs · this week · completed all-time · reliability
2. **Today's schedule** — accepted jobs in time order, each with location, requester, and a Navigate action (Phase 2)
3. **Nearby requests** — top 3 pending by distance, with a link to `/interpreter/requests`
4. Mini map of nearby pending requests — **blue fuzzy circles** (areas, not points), your own position as a red dot. Private-mode requests never appear here

**API:** `GET /api/requests/mine` (as interpreter), `GET /api/requests/pending?limit=3`, `PATCH /api/interpreters/availability`, `PATCH /api/interpreters/reachability`.

**States:** loading · **unverified** (see below) · unavailable ("Turn on availability to accept jobs") · empty · loaded · error.

**Unverified state** — the most important one to design well, because it's the first thing a new interpreter sees:

- Availability toggle and nearby requests are replaced, not dimmed-but-present. Showing work they can't take is a bad first impression
- A clear status card: where their credential and background check stand, expected turnaround, link to `/interpreter/verification`
- Profile editing stays available so the wait isn't idle time

**Phase 2:** new pending requests appear live via `request:created`.

**Acceptance criteria**

- [ ] An unverified interpreter sees the verification state, never the request list
- [ ] Availability toggle is unavailable until verified, and is server-persisted once it is
- [ ] Connection status is visible and honest — an interpreter knows when they're only reachable by text
- [ ] Driving toggle is one tap and immediately suppresses video offers
- [ ] Stats are real DB aggregates — no placeholder zeros
- [ ] Nearby requests are sorted by true distance from the interpreter's coordinates
- [ ] The map is secondary; every request on it also appears in the list

**v1 problems fixed:** the 504-line `InterpreterDashboard.jsx` mixed map setup, three data lists, and a hardcoded stats object (`{todayEarnings: 0, weekAppointments: 0, ...}`) that was never populated — earnings shown despite no payments feature existing.

---

## 9. Browse requests — `/interpreter/requests`

**Goal:** scan available work and claim it in one action.

**Layout:** filter bar (distance · language · timing: now/today/this week · duration) over a list of request cards.

**Card contents:** title · description excerpt · when · duration · distance · language · setting · Accept button.

**API:** `GET /api/requests/pending?radius=&language=`, `POST /api/requests/:id/accept`.

**States:** loading · empty (filter-aware: "No requests match these filters" vs "No requests nearby right now") · accepting (that card disabled) · **accept conflict (409)** — card grays out with "Another interpreter accepted this request" and removes itself · error.

**Access:** verified interpreters only. Unverified users are redirected to `/interpreter/verification`, and the API returns 403 regardless of what the client does.

**Acceptance criteria**

- [ ] An unverified interpreter cannot reach this page, and cannot reach its data by calling the API directly
- [ ] Accept is atomic server-side; a simultaneous double-accept yields one winner and one clear 409 message
- [ ] The 409 path is explicitly tested
- [ ] The 403-unverified path is explicitly tested
- [ ] Accepting removes the card and adds the job to the dashboard without a full reload
- [ ] Filters are reflected in the URL so views are shareable and back-button-safe
- [ ] Distance shown on every card

**v1 problems fixed:** `components/ViewRequestsPage.jsx` (165 lines) and `pages/interpreter/ViewRequests.jsx` (174 lines) duplicated the feature; accept had no conflict handling.

---

## 10. Request detail — `/requests/:id`

**Goal:** the single source of truth for one request, for both parties.

**Layout:** header (title + status pill) · status timeline (Created → Accepted → In progress → Completed, with timestamps) · details block (when, duration, location + map, language, modality, setting, description) · counterparty card (photo, name, credential, reliability, contact) · action bar.

**Actions by role and status**

| Status | Requester | Interpreter |
|---|---|---|
| pending | Cancel | Accept |
| accepted | Video · Track · Cancel | Video · Start · Navigate · Cancel |
| in_progress | Video · Track | Complete |
| completed | Leave review (Phase 5) | Leave review (Phase 5) |
| cancelled | — | — |

**API:** `GET /api/requests/:id`, plus the action endpoints.

**States:** loading · loaded · not found (404 page) · **forbidden** (not a party → 403 message, not a redirect loop) · **recovery** (Phase 4 — see §12d) · error.

**Acceptance criteria**

- [ ] Non-parties get a clear 403, enforced server-side
- [ ] The action bar shows only valid transitions for the viewer's role and the current status
- [ ] Timeline entries have real timestamps from `accepted_at` / `completed_at`
- [ ] Destructive actions (Cancel) require confirmation
- [ ] Deep-linkable and refresh-safe

---

## 10b. Video session — `/requests/:id/session` *(Phase 3)*

**Goal:** connect the two people in ASL, immediately, the moment an interpreter accepts — including while that interpreter is still traveling.

This is the page that makes "you are not left waiting" true. It opens automatically on acceptance; it is not something the user has to go find.

**Layout:** full-bleed remote video · self-view picture-in-picture · minimal controls (camera flip, mute, end) · a status strip showing whether the interpreter is remote-only or en route, with ETA when travelling.

**States:** connecting · waiting for the other party · connected · interpreter en route (video continues, ETA shown) · interpreter arrived (prompt to end video and continue in person) · reconnecting · permission denied · ended.

**Acceptance criteria**

- [ ] Session opens within 10 seconds of acceptance, for both parties
- [ ] **Video quality is preserved over audio under bandwidth constraint** — the video *is* the language. This inverts a normal call app's default
- [ ] Interpreting can begin on video and continue in person without a session break
- [ ] Camera/mic permission denial is explained and recoverable — never a dead end
- [ ] Controls are reachable one-handed at 375px
- [ ] **Nothing is recorded or persisted.** Verified, not assumed
- [ ] Reconnects automatically after a network drop without losing the session

---

## 11. Track request — `/requests/:id/track` *(Phase 2)*

**Goal:** answer "are they actually coming?" — see [PRD §5.0c](./PRD.md#50c-live-availability).

**Layout:** full-bleed map with both dots and route line · bottom sheet with interpreter name, ETA, distance, and status · Navigate button (interpreter view).

**Data:** socket `interpreter:location` events; REST polling fallback every 30s.

**States:** waiting for first location ping · tracking · arrived · stale connection ("Last updated 2 minutes ago") · request no longer active (redirect to detail).

**Acceptance criteria**

- [ ] ETA and distance are also presented as text — the map is not the only channel
- [ ] Tracking stops and the page redirects when the request reaches `completed` or `cancelled`
- [ ] Only the counterparty can view; enforced server-side
- [ ] **Stale data is labeled with its age rather than shown as current** — a frozen dot reads as abandonment
- [ ] Marker movement respects `prefers-reduced-motion`

---

## 12. Notifications — `/notifications` *(Phase 2)*

**Goal:** a durable record of everything that happened while the user was away.

**Layout:** reverse-chronological list, unread visually distinct (by weight and marker, not color alone), each linking to its request. "Mark all read" action.

**Acceptance criteria**

- [ ] New notifications are announced via `aria-live="polite"`
- [ ] Haptic feedback on mobile where supported; never audio-only (PRD A10)
- [ ] Unread count in the header badge matches the list
- [ ] Notifications survive reload — server-persisted, not in-memory

---

## 12b. Cancel request — `/requests/:id/cancel` *(Phase 4)*

**Goal:** capture why, classify the impact, and — for interpreters — make the consequence clear *before* they confirm.

**Interpreter view:** reason (required), a plain statement of how this will be classified and what it means for their reliability record, and confirmation. An interpreter cancelling two hours before a medical appointment should see exactly that before tapping.

**Requester view:** reason (optional), notice that the interpreter loses income, and any late-cancellation fee once payments are live.

**Acceptance criteria**

- [ ] Consequence is shown before confirmation, never after
- [ ] Classification (`early` / `late` / `last_minute`) is computed and displayed honestly
- [ ] Confirming triggers backfill immediately — the requester's recovery starts before this page closes
- [ ] Genuine emergencies have a path to `excused` review; the copy doesn't treat every cancellation as misconduct

---

## 12c. Reliability — `/interpreter/reliability` *(Phase 4)*

**Goal:** show an interpreter their record and exactly how it's calculated. Enforcement that isn't understood is just punishment.

**Layout:** current score with plain-language standing · completed jobs, cancellations by class, no-shows · recent history · **an explanation of the calculation in plain terms** · current standing and what changes it · appeals link.

**Acceptance criteria**

- [ ] The calculation is explained in words the interpreter can act on — not a formula
- [ ] Any active consequence (reduced priority, suspension) is stated plainly, never applied silently
- [ ] Appeals path is visible from this page
- [ ] Tone is factual, not punitive — most cancellations are life, not misconduct

---

## 12d. Requester recovery state *(Phase 4)*

Not a separate route — a state of the request detail page, and the single most important screen in the product.

When an interpreter cancels, the Deaf user must **never** see a bare failure. They see:

1. What happened, immediately and plainly
2. That the system is already finding a replacement — with live status
3. A video option if in-person can't be secured in time
4. A real human contact path if all layers fail

**Acceptance criteria**

- [ ] The word "cancelled" never appears alone without the recovery state beside it
- [ ] Status updates push live — the user never refreshes to find out
- [ ] If everything fails, the page says so honestly and offers a next step, rather than leaving them staring at a dead screen
- [ ] Understandable at a glance under stress — this gets read by someone in a hospital waiting room

---

## 13. Profile — `/profile`

**Goal:** view and edit your own information.

Reuses the profile setup form in edit mode. Adds account settings (change password, log out, delete account) and, for interpreters, a preview of the public profile card.

**Acceptance criteria**

- [ ] Changing an address re-geocodes and updates matching
- [ ] Password change requires the current password
- [ ] Unsaved-changes warning on navigate-away
- [ ] Account deletion requires typed confirmation

---

## 14. Not found — `*`

Plain-language message, link to dashboard or home, no dead end. Returns proper document title.

---

## Component inventory

Reusable pieces extracted once and shared. Nothing here fetches data.

| Component | Used by |
|---|---|
| `<StatusPill status>` | dashboards, detail, browse |
| `<VerificationBadge credential>` | interpreter cards, detail counterparty, public profile |
| `<ReliabilityBadge score>` | interpreter cards, detail counterparty, browse |
| `<RecoveryBanner request>` | request detail during backfill |
| `<LocationDisclosure mode>` | create request, request detail |
| `<RequestCard request role>` | Deaf dashboard, interpreter dashboard, browse |
| `<PersonCard user>` | detail, find interpreters, track |
| `<ReachOutModal interpreter>` | find interpreters |
| `<Map markers center>` | find interpreters, create request, detail, track |
| `<MapMarker role precision>` | inside `<Map>` — the single implementation of the marker system |
| `<MapLegend>` | every map surface |
| `<NearbyList items>` | find interpreters (map parity) |
| `<EmptyState icon title body action>` | every list page |
| `<LoadingSkeleton variant>` | every data page |
| `<ErrorState error onRetry>` | every data page |
| `<ConfirmDialog>` | cancel, delete, complete |
| `<Field>` / `<Select>` / `<TextArea>` | all forms |
| `<PageHeader title subtitle actions>` | every page |

**`<VerificationBadge>` rule.** It renders the credential type and verification date — "RID NIC · verified March 2026" — never a bare "Verified." It renders nothing at all for unverified credentials rather than a neutral or pending badge, because an ambiguous badge reads as endorsement. This component is the single place the platform makes a factual claim about someone's qualifications, so it has one implementation and one copy string.

**`<MapMarker>` rule.** Plain solid dot, no inner detail, ever. Blue for Deaf users, red for available interpreters. If someone proposes adding an icon or a hollow state, the answer is no — it stops being legible at phone size, which is the only size that matters here.

**Rule:** if the same visual appears on two pages, it becomes a component before the second copy is written. v1's cost was two dashboards, three login forms, and two of every request page — all of which drifted apart.
