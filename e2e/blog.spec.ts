import { test, expect } from "@playwright/test";

test("blog list shows posts in Korean by default", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link").filter({ hasText: /스타트업|지식|AI Q&A/ }).first()).toBeVisible();
});

test("blog list shows English posts with en locale cookie", async ({ page, context }) => {
  await context.addCookies([
    {
      name: "geck0-locale",
      value: "en",
      domain: "localhost",
      path: "/",
    },
  ]);
  await page.goto("/blog");
  await expect(page.getByRole("link").filter({ hasText: /startup|silos|accuracy/i }).first()).toBeVisible();
});

test("blog post page renders markdown", async ({ page }) => {
  await page.goto("/blog/startup-timing");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/타이밍|moments/i);
});
