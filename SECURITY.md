# Security review checklist

- Verify all required environment variables are present only in Vercel settings.
- Enable a production authentication provider before exposing protected routes.
- Implement rate limiting for authentication, contact, checkout and AI routes before activation.
- Verify Stripe webhook signatures and event-id idempotency before enabling billing.
- Review CSP after every third-party integration.
- Run migrations from a controlled, database-connected environment.
