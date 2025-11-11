// Nutrition router - main entry point for food lookups

import type { GetMacrosInput, GetMacrosResult, Macro } from './types';
import { fetchOFFByUPC } from './off';
import { searchFDC, searchFDCByGTIN } from './fdc';
import { toGrams, scaleMacros } from './units';
import { getCache, upcCacheKey, nameCacheKey, TTL } from './cache';

let fdcApiKey: string | null = null;

/**
 * Initialize nutrition module with API keys
 */
export function initNutrition(config: { fdcApiKey: string }) {
  fdcApiKey = config.fdcApiKey;
}

/**
 * Main function to get macros for any food
 * Routes to appropriate provider based on input
 */
export async function getMacros(input: GetMacrosInput): Promise<GetMacrosResult> {
  const cache = getCache();

  // Validate we have API key
  if (!fdcApiKey) {
    throw new Error('Nutrition module not initialized. Set FDC_API_KEY environment variable.');
  }

  let macro: Macro | null = null;

  // Route 1: UPC/Barcode lookup
  if (input.upc) {
    const cacheKey = upcCacheKey(input.upc);
    macro = cache.get(cacheKey);

    if (!macro) {
      // Try OFF first
      macro = await fetchOFFByUPC(input.upc);

      // Fall back to FDC by GTIN
      if (!macro) {
        macro = await searchFDCByGTIN(input.upc, fdcApiKey);
      }

      // Fall back to FDC by name if we have one
      if (!macro && input.name) {
        macro = await searchFDC(input.name, fdcApiKey);
      }

      if (macro) {
        cache.set(cacheKey, macro, macro.source === 'off' ? TTL.OFF : TTL.FDC);
      }
    }
  }
  // Route 2: Text or name search
  else if (input.text || input.name) {
    const query = input.text || input.name!;
    const cacheKey = nameCacheKey(query);
    macro = cache.get(cacheKey);

    if (!macro) {
      macro = await searchFDC(query, fdcApiKey);

      if (macro) {
        cache.set(cacheKey, macro, TTL.FDC);
      }
    }
  } else {
    throw new Error('Provide upc, text, or name');
  }

  if (!macro) {
    throw new Error('Food not found');
  }

  // Build result
  const result: GetMacrosResult = { ...macro };

  // Scale if amount and unit provided
  if (input.amount && input.unit) {
    try {
      const grams = toGrams(input.amount, input.unit, macro.serving);

      // Scale from per-100g to target grams
      result.scaled = scaleMacros(
        {
          kcal: macro.kcal,
          protein_g: macro.protein_g,
          carb_g: macro.carb_g,
          fat_g: macro.fat_g,
          fiber_g: macro.fiber_g,
          sugar_g: macro.sugar_g,
          sodium_mg: macro.sodium_mg,
        },
        100,
        grams
      );
    } catch (error: any) {
      result.cannot_scale = true;
      result.error = error.message;
    }
  }

  return result;
}
