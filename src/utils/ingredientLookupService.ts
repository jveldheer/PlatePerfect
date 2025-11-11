/**
 * Unified Ingredient Lookup Service
 *
 * Provides a single interface for looking up ingredient nutrition data
 * with fallback from local databases to external APIs.
 */

import { findAIIngredient, type IngredientData } from './aiIngredientDatabase';
import { findIngredient, type IngredientInfo } from './ingredientDatabase';
import { lookupFood } from './fdcService';

export interface UnifiedIngredientData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  servingSize?: string;
  source: 'local_ai_db' | 'local_basic_db' | 'fdc_api';
}

/**
 * Convert IngredientData (AI database) to UnifiedIngredientData
 */
function fromAIIngredient(ingredient: IngredientData): UnifiedIngredientData {
  return {
    name: ingredient.canonical_name,
    calories: Math.round(ingredient.macros_per_100g.cal * ingredient.typical_serving_g / 100),
    protein: Math.round(ingredient.macros_per_100g.protein_g * ingredient.typical_serving_g / 100),
    carbs: Math.round(ingredient.macros_per_100g.carb_g * ingredient.typical_serving_g / 100),
    fat: Math.round(ingredient.macros_per_100g.fat_g * ingredient.typical_serving_g / 100),
    fiber: Math.round(ingredient.macros_per_100g.fiber_g * ingredient.typical_serving_g / 100),
    servingSize: `${ingredient.typical_serving_g}g`,
    source: 'local_ai_db'
  };
}

/**
 * Convert IngredientInfo (basic database) to UnifiedIngredientData
 */
function fromBasicIngredient(ingredient: IngredientInfo): UnifiedIngredientData {
  return {
    name: ingredient.name,
    calories: ingredient.calories,
    protein: ingredient.protein,
    carbs: ingredient.carbs,
    fat: ingredient.fat,
    servingSize: ingredient.standardSize,
    source: 'local_basic_db'
  };
}

/**
 * Convert FDC Partial IngredientData to UnifiedIngredientData
 */
function fromFDCIngredient(ingredient: Partial<IngredientData>): UnifiedIngredientData {
  const servingGrams = ingredient.typical_serving_g || 100;
  const macros = ingredient.macros_per_100g!;

  return {
    name: ingredient.canonical_name || 'Unknown',
    calories: Math.round(macros.cal * servingGrams / 100),
    protein: Math.round(macros.protein_g * servingGrams / 100),
    carbs: Math.round(macros.carb_g * servingGrams / 100),
    fat: Math.round(macros.fat_g * servingGrams / 100),
    fiber: Math.round(macros.fiber_g * servingGrams / 100),
    servingSize: `${servingGrams}g`,
    source: 'fdc_api'
  };
}

/**
 * Lookup ingredient with cascading fallback:
 * 1. Local AI ingredient database
 * 2. Local basic ingredient database
 * 3. FDC API (if configured)
 */
export async function lookupIngredient(
  ingredientName: string,
  useFDC: boolean = true
): Promise<UnifiedIngredientData | null> {
  // Try local AI ingredient database first
  const aiIngredient = findAIIngredient(ingredientName);
  if (aiIngredient) {
    console.log(`✓ Found "${ingredientName}" in AI ingredient database`);
    return fromAIIngredient(aiIngredient);
  }

  // Try local basic ingredient database
  const basicIngredient = findIngredient(ingredientName);
  if (basicIngredient) {
    console.log(`✓ Found "${ingredientName}" in basic ingredient database`);
    return fromBasicIngredient(basicIngredient);
  }

  // Try FDC API if enabled and configured
  if (useFDC) {
    try {
      const fdcIngredient = await lookupFood(ingredientName);
      if (fdcIngredient && fdcIngredient.macros_per_100g) {
        console.log(`✓ Found "${ingredientName}" via FDC API`);
        return fromFDCIngredient(fdcIngredient);
      }
    } catch (error) {
      // FDC API failed (no key configured, network error, or no results)
      console.warn(`FDC API lookup failed for "${ingredientName}":`, error instanceof Error ? error.message : 'Unknown error');
      // Continue to return null below
    }
  }

  console.warn(`✗ No nutrition data found for "${ingredientName}" in any database`);
  return null;
}

/**
 * Batch lookup multiple ingredients
 */
export async function lookupIngredients(
  ingredientNames: string[],
  useFDC: boolean = true
): Promise<Map<string, UnifiedIngredientData>> {
  const results = new Map<string, UnifiedIngredientData>();

  for (const name of ingredientNames) {
    try {
      const result = await lookupIngredient(name, useFDC);
      if (result) {
        results.set(name, result);
      }
    } catch (error) {
      console.error(`Failed to lookup "${name}":`, error);
    }
  }

  return results;
}

/**
 * Check if FDC API is available (key is configured)
 */
export function isFDCAvailable(): boolean {
  const envKey = import.meta.env.VITE_FDC_API_KEY;
  const storageKey = localStorage.getItem('fdc_api_key');

  return (
    (envKey && envKey !== 'your_api_key_here') ||
    (storageKey && storageKey.trim().length > 0)
  );
}
