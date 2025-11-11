// Nutrition lookup module
// Provides food macro data from Open Food Facts and USDA FoodData Central

export { getMacros } from './router';
export { clearCache, getCacheStats } from './cache';

export type {
  Macro,
  GetMacrosInput,
  GetMacrosResult,
  OFFProduct,
  FDCFood,
  FDCSearchResult,
} from './types';

/**
 * Get attribution text for data sources
 * Include this in your app footer or about page
 */
export function nutritionAttribution() {
  return {
    fdc: 'Nutrition data from USDA FoodData Central',
    fdcUrl: 'https://fdc.nal.usda.gov/',
    off: 'Barcode data from Open Food Facts',
    offUrl: 'https://world.openfoodfacts.org/',
  };
}

/**
 * Get setup instructions for the nutrition module
 */
export function getSetupInstructions() {
  return {
    message: 'Nutrition module requires USDA FoodData Central API key for text search',
    steps: [
      '1. Get a free API key at https://fdc.nal.usda.gov/api-key-signup.html',
      '2. Create a .env file in your project root',
      '3. Add: VITE_FDC_API_KEY=your_api_key_here',
      '4. Restart your development server',
    ],
    note: 'Barcode lookup (UPC) works without an API key using Open Food Facts',
  };
}
