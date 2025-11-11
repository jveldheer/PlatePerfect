/**
 * FoodData Central API Service
 *
 * Provides integration with USDA's FoodData Central API for nutrition data.
 * Get a free API key at: https://fdc.nal.usda.gov/api-key-signup.html
 *
 * WARNING: Using VITE_FDC_API_KEY exposes your API key in the browser.
 * For production, use a backend proxy to keep the key secure.
 */

import type { NutrientData, IngredientData } from './aiIngredientDatabase';

const FDC_API_BASE = 'https://api.nal.usda.gov/fdc/v1';

export interface FDCFood {
  fdcId: number;
  description: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }>;
  dataType: string;
  brandOwner?: string;
}

export interface FDCSearchResult {
  foods: FDCFood[];
  totalHits: number;
}

/**
 * Get FDC API key from environment variables or localStorage
 */
function getFDCApiKey(): string {
  // First try environment variable (set via .env file)
  const envKey = import.meta.env.VITE_FDC_API_KEY;
  if (envKey && envKey !== 'your_api_key_here') {
    return envKey;
  }

  // Fallback to localStorage (user can set via Settings UI)
  const storageKey = localStorage.getItem('fdc_api_key');
  if (storageKey && storageKey.trim()) {
    return storageKey.trim();
  }

  throw new Error(
    'FDC_API_KEY not configured. Get a free key at https://fdc.nal.usda.gov/api-key-signup.html ' +
    'and set VITE_FDC_API_KEY in your .env file. ' +
    'WARNING: This will expose your API key in the browser. For production, use a backend proxy.'
  );
}

/**
 * Search for foods in the FDC database
 */
export async function searchFoods(query: string, pageSize = 5): Promise<FDCSearchResult> {
  const apiKey = getFDCApiKey();

  const url = `${FDC_API_BASE}/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query)}&pageSize=${pageSize}&dataType=Foundation,SR Legacy`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Invalid FDC API key. Please check your API key configuration.');
      }
      throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
    }

    const data: FDCSearchResult = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching from FDC:', error);
      throw error;
    }
    throw new Error('Unknown error fetching from FDC API');
  }
}

/**
 * Get detailed nutrition data for a specific food by FDC ID
 */
export async function getFoodById(fdcId: number): Promise<FDCFood> {
  const apiKey = getFDCApiKey();

  const url = `${FDC_API_BASE}/food/${fdcId}?api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`FDC API error: ${response.status} ${response.statusText}`);
    }

    const data: FDCFood = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching food by ID from FDC:', error);
      throw error;
    }
    throw new Error('Unknown error fetching food from FDC API');
  }
}

/**
 * Extract nutrient value from FDC food data
 */
function getNutrientValue(food: FDCFood, nutrientIds: number[]): number {
  for (const id of nutrientIds) {
    const nutrient = food.foodNutrients.find(n => n.nutrientId === id);
    if (nutrient) {
      return nutrient.value;
    }
  }
  return 0;
}

/**
 * Convert FDC food data to our IngredientData format
 */
export function fdcToIngredientData(food: FDCFood): Partial<IngredientData> {
  // FDC Nutrient IDs (per 100g):
  // 1008 = Energy (kcal)
  // 1003 = Protein
  // 1005 = Carbohydrate
  // 1004 = Total lipid (fat)
  // 1079 = Fiber, total dietary

  const macros_per_100g: NutrientData = {
    cal: getNutrientValue(food, [1008]),
    protein_g: getNutrientValue(food, [1003]),
    carb_g: getNutrientValue(food, [1005]),
    fat_g: getNutrientValue(food, [1004]),
    fiber_g: getNutrientValue(food, [1079])
  };

  // Categorize based on macros
  let category: IngredientData['category'] = 'staple';
  const isHighProtein = macros_per_100g.protein_g > 15;
  const isHighCarb = macros_per_100g.carb_g > 20;
  const isHighFat = macros_per_100g.fat_g > 15;

  if (isHighProtein && !isHighCarb) {
    category = 'protein';
  } else if (isHighCarb && !isHighProtein) {
    category = 'carb';
  } else if (isHighFat) {
    category = 'fat';
  } else if (macros_per_100g.fiber_g > 2 || food.description.toLowerCase().includes('vegetable') || food.description.toLowerCase().includes('fruit')) {
    category = 'veg_fruit';
  }

  const description = food.description.toLowerCase();
  const isAnimalProtein =
    description.includes('chicken') ||
    description.includes('beef') ||
    description.includes('pork') ||
    description.includes('turkey') ||
    description.includes('fish') ||
    description.includes('salmon') ||
    description.includes('tuna') ||
    description.includes('egg') ||
    description.includes('meat');

  return {
    canonical_name: food.description.toLowerCase(),
    aliases: [food.description.toLowerCase()],
    category,
    is_animal_protein: isAnimalProtein,
    macros_per_100g,
    typical_serving_g: 100, // Default, could be improved with portion size data
    source: 'pantry' as const
  };
}

/**
 * Lookup nutrition data for a food item by name
 */
export async function lookupFood(foodName: string): Promise<Partial<IngredientData> | null> {
  try {
    const result = await searchFoods(foodName, 1);

    if (result.foods.length === 0) {
      console.warn(`No nutrition data found for: ${foodName}`);
      throw new Error(`No nutrition data found for: ${foodName}`);
    }

    const topResult = result.foods[0];
    return fdcToIngredientData(topResult);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Food lookup error:', error);
      throw error;
    }
    throw new Error('Unknown error during food lookup');
  }
}
