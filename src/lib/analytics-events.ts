/** Fire conversion events after cookie consent (Plausible + GA4). */

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackWaitlistSignup(source: string): void {
  if (typeof window === "undefined") return;
  window.plausible?.("Waitlist Signup", { props: { source } });
  window.gtag?.("event", "waitlist_signup", { source });
}

export function trackContactSubmit(): void {
  if (typeof window === "undefined") return;
  window.plausible?.("Contact Submit");
  window.gtag?.("event", "contact_submit");
}
