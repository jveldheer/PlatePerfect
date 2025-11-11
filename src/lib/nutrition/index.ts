// Nutrition module public API

export { getMacros, initNutrition } from './router';
export type { Macro, GetMacrosInput, GetMacrosResult } from './types';

/**
 * Attribution information for nutrition data sources
 */
export function nutritionAttribution() {
  return {
    fdc: 'Nutrition data from USDA FoodData Central',
    fdcUrl: 'https://fdc.nal.usda.gov/',
    off: 'Barcode data from Open Food Facts',
    offUrl: 'https://world.openfoodfacts.org/'
  };
}
