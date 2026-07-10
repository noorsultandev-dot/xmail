# XMail

A personal, single-user, multi-mailbox email marketing platform built with React, Vite, Tailwind, Framer Motion, Node, Express, SQLite, Prisma, Bull, Redis, Nodemailer, PapaParse, csv-parse and Recharts.

## What is implemented

1. **Database schema**: Every operational table is scoped to `environmentId`. SMTP credentials are encrypted with AES-256-GCM before storage.
2. **Environment management API**: Create, update, clone and delete mail environments. Each environment stores independent SMTP settings, rate limit and quota metadata.
3. **CSV import wizard**: Browser-side worker parsing for column discovery and server-side streaming import, validation and per-environment deduplication.
4. **Campaign engine**: Draft campaigns, merge tags, A/B subject variants, environment-scoped recipients, Bull jobs, retry/backoff and bounce classification.
5. **Scheduling**: One-time, daily and weekly jobs checked every minute. Missed sends can be fired or flagged according to `MISSED_SEND_POLICY`.
6. **Analytics**: Sent, open, click and bounce events with a tracking pixel, redirect tracking and global/environment dashboards.
7. **Settings**: Persistent app settings API plus instant theme and motion controls in the UI.
8. **Design system**: Four-color glassmorphism UI, animated gradient mesh, responsive shell and Framer Motion transitions.

## Local setup

```bash
cp .env.example .env
# Generate a key, then paste it into SMTP_ENCRYPTION_KEY
openssl rand -hex 32

docker compose up -d redis
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:4000`.

## Production notes

- Put the API behind HTTPS before using open/click tracking.
- Use a persistent volume for SQLite and Redis.
- Restrict access at the reverse proxy or private network because this build intentionally has no login system.
- Add SPF, DKIM and DMARC records at the domain level.
- Confirm applicable anti-spam and privacy requirements before sending campaigns. Even though XMail does not implement unsubscribe handling by design, some jurisdictions and providers may require it.

## Next production-hardening tasks

- Add a complete rich-text editor such as TipTap or Lexical.
- Add environment create/edit/clone modal UI; the backend endpoints are ready.
- Add tag segment query-builder UI.
- Add Redis-backed dynamic rate limiting per environment rather than queue-wide concurrency only.
- Add A/B winner evaluation window and automatic remainder dispatch.
- Add CSV/JSON backup download endpoints and restore validation.
- Add test suites, audit logging, CSRF protection and reverse-proxy access controls.
