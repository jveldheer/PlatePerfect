// Main router for nutrition lookups
// Combines OFF and FDC data sources with intelligent fallback

import type { GetMacrosInput, GetMacrosResult, Macro } from './types';
import { getMacrosFromOFF } from './off';
import { getMacrosFromFDC, searchFDCByUPC, parseFDCFood } from './fdc';
import { toGrams, scaleMacros } from './units';
import { getCached, setCached, upcCacheKey, nameCacheKey } from './cache';

/**
 * Get nutrition macros from multiple data sources
 *
 * @param input - Search parameters (upc, text, or name) and optional amount/unit for scaling
 * @returns Normalized macro data with optional scaled values
 *
 * Lookup strategy:
 * 1. If UPC provided: OFF → FDC by GTIN → FDC by name
 * 2. If text/name provided: FDC search
 * 3. Cache results to reduce API calls
 * 4. Scale to target amount if provided
 */
export async function getMacros(input: GetMacrosInput): Promise<GetMacrosResult> {
  const { upc, text, name, amount, unit } = input;

  // Validation
  if (!upc && !text && !name) {
    throw new Error('Must provide upc, text, or name');
  }

  let macro: Macro | null = null;
  let foodName: string | undefined;

  // UPC lookup path
  if (upc) {
    const cacheKey = upcCacheKey(upc);

    // Check cache
    const cached = getCached(cacheKey);
    if (cached) {
      macro = cached;
    } else {
      // Try Open Food Facts first (free, no API key)
      macro = await getMacrosFromOFF(upc);

      if (macro) {
        setCached(cacheKey, macro, 'off');
        // Extract food name from raw data if available
        if (macro.raw && typeof macro.raw === 'object' && 'product_name' in macro.raw) {
          foodName = (macro.raw as any).product_name;
        }
      } else {
        // Fallback to FDC by GTIN
        try {
          const fdcFood = await searchFDCByUPC(upc);
          if (fdcFood) {
            macro = parseFDCFood(fdcFood);
            if (macro) {
              setCached(cacheKey, macro, 'fdc');
              foodName = fdcFood.description;
            }
          }
        } catch (error) {
          console.error('FDC lookup by UPC failed:', error);
          // FDC might not be configured, continue
        }
      }
    }

    if (!macro) {
      throw new Error(`No nutrition data found for UPC: ${upc}`);
    }
  }

  // Text/name lookup path
  else if (text || name) {
    const query = text || name || '';
    const cacheKey = nameCacheKey(query);

    // Check cache
    const cached = getCached(cacheKey);
    if (cached) {
      macro = cached.macro;
      foodName = cached.foodName;
    } else {
      // Use FDC for text search (more comprehensive for generic foods)
      try {
        macro = await getMacrosFromFDC(query);

        if (macro) {
          // Extract food name from raw data
          if (macro.raw && typeof macro.raw === 'object' && 'description' in macro.raw) {
            foodName = (macro.raw as any).description;
          }

          setCached(cacheKey, { macro, foodName }, 'fdc');
        }
      } catch (error) {
        console.error('FDC search failed:', error);
        throw new Error(
          'FDC API not configured. Set VITE_FDC_API_KEY in .env or use UPC barcode lookup instead. ' +
          'Get a free API key at https://fdc.nal.usda.gov/api-key-signup.html'
        );
      }

      if (!macro) {
        throw new Error(`No nutrition data found for: ${query}`);
      }
    }
  }

  // Build result
  const result: GetMacrosResult = {
    ...macro!,
    food_name: foodName,
  };

  // Scale if amount and unit provided
  if (amount && unit && macro) {
    try {
      const grams = toGrams(amount, unit, macro.serving);

      const scaled = scaleMacros(
        {
          kcal: macro.kcal,
          protein_g: macro.protein_g,
          carb_g: macro.carb_g,
          fat_g: macro.fat_g,
          fiber_g: macro.fiber_g,
          sugar_g: macro.sugar_g,
          sodium_mg: macro.sodium_mg,
        },
        grams,
        macro.base_ref,
        macro.serving?.grams
      );

      result.scaled = scaled;
    } catch (error) {
      // Cannot scale - add flag and keep base values
      result.cannot_scale = true;
      result.notes = [
        ...(result.notes || []),
        `Cannot scale: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ];
    }
  }

  return result;
}
