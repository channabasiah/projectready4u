# ProjectReady4U

Next.js 14 + TypeScript starter for ProjectReady4U.

Features included in this scaffold:
- Next.js App Router structure
- Tailwind CSS setup
- Basic pages: homepage, project details, admin dashboard (scaffold)
- API route stubs for projects & requests
- `lib/db.ts` and `lib/email.ts` placeholders for Turso/Resend

Environment variables (set in Vercel or .env):
- `DATABASE_URL` - Turso connection URL
- `DATABASE_AUTH_TOKEN` - Turso auth token
- `RESEND_API_KEY` - Resend API key
- `ADMIN_EMAIL` - admin email
- `ADMIN_PASSWORD` - admin password for local credential auth
- `NEXTAUTH_SECRET` - NextAuth secret

Setup:

1. Install dependencies:
```bash
npm install
```

2. Run dev server:
```bash
npm run dev
```

Deploy: push to Vercel and configure environment variables.
