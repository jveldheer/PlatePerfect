// Open Food Facts API client

import type { Macro } from './types';
import { kJtoKcal, kcalFromMacros, nearlyEqual, round } from './units';

const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v2';

/**
 * Parse serving size string from OFF
 * Examples: "40 g", "serving 40 g", "1 serving (40g)"
 */
export function parseOFFServing(servingSize?: string): { grams?: number; desc?: string } {
  if (!servingSize) return {};

  const desc = servingSize;

  // Try to extract grams
  const gramsMatch = servingSize.match(/(\d+(?:\.\d+)?)\s*g/i);
  if (gramsMatch) {
    return {
      grams: parseFloat(gramsMatch[1]),
      desc
    };
  }

  return { desc };
}

/**
 * Fetch nutrition data from Open Food Facts by UPC/barcode
 */
export async function fetchOFFByUPC(upc: string): Promise<Macro | null> {
  try {
    const url = `${OFF_API_BASE}/product/${upc}.json`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return null;
    }

    const product = data.product;
    const nutriments = product.nutriments || {};

    // Get energy - prefer kcal, fall back to kJ conversion
    let kcal = nutriments['energy-kcal_100g'];
    if (kcal === undefined && nutriments['energy-kj_100g']) {
      kcal = kJtoKcal(nutriments['energy-kj_100g']);
    }

    // Get macros per 100g
    const protein_g = nutriments.proteins_100g;
    const carb_g = nutriments.carbohydrates_100g;
    const fat_g = nutriments.fat_100g;

    // Validate we have the essentials
    if (kcal === undefined || protein_g === undefined || carb_g === undefined || fat_g === undefined) {
      return null;
    }

    // Optional nutrients
    const fiber_g = nutriments.fiber_100g;
    const sugar_g = nutriments.sugars_100g;
    const sodium_g = nutriments.sodium_100g;
    const sodium_mg = sodium_g !== undefined ? sodium_g * 1000 : undefined;

    // Parse serving info
    const serving = parseOFFServing(product.serving_size);

    // Calculate confidence
    let confidence = 0.7; // Base confidence for OFF data

    // Check energy sanity
    const calculatedKcal = kcalFromMacros(protein_g, carb_g, fat_g);
    if (nearlyEqual(kcal, calculatedKcal, 0.15)) {
      confidence += 0.2;
    } else {
      confidence -= 0.1;
    }

    // Bonus for having complete data
    if (fiber_g !== undefined && sugar_g !== undefined && sodium_mg !== undefined) {
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
      source: 'off',
      confidence,
      raw: product
    };
  } catch (error) {
    console.error('OFF API error:', error);
    return null;
  }
}
