import { defineConfig } from "vitest/config";

// Unit tests only — Playwright specs live in e2e/ and run separately.
export default defineConfig({
  test: { include: ["src/**/*.test.{ts,tsx}"] },
});
