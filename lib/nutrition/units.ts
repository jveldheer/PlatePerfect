/**
 * Unit conversion and calculation utilities for nutrition data
 */

/**
 * Convert kilojoules to kilocalories
 */
export function kJtoKcal(kj: number): number {
  return kj / 4.184;
}

/**
 * Calculate kilocalories from macronutrients using Atwater factors
 * Protein: 4 kcal/g, Carbs: 4 kcal/g, Fat: 9 kcal/g
 */
export function kcalFromMacros(protein_g: number, carb_g: number, fat_g: number): number {
  return protein_g * 4 + carb_g * 4 + fat_g * 9;
}

/**
 * Check if two numbers are nearly equal within a tolerance
 * Default tolerance of 0.15 (15%)
 */
export function nearlyEqual(a: number, b: number, tolerance = 0.15): boolean {
  if (a === 0 && b === 0) return true;
  if (a === 0 || b === 0) return Math.abs(a - b) < 1; // Within 1 kcal for zero cases
  const ratio = Math.abs((a - b) / Math.max(a, b));
  return ratio <= tolerance;
}

/**
 * Round a number to a specified number of decimal places
 */
export function round(n: number, decimals = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(n * factor) / factor;
}

/**
 * Convert various units to grams
 * Supports: g, kg, oz, lb
 * For volume units (cup, tbsp, tsp, ml, l), requires serving grams
 * For descriptive units (slice, piece, serving), requires serving grams
 */
export function toGrams(
  amount: number,
  unit: string,
  serving?: { grams?: number; desc?: string }
): number {
  const normalizedUnit = unit.toLowerCase().trim();

  // Weight units - direct conversion
  switch (normalizedUnit) {
    case "g":
    case "gram":
    case "grams":
      return amount;

    case "kg":
    case "kilogram":
    case "kilograms":
      return amount * 1000;

    case "oz":
    case "ounce":
    case "ounces":
      return amount * 28.3495;

    case "lb":
    case "lbs":
    case "pound":
    case "pounds":
      return amount * 453.592;
  }

  // Volume units - use serving size as reference
  // Note: These are approximations and work best when serving size matches
  const volumeUnits = [
    "cup", "cups",
    "tbsp", "tablespoon", "tablespoons",
    "tsp", "teaspoon", "teaspoons",
    "ml", "milliliter", "milliliters",
    "l", "liter", "liters",
    "fl oz", "fluid ounce", "fluid ounces"
  ];

  const descriptiveUnits = [
    "slice", "slices",
    "piece", "pieces",
    "serving", "servings",
    "unit", "units",
    "item", "items",
    "portion", "portions"
  ];

  const isVolumeOrDescriptive = volumeUnits.includes(normalizedUnit) || descriptiveUnits.includes(normalizedUnit);

  // Volume and descriptive units require serving information
  if (isVolumeOrDescriptive) {
    if (!serving?.grams) {
      throw new Error(
        `Cannot convert ${normalizedUnit} to grams: serving size information not available`
      );
    }
    // Use serving grams as the reference for 1 unit
    return amount * serving.grams;
  }

  throw new Error(`Unsupported unit: ${unit}`);
}

/**
 * Parse serving size string to extract grams
 * Examples: "40g", "40 g", "1 serving (40g)", "serving 40 g"
 */
export function parseServingGrams(servingSize?: string): number | undefined {
  if (!servingSize) return undefined;

  // Match patterns like "40g", "40 g", "(40g)", "40 grams"
  const gramMatch = servingSize.match(/(\d+(?:\.\d+)?)\s*g(?:ram)?s?/i);
  if (gramMatch) {
    return parseFloat(gramMatch[1]);
  }

  return undefined;
}

/**
 * Scale macros from per-100g to a specific gram amount
 */
export function scaleMacros(
  macro: {
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
    kcal: round(macro.kcal * ratio, 0),
    protein_g: round(macro.protein_g * ratio),
    carb_g: round(macro.carb_g * ratio),
    fat_g: round(macro.fat_g * ratio),
    fiber_g: macro.fiber_g !== undefined ? round(macro.fiber_g * ratio) : undefined,
    sugar_g: macro.sugar_g !== undefined ? round(macro.sugar_g * ratio) : undefined,
    sodium_mg: macro.sodium_mg !== undefined ? round(macro.sodium_mg * ratio, 0) : undefined,
  };
}
