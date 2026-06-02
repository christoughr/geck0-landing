import { test, expect } from "@playwright/test";

test("new blog posts are listed", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("link", { name: /RAG security|RAG 보안/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Slack \+ Notion|슬랙 \+ 노션/i })).toBeVisible();
});

test("rag-security post opens", async ({ page }) => {
  await page.goto("/blog/rag-security");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
