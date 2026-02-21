# Decision Intelligence Platform (Backend)

## Project Overview
A production-ready Decision Intelligence Platform built to help users make complex decisions using weighted scoring models and sensitivity analysis.

## Tech Stack
- **Runtime:** Node.js + Express
- **Language:** TypeScript (Strict Mode)
- **Database:** PostgreSQL (via Neon.tech)
- **ORM:** Prisma (v5.10.2)
- **Architecture:** Controller-Service-Repository (3-Layer)

## Project Structure
```text
src/
├── config/         # Environment variables
├── controllers/    # Request handlers
├── services/       # Business logic
├── routes/         # API endpoints
├── utils/          # Helpers (DB connection)
├── app.ts          # App configuration
└── server.ts       # Server entry point

## Features Implemented So Far

### Phase 1 & 2: Project Setup & Authentication
* Fully typed Express server environment.
* Secure User Registration with password hashing (bcrypt).
* User Login with JWT generation.
* Custom Auth Middleware to protect private routes.

### Phase 3: The Core Engine (Decisions)
* Create new decisions linked to specific users.
* Fetch all decisions belonging to the authenticated user.
* Fetch a single decision with all its nested relationships (Options, Criteria, Scores).
* Strict route protection preventing cross-user data access.

### Phase 4: The Decision Matrix (Options & Criteria)
* Relational database schema linking Decisions, Options, Criteria, and Scores.
* Cascading deletes (removing a decision removes all its associated data).
* API endpoints to dynamically add Options to a specific Decision.

## Getting Started

1. **Install dependencies:** `npm install`
2. **Setup Environment:** Create a `.env` file with `DATABASE_URL` and `JWT_SECRET`.
3. **Sync Database:** `npx prisma db push`
4. **Run Development Server:** `npm run dev`

---
*Built with modern backend architecture principles: Route -> Middleware -> Controller -> Service.*