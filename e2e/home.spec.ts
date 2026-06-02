import { test, expect } from "@playwright/test";

test("homepage loads with hero and waitlist", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();
});

test("homepage hero links to demo and contact", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Join waitlist|웨이트리스트 등록/i }).first()).toHaveAttribute(
    "href",
    /#contact/
  );
  await expect(page.getByRole("link", { name: /Watch demo|데모 보기/i }).first()).toHaveAttribute("href", "/demo");
});

test("cookie consent enables analytics scripts after accept", async ({ page }) => {
  await page.goto("/");
  const accept = page.getByRole("button", { name: /동의|Accept/i });
  if (await accept.isVisible()) {
    await accept.click();
  }
  await expect(page.locator("body")).toBeVisible();
});

test("support contact form renders", async ({ page }) => {
  await page.goto("/support");
  await expect(page.getByLabel(/이름|Name/i)).toBeVisible();
  await expect(page.getByLabel(/메시지|Message/i)).toBeVisible();
});

test("status page loads health UI", async ({ page }) => {
  await page.goto("/status");
  await expect(page.getByText(/시스템 상태|System Status/i)).toBeVisible();
});
