# DecisionIQ

### Smarter Decisions. Guaranteed.

DecisionIQ is a full-stack decision intelligence platform that turns complex, multi-variable choices into a structured, math-driven process. Break any dilemma into weighted criteria and scored options — the engine calculates the optimal choice so you never rely on gut feelings again.

---

## How It Works

```
1. Create a decision     →  "Which car should I buy?"
2. Add options            →  Tesla Model 3, Toyota Camry, Honda Civic
3. Define weighted criteria  →  Safety (w:4), Price (w:3), Comfort (w:2)
4. Score each option      →  Rate 1–10 in an interactive heatmap matrix
5. Evaluate               →  Engine ranks all options with full breakdowns
```

---

## Features

| Category | Details |
|----------|---------|
| **Heatmap Score Matrix** | Color-coded grid (red → green) for rating each option against every criterion |
| **Weighted Evaluation Engine** | Instant ranked results with score breakdowns (value x weight = points) |
| **Dashboard Analytics** | Stat cards, decision overview, search, and demo heatmap for new users |
| **Auth Flow** | Register → auto-login → dashboard. JWT-based with bcrypt password hashing |
| **Full CRUD** | Create, read, update, delete for decisions, options, criteria, and scores |
| **Paginated API** | `?page=1&limit=10` with total count and page metadata |
| **Rate Limiting** | Auth endpoints throttled (20 req / 15 min) to prevent brute-force |
| **Global Error Handler** | Centralized middleware with `AppError` class and proper HTTP status codes |
| **Input Validation** | Zod schemas enforced via middleware before any controller logic runs |
| **Cascading Deletes** | Deleting a decision automatically wipes all orphaned options, criteria, and scores |
| **Graceful Shutdown** | Clean Prisma disconnect and HTTP server close on SIGTERM/SIGINT |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| **Backend** | Node.js, Express 5, TypeScript, Prisma ORM |
| **Database** | PostgreSQL (Neon) |
| **Auth** | JWT + bcryptjs |
| **Validation** | Zod (server-side middleware + client-side forms) |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Forest Green | `#1B4332` | Sidebar, headings, primary text |
| Teal | `#38A3A5` | Buttons, accents, links, winner states |
| Mint | `#52B788` | Progress bars, gradients |
| Mint Background | `#F8FCFA` | Auth panels, empty states, subtle backgrounds |
| Border | `#D0D7DE` | Card borders, dividers |
| Font | Plus Jakarta Sans | 400 body, 600 labels, 700 headings |
| Border Radius | 12–16px | All cards, inputs, and buttons |

---

## Project Structure

```
DecisionIQ/
├── backend/
│   ├── src/
│   │   ├── config/env.ts              # Zod-validated environment variables
│   │   ├── controllers/
│   │   │   ├── auth.controllers.ts    # Register & login
│   │   │   ├── decision.controller.ts # Decision CRUD + evaluate
│   │   │   ├── option.controller.ts   # Option CRUD
│   │   │   ├── criterion.controller.ts
│   │   │   └── score.controller.ts    # Score create & update
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts      # JWT verification
│   │   │   ├── error.middleware.ts     # Global error handler + AppError
│   │   │   └── validate.middleware.ts  # Reusable Zod validation
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   └── decision.routes.ts     # All nested resource routes
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── decision.service.ts    # Includes evaluation engine
│   │   │   ├── option.service.ts
│   │   │   ├── criterion.service.ts
│   │   │   └── score.service.ts
│   │   ├── utils/db.ts               # Prisma client singleton
│   │   ├── app.ts                     # Express app + middleware stack
│   │   └── server.ts                  # Entry point + graceful shutdown
│   ├── prisma/
│   │   └── schema.prisma
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GlassCard.tsx          # Reusable animated card
│   │   │   ├── Sidebar.tsx            # Forest green sidebar with nav + CTA
│   │   │   └── ProtectedRoute.tsx     # Auth guard
│   │   ├── context/
│   │   │   └── AuthContext.tsx         # JWT auth state + localStorage persistence
│   │   ├── lib/
│   │   │   └── api.ts                 # Axios instance + all API functions
│   │   ├── pages/
│   │   │   ├── Login.tsx              # Split-panel login (form + results preview)
│   │   │   ├── Register.tsx           # Split-panel register (features + form)
│   │   │   ├── Dashboard.tsx          # Stat cards, search, decision list, demo heatmap
│   │   │   └── DecisionDetail.tsx     # Options, criteria, score heatmap, evaluate, results
│   │   ├── App.tsx                    # Router + sidebar layout
│   │   ├── main.tsx                   # Entry point
│   │   └── index.css                  # Tailwind + design tokens + component classes
│   ├── package.json
│   └── vite.config.ts
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** (local or hosted — e.g., [Neon](https://neon.tech), Supabase)
- **npm**

### 1. Clone

```bash
git clone https://github.com/yourusername/DecisionIQ.git
cd DecisionIQ
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/decisioniq
JWT_SECRET=your_jwt_secret_at_least_10_chars
```

Run migrations and start:

```bash
npx prisma migrate dev --name init
npm run dev
```

API runs at `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`. Vite proxies `/api` to `localhost:3000` automatically.

---

## API Reference

All protected routes require `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ email, password }` | Create account |
| `POST` | `/api/auth/login` | `{ email, password }` | Get JWT token |

### Decisions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/decisions` | Create decision `{ title }` |
| `GET` | `/api/decisions?page=1&limit=10` | List decisions (paginated) |
| `GET` | `/api/decisions/:id` | Get decision with all nested data |
| `PATCH` | `/api/decisions/:id` | Update title `{ title }` |
| `DELETE` | `/api/decisions/:id` | Delete with cascading cleanup |

### Options

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/decisions/:id/options` | Add option `{ name }` |
| `PATCH` | `/api/decisions/:id/options/:optionId` | Update `{ name }` |
| `DELETE` | `/api/decisions/:id/options/:optionId` | Remove option |

### Criteria

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/decisions/:id/criteria` | Add criterion `{ name, weight }` |
| `PATCH` | `/api/decisions/:id/criteria/:criterionId` | Update `{ name?, weight? }` |
| `DELETE` | `/api/decisions/:id/criteria/:criterionId` | Remove criterion |

### Scores

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/decisions/:id/scores` | Assign `{ optionId, criterionId, value }` |
| `PATCH` | `/api/decisions/:id/scores/:scoreId` | Update `{ value }` |

### Evaluate

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/decisions/:id/evaluate` | Run calculation engine |

**Response:**
```json
{
  "winner": {
    "name": "Tesla Model 3",
    "totalScore": 38.5,
    "breakdown": [
      { "criterionName": "Safety", "originalValue": 9, "weightApplied": 4, "calculatedPoints": 36 }
    ]
  },
  "rankings": [...]
}
```

---

## Database Schema

```
User ──< Decision ──< Option ──< Score >── Criterion >── Decision
```

| Model | Key Fields | Notes |
|-------|-----------|-------|
| **User** | email, password (hashed) | One-to-many with Decisions |
| **Decision** | title, userId | Scoped to authenticated user |
| **Option** | name, decisionId | Cascade delete from Decision |
| **Criterion** | name, weight (1-5), decisionId | Cascade delete from Decision |
| **Score** | value (1-10), optionId, criterionId | `@@unique([optionId, criterionId])` |

---

## Architecture

```
Client (React + Vite)
  ↓  HTTP / Axios
Router → Rate Limit → Auth Middleware → Validation Middleware
  ↓
Controller (extracts params, returns response)
  ↓
Service (business logic + evaluation engine)
  ↓
Prisma ORM → PostgreSQL
```

**Security layers:** Helmet headers, CORS (frontend origin), rate limiting on auth, JWT verification, Zod input validation, user-scoped data queries, cascading deletes.

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `3000` | Backend server port |
| `NODE_ENV` | No | `development` | Environment mode |
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | — | JWT signing key (min 10 chars) |
| `FRONTEND_URL` | No | — | Production frontend URL for CORS |

---

## License

ISC
