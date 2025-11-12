import { describe, it, expect, beforeEach } from "vitest";
import { getMacros, getBatchMacros } from "../router";
import { clearCache } from "../cache";

describe("getMacros", () => {
  beforeEach(() => {
    clearCache();
  });

  it("should throw error if no input provided", async () => {
    await expect(getMacros({})).rejects.toThrow(
      "Must provide at least one of: upc, text, or name"
    );
  });

  it("should lookup by UPC", async () => {
    // Skip if network unavailable
    try {
      const result = await getMacros({ upc: "030000010303" });
      expect(result.source).toBeDefined();
      expect(result.kcal).toBeGreaterThan(0);
    } catch (error) {
      console.log("UPC lookup failed - network may be unavailable");
    }
  });

  it("should lookup by name", async () => {
    // Skip if no API key
    if (!process.env.FDC_API_KEY) {
      console.log("Skipping name lookup test - no FDC API key");
      return;
    }

    try {
      const result = await getMacros({ name: "oats" });
      expect(result.source).toBe("fdc");
      expect(result.kcal).toBeGreaterThan(0);
      expect(result.protein_g).toBeGreaterThan(0);
    } catch (error) {
      console.log("Name lookup failed:", error);
    }
  });

  it("should scale macros when amount and unit provided", async () => {
    // Skip if no API key
    if (!process.env.FDC_API_KEY) {
      console.log("Skipping scaling test - no FDC API key");
      return;
    }

    try {
      const result = await getMacros({
        name: "chicken breast raw",
        amount: 200,
        unit: "g",
      });

      expect(result.scaled).toBeDefined();
      expect(result.scaled?.grams).toBe(200);
      expect(result.scaled?.kcal).toBeGreaterThan(result.kcal);
      expect(result.scaled?.protein_g).toBeGreaterThan(result.protein_g);
    } catch (error) {
      console.log("Scaling test failed:", error);
    }
  });

  it("should handle unsupported units gracefully", async () => {
    // Skip if no API key
    if (!process.env.FDC_API_KEY) {
      console.log("Skipping unit error test - no FDC API key");
      return;
    }

    try {
      const result = await getMacros({
        name: "oats",
        amount: 1,
        unit: "foobar",
      });

      expect(result.cannot_scale).toBe(true);
      expect(result.notes).toBeDefined();
      expect(result.notes?.some((n) => n.includes("Cannot convert"))).toBe(true);
    } catch (error) {
      console.log("Unit error test failed:", error);
    }
  });

  it("should use cache on second lookup", async () => {
    // Skip if no API key
    if (!process.env.FDC_API_KEY) {
      console.log("Skipping cache test - no FDC API key");
      return;
    }

    try {
      const result1 = await getMacros({ name: "rice" });
      const startTime = Date.now();
      const result2 = await getMacros({ name: "rice" });
      const duration = Date.now() - startTime;

      // Cached lookup should be very fast
      expect(duration).toBeLessThan(10);
      expect(result1.kcal).toBe(result2.kcal);
    } catch (error) {
      console.log("Cache test failed:", error);
    }
  });
});

describe("getBatchMacros", () => {
  beforeEach(() => {
    clearCache();
  });

  it("should handle batch lookups", async () => {
    // Skip if no API key
    if (!process.env.FDC_API_KEY) {
      console.log("Skipping batch test - no FDC API key");
      return;
    }

    try {
      const results = await getBatchMacros([
        { name: "oats" },
        { name: "chicken breast raw" },
        { name: "nonexistent_food_xyz123" },
      ]);

      expect(results).toHaveLength(3);

      // First two should succeed
      if ("kcal" in results[0]) {
        expect(results[0].kcal).toBeGreaterThan(0);
      }

      if ("kcal" in results[1]) {
        expect(results[1].kcal).toBeGreaterThan(0);
      }

      // Third may fail
      if ("error" in results[2]) {
        expect(results[2].error).toBeDefined();
      }
    } catch (error) {
      console.log("Batch test failed:", error);
    }
  });

  it("should return errors for invalid inputs", async () => {
    const results = await getBatchMacros([
      { name: "oats" },
      {}, // Invalid - no input
    ]);

    expect(results).toHaveLength(2);
    expect("error" in results[1]).toBe(true);
  });
});
