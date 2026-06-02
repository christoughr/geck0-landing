import { test, expect } from "@playwright/test";

test("customers page lists anonymized stories", async ({ page }) => {
  await page.goto("/customers");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/고객|customer/i);
  await expect(
    page.getByRole("main").getByRole("link", { name: /Watch demo|데모 보기/i })
  ).toBeVisible();
});
