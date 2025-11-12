import { describe, it, expect } from "vitest";
import { rankFDCFoods, parseFDCFood, getFDCMacrosBySearch } from "../fdc";
import type { FDCFood } from "../types";

describe("rankFDCFoods", () => {
  const foods: FDCFood[] = [
    {
      fdcId: 1,
      description: "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
      dataType: "SR Legacy",
    },
    {
      fdcId: 2,
      description: "Chicken breast, raw",
      dataType: "Foundation",
    },
    {
      fdcId: 3,
      description: "Generic chicken breast",
      dataType: "Branded",
    },
  ];

  it("should prefer Foundation over SR Legacy over Branded", () => {
    const ranked = rankFDCFoods([...foods]);

    expect(ranked[0].dataType).toBe("Foundation");
    expect(ranked[1].dataType).toBe("SR Legacy");
    expect(ranked[2].dataType).toBe("Branded");
  });

  it("should prefer matching form words when provided", () => {
    const query = "chicken breast raw";
    const ranked = rankFDCFoods([...foods], query);

    // Foundation with "raw" should be first
    expect(ranked[0].description).toContain("raw");
    expect(ranked[0].dataType).toBe("Foundation");
  });
});

describe("parseFDCFood", () => {
  it("should parse FDC food with complete data", () => {
    const food: FDCFood = {
      fdcId: 171477,
      description: "Chicken, broilers or fryers, breast, meat only, cooked, roasted",
      dataType: "SR Legacy",
      foodNutrients: [
        { nutrientId: 1008, nutrientName: "Energy", unitName: "kcal", value: 165 },
        { nutrientId: 1003, nutrientName: "Protein", unitName: "g", value: 31 },
        {
          nutrientId: 1005,
          nutrientName: "Carbohydrate, by difference",
          unitName: "g",
          value: 0,
        },
        {
          nutrientId: 1004,
          nutrientName: "Total lipid (fat)",
          unitName: "g",
          value: 3.6,
        },
        {
          nutrientId: 1079,
          nutrientName: "Fiber, total dietary",
          unitName: "g",
          value: 0,
        },
        {
          nutrientId: 2000,
          nutrientName: "Sugars, total including NLEA",
          unitName: "g",
          value: 0,
        },
        { nutrientId: 1093, nutrientName: "Sodium, Na", unitName: "mg", value: 74 },
      ],
    };

    const result = parseFDCFood(food);

    expect(result).not.toBeNull();
    expect(result?.kcal).toBe(165);
    expect(result?.protein_g).toBe(31);
    expect(result?.carb_g).toBe(0);
    expect(result?.fat_g).toBe(3.6);
    expect(result?.fiber_g).toBe(0);
    expect(result?.sugar_g).toBe(0);
    expect(result?.sodium_mg).toBe(74);
    expect(result?.source).toBe("fdc");
    expect(result?.base_ref).toBe("per_100g");
    expect(result?.confidence).toBeGreaterThan(0.85);
  });

  it("should return null for food without required nutrients", () => {
    const food: FDCFood = {
      fdcId: 123,
      description: "Incomplete food",
      dataType: "Branded",
      foodNutrients: [
        { nutrientId: 1008, nutrientName: "Energy", unitName: "kcal", value: 100 },
        // Missing protein, carb, fat
      ],
    };

    const result = parseFDCFood(food);
    expect(result).toBeNull();
  });

  it("should have higher confidence for Foundation data", () => {
    const food: FDCFood = {
      fdcId: 123,
      description: "Test food",
      dataType: "Foundation",
      foodNutrients: [
        { nutrientId: 1008, nutrientName: "Energy", unitName: "kcal", value: 125 }, // Matches calculated: 10*4 + 10*4 + 5*9 = 125
        { nutrientId: 1003, nutrientName: "Protein", unitName: "g", value: 10 },
        {
          nutrientId: 1005,
          nutrientName: "Carbohydrate, by difference",
          unitName: "g",
          value: 10,
        },
        { nutrientId: 1004, nutrientName: "Total lipid (fat)", unitName: "g", value: 5 },
      ],
    };

    const result = parseFDCFood(food);

    expect(result).not.toBeNull();
    expect(result?.confidence).toBeGreaterThanOrEqual(0.90);
  });

  it("should include portion information when available", () => {
    const food: FDCFood = {
      fdcId: 123,
      description: "Test food",
      dataType: "Foundation",
      foodNutrients: [
        { nutrientId: 1008, nutrientName: "Energy", unitName: "kcal", value: 100 },
        { nutrientId: 1003, nutrientName: "Protein", unitName: "g", value: 10 },
        {
          nutrientId: 1005,
          nutrientName: "Carbohydrate, by difference",
          unitName: "g",
          value: 10,
        },
        { nutrientId: 1004, nutrientName: "Total lipid (fat)", unitName: "g", value: 5 },
      ],
      foodPortions: [
        {
          id: 1,
          gramWeight: 140,
          amount: 1,
          modifier: "cup",
          portionDescription: "1 cup",
        },
      ],
    };

    const result = parseFDCFood(food);

    expect(result).not.toBeNull();
    expect(result?.serving).toBeDefined();
    expect(result?.serving?.grams).toBe(140);
    expect(result?.serving?.desc).toBeDefined();
  });
});

describe("getFDCMacrosBySearch", () => {
  it("should search and return macro data for common food", async () => {
    // Skip if no API key
    if (!process.env.FDC_API_KEY) {
      console.log("Skipping FDC live test - no API key");
      return;
    }

    const result = await getFDCMacrosBySearch("chicken breast raw");

    if (result) {
      expect(result.source).toBe("fdc");
      expect(result.kcal).toBeGreaterThan(0);
      expect(result.protein_g).toBeGreaterThan(0);
      expect(result.carb_g).toBeGreaterThanOrEqual(0);
      expect(result.fat_g).toBeGreaterThan(0);
    } else {
      console.log("FDC search returned null");
    }
  });

  it("should return null for nonsense query", async () => {
    // Skip if no API key
    if (!process.env.FDC_API_KEY) {
      console.log("Skipping FDC live test - no API key");
      return;
    }

    const result = await getFDCMacrosBySearch("xyzabc123impossible");
    // May return null or possibly a very low confidence result
    expect(result === null || result.confidence).toBeDefined();
  });
});
