/**
 * Public API for nutrition module
 *
 * This module provides production-ready nutrition lookup using:
 * - USDA FoodData Central for generic foods
 * - Open Food Facts for barcode/UPC lookups
 *
 * @example
 * ```typescript
 * import { getMacros } from '@/lib/nutrition';
 *
 * // Lookup by UPC
 * const result = await getMacros({ upc: '737628064502' });
 *
 * // Search by name
 * const result = await getMacros({ name: 'chicken breast raw' });
 *
 * // With portion size
 * const result = await getMacros({
 *   name: 'oats',
 *   amount: 1,
 *   unit: 'cup'
 * });
 * ```
 */

export { getMacros, getBatchMacros } from "./router";
export { clearCache, getCacheStats } from "./cache";

export type {
  Macro,
  GetMacrosInput,
  GetMacrosResult,
  OFFProduct,
  FDCSearchResult,
  FDCFood,
  FDCFoodDetail,
} from "./types";

/**
 * Get attribution text for nutrition data sources
 * Use this in your UI footer or about page
 */
export function nutritionAttribution() {
  return {
    fdc: "Nutrition data from USDA FoodData Central",
    fdcUrl: "https://fdc.nal.usda.gov/",
    off: "Barcode data from Open Food Facts",
    offUrl: "https://world.openfoodfacts.org/",
  };
}

/**
 * Validate environment variables
 * Call this on app startup to ensure required API keys are set
 */
export function validateEnv(): void {
  if (!process.env.FDC_API_KEY) {
    throw new Error(
      "Missing FDC_API_KEY environment variable. " +
        "Get a free API key at https://fdc.nal.usda.gov/api-key-signup.html " +
        "and add it to your .env.local file"
    );
  }
}
