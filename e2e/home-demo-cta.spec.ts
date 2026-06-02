import { test, expect } from "@playwright/test";

test("homepage demo CTA banner links to /demo", async ({ page }) => {
  await page.goto("/");
  const demoLink = page
    .getByRole("main")
    .getByRole("link", { name: /데모 영상 보기|Watch demo/i })
    .first();
  await expect(demoLink).toBeVisible();
  await expect(demoLink).toHaveAttribute("href", "/demo");
});
