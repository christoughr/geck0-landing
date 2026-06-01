export async function register() {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN) {
    await import("../sentry.server.config");
  }
}