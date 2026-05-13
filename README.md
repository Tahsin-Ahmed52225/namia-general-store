# The Miracle of Namia General Store

Anonymous letter exchange portal. Users write under a fake name + PIN. Admin replies. Letters expire in 24 hours.

## Quick Start (Docker)

```bash
# Edit secrets in .env first
nano .env   # change ADMIN_PASSWORD and JWT_SECRET

docker compose up --build

# Open http://localhost:3000
```

## Environment Variables (`.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL URL (pre-set for Docker Compose) |
| `ADMIN_PASSWORD` | Admin login password |
| `JWT_SECRET` | JWT signing secret (min 32 chars) |
| `CRON_SECRET` | Bearer token for `/api/cron/cleanup` |

## Local Development

```bash
cp .env .env.local
# Update DATABASE_URL to your local PostgreSQL

npm install
npx prisma migrate deploy
npm run dev
```

## Routes

| Path | Description |
|---|---|
| `/` | Letter dock (public) + hero |
| `/write` | Write an anonymous letter |
| `/unlock/[id]` | Unlock letter with PIN |
| `/admin` | Admin login |
| `/admin/dashboard` | Admin reply panel |

## Architecture

- **Next.js 16** (App Router, standalone output)
- **PostgreSQL** via Prisma 7 + `@prisma/adapter-pg`
- **Docker Compose**: `app` + `db` + `cron` services
- **Auth**: bcrypt PIN hashing, httpOnly JWT cookie for admin
- **Privacy**: no real names/emails/IPs stored; PIN is bcrypt-hashed (one-way)
