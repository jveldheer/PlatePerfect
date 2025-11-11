/**
 * Open Food Facts API Service
 *
 * Provides nutrition data lookup by barcode using the Open Food Facts database.
 * This is a free, open database with millions of food products worldwide.
 * API Documentation: https://world.openfoodfacts.org/data
 */

export interface OpenFoodFactsProduct {
  product_name: string;
  brands?: string;
  quantity?: string;
  image_url?: string;
  nutriments: {
    'energy-kcal_100g'?: number;
    'proteins_100g'?: number;
    'carbohydrates_100g'?: number;
    'fat_100g'?: number;
    'fiber_100g'?: number;
    'sugars_100g'?: number;
    'sodium_100g'?: number;
  };
  serving_size?: string;
  serving_quantity?: number;
}

export interface OpenFoodFactsResponse {
  code: string;
  status: number;
  status_verbose: string;
  product?: OpenFoodFactsProduct;
}

export interface NutritionData {
  name: string;
  brand?: string;
  servingSize: string;
  imageUrl?: string;
  // Per serving
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  // Additional info
  barcode: string;
}

const API_BASE = 'https://world.openfoodfacts.org/api/v2';

/**
 * Look up product by barcode
 */
export async function lookupBarcode(barcode: string): Promise<NutritionData | null> {
  try {
    // Clean up barcode (remove spaces, dashes)
    const cleanBarcode = barcode.replace(/[\s-]/g, '');

    console.log('Looking up barcode:', cleanBarcode);

    const url = `${API_BASE}/product/${cleanBarcode}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'VeldheersAthleteNutrition/1.0',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`API returned status: ${response.status}`);
      throw new Error(`Open Food Facts API error: ${response.status}`);
    }

    const data: OpenFoodFactsResponse = await response.json();

    console.log('API response status:', data.status);

    if (data.status === 0 || !data.product) {
      console.warn(`Product not found for barcode: ${cleanBarcode}`);
      return null;
    }

    const nutritionData = convertToNutritionData(data.product, cleanBarcode);
    console.log('Converted nutrition data:', nutritionData);

    return nutritionData;
  } catch (error) {
    console.error('Error looking up barcode:', error);
    throw error;
  }
}

/**
 * Search products by name
 */
export async function searchProducts(query: string, pageSize = 5): Promise<NutritionData[]> {
  try {
    const url = `${API_BASE}/search?search_terms=${encodeURIComponent(query)}&page_size=${pageSize}&json=1`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'VeldheersAthleteNutrition/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Open Food Facts API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.products || data.products.length === 0) {
      return [];
    }

    return data.products
      .map((product: OpenFoodFactsProduct & { code?: string }) => {
        try {
          return convertToNutritionData(product, product.code || 'unknown');
        } catch (e) {
          console.warn('Failed to convert product:', e);
          return null;
        }
      })
      .filter((item: NutritionData | null): item is NutritionData => item !== null);
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

/**
 * Convert Open Food Facts product to our NutritionData format
 */
function convertToNutritionData(product: OpenFoodFactsProduct, barcode: string): NutritionData {
  const nutriments = product.nutriments;

  // Get serving size or default to 100g
  let servingGrams = 100;
  let servingSize = '100g';

  if (product.serving_quantity && product.serving_quantity > 0) {
    servingGrams = product.serving_quantity;
    servingSize = product.serving_size || `${servingGrams}g`;
  } else if (product.serving_size) {
    // Try to parse serving size
    const match = product.serving_size.match(/(\d+(?:\.\d+)?)\s*g/i);
    if (match) {
      servingGrams = parseFloat(match[1]);
      servingSize = product.serving_size;
    }
  }

  // Calculate nutrition per serving (data is per 100g)
  const servingMultiplier = servingGrams / 100;

  const calories = (nutriments['energy-kcal_100g'] || 0) * servingMultiplier;
  const protein = (nutriments['proteins_100g'] || 0) * servingMultiplier;
  const carbs = (nutriments['carbohydrates_100g'] || 0) * servingMultiplier;
  const fat = (nutriments['fat_100g'] || 0) * servingMultiplier;
  const fiber = nutriments['fiber_100g'] ? nutriments['fiber_100g'] * servingMultiplier : undefined;

  return {
    name: product.product_name || 'Unknown Product',
    brand: product.brands,
    servingSize,
    imageUrl: product.image_url,
    calories: Math.round(calories),
    protein: Math.round(protein * 10) / 10, // 1 decimal place
    carbs: Math.round(carbs * 10) / 10,
    fat: Math.round(fat * 10) / 10,
    fiber: fiber ? Math.round(fiber * 10) / 10 : undefined,
    barcode
  };
}

/**
 * Validate barcode format (UPC, EAN-13, EAN-8)
 */
export function isValidBarcode(barcode: string): boolean {
  // Remove any spaces or dashes
  const cleaned = barcode.replace(/[\s-]/g, '');

  // Check if it's all digits
  if (!/^\d+$/.test(cleaned)) {
    return false;
  }

  // Check valid lengths (UPC-A: 12, EAN-13: 13, EAN-8: 8)
  const validLengths = [8, 12, 13, 14];
  return validLengths.includes(cleaned.length);
}
