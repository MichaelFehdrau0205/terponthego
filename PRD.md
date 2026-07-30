# TERP / on the go — Product Requirements Document

**Version:** 2.0
**Status:** Draft for build
**Author:** Michael Fehdrau
**Last updated:** July 2026

---

## 1. Summary

TERP / on the go is an on-demand **signed language** interpreting service for Deaf and hard-of-hearing people. Available 24/7. Same-day, often within the hour.

The product is not speed. **The product is reliability.**

Existing agencies cancel. A Deaf person books an interpreter days ahead, arranges their entire day around it — takes time off work, schedules the medical appointment, arranges transport — and the agency cancels the day before, or the morning of. Now they're sitting in a doctor's office unable to communicate about their own health, and none of it was their failure.

That happens often enough that Deaf people have learned not to trust the system. TERP exists to be the service that doesn't do that.

**The promise:** you will not be left without an interpreter.

That promise is kept by engineering, not by hope. No software prevents a human from getting sick — so the system is built so that one interpreter's cancellation never becomes the Deaf person's problem. See §5.

---

## 2. Problem

### 2.1 The primary problem: unreliability

Last-minute cancellation is the defining failure of interpreter booking. Its cost is asymmetric and severe:

- A cancelled medical appointment isn't rescheduled — it's *lost*, often for weeks
- A cancelled job interview isn't rescheduled — the opportunity is gone
- The Deaf person absorbs 100% of the cost of someone else's failure
- Each occurrence teaches them the system can't be relied on, so they stop trying

Agencies have little incentive to fix this. They're paid on placement, not on reliability, and they carry no consequence when an interpreter drops.

### 2.2 The secondary problem: lead time

Agency booking assumes 24–48 hours notice. Life doesn't work that way. Same-day medical needs, an interview scheduled Friday for Monday, an urgent legal meeting — these are routine, and the existing system treats them as exceptional.

**One hour of notice is the target**, and it works for both sides: short enough that a Deaf person isn't restructuring their life around interpreter availability, long enough that an interpreter can realistically travel. It also fills a gap in the interpreter's day that would otherwise earn nothing.

### 2.3 Contributing problems

- **No visibility.** The requester can't see who's available, how far away, or whether anyone has picked up the job — until it's too late to react.
- **Phone-first intake.** Many agency systems require a phone call. An obvious failure for the population being served.
- **No supply-side view.** Freelance interpreters have unfilled hours and no single place to see nearby demand.
- **Business hours only.** Emergencies don't schedule themselves.

---

## 3. Users

TERP is for **all Deaf and hard-of-hearing people** — not a narrow professional segment. That breadth is a design constraint, not a marketing line: it sets the accessibility bar (§8) and rules out interfaces that assume English fluency, recent hardware, or comfort with technology.

The user base spans:

- Deaf professionals booking work meetings and medical appointments
- Deaf people seeking employment — job interviews, onboarding, workplace meetings (often VR-funded, see §7)
- Elderly Deaf users, who may have limited technology experience
- Deaf users with limited English literacy — ASL is a distinct language, not signed English
- Students, parents at school meetings, people in legal proceedings
- DeafBlind users, who require tactile or ProTactile interpreting (a distinct skill set — see open question 9)

### Supply side — the interpreter

Freelance certified interpreters, assembling work from agencies and word of mouth. They have unfilled hours, no portable reputation, and take a large cut from agencies. TERP offers them **75% of the job value** (§7), nearby work matched by GPS, and a reliability record that belongs to them.

They are also the mechanism of the promise. An interpreter who cancels late doesn't just lose a job — they harm a person. Reliability is tracked and enforced (§5.4).

---

## 4. Goals & non-goals

### Goals

| G# | Goal |
|---|---|
| G1 | **A Deaf person is never left without an interpreter.** Fulfillment is the headline metric, not speed |
| G2 | Operate 24/7/365 — reliability that stops at 5pm isn't reliability |
| G3 | Same-day fulfillment as the floor; one hour as the target |
| G4 | Make cancellation a non-event for the requester through automatic backfill and video fallback |
| G5 | Hold interpreters accountable for reliability in a way agencies don't |
| G6 | Meet WCAG 2.1 AA, validated by Deaf users across a range of ages and tech comfort |
| G7 | Pay interpreters better than agencies do (75%), so supply follows |

### Non-goals for v2

"Non-goal" means **deliberately not built in v2** — a boundary written down so it doesn't creep in. Nothing is deleted; these are deferred.

- **Signed language interpreting only.** Spoken-language interpreting is a different product with a different supply pool and different credentialing bodies. ASL at launch; the schema supports other signed languages and modalities
- Not taking real money in v2 — payment flows are built and tested in Stripe test mode (§7)
- Not an ACCES-VR approved vendor yet — that's a procurement process running in parallel (§7.2)
- No native mobile apps; PWA only
- Not building an agency admin console
- Not issuing or adjudicating credentials — we verify against the issuing body's public registry

---

## 5. The guarantee

This is the core of the product. Everything else supports it.

**What we promise:** the Deaf user gets an interpreter.
**What we do not promise:** that a specific named interpreter will never cancel.

That distinction is what makes the guarantee honest and keepable. A human will always be able to get sick. The system is designed so that when they do, the requester is still served.

### 5.0 The core flow

Both parties are on phones, in the field. This is a mobile product first.

```
Deaf user opens app, posts request  ──▶  GPS finds verified interpreters in range
                                              │
                                    SMS + push alert, instantly
                                              │
                             First interpreter to respond claims it
                                              │
                          ── VIDEO OPENS IMMEDIATELY ──
                                              │
                  Interpreting begins now, over video, in ASL
                                              │
                    ┌─────────────────────────┴──────────────────────┐
          Interpreter travels                              Nobody can travel
          (video continues en route)                       (video is the service)
                    │                                                │
          Arrives, continues in person                    Completed over video
```

The Deaf user is never in silence waiting. That's the point.

### 5.0b Two request modes: visible and private

Not every request is the same shape. A Deaf person standing in an emergency room has different needs — and different privacy concerns — than one sitting at home.

| | **Visible mode** | **Private mode** |
|---|---|---|
| Where the user is | Out in the world — hospital, store, street, workplace | At home |
| Live GPS | On. Location broadcasts to the nearby pool | **Off. Nothing broadcasts** |
| Matching | By real-time proximity | By video availability, or scheduled in-person |
| Typical urgency | Now, ASAP | Now or scheduled |
| What interpreters see before accepting | Approximate area only | Area only, or nothing but the video request |
| What the accepted interpreter sees | Exact location + live tracking | Exact address only if they're traveling; nothing if video-only |
| Typical use | Emergency, unplanned, out and about | Telehealth, remote work meeting, planned appointment at home |

**Why this matters.** A Deaf person at home should not have their home address broadcast to every interpreter within 25 miles. That's a genuine safety issue, particularly for users who are already vulnerable. Private mode exists so that requesting help from home doesn't mean disclosing where you live.

**Location disclosure rule — applies to both modes:**

1. **Before acceptance:** interpreters see an approximate area only (roughly a half-mile radius), never a precise address
2. **After acceptance:** the assigned interpreter sees the exact location, and only if they are physically traveling there
3. **Video-only requests:** no location is ever disclosed
4. **On completion or cancellation:** location sharing stops immediately, both directions

This is privacy by default, not privacy as a setting the user has to find.

### 5.0c Live availability

The map's job is to answer one question at a glance: **who can help me right now?** That requires availability to be a real, live, server-computed state — not a stale flag an interpreter forgot to turn off.

| State | Definition |
|---|---|
| `available` | Verified, background-cleared, toggled on, **not currently on a job**, seen within the last 5 minutes |
| `on_job` | Currently assigned to an active request |
| `offline` | Toggled off, or no heartbeat in 5 minutes |

Rules:

- Accepting a request moves an interpreter to `on_job` automatically — no manual toggle
- Completing or cancelling returns them to `available`
- A missing heartbeat for 5 minutes flips them to `offline`, so the map never shows phantom supply
- **Only `available` interpreters receive alerts and render on the public map**

**The accept flip — a privacy rule, not just a display rule.** The instant an interpreter accepts, their marker is removed from every other user's map and becomes visible **only to their assigned Deaf user**, live and moving, so that person can follow them to the meeting location.

| | Before accepting | After accepting |
|---|---|---|
| Who sees them | All nearby Deaf users | **Only the assigned Deaf user** |
| Position accuracy | Approximate | Exact, live |
| Marker | Solid red dot | Solid red dot, moving |

An interpreter working a job is not visible to strangers. Their location is shared with exactly one person, for exactly as long as that job lasts, and stops on completion or cancellation.

**Why the assigned user tracks them — this is a trust mechanism.** After being cancelled on repeatedly, a Deaf person's real question isn't "where are they?" It's **"are they actually coming?"** Watching the dot move closer is a promise being kept in real time, minute by minute. It replaces anxious uncertainty with evidence.

That makes tracking a **core reliability feature, not a convenience**, and it sets a requirement: the dot must keep updating even when nothing eventful is happening. A stale marker reads as abandonment. If position data goes quiet, the UI must say so explicitly — *"Last updated 3 minutes ago"* — rather than leave a frozen dot implying everything is fine.

Because busy interpreters no longer render, the useful "supply exists but is momentarily busy" signal is carried as **text** instead — *"2 available nearby · 3 more on jobs"* — which informs the wait-or-switch-to-video decision without exposing anyone's position.

Visual encoding is specified once in [PAGES-GOALS — marker system](./PAGES-GOALS.md#the-live-map--marker-system): plain solid dots, blue for Deaf users and red for available interpreters, with the paired list view carrying the colorblind fallback.

### 5.0d Two ways to get an interpreter

Both paths exist, and both end in the same place — an assigned, confirmed interpreter.

| | **Broadcast** | **Direct pick** |
|---|---|---|
| How it starts | "I need an interpreter" | Tap a specific red dot on the map |
| Who's alerted | Every available interpreter in range | One chosen interpreter |
| How it resolves | First to accept wins | That person confirms by video or message |
| Speed | Fastest | Slower, but you choose who |
| Best for | Urgent, anyone qualified will do | You want a specific person — familiarity, past experience, specialization |

Both paths are then shaped by **reachability** (§5.0e): whether the interpreter can actually take a video call right now, or only text. That's not a third way of finding someone — it's the connection deciding how you reach whoever you found.

**The direct-pick modal** ([spec](./PAGES-GOALS.md#tapping-a-red-dot--the-reach-out-modal)) offers two ways to reach the chosen interpreter:

- **Video now** — a live call to ask, in ASL, whether they're free. They answer face to face; if yes, the job is reserved immediately
- **Send message** — a text request they reply to

Confirmation assigns the request. No separate booking step.

**Escalation is mandatory.** A direct pick that goes unanswered **auto-escalates to broadcast** — 60 seconds for video, 3 minutes for a message. Declining escalates immediately.

This is a guarantee requirement, not a convenience. Letting a user wait indefinitely on one unresponsive interpreter recreates precisely the abandonment this product exists to eliminate. The user is always told what's happening — *"No answer from Dana — asking everyone nearby now"* — and can skip the wait at any point.

Declining a direct request carries **no reliability penalty**. An interpreter who says "not right now" is behaving correctly; only cancelling an *accepted* job counts against them (§5.2). Conflating the two would push interpreters to accept work they can't do, which is the opposite of what reliability requires.

### 5.0e Reachability — adapting to the connection

Availability and reachability are different things. An interpreter on the subway is *available* — they'd take the job — but they cannot answer a video call. An interpreter driving shouldn't answer one even if they could.

So the system tracks a second state: **how can this person be reached right now?** The contact options offered to the Deaf user adapt to the answer, and the user is told why.

| Reachability | Meaning | What the Deaf user can do |
|---|---|---|
| `full` | Good connection, not driving | **Video or message** |
| `text_only` | Weak or unstable signal (subway, elevator, dead zone), or driving | **Message only.** Video is disabled with a plain reason |
| `unreachable` | No connection for >2 min | Not shown on the map at all |

**What the user sees.** The video button doesn't silently fail — it's disabled with an explanation:

> *"Dana can't take video right now — weak signal. Send a message instead."*

Being told *why* is the difference between a broken app and a system that's being honest with you. A greyed-out button with no reason reads as a bug.

**The text request carries everything needed to decide**, because the interpreter can't ask follow-up questions over a bad line: what's needed, where, when, how long, setting, language, distance, and pay. Enough to accept or reject on one screen.

**The interpreter always has the right to reject.** Accepting is never automatic and never assumed. Declining a request — direct, broadcast, or text-adaptive — carries **no reliability penalty** (§5.2). Only cancelling an already-accepted job counts.

#### Detection

Two inputs, because neither alone is sufficient:

1. **Measured, not declared.** [The Network Information API is not available on iOS Safari](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API), so connection quality can't simply be read off the device. It's inferred from real signals: socket heartbeat latency, dropped connections, and failed message delivery. Degraded round-trip times over a short window ⇒ `text_only`.
2. **Self-declared.** A manual "I'm driving" / "low signal" toggle, because the interpreter knows things the network doesn't.

**Driving is a safety rule, not a quality signal.** When driving mode is on, video is never offered regardless of connection strength. The system must never invite an interpreter to take a video call at the wheel.

#### Matching consequence

A **video-only request** — private mode, or nobody can travel — cannot be served by a `text_only` interpreter. They aren't alerted for it. Alerting someone to work they physically cannot perform wastes the response window that the one-hour promise depends on.

### 5.1 Four layers of protection

**Layer 1 — Instant alert.** A new request reaches every qualified, available interpreter in range immediately. Not a dashboard they must remember to check. The one-hour target is impossible without this.

**Delivery is SMS-first, push-second**, for a specific technical reason: [iOS web push only works if the app has been added to the home screen](https://www.magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide), and [Apple permits no automatic install prompt](https://www.mobiloud.com/blog/progressive-web-apps-ios) — every install is a manual step. SMS reaches every phone with no install, no permission grant, and no app open. Push is the fast path for interpreters who have installed; SMS is the guarantee.

Requirements that follow:

- Interpreter onboarding includes a walkthrough for adding TERP to the home screen, framed as "this is how you get work"
- Phone number verification is mandatory for interpreters — SMS is the primary alert channel
- The alert path is monitored: an undelivered alert is a fulfillment risk, not a minor bug

**Layer 2 — Automatic backfill on cancellation.** The moment an interpreter drops, the request re-enters the pool and re-broadcasts at elevated priority. The requester is never told "sorry" — they're told "we're finding someone else," with live status. Backfill is automatic and immediate; no human dispatcher in the loop.

**Layer 3 — Pre-assigned backup for high-stakes requests.** Medical, legal, and employment requests get a standby interpreter assigned at acceptance time. If the primary drops, the backup is already briefed and committed. Backups are compensated for holding the slot (rate TBD — open question 12).

**Layer 4 — Video as immediate first contact, and as the floor.** Video is not only a fallback for when nobody can travel. It is the **first connection**, opened as soon as an interpreter responds — even when they're also coming in person.

This matters more than it sounds:

- **Interpreting starts immediately.** Someone in an emergency room doesn't sit in silence for 40 minutes waiting for travel. The interpreter connects by video, begins interpreting, then arrives and continues in person. The gap between "I need help" and "I have help" collapses to seconds.
- **The requester sees who is coming.** Face, real person, confirmed — before arrival. This is a trust mechanism, not just a convenience.
- **When nobody can travel at all, video is the whole service.** Physical presence can fail; the *service* does not. This is what makes ≥99% fulfillment achievable rather than aspirational.

> **Live video only. No recording.** Sessions are never recorded or stored. Interpreted conversations are frequently medical, legal, or employment matters, and recording them would create serious privacy, consent, and liability exposure. This is permanently out of scope.

### 5.2 Cancellation handling

Cancellations are recorded with a reason and a timestamp, and classified:

| Class | Definition | Consequence |
|---|---|---|
| `early` | > 24h before start | No penalty; normal backfill |
| `late` | 2–24h before start | Counts against reliability score |
| `last_minute` | < 2h before start | Heavily weighted against score; triggers priority backfill + backup activation |
| `no_show` | Never arrived, unreported | Most severe; automatic account review |
| `excused` | Documented emergency, admin-reviewed | No penalty |

**The requester is never left uninformed.** Every state change pushes to them. Most of the injury in a last-minute cancellation is discovering it too late to act — so the system's first obligation is to tell them immediately, and its second is to already be solving it.

### 5.3 Requester-side cancellation

Deaf users cancel too, and interpreters lose income when they do. Late cancellations by requesters are recorded, and in the paid model (§7) a late-cancellation fee compensates the interpreter. Symmetry here is a fairness requirement, not an afterthought.

### 5.4 Reliability scoring

Every interpreter carries a visible reliability record:

- Completed jobs, cancellations by class, no-shows
- Rolling reliability score weighted toward recent behavior
- Displayed on their profile and factored into match ordering

Enforcement is graduated, and **transparent to the interpreter at every step** — no silent throttling:

1. Score below threshold → warning, with the record shown
2. Continued → reduced match priority
3. Repeated last-minute cancellations or a no-show → suspension pending review
4. Pattern of no-shows → removal

An appeals path exists; emergencies are real and the `excused` class exists for them.

---

## 6. User stories

### Auth, profile & verification

| ID | Story | Priority |
|---|---|---|
| U-01 | As a new user, I choose Deaf or Interpreter, then sign up with name, email, password | P0 |
| U-02 | As a returning user, I log in and land on my role's dashboard | P0 |
| U-03 | As a Deaf user, I complete a profile with address, preferred language, and access notes | P0 |
| U-04 | As an interpreter, I complete a profile with languages, service radius, bio, and **a face photo** | P0 |
| U-05 | As an interpreter, I submit my certification for review; I cannot work until it's verified | P0 |
| U-06 | As an interpreter, I complete a background check before I can accept work | P0 |
| U-07 | As an admin, I review a credential against the RID registry and approve or reject it with a note | P0 |
| U-08 | As a Deaf user, I see the interpreter's photo, credential, and reliability record before they arrive | P0 |

### Requesting

| ID | Story | Priority |
|---|---|---|
| R-01 | As a Deaf user, I create a request with details, location, timing, duration, language, and setting | P0 |
| R-02 | As a Deaf user, I request an interpreter **now**, not just scheduled | P0 |
| R-02b | As a Deaf user out in the world, I share live GPS so nearby interpreters can reach me fast | P0 |
| R-02c | As a Deaf user at home, I request help **without broadcasting my home address** | P0 |
| R-02d | As a Deaf user, I connect by video the moment an interpreter responds — before they arrive | P0 |
| R-03 | As a Deaf user, I see my requests grouped by status | P0 |
| R-04 | As a Deaf user, I see nearby interpreters on a map with distance and credentials | P0 |
| R-04b | As a Deaf user, I tap an interpreter's red dot and reach them directly — **by video or by message** — to confirm they're free | P0 |
| R-04c | As a Deaf user, if my chosen interpreter doesn't answer, the request **goes out to everyone nearby automatically** and I'm told | P0 |
| R-04d | As a Deaf user, I'm told **before** I try when an interpreter can't take video, and offered message instead — with the reason | P0 |
| R-05 | As a Deaf user, I'm notified instantly when an interpreter accepts | P0 |
| R-06 | **As a Deaf user, if my interpreter cancels, I'm told immediately and the system is already finding a replacement** | P0 |
| R-07 | As a Deaf user, I track my interpreter's location and ETA en route | P1 |
| R-08 | As a Deaf user, I connect to a video interpreter when nobody can arrive in time | P1 |
| R-09 | As a Deaf user, I cancel a request | P1 |
| R-10 | As a Deaf user, I rate an interpreter after a completed request | P2 |

### Supplying

| ID | Story | Priority |
|---|---|---|
| I-01 | As a verified interpreter, I'm **notified immediately** when a nearby request posts | P0 |
| I-01b | As a verified interpreter, I receive direct video calls and messages from Deaf users who picked me | P0 |
| I-01c | As a verified interpreter, I can decline a direct request **with no penalty** to my reliability score | P0 |
| I-01d | As an interpreter on the subway or in a dead zone, I still receive text requests with everything I need to decide | P0 |
| I-01e | As an interpreter who is driving, I am **never** offered a video call | P0 |
| I-01f | As an interpreter, I can mark myself text-only when I know my connection is bad | P1 |
| I-02 | As a verified interpreter, I accept in one action, and it leaves everyone else's queue | P0 |
| I-03 | As an interpreter, I see today's accepted jobs | P0 |
| I-04 | As an interpreter, I can be assigned as backup on a high-stakes job and be paid for holding it | P1 |
| I-05 | As an interpreter, I cancel with a reason, and I understand the consequence before confirming | P1 |
| I-06 | As an interpreter, I get turn-by-turn directions to a job | P1 |
| I-07 | As an interpreter, I toggle available/unavailable | P1 |
| I-08 | As an interpreter, I mark a job in-progress and then completed | P1 |
| I-09 | As an interpreter, I see my reliability score and understand exactly how it's calculated | P1 |
| I-10 | As an interpreter, I see my earnings at 75% of job value | P2 |

---

## 7. Money

v2 builds and tests all payment flows in **Stripe test mode**. No real money moves until the service goes live.

### 7.1 Revenue split

**75% interpreter / 25% platform.**

That's a materially better deal than agencies offer, and it's the supply-side hook — worth stating explicitly in interpreter recruiting.

Open decision: payment processing costs roughly 2.9% + 30¢ per transaction. Whether that comes off the top before the split or out of the platform's 25% changes real margin. See open question 11.

### 7.2 Three payer types

A request has a **payer** who may not be the requester. This is a structural requirement, not a later feature.

| Payer | Who pays | Notes |
|---|---|---|
| `self_pay` | The Deaf user | Employed users paying directly |
| `vr_agency` | State Vocational Rehabilitation | For employment-related interpreting — job interviews, onboarding, workplace meetings |
| `grant` | Grant-funded program | Fund with a balance, drawn down per request |

**Vocational Rehabilitation.** VR agencies fund interpreting for employment situations. In New York this is [ACCES-VR](https://www.acces.nysed.gov/vr), which provides interpreter services [through contracts with pre-approved vendors](https://www.acces.nysed.gov/vr/sign-language-interpreter-referral-service-procedures), with rates held in their case management system. Referrals are generated by a VR Counselor or a Rehabilitation Counselor for the Deaf — the Deaf person doesn't self-authorize.

Two consequences:

1. **Becoming an approved vendor is a procurement process, not a feature.** No code produces that contract. It's paperwork and approval, likely measured in months, and should start early precisely because it runs in parallel with building.
2. **VR-funded requests need an authorization reference** and a billing record separate from the requester. The data model supports this from day one (§9) even though v2 doesn't transact.

### 7.3 Interpreter requirements (all mandatory)

An interpreter cannot accept work without **all three**:

1. **Verified certification** — RID NIC, RID CDI, BEI, or NAD, checked against the issuing body's public registry
2. **Background check** — cleared through a third-party vendor
3. **Face photo** — the Deaf user must know who is arriving

On background checks: TERP does not run these itself. It integrates a vendor (Checkr, Sterling, Accurate) who is the consumer reporting agency. TERP still carries FCRA obligations as the *user* of the report — written disclosure, consent, and a proper adverse-action process if someone is rejected. In v2 the flow is built and the vendor call is stubbed; the integration goes live before real users.

> Open question 13: whether this is criminal screening, work-history/reference verification, or both. Different vendors, different costs.

---

## 8. Accessibility requirements

Serving *all* Deaf people sets the bar higher than serving a tech-comfortable subset. Accessibility is a **release gate**: a phase does not ship if these fail.

| A# | Requirement |
|---|---|
| A1 | WCAG 2.1 Level AA on all pages — zero critical/serious axe violations |
| A2 | Every interactive element keyboard-operable, visible focus at 3:1 contrast |
| A3 | Status **never** conveyed by color or emoji alone — always paired with text |
| A4 | Text contrast ≥ 4.5:1 (≥ 3:1 large text and UI boundaries) |
| A5 | Persistent `<label>` on every field; errors announced via `aria-live` |
| A6 | Map always paired with an equivalent list view — no information exists only on the map |
| A7 | **Plain language throughout.** Written for ASL-first readers with a range of English literacy. Short sentences, no idioms, no jargon |
| A8 | Captions on all video content; text alternative for any audio |
| A9 | Respects `prefers-reduced-motion` |
| A10 | Notifications visual and haptic — **never audio-only** |
| A11 | Usable on older devices and slower connections — the user base is not uniformly on new hardware |
| A12 | Critical flows (request, cancellation, replacement) understandable without reading dense text — icons, structure, and short sentences carry the meaning |
| A13 | **Mobile-first, not mobile-tolerated.** Both parties use this on a phone, in the field, often one-handed and under stress. Design for 375px first and scale up |
| A14 | Video quality preserved over audio under bandwidth constraint — the video *is* the language. This inverts a normal call app's priority |

### 8.1 Platform

This is a **PWA (Progressive Web App)**, installable to the home screen. That choice follows from the flow in §5.0: both parties are on phones, and interpreters need push notifications, which on iOS [require home-screen installation](https://www.mobiloud.com/blog/progressive-web-apps-ios).

- Installable with an offline shell and app icon
- Camera and microphone permissions for video
- Geolocation permission for matching
- Web push where available; SMS always
- Native iOS/Android apps remain out of scope for v2 — revisit if PWA limits prove blocking

---

## 9. Data model

```sql
users
  id, email, password_hash
  role            check (role in ('deaf','interpreter','admin'))
  first_name, last_name, phone
  created_at, updated_at

profiles
  user_id pk → users(id)
  street, unit, city, state, postal_code, latitude, longitude
  bio, avatar_url
  -- interpreter
  languages text[], service_radius_miles
  availability_state check (availability_state in
                        ('available','on_job','offline'))
  reachability check (reachability in
                        ('full','text_only','unreachable'))
  is_driving boolean default false       -- self-declared; forces text_only
  last_heartbeat_at timestamptz          -- >5min stale ⇒ offline
  avg_latency_ms int                     -- rolling; degraded ⇒ text_only
  photo_url                              -- required; face photo
  verification_status  check (verification_status in
                        ('pending','verified','rejected','suspended'))
  background_check_status check (background_check_status in
                        ('not_started','pending','cleared','failed'))
  reliability_score numeric(4,2)         -- 0.00–100.00
  completed_count, cancellation_count, no_show_count
  payout_account_id                      -- Stripe Connect
  -- deaf
  preferred_language, access_notes

credentials
  id, user_id → users(id)
  credential_type check (credential_type in
    ('RID_NIC','RID_CDI','BEI','NAD','STATE_LICENSE','OTHER'))
  credential_number, issuing_body, issuing_state
  issued_on, expires_on
  status check (status in ('pending','verified','rejected','expired'))
  verified_by, verified_at, verification_note, rejection_reason
  unique (credential_type, credential_number)

requests
  id, requester_id → users(id)
  interpreter_id → users(id)             -- primary, nullable
  backup_interpreter_id → users(id)      -- high-stakes only
  title, description, language
  -- location & privacy (see §5.0b)
  visibility_mode check (visibility_mode in ('visible','private'))
  location_text, latitude, longitude     -- exact; disclosed only per §5.0b
  approx_latitude, approx_longitude      -- fuzzed ~0.5mi; safe to broadcast
  uses_live_gps boolean                  -- true only in visible mode
  scheduled_at, is_immediate, duration_minutes
  setting  check (setting in
    ('general','medical','legal','educational','employment','mental_health'))
  is_high_stakes  boolean                -- derived from setting; drives backup
  modality check (modality in ('in_person','video','either'))
  status check (status in
    ('pending','accepted','in_progress','completed','cancelled','unfulfilled'))
  -- how it was raised (§5.0d)
  origin check (origin in ('broadcast','direct'))
  targeted_interpreter_id → users(id)    -- direct pick only
  direct_contact_method check (direct_contact_method in ('video','message'))
  direct_expires_at timestamptz          -- auto-escalate to broadcast at this time
  escalated_at timestamptz               -- when it went wide
  -- money
  payer_type check (payer_type in ('self_pay','vr_agency','grant'))
  payer_reference varchar(255)           -- VR authorization / grant ID
  quoted_amount_cents, interpreter_amount_cents, platform_amount_cents
  accepted_at, completed_at, created_at, updated_at

cancellations                            -- the reliability record
  id, request_id → requests(id)
  cancelled_by → users(id)
  cancelled_role check (cancelled_role in ('requester','interpreter'))
  cancelled_at timestamptz
  hours_before_start numeric(6,2)
  classification check (classification in
    ('early','late','last_minute','no_show','excused'))
  reason text
  backfilled boolean                     -- did we successfully replace?
  backfill_duration_seconds int
  replacement_interpreter_id → users(id)

reviews
  id, request_id unique → requests(id)
  reviewer_id, reviewee_id, rating (1–5), comment, created_at
```

Indexes: `users(email)`, `users(role)`, `requests(status)`, `requests(requester_id)`, `requests(interpreter_id)`, `requests(scheduled_at)`, `requests(payer_type)`, `profiles(latitude, longitude)`, `profiles(verification_status)`, `profiles(reliability_score)`, `credentials(user_id)`, `credentials(status)`, `credentials(expires_on)`, `cancellations(request_id)`, `cancellations(cancelled_by)`.

**`status = 'unfulfilled'` is the failure state we measure against.** It means every layer of the guarantee was exhausted and nobody served the requester. It should be rare, and every occurrence gets reviewed.

### Hosting

Postgres on **Neon** (free tier, scale-to-zero), `main` and `dev` branches. API on **Railway** (long-lived server required for sockets). Frontend on **Vercel**. ~$5/month. See [README](./README.md#deployment--cost).

Avatars and interpreter photos go to object storage, never as blobs in Postgres — the 0.5 GB ceiling arrives fast.

---

## 10. API contract

This table is the source of truth. The frontend client in `lib/api.js` must match it exactly — v1's client called five endpoints that didn't exist.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Create account. Body: `{role, firstName, lastName, email, password}` → `{token, user}` |
| POST | `/api/auth/login` | — | Body: `{email, password}` → `{token, user}` |
| GET | `/api/auth/me` | JWT | Current user + profile completeness flag |
| GET | `/api/profile` | JWT | Own profile |
| PUT | `/api/profile` | JWT | Create or update own profile (upsert) |
| POST | `/api/credentials` | JWT (interpreter) | Submit a credential for review |
| GET | `/api/credentials` | JWT (interpreter) | Own credentials + statuses |
| GET | `/api/admin/credentials?status=pending` | JWT (admin) | Review queue |
| PATCH | `/api/admin/credentials/:id` | JWT (admin) | Approve or reject. Requires `verification_note` |
| POST | `/api/requests` | JWT (deaf) | Create request (broadcast or direct) |
| GET | `/api/requests/mine` | JWT (deaf) | Own requests, `?status=` filter |
| GET | `/api/requests/:id` | JWT (party) | Single request detail |
| PATCH | `/api/requests/:id/cancel` | JWT (party) | Cancel; records classification |
| GET | `/api/requests/pending` | JWT (**verified** interpreter) | Nearby pending requests, `?radius=`. 403 if unverified |
| POST | `/api/requests/:id/accept` | JWT (**verified** interpreter) | Atomic claim. 403 if unverified, 409 if already taken |
| POST | `/api/requests/:id/decline` | JWT (interpreter) | Decline a direct request. **No reliability penalty** |
| PATCH | `/api/requests/:id/status` | JWT (interpreter) | `in_progress` / `completed` |
| GET | `/api/interpreters/nearby` | JWT | Nearby **available** interpreters with distance and reachability |
| PATCH | `/api/interpreters/availability` | JWT (interpreter) | Toggle available |
| PATCH | `/api/interpreters/reachability` | JWT (interpreter) | Driving / low-signal self-declaration |
| POST | `/api/reviews` | JWT | Phase 5 |
| GET | `/api/users/:id/reviews` | JWT | Phase 5 |

**Response envelope** — consistent everywhere:

```json
// success
{ "success": true, "data": { ... } }
// error
{ "success": false, "error": { "code": "REQUEST_ALREADY_ACCEPTED", "message": "Another interpreter accepted this request." } }
```

Status codes: 200 ok · 201 created · 400 validation · 401 no/bad token · 403 wrong role or unverified · 404 missing · 409 conflict · 500 server.

---

## 11. Success metrics

**The headline metric is fulfillment.** Everything else is secondary.

| Metric | Target | Measurement |
|---|---|---|
| **Fulfillment rate** | **≥ 99%** | requests reaching `completed` ÷ all non-requester-cancelled requests |
| **Unfulfilled requests** | **As close to 0 as possible** | count of `status = 'unfulfilled'` — every one is reviewed |
| Backfill success rate | ≥ 95% | `cancellations.backfilled = true` ÷ interpreter cancellations |
| Time to backfill | < 15 min median | `backfill_duration_seconds` |
| Same-day fulfillment | ≥ 90% of immediate requests | filled on the day posted |
| Time to first accept | < 10 min median | `accepted_at − created_at` for immediate requests |
| Interpreter last-minute cancellation rate | < 2% | `last_minute` + `no_show` ÷ accepted jobs |
| Coverage | 24/7/365 | no hour with zero available interpreters |
| Credential review turnaround | < 48h median | `verified_at − created_at` |
| Unverified interpreters accepting work | **0 — hard gate** | integration test + DB audit |
| axe critical/serious violations | 0 | CI + manual audit per phase |
| Lighthouse Accessibility | ≥ 95 every page | CI |

Portfolio outcome: a deployed URL, seeded demo accounts for every role, and a walkthrough that shows the guarantee working — including a staged cancellation that backfills automatically.

---

## 12. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| **Cannot keep the guarantee** — too few interpreters to backfill | **Critical** | Video fallback as the floor; launch in one metro with concentrated supply; don't promise 24/7 publicly until coverage data supports it |
| Cold-start supply — no interpreters, no reason for requesters | High | 75% split as the recruiting hook; seed demo accounts; recruit a core group in one borough before widening |
| Credential fraud — unqualified person takes a medical assignment | Critical | Hard server-side gate; manual RID registry verification incl. revoked list; background check; audited decisions |
| Reliability enforcement drives away scarce supply | High | Graduated and transparent consequences; `excused` class for real emergencies; appeals path; never silent throttling |
| Building for Deaf users without Deaf input | High | Testing with Deaf users across ages and tech comfort before Phase 1 sign-off; A1–A14 as hard gates |
| ACCES-VR vendor approval takes longer than the build | Medium | Start the application early; v2 doesn't depend on it; self-pay works without it |
| **Location privacy — broadcasting a Deaf user's home address** | **Critical** | Private mode (§5.0b): home requests never broadcast location. Approximate area before acceptance, exact only to the assigned traveling interpreter, nothing at all for video-only |
| Location privacy — sharing interpreter coordinates | High | Only during active requests, counterparty-only, throttled, stops on completion |
| Alert delivery failure — interpreter never sees the request | High | SMS-first with push as fast path; delivery monitored; an undelivered alert is a fulfillment risk, not a minor bug |
| Video fallback quality insufficient for real interpreting | High | Preserve video over audio under constraint — the video *is* the language; test on degraded connections |
| Scope — this is a large build for one person | High | Phase gates in SCOPE.md; portfolio-first target; nothing from a later phase starts before the current one closes |

---

## 13. Open questions

1. Pricing — what does an hour cost, and does it vary by setting or urgency? Needed before §7 is real.
2. Cancellation window and no-show policy for requesters — needs a number.
3. Video provider: Daily, Twilio, or direct WebRTC?
4. Simultaneous broadcast to all nearby interpreters, or sequential to the closest? Simultaneous for v2; revisit if it becomes a race-to-accept problem.
5. ~~Geographic launch — Buffalo or NYC?~~ **Resolved: New York City.** All seed data, demo accounts, and supply recruiting target NYC. The v1 hardcoded Buffalo coordinates (`42.8864, -78.8784`) are a bug to remove, not a signal. ACCES-VR is the relevant VR agency.
6. Migration tooling — `node-pg-migrate`, Prisma, or numbered SQL files? Decide before the first schema change after Phase 1.
7. Avatar and photo storage — R2, S3, or URLs only?
8. NY licensure status — legislation has been under consideration. Confirm before launch; it would change the credential gate.
9. DeafBlind users need tactile/ProTactile interpreting, a distinct skill. Is it a language, a credential, or a separate match dimension?
10. Team interpreting — assignments over ~1 hour conventionally need two interpreters rotating. Current model assigns one. Acknowledge in v2 or defer?
11. Do processing fees come off the top or out of the platform's 25%?
12. What is a backup interpreter paid for holding a slot they may not work?
13. Background check scope — criminal, work history, or both?
14. Who reviews credentials and appeals when it isn't Michael? Admin is one manual role with no delegation.
