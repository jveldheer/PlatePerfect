// USDA FoodData Central API client

import type { Macro } from './types';
import { kcalFromMacros, nearlyEqual, round } from './units';

const FDC_API_BASE = 'https://api.nal.usda.gov/fdc/v1';

/**
 * Data type ranking for FDC results
 * Foundation > SR Legacy > Branded
 */
const DATA_TYPE_RANK: Record<string, number> = {
  'Foundation': 3,
  'SR Legacy': 2,
  'Branded': 1,
};

/**
 * Get nutrient value by name from FDC food nutrients array
 */
function getNutrient(foodNutrients: any[], name: string): number | undefined {
  const nutrient = foodNutrients.find(n =>
    n.nutrient?.name?.toLowerCase().includes(name.toLowerCase())
  );
  return nutrient?.amount;
}

/**
 * Parse FDC food item into Macro object
 */
function parseFDCFood(food: any): Macro | null {
  const nutrients = food.foodNutrients || [];

  // Map FDC nutrients to our schema
  const kcal = getNutrient(nutrients, 'Energy');
  const protein_g = getNutrient(nutrients, 'Protein');
  const carb_g = getNutrient(nutrients, 'Carbohydrate');
  const fat_g = getNutrient(nutrients, 'Total lipid');

  // Validate essentials
  if (kcal === undefined || protein_g === undefined || carb_g === undefined || fat_g === undefined) {
    return null;
  }

  // Optional nutrients
  const fiber_g = getNutrient(nutrients, 'Fiber');
  const sugar_g = getNutrient(nutrients, 'Sugars, total');
  const sodium_mg = getNutrient(nutrients, 'Sodium');

  // Extract serving/portion info
  let serving: { grams?: number; desc?: string } | undefined;
  const portions = food.foodPortions || [];
  if (portions.length > 0) {
    const portion = portions[0];
    serving = {
      grams: portion.gramWeight,
      desc: portion.portionDescription || portion.modifier
    };
  }

  // Calculate confidence
  let confidence = 0.6; // Base confidence

  // Prefer certain data types
  const dataType = food.dataType;
  if (dataType === 'Foundation') confidence += 0.3;
  else if (dataType === 'SR Legacy') confidence += 0.2;
  else if (dataType === 'Branded') confidence += 0.1;

  // Energy sanity check
  const calculatedKcal = kcalFromMacros(protein_g, carb_g, fat_g);
  if (nearlyEqual(kcal, calculatedKcal, 0.15)) {
    confidence += 0.1;
  }

  confidence = Math.max(0, Math.min(1, confidence));

  return {
    kcal: round(kcal, 0),
    protein_g: round(protein_g),
    carb_g: round(carb_g),
    fat_g: round(fat_g),
    fiber_g: fiber_g !== undefined ? round(fiber_g) : undefined,
    sugar_g: sugar_g !== undefined ? round(sugar_g) : undefined,
    sodium_mg: sodium_mg !== undefined ? round(sodium_mg, 0) : undefined,
    base_ref: 'per_100g',
    serving,
    source: 'fdc',
    confidence,
    raw: food
  };
}

/**
 * Rank FDC search results
 * Prefer Foundation > SR Legacy > Branded
 * Prefer better description matches
 */
function rankFDCResults(foods: any[], query: string): any[] {
  const queryLower = query.toLowerCase();
  const formWords = ['raw', 'cooked', 'roasted', 'baked', 'grilled', 'fried', 'drained', 'boiled'];

  return foods
    .map(food => {
      let score = DATA_TYPE_RANK[food.dataType] || 0;

      // Bonus for form word matches
      const desc = (food.description || '').toLowerCase();
      for (const word of formWords) {
        if (queryLower.includes(word) && desc.includes(word)) {
          score += 0.5;
        }
      }

      return { food, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(x => x.food);
}

/**
 * Search FDC by text query
 */
export async function searchFDC(query: string, apiKey: string): Promise<Macro | null> {
  try {
    const url = `${FDC_API_BASE}/foods/search?query=${encodeURIComponent(query)}&api_key=${apiKey}&pageSize=25`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error('FDC search failed:', response.statusText);
      return null;
    }

    const data = await response.json();
    const foods = data.foods || [];

    if (foods.length === 0) {
      return null;
    }

    // Rank and try results
    const ranked = rankFDCResults(foods, query);

    for (const food of ranked.slice(0, 3)) {
      const macro = parseFDCFood(food);
      if (macro) return macro;
    }

    return null;
  } catch (error) {
    console.error('FDC API error:', error);
    return null;
  }
}

/**
 * Get FDC food item by ID
 */
export async function getFDCById(fdcId: number, apiKey: string): Promise<Macro | null> {
  try {
    const url = `${FDC_API_BASE}/food/${fdcId}?api_key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const food = await response.json();
    return parseFDCFood(food);
  } catch (error) {
    console.error('FDC API error:', error);
    return null;
  }
}

/**
 * Search FDC by GTIN/barcode
 */
export async function searchFDCByGTIN(gtin: string, apiKey: string): Promise<Macro | null> {
  try {
    const url = `${FDC_API_BASE}/foods/search?query=${gtin}&api_key=${apiKey}&pageSize=10&dataType=Branded`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const foods = data.foods || [];

    // Find exact GTIN match
    const match = foods.find((f: any) => f.gtinUpc === gtin);
    if (match) {
      return parseFDCFood(match);
    }

    return null;
  } catch (error) {
    console.error('FDC GTIN search error:', error);
    return null;
  }
}
