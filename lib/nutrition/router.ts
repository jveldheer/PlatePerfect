/**
 * Smart routing for nutrition lookups across multiple data sources
 */

import type { GetMacrosInput, GetMacrosResult, Macro } from "./types";
import { getOFFMacros } from "./off";
import { getFDCMacrosByGTIN, getFDCMacrosBySearch } from "./fdc";
import { getCachedByUPC, setCachedByUPC, getCachedByName, setCachedByName } from "./cache";
import { toGrams, scaleMacros } from "./units";

/**
 * Main entry point for getting macro data
 * Handles routing between OFF and FDC based on input type
 */
export async function getMacros(input: GetMacrosInput): Promise<GetMacrosResult> {
  // Validate input
  if (!input.upc && !input.text && !input.name) {
    throw new Error("Must provide at least one of: upc, text, or name");
  }

  let macro: Macro | null = null;
  let lookupKey: string | undefined;

  // Route 1: UPC lookup
  if (input.upc) {
    lookupKey = input.upc;

    // Check cache first
    macro = getCachedByUPC(input.upc);

    if (!macro) {
      // Try OFF first for barcodes
      macro = await getOFFMacros(input.upc);

      // Fallback to FDC branded foods by GTIN
      if (!macro) {
        macro = await getFDCMacrosByGTIN(input.upc);
      }

      // Last resort: search FDC by UPC as text
      if (!macro) {
        macro = await getFDCMacrosBySearch(input.upc);
      }

      // Cache the result if found
      if (macro) {
        setCachedByUPC(input.upc, macro);
      }
    }
  }
  // Route 2: Text or name search in FDC
  else {
    const query = input.text || input.name!;
    lookupKey = query;

    // Check cache first
    macro = getCachedByName(query);

    if (!macro) {
      // Search FDC
      macro = await getFDCMacrosBySearch(query);

      // Cache the result if found
      if (macro) {
        setCachedByName(query, macro);
      }
    }
  }

  // If no data found, throw error
  if (!macro) {
    throw new Error(
      `No nutrition data found for ${input.upc ? `UPC ${input.upc}` : `"${lookupKey}"`}`
    );
  }

  // Build result
  const result: GetMacrosResult = { ...macro };

  // Calculate scaled values if amount and unit provided
  if (input.amount !== undefined && input.unit !== undefined) {
    try {
      // Convert to grams
      const grams = toGrams(input.amount, input.unit, macro.serving);

      // Scale from per_100g to the requested amount
      if (macro.base_ref === "per_100g") {
        result.scaled = scaleMacros(macro, 100, grams);
      } else if (macro.base_ref === "per_serving" && macro.serving?.grams) {
        // Scale from per_serving to requested amount
        result.scaled = scaleMacros(macro, macro.serving.grams, grams);
      } else {
        // Cannot scale - missing serving size information
        result.cannot_scale = true;
        if (!result.notes) result.notes = [];
        result.notes.push(
          "Cannot calculate scaled values: serving size information not available"
        );
      }
    } catch (error) {
      // Unit conversion failed
      result.cannot_scale = true;
      if (!result.notes) result.notes = [];
      result.notes.push(`Cannot convert units: ${(error as Error).message}`);
    }
  }

  return result;
}

/**
 * Batch lookup for multiple items
 * Returns results in same order as input
 */
export async function getBatchMacros(
  inputs: GetMacrosInput[]
): Promise<(GetMacrosResult | { error: string })[]> {
  const promises = inputs.map(async (input) => {
    try {
      return await getMacros(input);
    } catch (error) {
      return { error: (error as Error).message };
    }
  });

  return Promise.all(promises);
}
