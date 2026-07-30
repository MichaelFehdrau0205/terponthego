# TERP / on the go

On-demand **signed language** interpreting, 24/7. A Deaf user posts a request from their phone; nearby verified interpreters are alerted instantly; the first to respond **opens video immediately** — interpreting starts in seconds, and continues in person when they arrive.

**The product is reliability, not speed.**

Existing agencies cancel. Someone books an interpreter, arranges their whole day around it, and gets cancelled on the morning of a medical appointment. TERP is built so that one interpreter's cancellation never becomes the Deaf person's problem: automatic backfill, pre-assigned backups on high-stakes jobs, and video as the floor beneath everything.

**The promise: you will not be left without an interpreter.**

Interpreters must hold a verified national certification, pass a background check, and show a face photo before accepting any work. That gate is enforced server-side, not in the UI. They keep **75%** of the job value.

Signed language only — ASL at launch, **New York City** the launch market.

**The live map** uses two plain solid dots — blue for Deaf users, red for available interpreters. Every red dot is someone who can actually take the job. The moment an interpreter accepts, their dot leaves everyone else's map and becomes visible only to the Deaf user they're helping, who watches it move closer. That tracking isn't navigation; it's a promise being kept in real time. Requests made from home never appear on the map at all. Spec: [PAGES-GOALS](./PAGES-GOALS.md#the-live-map--marker-system).

Originally built October 2025 during Pursuit L1. This repo is the **v2 rebuild**: same stack, cleaner architecture, real-time matching, and an actual deploy.

- **Repo:** https://github.com/MichaelFehdrau0205/terponthego
- **Docs:** [PRD.md](./PRD.md) · [SCOPE.md](./SCOPE.md) · [SPRINT.md](./SPRINT.md) · [PAGES-GOALS.md](./PAGES-GOALS.md)

---

## Stack

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite 7, React Router 7, Tailwind 4 |
| Maps | Leaflet + react-leaflet, OpenRouteService for turn-by-turn |
| HTTP | Axios (single shared client) |
| Backend | Node + Express 5 |
| Database | PostgreSQL (`pg`) — hosted on [Neon](https://neon.com) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Real-time (v2) | Socket.IO |
| Hosting | Frontend: Vercel · API: Railway · DB: Neon |

---

## Getting started

**Prerequisites:** Node 20+, an [OpenRouteService](https://openrouteservice.org/) API key (free tier), and either local PostgreSQL 14+ or a Neon account.

```bash
git clone https://github.com/MichaelFehdrau0205/terponthego.git
cd terponthego
```

### 1. Database

**Option A — Neon (recommended).** Create a project at [neon.com](https://neon.com), then copy the connection string from the dashboard. Create two branches: `main` (production) and `dev` (local development), so local work never touches production data.

```bash
psql "$DATABASE_URL" -f backend/database_schema.sql
```

**Option B — local Postgres.**

```bash
createdb terp_db
psql terp_db -f backend/database_schema.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in the values below
npm run dev               # http://localhost:5000
```

`backend/.env`:

```
PORT=5000
# Neon (note: sslmode=require is mandatory)
DATABASE_URL=postgresql://<user>:<pass>@<host>.neon.tech/terp_db?sslmode=require
# or local: postgresql://localhost:5432/terp_db
JWT_SECRET=<generate: openssl rand -base64 32>
JWT_EXPIRES_IN=7d
ORS_API_KEY=<openrouteservice key>
CLIENT_ORIGIN=http://localhost:5173
```

> **Never commit `.env`.** Only `.env.example`, with placeholder values, belongs in git.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev               # http://localhost:5173
```

`frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

---

## Project structure (v2 target)

All planning documents live at the repo root. `backend/` and `frontend/` contain code only.

```
terponthego/
├── README.md                    # you are here
├── PRD.md                       # what we're building and why
├── SCOPE.md                     # phases and gates
├── SPRINT.md                    # tickets
├── PAGES-GOALS.md               # per-page specs
├── backend/
│   ├── database_schema.sql
│   ├── src/
│   │   ├── server.js            # express app + socket.io bootstrap
│   │   ├── db.js                # single pg Pool
│   │   ├── config/              # env loading + validation
│   │   ├── middleware/          # auth, requireRole, errorHandler, validate
│   │   ├── routes/              # auth, profile, requests, interpreters
│   │   ├── controllers/         # thin — parse, call service, respond
│   │   ├── services/            # business logic, all SQL lives here
│   │   └── sockets/             # request + location channels
│   └── tests/
└── frontend/
    └── src/
        ├── main.jsx
        ├── App.jsx              # routes only
        ├── routes/              # ProtectedRoute, RoleRoute
        ├── pages/               # ONE component per route (see PAGES-GOALS.md)
        │   ├── auth/
        │   ├── deaf/
        │   ├── interpreter/
        │   ├── admin/
        │   └── shared/
        ├── components/          # reusable, no page logic
        ├── context/             # AuthContext, SocketContext
        ├── hooks/               # useRequests, useNearbyInterpreters, useGeolocation
        ├── lib/api.js           # single axios client, all endpoints
        └── styles/              # tokens.css + Tailwind config
```

**Rule:** `pages/` owns routes and data fetching. `components/` is presentational and reusable. Nothing in `components/` calls `fetch` directly.

---

## Scripts

```bash
# backend
npm run dev        # nodemon
npm start          # node src/server.js
npm run setup-db   # run schema against DATABASE_URL
npm test           # vitest

# frontend
npm run dev
npm run build
npm run preview
npm run lint
```

---

## What went wrong in v1 (audit)

Documented so the rebuild doesn't repeat it. Every item below is a real defect found in the v1 `main`.

| # | Problem | Evidence | Fix in v2 |
|---|---|---|---|
| 0 | **No credential gate.** `certification` was a free-text `VARCHAR(255)` an interpreter typed themselves, never checked by anyone, and `accept` had no verification check. Anyone who signed up as an interpreter could accept a medical appointment. | `backend/database_schema.sql`, `requestController.acceptRequest` | Hard server-side gate; manual review against the RID registry; audited decisions |
| 1 | **Schema drift.** `database_schema.sql` defines one `users` table with a `user_type` column, but `authController.js` inserts into `deaf_users` and `interpreters`. The committed schema cannot run the committed code. | `backend/database_schema.sql` vs `backend/src/controllers/authController.js` | One canonical schema, migrations checked in, no hand-edited tables |
| 2 | **Two conflicting API base URLs, neither configurable.** The server listens on `:5000` and `utils/api.js` targets `:5000` — but **10 component files** bypass the axios client entirely with raw `fetch` calls hardcoded to `http://localhost:3001`. Those components can never reach the backend. | `backend/src/server.js` vs `frontend/src/components/*.jsx` (10 files) | `VITE_API_URL` env var, one axios client, zero raw `fetch` calls |
| 3 | **API client doesn't match the backend.** `api.js` calls `/auth/login/deaf`, `/requests/available`, `/users/profile`; backend actually exposes `/auth/login`, `/requests/pending`, `/profile/me`. | `frontend/src/utils/api.js` vs `backend/src/routes/*.js` | Endpoint table in PRD.md is the contract; client generated from it |
| 4 | **Duplicate pages.** `components/DeafDashboard.jsx` (227 lines, CSS-variable styling) and `pages/deaf/DeafDashboard.jsx` (73 lines, Tailwind) both exist. Same for the interpreter dashboard, request form, and requests list. | `frontend/src/components/` vs `frontend/src/pages/` | Delete `components/` duplicates; one component per route |
| 5 | **Broken routing.** `App.jsx` registers `path="/"` twice (Login then Signup — the second is unreachable), imports six components it never routes to, and has no route for signup, create-request, or view-requests. | `frontend/src/App.jsx` | Full route table, no duplicates, every page reachable |
| 6 | **No auth guard.** `PrivateRoute.jsx` is an empty file. Every dashboard is reachable by URL without a token. | `frontend/src/components/PrivateRoute.jsx` (0 bytes) | `ProtectedRoute` + `RoleRoute`, tested |
| 7 | **Four competing style systems.** `styles.css` (265 lines of CSS vars), `App.css`, `styles/HomePage.css`, per-page CSS files, plus Tailwind. Theme changed three times across commits (wine red → grass green → new design). | `frontend/src/` CSS files, git log | One `tokens.css` + Tailwind theme extension. Design tokens defined once. |
| 8 | **Hardcoded location.** `MapView`, `TrackingMapView`, and `InterpreterDashboard` all hardcode `42.8864, -78.8784` (Buffalo) as "Your Location", while the seed data is New York City. | `frontend/src/components/MapView.jsx`, `TrackingMapView.jsx`, `InterpreterDashboard.jsx` | Real geolocation with a permission-denied fallback; coords come from the profile |
| 9 | **No accessibility work** in a product built for Deaf users — no skip links, no focus management, no ARIA on the map, status conveyed by emoji and color alone. | throughout | WCAG 2.1 AA is a release gate, not a nice-to-have (see PRD §8) |
| 10 | **No tests, no error boundaries, no `.env.example`, no deploy.** `npm test` exits 1. Secrets have no documented shape. Project only ever ran on localhost. | `backend/package.json` | Vitest on services + auth, error boundary per route, `.env.example` committed, deployed URL in this README |

Additional smaller issues: `console.log` debugging left in production paths (`🎨 NEW DASHBOARD LOADING!`), `bcrypt` **and** `bcryptjs` both installed, a stray `backend/nodemon` file and `backend/terp-on-the-go-backend@1.0.0` artifact committed, `users.js` routes registered nowhere in `server.js`, and `app.use(cors())` with no origin restriction — harmless on localhost, not acceptable once deployed.

---

## Deployment & cost

Target: **~$5/month total.**

| Piece | Host | Plan | Cost |
|---|---|---|---|
| Postgres | Neon | Free (0.5 GB, 100 compute-hours/mo, scales to zero) | $0 |
| API + Socket.IO | Railway | Hobby (includes $5 usage credit) | $5/mo |
| Frontend | Vercel | Hobby | $0 |
| Routing/geocoding | OpenRouteService | Free tier | $0 |

**Why this split.** The backend connects with a plain `pg` Pool, so Neon is a connection-string swap — no code changes and no vendor SDK. Neon scales to zero when idle, which suits a low-traffic portfolio app, and its paid tier is pure usage-based with no monthly minimum, so outgrowing free costs cents rather than jumping to a flat $25. Railway hosts the API because Socket.IO needs a long-lived server, not serverless functions.

**Budget guardrails**

- Set a spend limit in both the Neon and Railway dashboards before adding a card
- Use a Neon **branch** for development so local work never writes to production data
- Watch the 0.5 GB storage ceiling — seed data and test requests are tiny, but uploaded photos are not. Store images on an object store or use URLs, never base64 blobs in Postgres
- Neon cold starts add roughly a second on first request after idle. Acceptable here; if it isn't, that's the trigger to move to a paid compute tier

**Pricing changes often — verify on the official pages ([Neon](https://neon.com/pricing), [Railway](https://railway.app/pricing)) before entering payment details.** Figures above were current as of July 2026.

### Deploy checklist

- [ ] Neon project created, `main` and `dev` branches set up
- [ ] Schema applied to both branches
- [ ] Railway service connected to the repo, root directory `backend/`
- [ ] Railway env vars set (`DATABASE_URL` pointing at Neon `main`, `JWT_SECRET`, `ORS_API_KEY`, `CLIENT_ORIGIN`)
- [ ] Vercel project pointed at `frontend/`, `VITE_API_URL` set to the Railway URL
- [ ] CORS on the backend restricted to the Vercel origin — not `cors()` with no options
- [ ] Spend limits set on both dashboards
- [ ] Seeded demo accounts verified on the live URL

---

## Roadmap

Phased in [SCOPE.md](./SCOPE.md). Short version:

- **Phase 0 — Foundation:** schema, Neon, PWA shell, mobile-first tokens, auth guards
- **Phase 1 — Core loop:** signup → profile → **credential + background gate** → request → accept → complete
- **Phase 2 — Instant alerts + GPS:** SMS/push to nearby interpreters, live tracking
- **Phase 3 — Video:** connect on accept, continue en route, video-only when nobody can travel
- **Phase 4 — The guarantee:** auto-backfill, backup interpreters, reliability enforcement
- ⬆ **portfolio v2 ships here**
- **Phase 5 — Payments (test mode) + reviews:** Stripe Connect, 75/25, three payer types
- **Phase 6 — Real-service readiness:** live background vendor, ACCES-VR status, legal review

Phases 2–4 are the guarantee. v2 isn't real without all three.

### Credential verification

Interpreters submit a national certification (RID NIC, RID CDI, BEI, NAD). An admin verifies the number against the [public RID registry](https://myaccount.rid.org/Public/Search/Member.aspx), confirms the name matches, and checks it isn't on the revoked-certifications list. Every decision is recorded with a reviewer, timestamp, and note.

An interpreter must clear **all three** before accepting any work:

1. **Verified certification** — checked against the issuing body's public registry
2. **Background check** — run through a third-party vendor (Checkr/Sterling/Accurate), who is the consumer reporting agency. TERP carries FCRA obligations as the *user* of the report: written disclosure, consent, and a proper adverse-action process. Flow is built in Phase 1 with the vendor call stubbed; wired live in Phase 6
3. **Face photo** — the Deaf user must know who is arriving

Until all three pass, the interpreter cannot appear in search results, see pending requests, or accept anything — enforced by middleware, tested by attacking the API directly. Credentials carry expiry dates and are re-checked daily.

TERP does **not** issue, endorse, or adjudicate credentials. It verifies against the issuing body. The UI must never suggest otherwise.

State licenses and request settings (medical, legal, educational) are captured in the schema but not enforced in v2 — [31 of 51 states require a state license or registration](https://rid.org/programs/gap/state-by-state-regulations/), and states like Wisconsin and Illinois gate medical and court work on additional qualification. NY doesn't currently mandate general licensure, which is why it's the launch market. Enforcement ships with multi-state expansion.

Full rules: [PRD §6.4](./PRD.md#64-credential-verification) and [§7.3](./PRD.md#7-money).

---

## License

ISC
