// Unit conversion utilities for nutrition module

/**
 * Convert kilojoules to kilocalories
 */
export function kJtoKcal(kj: number): number {
  return kj / 4.184;
}

/**
 * Calculate kilocalories from macros using Atwater factors
 * Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
 */
export function kcalFromMacros(protein_g: number, carb_g: number, fat_g: number): number {
  return (protein_g * 4) + (carb_g * 4) + (fat_g * 9);
}

/**
 * Check if two numbers are nearly equal within a tolerance
 */
export function nearlyEqual(a: number, b: number, tolerance = 0.15): boolean {
  if (b === 0) return Math.abs(a) < tolerance;
  return Math.abs((a - b) / b) <= tolerance;
}

/**
 * Round number to specified decimal places
 */
export function round(n: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}

/**
 * Unit conversion constants
 */
const UNIT_TO_GRAMS: Record<string, number> = {
  'g': 1,
  'gram': 1,
  'grams': 1,
  'kg': 1000,
  'kilogram': 1000,
  'kilograms': 1000,
  'oz': 28.35,
  'ounce': 28.35,
  'ounces': 28.35,
  'lb': 453.59,
  'lbs': 453.59,
  'pound': 453.59,
  'pounds': 453.59,
  // Volume conversions require density - handle separately
};

/**
 * Convert amount and unit to grams
 * For volume units (cup, tbsp, etc.), requires serving info with grams
 */
export function toGrams(
  amount: number,
  unit: string,
  serving?: { grams?: number; desc?: string }
): number {
  const normalizedUnit = unit.toLowerCase().trim();

  // Direct weight conversion
  if (UNIT_TO_GRAMS[normalizedUnit]) {
    return amount * UNIT_TO_GRAMS[normalizedUnit];
  }

  // Volume units need serving info
  const volumeUnits = ['cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 'tsp', 'teaspoon', 'teaspoons'];
  if (volumeUnits.includes(normalizedUnit)) {
    if (!serving?.grams) {
      throw new Error(`Cannot convert ${unit} to grams without serving size information`);
    }

    // Rough approximations if serving is "1 cup" etc
    if (serving.desc?.toLowerCase().includes('cup')) {
      return amount * serving.grams;
    }

    throw new Error(`Cannot determine conversion for ${unit}`);
  }

  // Piece-based units
  const pieceUnits = ['piece', 'pieces', 'slice', 'slices', 'serving', 'servings'];
  if (pieceUnits.includes(normalizedUnit)) {
    if (!serving?.grams) {
      throw new Error(`Cannot convert ${unit} to grams without serving size information`);
    }
    return amount * serving.grams;
  }

  throw new Error(`Unknown unit: ${unit}`);
}

/**
 * Scale macro values from per-100g to specific grams
 */
export function scaleMacros(
  macros: {
    kcal: number;
    protein_g: number;
    carb_g: number;
    fat_g: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
  },
  fromGrams: number,
  toGrams: number
) {
  const ratio = toGrams / fromGrams;
  return {
    grams: toGrams,
    kcal: round(macros.kcal * ratio, 0),
    protein_g: round(macros.protein_g * ratio),
    carb_g: round(macros.carb_g * ratio),
    fat_g: round(macros.fat_g * ratio),
    fiber_g: macros.fiber_g !== undefined ? round(macros.fiber_g * ratio) : undefined,
    sugar_g: macros.sugar_g !== undefined ? round(macros.sugar_g * ratio) : undefined,
    sodium_mg: macros.sodium_mg !== undefined ? round(macros.sodium_mg * ratio, 0) : undefined,
  };
}
