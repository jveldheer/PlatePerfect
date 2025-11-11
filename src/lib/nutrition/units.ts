// Unit conversion and calculation utilities for nutrition data

/**
 * Convert kilojoules to kilocalories
 */
export function kJtoKcal(kj: number): number {
  return kj / 4.184;
}

/**
 * Calculate kilocalories from macros using 4-4-9 rule
 * Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
 */
export function kcalFromMacros(protein_g: number, carb_g: number, fat_g: number): number {
  return protein_g * 4 + carb_g * 4 + fat_g * 9;
}

/**
 * Check if two numbers are nearly equal within a tolerance
 * Default tolerance is 15% (0.15)
 */
export function nearlyEqual(a: number, b: number, tolerance = 0.15): boolean {
  if (a === 0 && b === 0) return true;
  if (a === 0 || b === 0) return Math.abs(a - b) < 1; // Within 1 kcal for zero cases
  const diff = Math.abs(a - b);
  const avg = (Math.abs(a) + Math.abs(b)) / 2;
  return diff / avg <= tolerance;
}

/**
 * Round a number to specified decimal places
 */
export function round(n: number, decimals = 1): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(n * multiplier) / multiplier;
}

/**
 * Parse serving size string to extract grams
 * Examples: "40g", "40 g", "serving 40g", "1.5 oz (42g)"
 */
export function parseServingGrams(servingSize?: string): number | undefined {
  if (!servingSize) return undefined;

  // Look for patterns like "40g" or "40 g"
  const gramMatch = servingSize.match(/(\d+(?:\.\d+)?)\s*g(?:ram)?s?/i);
  if (gramMatch) {
    return parseFloat(gramMatch[1]);
  }

  return undefined;
}

/**
 * Convert amount and unit to grams
 * Supports: g, kg, oz, lb, and volume units if serving info is available
 */
export function toGrams(
  amount: number,
  unit: string,
  serving?: { grams?: number; desc?: string }
): number {
  const unitLower = unit.toLowerCase().trim();

  // Direct weight units
  switch (unitLower) {
    case 'g':
    case 'gram':
    case 'grams':
      return amount;

    case 'kg':
    case 'kilogram':
    case 'kilograms':
      return amount * 1000;

    case 'oz':
    case 'ounce':
    case 'ounces':
      return amount * 28.3495;

    case 'lb':
    case 'pound':
    case 'pounds':
      return amount * 453.592;

    case 'mg':
    case 'milligram':
    case 'milligrams':
      return amount / 1000;
  }

  // Volume and count units - require serving info
  if (serving?.grams) {
    // Common volume units - assume serving is for "1 unit"
    const volumeUnits = [
      'cup', 'cups',
      'tbsp', 'tablespoon', 'tablespoons',
      'tsp', 'teaspoon', 'teaspoons',
      'ml', 'milliliter', 'milliliters',
      'l', 'liter', 'liters',
      'fl oz', 'fluid ounce', 'fluid ounces',
      'serving', 'servings',
      'piece', 'pieces',
      'slice', 'slices',
      'item', 'items'
    ];

    if (volumeUnits.includes(unitLower)) {
      return amount * serving.grams;
    }

    // Check if serving description matches the unit
    if (serving.desc && serving.desc.toLowerCase().includes(unitLower)) {
      return amount * serving.grams;
    }
  }

  throw new Error(
    `Cannot convert ${unit} to grams. ` +
    `Supported units: g, kg, oz, lb. ` +
    `Volume units require serving information.`
  );
}

/**
 * Scale macros from per-100g to target grams
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
  targetGrams: number,
  baseRef: 'per_100g' | 'per_serving' = 'per_100g',
  servingGrams?: number
): {
  grams: number;
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
} {
  let multiplier: number;

  if (baseRef === 'per_100g') {
    multiplier = targetGrams / 100;
  } else if (baseRef === 'per_serving' && servingGrams) {
    multiplier = targetGrams / servingGrams;
  } else {
    throw new Error('Cannot scale: serving grams not available');
  }

  return {
    grams: round(targetGrams, 1),
    kcal: round(macros.kcal * multiplier, 0),
    protein_g: round(macros.protein_g * multiplier, 1),
    carb_g: round(macros.carb_g * multiplier, 1),
    fat_g: round(macros.fat_g * multiplier, 1),
    fiber_g: macros.fiber_g !== undefined ? round(macros.fiber_g * multiplier, 1) : undefined,
    sugar_g: macros.sugar_g !== undefined ? round(macros.sugar_g * multiplier, 1) : undefined,
    sodium_mg: macros.sodium_mg !== undefined ? round(macros.sodium_mg * multiplier, 0) : undefined,
  };
}
