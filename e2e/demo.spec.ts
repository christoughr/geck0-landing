import { test, expect } from "@playwright/test";

test("demo page shows product walkthrough video", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.locator("video")).toBeVisible();
});

test("demo page interactive mockup switches scenarios", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/데모|Demo/i);
  await expect(page.getByText(/샘플 질문|sample question/i)).toBeVisible();

  const scenarioButtons = page.getByRole("button", { name: /^Q[123]$/ });
  await expect(scenarioButtons).toHaveCount(3);
  await scenarioButtons.nth(1).click();
  await expect(page.locator(".text-teal-400").first()).toBeVisible();
});

test("openapi spec is downloadable", async ({ page, request }) => {
  const res = await request.get("/openapi.yaml");
  expect(res.ok()).toBeTruthy();
  const text = await res.text();
  expect(text).toContain("openapi:");
});
