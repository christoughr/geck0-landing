import { test, expect } from "@playwright/test";

test("app gate shows login and waitlist", async ({ page }) => {
  await page.goto("/app");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/geck0/i);
  await expect(page.locator("#app-beta-email")).toBeVisible();
  await expect(page.getByText(/웨이트리스트|waitlist/i).first()).toBeVisible();
});
