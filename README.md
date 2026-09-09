# XiantronOS

XiantronOS is a modular Next.js foundation for AI-assisted learning in cybersecurity, privacy, AI, networking and digital trust.

## Status
Only XiantronOS is active. Other named ecosystem initiatives are displayed as roadmap items. Authentication, Stripe and AI delivery remain deliberately disabled until their production providers and secrets are configured.

## Local setup
1. Copy `.env.example` to `.env.local` and configure a managed PostgreSQL database.
2. Run `npm install`, `npx prisma generate`, then `npm run dev`.
3. Apply database migrations deliberately with `npx prisma migrate dev --name init` locally or `npm run db:migrate:deploy` in a controlled production job.

## Security checklist
- Never commit `.env.local` or secret values.
- Configure production values in Vercel Environment Variables.
- Use verified Stripe webhooks for billing entitlements.
- Add an auth provider before enabling protected product routes.
- Review CSP and rate limiting when external services are enabled.
