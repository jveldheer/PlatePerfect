// USDA FoodData Central API client
// Requires FDC_API_KEY - get free key at https://fdc.nal.usda.gov/api-key-signup.html

import type { FDCFood, FDCSearchResult, Macro } from './types';
import { kcalFromMacros, nearlyEqual, round } from './units';

const FDC_API_BASE = 'https://api.nal.usda.gov/fdc/v1';

// DataType ranking for search results (higher is better)
const DATA_TYPE_RANK: Record<string, number> = {
  'Foundation': 3,
  'SR Legacy': 2,
  'Survey (FNDDS)': 2,
  'Branded': 1,
};

/**
 * Get FDC API key from environment or throw error
 * NOTE: In browser context, this should come from a backend proxy
 */
function getApiKey(): string {
  // Check if we're in a Vite environment
  const apiKey = import.meta.env?.VITE_FDC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'FDC_API_KEY not configured. ' +
      'Get a free key at https://fdc.nal.usda.gov/api-key-signup.html ' +
      'and set VITE_FDC_API_KEY in your .env file. ' +
      'WARNING: This will expose your API key in the browser. ' +
      'For production, use a backend proxy.'
    );
  }

  return apiKey;
}

/**
 * Search USDA FoodData Central
 */
export async function searchFDC(query: string, pageSize = 25): Promise<FDCSearchResult> {
  const apiKey = getApiKey();
  const url = new URL(`${FDC_API_BASE}/foods/search`);
  url.searchParams.set('query', query);
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('api_key', apiKey);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get specific food item by FDC ID
 */
export async function getFDCFood(fdcId: number): Promise<FDCFood> {
  const apiKey = getApiKey();
  const url = `${FDC_API_BASE}/food/${fdcId}?api_key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search FDC by GTIN/UPC
 */
export async function searchFDCByUPC(upc: string): Promise<FDCFood | null> {
  try {
    const result = await searchFDC(`gtin:${upc}`, 5);
    if (result.foods && result.foods.length > 0) {
      // Prefer exact GTIN matches
      const exactMatch = result.foods.find(f => f.gtinUpc === upc);
      return exactMatch || result.foods[0];
    }
    return null;
  } catch (error) {
    console.error('Error searching FDC by UPC:', error);
    return null;
  }
}

/**
 * Rank FDC foods for search relevance
 */
function rankFDCFood(food: FDCFood, query: string): number {
  let score = DATA_TYPE_RANK[food.dataType] || 0;

  const desc = food.description.toLowerCase();
  const queryLower = query.toLowerCase();

  // Exact match bonus
  if (desc === queryLower) {
    score += 5;
  }

  // Contains all query words
  const queryWords = queryLower.split(/\s+/);
  const allWordsMatch = queryWords.every(word => desc.includes(word));
  if (allWordsMatch) {
    score += 2;
  }

  // Form modifiers (raw, cooked, etc.)
  const formWords = ['raw', 'cooked', 'roasted', 'grilled', 'baked', 'fried', 'boiled', 'steamed'];
  const queryForms = queryWords.filter(w => formWords.includes(w));
  const descForms = formWords.filter(w => desc.includes(w));

  if (queryForms.length > 0 && descForms.length > 0) {
    const formsMatch = queryForms.some(qf => descForms.includes(qf));
    if (formsMatch) {
      score += 1;
    }
  }

  return score;
}

/**
 * Get best FDC food match from search results
 */
export function getBestFDCMatch(foods: FDCFood[], query: string): FDCFood | null {
  if (!foods || foods.length === 0) return null;

  const ranked = foods
    .map(food => ({
      food,
      score: rankFDCFood(food, query),
    }))
    .sort((a, b) => b.score - a.score);

  return ranked[0].food;
}

/**
 * Parse FDC food into normalized Macro format
 */
export function parseFDCFood(food: FDCFood): Macro | null {
  const notes: string[] = [];

  // Extract nutrients
  const nutrients = food.foodNutrients;
  if (!nutrients || nutrients.length === 0) {
    return null;
  }

  const getNutrient = (names: string[]): number | undefined => {
    for (const name of names) {
      const nutrient = nutrients.find(n =>
        n.nutrientName.toLowerCase().includes(name.toLowerCase())
      );
      if (nutrient !== undefined) {
        return nutrient.value;
      }
    }
    return undefined;
  };

  // Get macros
  let kcal = getNutrient(['Energy']) ?? 0;
  const protein_g = getNutrient(['Protein']) ?? 0;
  const carb_g = getNutrient(['Carbohydrate, by difference', 'Carbohydrate']) ?? 0;
  const fat_g = getNutrient(['Total lipid (fat)', 'Fat']) ?? 0;

  // Optional nutrients
  const fiber_g = getNutrient(['Fiber, total dietary', 'Fiber']);
  const sugar_g = getNutrient(['Sugars, total including NLEA', 'Sugars']);
  const sodium_mg = getNutrient(['Sodium, Na', 'Sodium']);

  // Calculate confidence
  let confidence = 0.85; // Base confidence for FDC (higher quality than OFF)

  // Higher confidence for Foundation/SR Legacy
  if (food.dataType === 'Foundation') {
    confidence = 0.95;
  } else if (food.dataType === 'SR Legacy') {
    confidence = 0.90;
  } else if (food.dataType === 'Branded') {
    confidence = 0.75;
  }

  // Check energy sanity if we have macros
  if (protein_g > 0 || carb_g > 0 || fat_g > 0) {
    const calculatedKcal = kcalFromMacros(protein_g, carb_g, fat_g);
    if (kcal === 0 && calculatedKcal > 0) {
      kcal = calculatedKcal;
      notes.push('Energy calculated from macros');
    } else if (!nearlyEqual(kcal, calculatedKcal, 0.15)) {
      confidence -= 0.1;
      notes.push(
        `Energy mismatch: labeled ${round(kcal, 0)} kcal vs calculated ${round(calculatedKcal, 0)} kcal`
      );
    }
  }

  // Parse portions
  let serving: { grams?: number; desc?: string } | undefined;
  if (food.foodPortions && food.foodPortions.length > 0) {
    // Prefer common serving sizes
    const commonPortion = food.foodPortions.find(p =>
      p.portionDescription?.match(/cup|piece|serving|slice|tablespoon/i)
    );
    const portion = commonPortion || food.foodPortions[0];

    if (portion.gramWeight > 0) {
      serving = {
        grams: portion.gramWeight,
        desc: portion.portionDescription || `${portion.amount || 1} serving`,
      };
    }
  }

  return {
    kcal: round(kcal, 0),
    protein_g: round(protein_g, 1),
    carb_g: round(carb_g, 1),
    fat_g: round(fat_g, 1),
    fiber_g: fiber_g !== undefined ? round(fiber_g, 1) : undefined,
    sugar_g: sugar_g !== undefined ? round(sugar_g, 1) : undefined,
    sodium_mg: sodium_mg !== undefined ? round(sodium_mg, 0) : undefined,
    base_ref: 'per_100g',
    serving,
    source: 'fdc',
    confidence: round(confidence, 2),
    notes: notes.length > 0 ? notes : undefined,
    raw: food,
  };
}

/**
 * Get macro data from FDC by search query
 */
export async function getMacrosFromFDC(query: string): Promise<Macro | null> {
  try {
    const result = await searchFDC(query, 25);

    if (!result.foods || result.foods.length === 0) {
      return null;
    }

    const bestMatch = getBestFDCMatch(result.foods, query);
    if (!bestMatch) {
      return null;
    }

    return parseFDCFood(bestMatch);
  } catch (error) {
    console.error('Error fetching from FDC:', error);
    return null;
  }
}
