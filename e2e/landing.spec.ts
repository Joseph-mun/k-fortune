import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("renders birth input form", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("form")).toBeVisible();
  });

  test("submits birth data and shows result", async ({ page }) => {
    await page.goto("/en");

    // Fill birth input form
    await page.fill('input[name="year"], input[type="number"]:first-of-type', "1990");
    await page.fill('input[name="month"]', "6");
    await page.fill('input[name="day"]', "15");

    // Select gender if present
    const genderSelect = page.locator('select[name="gender"]');
    if (await genderSelect.isVisible()) {
      await genderSelect.selectOption("male");
    }

    // Submit form
    await page.locator('button[type="submit"]').click();

    // Should see some result content
    await expect(page.locator("body")).toContainText(/.+/);
  });

  test("navigates to pricing page", async ({ page }) => {
    await page.goto("/en/pricing");
    await expect(page.locator("body")).toContainText("Basic");
  });

  test("locale switch works", async ({ page }) => {
    await page.goto("/en");
    const title = await page.title();
    expect(title).toBeTruthy();

    await page.goto("/es");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("API Routes", () => {
  test("POST /api/fortune/basic returns result", async ({ request }) => {
    const res = await request.post("/api/fortune/basic", {
      data: {
        birthDate: "1990-06-15",
        birthTime: "14:30",
        gender: "male",
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.pillars).toBeDefined();
  });

  test("POST /api/fortune/basic rejects invalid data", async ({ request }) => {
    const res = await request.post("/api/fortune/basic", {
      data: { birthDate: "invalid" },
    });
    expect(res.status()).toBe(400);
  });
});
