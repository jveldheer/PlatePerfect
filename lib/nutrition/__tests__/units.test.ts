import { describe, it, expect } from "vitest";
import {
  kJtoKcal,
  kcalFromMacros,
  nearlyEqual,
  round,
  toGrams,
  parseServingGrams,
  scaleMacros,
} from "../units";

describe("kJtoKcal", () => {
  it("should convert kilojoules to kilocalories", () => {
    expect(kJtoKcal(4184)).toBeCloseTo(1000, 0);
    expect(kJtoKcal(418.4)).toBeCloseTo(100, 0);
    expect(kJtoKcal(0)).toBe(0);
  });
});

describe("kcalFromMacros", () => {
  it("should calculate kcal from macronutrients", () => {
    // 100g chicken breast: ~31g protein, 0g carb, ~3.6g fat
    expect(kcalFromMacros(31, 0, 3.6)).toBeCloseTo(156.4, 1);

    // 100g oats: ~17g protein, ~66g carb, ~7g fat
    expect(kcalFromMacros(17, 66, 7)).toBeCloseTo(395, 0);

    // Zero macros
    expect(kcalFromMacros(0, 0, 0)).toBe(0);
  });
});

describe("nearlyEqual", () => {
  it("should return true for nearly equal values within tolerance", () => {
    expect(nearlyEqual(100, 110, 0.15)).toBe(true); // 10% difference
    expect(nearlyEqual(100, 90, 0.15)).toBe(true); // 10% difference
    expect(nearlyEqual(100, 100, 0.15)).toBe(true); // exact match
  });

  it("should return false for values outside tolerance", () => {
    expect(nearlyEqual(100, 120, 0.15)).toBe(false); // 20% difference
    expect(nearlyEqual(100, 80, 0.15)).toBe(false); // 20% difference
  });

  it("should handle zero values", () => {
    expect(nearlyEqual(0, 0, 0.15)).toBe(true);
    expect(nearlyEqual(0, 0.5, 0.15)).toBe(true); // Within 1 kcal
    expect(nearlyEqual(0, 2, 0.15)).toBe(false); // More than 1 kcal
  });
});

describe("round", () => {
  it("should round to specified decimal places", () => {
    expect(round(3.14159, 2)).toBe(3.14);
    expect(round(3.14159, 0)).toBe(3);
    expect(round(3.14159, 1)).toBe(3.1);
    expect(round(3.5, 0)).toBe(4);
  });

  it("should default to 1 decimal place", () => {
    expect(round(3.14159)).toBe(3.1);
  });
});

describe("toGrams", () => {
  describe("weight units", () => {
    it("should convert grams", () => {
      expect(toGrams(100, "g")).toBe(100);
      expect(toGrams(1, "gram")).toBe(1);
      expect(toGrams(5, "grams")).toBe(5);
    });

    it("should convert kilograms", () => {
      expect(toGrams(1, "kg")).toBe(1000);
      expect(toGrams(0.5, "kilogram")).toBe(500);
    });

    it("should convert ounces", () => {
      expect(toGrams(1, "oz")).toBeCloseTo(28.35, 1);
      expect(toGrams(4, "ounce")).toBeCloseTo(113.4, 1);
    });

    it("should convert pounds", () => {
      expect(toGrams(1, "lb")).toBeCloseTo(453.6, 1);
      expect(toGrams(0.5, "pound")).toBeCloseTo(226.8, 1);
    });
  });

  describe("volume and descriptive units", () => {
    const serving = { grams: 40, desc: "1 serving (40g)" };

    it("should use serving size for volume units", () => {
      expect(toGrams(1, "cup", serving)).toBe(40);
      expect(toGrams(2, "cup", serving)).toBe(80);
    });

    it("should use serving size for descriptive units", () => {
      expect(toGrams(1, "serving", serving)).toBe(40);
      expect(toGrams(1, "piece", serving)).toBe(40);
      expect(toGrams(2, "slice", serving)).toBe(80);
    });

    it("should throw error if serving size not provided for volume units", () => {
      expect(() => toGrams(1, "cup")).toThrow(
        "Cannot convert cup to grams"
      );
    });

    it("should throw error for unsupported units", () => {
      expect(() => toGrams(1, "foobar")).toThrow("Unsupported unit: foobar");
    });
  });
});

describe("parseServingGrams", () => {
  it("should extract grams from serving size strings", () => {
    expect(parseServingGrams("40g")).toBe(40);
    expect(parseServingGrams("40 g")).toBe(40);
    expect(parseServingGrams("1 serving (40g)")).toBe(40);
    expect(parseServingGrams("serving 40 g")).toBe(40);
    expect(parseServingGrams("125 grams")).toBe(125);
  });

  it("should handle decimal values", () => {
    expect(parseServingGrams("28.5g")).toBe(28.5);
    expect(parseServingGrams("100.25 grams")).toBe(100.25);
  });

  it("should return undefined for unparseable strings", () => {
    expect(parseServingGrams("1 cup")).toBeUndefined();
    expect(parseServingGrams("large")).toBeUndefined();
    expect(parseServingGrams("")).toBeUndefined();
    expect(parseServingGrams(undefined)).toBeUndefined();
  });
});

describe("scaleMacros", () => {
  const baseMacro = {
    kcal: 165,
    protein_g: 31,
    carb_g: 0,
    fat_g: 3.6,
    fiber_g: 0,
    sugar_g: 0,
    sodium_mg: 74,
  };

  it("should scale macros from 100g to another amount", () => {
    const scaled = scaleMacros(baseMacro, 100, 200);

    expect(scaled.grams).toBe(200);
    expect(scaled.kcal).toBe(330);
    expect(scaled.protein_g).toBe(62);
    expect(scaled.carb_g).toBe(0);
    expect(scaled.fat_g).toBe(7.2);
    expect(scaled.sodium_mg).toBe(148);
  });

  it("should scale down correctly", () => {
    const scaled = scaleMacros(baseMacro, 100, 50);

    expect(scaled.grams).toBe(50);
    expect(scaled.kcal).toBe(83); // 165 / 2 = 82.5, rounded to 83
    expect(scaled.protein_g).toBe(15.5);
  });

  it("should handle optional nutrients", () => {
    const macro = { kcal: 100, protein_g: 10, carb_g: 10, fat_g: 5 };
    const scaled = scaleMacros(macro, 100, 200);

    expect(scaled.fiber_g).toBeUndefined();
    expect(scaled.sugar_g).toBeUndefined();
    expect(scaled.sodium_mg).toBeUndefined();
  });
});
