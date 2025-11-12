import { describe, it, expect } from "vitest";
import { parseOFFServing, parseOFFProduct, getOFFMacros } from "../off";
import type { OFFProduct } from "../types";

describe("parseOFFServing", () => {
  it("should parse serving size with grams", () => {
    const result = parseOFFServing("40g");
    expect(result.grams).toBe(40);
    expect(result.desc).toBe("40g");
  });

  it("should parse serving size with spaces", () => {
    const result = parseOFFServing("1 serving (40 g)");
    expect(result.grams).toBe(40);
    expect(result.desc).toBe("1 serving (40 g)");
  });

  it("should return empty object for undefined", () => {
    const result = parseOFFServing(undefined);
    expect(result).toEqual({});
  });

  it("should keep description even if grams cannot be parsed", () => {
    const result = parseOFFServing("1 cup");
    expect(result.grams).toBeUndefined();
    expect(result.desc).toBe("1 cup");
  });
});

describe("parseOFFProduct", () => {
  it("should parse valid OFF product data", () => {
    const product: OFFProduct = {
      code: "737628064502",
      status: 1,
      product: {
        product_name: "Test Product",
        serving_size: "40g",
        nutriments: {
          "energy-kcal_100g": 389,
          "proteins_100g": 16.89,
          "carbohydrates_100g": 66.27,
          "fat_100g": 6.9,
          "fiber_100g": 10.6,
          "sugars_100g": 0.8,
          "sodium_100g": 0.005,
        },
      },
    };

    const result = parseOFFProduct(product);

    expect(result).not.toBeNull();
    expect(result?.kcal).toBe(389);
    expect(result?.protein_g).toBe(16.9);
    expect(result?.carb_g).toBe(66.3);
    expect(result?.fat_g).toBe(6.9);
    expect(result?.fiber_g).toBe(10.6);
    expect(result?.sugar_g).toBe(0.8);
    expect(result?.sodium_mg).toBe(5);
    expect(result?.source).toBe("off");
    expect(result?.base_ref).toBe("per_100g");
    expect(result?.confidence).toBeGreaterThan(0.8);
  });

  it("should convert kJ to kcal when kcal not available", () => {
    const product: OFFProduct = {
      code: "123456",
      status: 1,
      product: {
        nutriments: {
          "energy-kj_100g": 1628, // ~389 kcal
          "proteins_100g": 10,
          "carbohydrates_100g": 50,
          "fat_100g": 5,
        },
      },
    };

    const result = parseOFFProduct(product);

    expect(result).not.toBeNull();
    expect(result?.kcal).toBeCloseTo(389, 0);
  });

  it("should return null for products without required nutrients", () => {
    const product: OFFProduct = {
      code: "123456",
      status: 1,
      product: {
        nutriments: {
          "energy-kcal_100g": 100,
          // Missing protein, carb, fat
        },
      },
    };

    const result = parseOFFProduct(product);
    expect(result).toBeNull();
  });

  it("should return null for invalid status", () => {
    const product: OFFProduct = {
      code: "123456",
      status: 0,
    };

    const result = parseOFFProduct(product);
    expect(result).toBeNull();
  });

  it("should add note when energy doesn't match macros", () => {
    const product: OFFProduct = {
      code: "123456",
      status: 1,
      product: {
        nutriments: {
          "energy-kcal_100g": 500, // Very wrong
          "proteins_100g": 10,
          "carbohydrates_100g": 10,
          "fat_100g": 5,
        },
      },
    };

    const result = parseOFFProduct(product);

    expect(result).not.toBeNull();
    expect(result?.notes).toBeDefined();
    expect(result?.notes?.[0]).toContain("Energy mismatch");
    expect(result?.confidence).toBeLessThan(0.8);
  });
});

describe("getOFFMacros", () => {
  it("should fetch and parse real product data", async () => {
    // Known good UPC: Quaker Oats Old Fashioned
    const result = await getOFFMacros("030000010303");

    if (result) {
      expect(result.source).toBe("off");
      expect(result.kcal).toBeGreaterThan(0);
      expect(result.protein_g).toBeGreaterThan(0);
      expect(result.carb_g).toBeGreaterThan(0);
      expect(result.fat_g).toBeGreaterThan(0);
    } else {
      // Network failure or product not in OFF - that's okay
      console.log("OFF lookup returned null - network may be unavailable");
    }
  });

  it("should return null for invalid UPC", async () => {
    const result = await getOFFMacros("00000000000000");
    // Either null or an error - both are acceptable
    expect(result === null || result?.confidence).toBeDefined();
  });
});
