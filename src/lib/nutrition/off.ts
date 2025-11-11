// Open Food Facts API client
// No API key required for read operations

import type { OFFProduct, Macro } from './types';
import { kJtoKcal, kcalFromMacros, nearlyEqual, parseServingGrams, round } from './units';

const OFF_API_BASE = 'https://world.openfoodfacts.org/api/v2';

/**
 * Fetch product data from Open Food Facts by UPC/barcode
 */
export async function fetchOFFByUPC(upc: string): Promise<OFFProduct> {
  const url = `${OFF_API_BASE}/product/${upc}.json`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'PlatePerfect/1.0 (Nutrition Tracker)',
    },
  });

  if (!response.ok) {
    throw new Error(`OFF API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Parse Open Food Facts product data into normalized Macro format
 */
export function parseOFFProduct(data: OFFProduct): Macro | null {
  if (data.status !== 1 || !data.product) {
    return null;
  }

  const product = data.product;
  const nutriments = product.nutriments;

  if (!nutriments) {
    return null;
  }

  const notes: string[] = [];

  // Get energy - prefer kcal, fallback to kJ conversion
  let kcal = nutriments['energy-kcal_100g'];
  if (kcal === undefined && nutriments['energy-kj_100g'] !== undefined) {
    kcal = kJtoKcal(nutriments['energy-kj_100g']);
    notes.push('Energy converted from kJ');
  }

  if (kcal === undefined) {
    return null;
  }

  // Get macros
  const protein_g = nutriments['proteins_100g'] ?? 0;
  const carb_g = nutriments['carbohydrates_100g'] ?? 0;
  const fat_g = nutriments['fat_100g'] ?? 0;

  // Optional nutrients
  const fiber_g = nutriments['fiber_100g'];
  const sugar_g = nutriments['sugars_100g'];
  const sodium_g = nutriments['sodium_100g'];
  const sodium_mg = sodium_g !== undefined ? sodium_g * 1000 : undefined;

  // Calculate confidence
  let confidence = 0.7; // Base confidence for OFF data

  // Check energy sanity
  const calculatedKcal = kcalFromMacros(protein_g, carb_g, fat_g);
  if (!nearlyEqual(kcal, calculatedKcal, 0.15)) {
    confidence -= 0.2;
    notes.push(
      `Energy mismatch: labeled ${round(kcal, 0)} kcal vs calculated ${round(calculatedKcal, 0)} kcal`
    );
  }

  // Higher confidence if we have all macros
  if (protein_g > 0 && carb_g > 0 && fat_g > 0) {
    confidence += 0.1;
  }

  // Parse serving info
  const servingGrams = parseServingGrams(product.serving_size);
  const serving = servingGrams
    ? { grams: servingGrams, desc: product.serving_size }
    : product.serving_size
    ? { desc: product.serving_size }
    : undefined;

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
    source: 'off',
    confidence: round(confidence, 2),
    notes: notes.length > 0 ? notes : undefined,
    raw: product,
  };
}

/**
 * Get macro data from Open Food Facts by UPC
 */
export async function getMacrosFromOFF(upc: string): Promise<Macro | null> {
  try {
    const data = await fetchOFFByUPC(upc);
    return parseOFFProduct(data);
  } catch (error) {
    console.error('Error fetching from Open Food Facts:', error);
    return null;
  }
}
