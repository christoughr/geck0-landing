export const siteConfig = {
  name: "geck0",
  tagline: "지식이 연결될 때, 회사가 진화합니다",
  email: "hello@geck0.ai",
  domain: "geck0.ai",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://app.geck0.ai",
  statusUrl: process.env.NEXT_PUBLIC_STATUS_URL ?? "/status",
  twitter: "@geck0_ai",
  linkedin: "https://linkedin.com/company/geck0",
  betaCustomerCount: process.env.NEXT_PUBLIC_BETA_COUNT ?? "47",
  trialDays: 1,
};

export type FooterLink = { href: string; external?: boolean };

export const footerLinks = {
  product: [
    { href: "/#knowledge-graph" },
    { href: "/#ai-qa" },
    { href: "/#insight-pulse" },
    { href: "/integrations" },
  ],
  company: [
    { href: "/about" },
    { href: "/blog" },
    { href: "/careers" },
    { href: "/press" },
  ],
  support: [
    { href: "/docs" },
    { href: "/docs/api" },
    { href: "/support" },
    { href: "/status" },
  ],
  legal: [
    { href: "/privacy" },
    { href: "/terms" },
    { href: "/cookies" },
  ],
} satisfies Record<string, FooterLink[]>;

export const featureAnchors = ["knowledge-graph", "ai-qa", "insight-pulse"] as const;
