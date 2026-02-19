# Decision Intelligence Platform (Backend)

## Project Overview
A production-ready Decision Intelligence Platform built to help users make complex decisions using weighted scoring models and sensitivity analysis.

## 🛠 Tech Stack
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