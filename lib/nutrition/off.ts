/**
 * Open Food Facts API client
 * https://world.openfoodfacts.org/
 */

import type { Macro, OFFProduct } from "./types";
import { kJtoKcal, kcalFromMacros, nearlyEqual, parseServingGrams, round } from "./units";

const OFF_API_BASE = "https://world.openfoodfacts.org/api/v2";

/**
 * Fetch product data from Open Food Facts by UPC/barcode
 */
export async function fetchOFFByUPC(upc: string): Promise<OFFProduct> {
  const url = `${OFF_API_BASE}/product/${upc}.json`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "PlatePerfect/1.0 (Nutrition tracker)",
    },
  });

  if (!response.ok) {
    throw new Error(`OFF API error: ${response.status} ${response.statusText}`);
  }

  const data: OFFProduct = await response.json();
  return data;
}

/**
 * Parse serving size string to extract grams and description
 */
export function parseOFFServing(servingSize?: string): {
  grams?: number;
  desc?: string;
} {
  if (!servingSize) return {};

  const grams = parseServingGrams(servingSize);

  return {
    grams,
    desc: servingSize,
  };
}

/**
 * Convert Open Food Facts product data to standardized Macro format
 */
export function parseOFFProduct(product: OFFProduct): Macro | null {
  if (product.status !== 1 || !product.product) {
    return null;
  }

  const p = product.product;
  const n = p.nutriments;

  if (!n) {
    return null;
  }

  // Get energy - prefer kcal, fallback to converting kJ
  let kcal = n["energy-kcal_100g"];
  if (kcal === undefined && n["energy-kj_100g"] !== undefined) {
    kcal = kJtoKcal(n["energy-kj_100g"]);
  }

  // Get macronutrients
  const protein_g = n["proteins_100g"];
  const carb_g = n["carbohydrates_100g"];
  const fat_g = n["fat_100g"];

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
  const fiber_g = n["fiber_100g"];
  const sugar_g = n["sugars_100g"];
  const sodium_mg = n["sodium_100g"] !== undefined ? n["sodium_100g"] * 1000 : undefined; // Convert g to mg

  // Parse serving information
  const serving = parseOFFServing(p.serving_size);

  // Calculate confidence
  const notes: string[] = [];
  let confidence = 0.8; // Base confidence for OFF data

  // Check if calculated kcal matches reported kcal
  const calculatedKcal = kcalFromMacros(protein_g, carb_g, fat_g);
  if (!nearlyEqual(kcal, calculatedKcal)) {
    confidence -= 0.2;
    notes.push(
      `Energy mismatch: reported ${round(kcal, 0)} kcal vs calculated ${round(calculatedKcal, 0)} kcal from macros`
    );
  }

  // Higher confidence if we have serving size in grams
  if (serving.grams) {
    confidence += 0.1;
  }

  // Higher confidence if we have fiber and sugar data
  if (fiber_g !== undefined && sugar_g !== undefined) {
    confidence += 0.05;
  }

  // Cap confidence at 0.95
  confidence = Math.min(confidence, 0.95);

  return {
    kcal: round(kcal, 0),
    protein_g: round(protein_g),
    carb_g: round(carb_g),
    fat_g: round(fat_g),
    fiber_g: fiber_g !== undefined ? round(fiber_g) : undefined,
    sugar_g: sugar_g !== undefined ? round(sugar_g) : undefined,
    sodium_mg: sodium_mg !== undefined ? round(sodium_mg, 0) : undefined,
    base_ref: "per_100g",
    serving: serving.grams || serving.desc ? serving : undefined,
    source: "off",
    confidence: round(confidence, 2),
    raw: product,
    notes: notes.length > 0 ? notes : undefined,
  };
}

/**
 * Get macro data from Open Food Facts by UPC
 */
export async function getOFFMacros(upc: string): Promise<Macro | null> {
  try {
    const product = await fetchOFFByUPC(upc);
    return parseOFFProduct(product);
  } catch (error) {
    // Return null on error - caller can decide whether to fallback
    console.error(`OFF lookup failed for UPC ${upc}:`, error);
    return null;
  }
}
