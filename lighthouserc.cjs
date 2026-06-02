/** @type {import('@lhci/cli').Config} */
module.exports = {
  ci: {
    collect: {
      ...(process.env.CHROME_PATH ? { chromePath: process.env.CHROME_PATH } : {}),
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/demo",
        "http://localhost:3000/pricing",
        "http://localhost:3000/customers",
      ],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        chromeFlags: [
          "--headless=new",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      },
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        "categories:performance": ["warn", { minScore: 0.55 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "total-blocking-time": ["warn", { maxNumericValue: 600 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 4500 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lighthouseci",
    },
  },
};
