# @bitriel/backend

Simple Express API with JWT auth helpers.

## Getting started

1. Copy `.env.example` to `.env` and set a strong `JWT_SECRET`.
2. Install dependencies from the repo root: `pnpm install`.
3. Start the API: `pnpm --filter @bitriel/backend dev`.

## Routes

- `GET /health` – readiness probe.
- `POST /auth/token` – provide `{ "userId": "<id>", "roles": ["admin"] }` to receive a signed JWT.
- `GET /me` – attach `Authorization: Bearer <token>` to inspect the decoded claims.

`JWT_EXPIRES_IN` (default `15m`) controls token lifetime.
