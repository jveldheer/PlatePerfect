/**
 * USDA FoodData Central API client
 * https://fdc.nal.usda.gov/
 */

import type { Macro, FDCSearchResult, FDCFood, FDCFoodDetail, FDCNutrient } from "./types";
import { kcalFromMacros, nearlyEqual, round } from "./units";

const FDC_API_BASE = "https://api.nal.usda.gov/fdc/v1";

/**
 * Validate that FDC_API_KEY is set
 */
function getApiKey(): string {
  const key = process.env.FDC_API_KEY;
  if (!key) {
    throw new Error(
      "FDC_API_KEY environment variable is required. Get a free key at https://fdc.nal.usda.gov/api-key-signup.html"
    );
  }
  return key;
}

/**
 * Search for foods in FoodData Central
 */
export async function searchFDC(query: string, pageSize = 25): Promise<FDCSearchResult> {
  const apiKey = getApiKey();
  const url = `${FDC_API_BASE}/foods/search?query=${encodeURIComponent(query)}&pageSize=${pageSize}&api_key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
  }

  const data: FDCSearchResult = await response.json();
  return data;
}

/**
 * Get detailed food information by FDC ID
 */
export async function getFDCFood(fdcId: number): Promise<FDCFoodDetail> {
  const apiKey = getApiKey();
  const url = `${FDC_API_BASE}/food/${fdcId}?api_key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
  }

  const data: FDCFoodDetail = await response.json();
  return data;
}

/**
 * Search FDC by GTIN/UPC for branded foods
 */
export async function searchFDCByGTIN(gtin: string): Promise<FDCFood | null> {
  const result = await searchFDC(gtin, 10);

  // Find exact GTIN match
  const match = result.foods.find((f) => f.gtinUpc === gtin);
  return match || null;
}

/**
 * Extract nutrient value by name from FDC nutrient array
 */
function getNutrientValue(nutrients: FDCNutrient[], name: string): number | undefined {
  const nutrient = nutrients.find((n) => n.nutrientName.toLowerCase() === name.toLowerCase());
  return nutrient?.value;
}

/**
 * Rank FDC foods by data quality and relevance
 */
export function rankFDCFoods(foods: FDCFood[], query?: string): FDCFood[] {
  return foods.sort((a, b) => {
    // Data type priority: Foundation > SR Legacy > Branded > Survey
    const typeScore = (food: FDCFood) => {
      switch (food.dataType) {
        case "Foundation":
          return 4;
        case "SR Legacy":
          return 3;
        case "Branded":
          return 2;
        case "Survey (FNDDS)":
          return 1;
        default:
          return 0;
      }
    };

    const typeA = typeScore(a);
    const typeB = typeScore(b);

    if (typeA !== typeB) return typeB - typeA;

    // If query provided, prefer descriptions that match form words
    if (query) {
      const formWords = ["raw", "cooked", "roasted", "boiled", "baked", "fried", "steamed", "grilled", "drained"];
      const queryLower = query.toLowerCase();

      const hasFormWord = (desc: string) => {
        const descLower = desc.toLowerCase();
        return formWords.some((word) => queryLower.includes(word) && descLower.includes(word));
      };

      const aHasForm = hasFormWord(a.description);
      const bHasForm = hasFormWord(b.description);

      if (aHasForm && !bHasForm) return -1;
      if (!aHasForm && bHasForm) return 1;
    }

    return 0;
  });
}

/**
 * Convert FDC food data to standardized Macro format
 */
export function parseFDCFood(food: FDCFood): Macro | null {
  const nutrients = food.foodNutrients || [];

  if (nutrients.length === 0) {
    return null;
  }

  // Extract nutrients (FDC uses per-100g as standard)
  const kcal = getNutrientValue(nutrients, "Energy");
  const protein_g = getNutrientValue(nutrients, "Protein");
  const carb_g = getNutrientValue(nutrients, "Carbohydrate, by difference");
  const fat_g = getNutrientValue(nutrients, "Total lipid (fat)");

  // Need at least energy and macros
  if (
    kcal === undefined ||
    protein_g === undefined ||
    carb_g === undefined ||
    fat_g === undefined
  ) {
    return null;
  }

  // Optional nutrients
  const fiber_g = getNutrientValue(nutrients, "Fiber, total dietary");
  const sugar_g = getNutrientValue(nutrients, "Sugars, total including NLEA");
  const sodium_mg = getNutrientValue(nutrients, "Sodium, Na");

  // Parse serving/portion information
  let serving: { grams?: number; desc?: string } | undefined;
  if (food.foodPortions && food.foodPortions.length > 0) {
    // Use the first portion as default serving
    const portion = food.foodPortions[0];
    serving = {
      grams: portion.gramWeight,
      desc: portion.portionDescription || portion.modifier || `${portion.amount} ${portion.modifier}`,
    };
  }

  // Calculate confidence
  const notes: string[] = [];
  let confidence = 0.85; // Base confidence for FDC data

  // Higher confidence for Foundation and SR Legacy
  if (food.dataType === "Foundation") {
    confidence = 0.95;
  } else if (food.dataType === "SR Legacy") {
    confidence = 0.9;
  } else if (food.dataType === "Branded") {
    confidence = 0.75;
  }

  // Check if calculated kcal matches reported kcal
  const calculatedKcal = kcalFromMacros(protein_g, carb_g, fat_g);
  if (!nearlyEqual(kcal, calculatedKcal)) {
    confidence -= 0.1;
    notes.push(
      `Energy mismatch: reported ${round(kcal, 0)} kcal vs calculated ${round(calculatedKcal, 0)} kcal from macros`
    );
  }

  // Higher confidence if we have fiber and sugar data
  if (fiber_g !== undefined && sugar_g !== undefined) {
    confidence += 0.05;
  }

  // Cap confidence
  confidence = Math.max(0.5, Math.min(confidence, 0.98));

  return {
    kcal: round(kcal, 0),
    protein_g: round(protein_g),
    carb_g: round(carb_g),
    fat_g: round(fat_g),
    fiber_g: fiber_g !== undefined ? round(fiber_g) : undefined,
    sugar_g: sugar_g !== undefined ? round(sugar_g) : undefined,
    sodium_mg: sodium_mg !== undefined ? round(sodium_mg, 0) : undefined,
    base_ref: "per_100g",
    serving,
    source: "fdc",
    confidence: round(confidence, 2),
    raw: food,
    notes: notes.length > 0 ? notes : undefined,
  };
}

/**
 * Search FDC and return best match as Macro
 */
export async function getFDCMacrosBySearch(query: string): Promise<Macro | null> {
  try {
    const result = await searchFDC(query, 25);

    if (result.foods.length === 0) {
      return null;
    }

    // Rank and get best match
    const ranked = rankFDCFoods(result.foods, query);
    const best = ranked[0];

    return parseFDCFood(best);
  } catch (error) {
    console.error(`FDC search failed for "${query}":`, error);
    return null;
  }
}

/**
 * Get FDC macros by GTIN/UPC
 */
export async function getFDCMacrosByGTIN(gtin: string): Promise<Macro | null> {
  try {
    const food = await searchFDCByGTIN(gtin);
    if (!food) return null;

    return parseFDCFood(food);
  } catch (error) {
    console.error(`FDC GTIN lookup failed for ${gtin}:`, error);
    return null;
  }
}
