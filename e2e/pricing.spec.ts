import { test, expect } from "@playwright/test";

test("pricing page shows plans and FAQ", async ({ page }) => {
  await page.goto("/pricing");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("text=Starter").first()).toBeVisible();
  await expect(page.locator("text=Growth").first()).toBeVisible();
});
