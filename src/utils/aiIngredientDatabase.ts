// Comprehensive ingredient database with macros per 100g
export interface NutrientData {
  cal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  fiber_g: number;
}

export interface IngredientData {
  canonical_name: string;
  aliases: string[];
  category: 'protein' | 'carb' | 'fat' | 'veg_fruit' | 'flavor' | 'staple';
  is_animal_protein: boolean;
  macros_per_100g: NutrientData;
  typical_serving_g: number;
  source: 'fridge' | 'pantry' | 'frozen';
}

export const AI_INGREDIENT_DATABASE: Record<string, IngredientData> = {
  // ANIMAL PROTEINS
  chicken_breast: {
    canonical_name: 'chicken breast',
    aliases: ['chicken', 'chk', 'chkn', 'chikn', 'chicken breast'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 165, protein_g: 31, carb_g: 0, fat_g: 3.6, fiber_g: 0 },
    typical_serving_g: 170,
    source: 'fridge'
  },
  ground_turkey: {
    canonical_name: 'ground turkey',
    aliases: ['ground turkey', 'turkey', 'tky', 'ground tky'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 170, protein_g: 20, carb_g: 0, fat_g: 10, fiber_g: 0 },
    typical_serving_g: 113,
    source: 'fridge'
  },
  ground_beef: {
    canonical_name: 'ground beef',
    aliases: ['ground beef', 'beef', 'g beef', 'lean gb', 'hamburger'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 217, protein_g: 20, carb_g: 0, fat_g: 15, fiber_g: 0 },
    typical_serving_g: 113,
    source: 'fridge'
  },
  canned_tuna: {
    canonical_name: 'canned tuna',
    aliases: ['tuna', 'tna', 'canned tuna', 'tuna can'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 116, protein_g: 26, carb_g: 0, fat_g: 0.8, fiber_g: 0 },
    typical_serving_g: 142,
    source: 'pantry'
  },
  salmon: {
    canonical_name: 'salmon',
    aliases: ['salmon', 'salmn', 'slmn', 'salmon fillet'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 206, protein_g: 22, carb_g: 0, fat_g: 13, fiber_g: 0 },
    typical_serving_g: 140,
    source: 'fridge'
  },
  eggs: {
    canonical_name: 'eggs',
    aliases: ['eggs', 'egg', 'whole eggs'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 143, protein_g: 13, carb_g: 0.7, fat_g: 10, fiber_g: 0 },
    typical_serving_g: 100,
    source: 'fridge'
  },
  egg_whites: {
    canonical_name: 'egg whites',
    aliases: ['egg whites', 'egg whts', 'whites'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 52, protein_g: 11, carb_g: 0.7, fat_g: 0.2, fiber_g: 0 },
    typical_serving_g: 120,
    source: 'fridge'
  },
  greek_yogurt: {
    canonical_name: 'greek yogurt',
    aliases: ['greek yogurt', 'grk yog', 'yogurt', 'greek yog'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 97, protein_g: 10, carb_g: 3.6, fat_g: 5, fiber_g: 0 },
    typical_serving_g: 170,
    source: 'fridge'
  },
  cottage_cheese: {
    canonical_name: 'cottage cheese',
    aliases: ['cottage cheese', 'cot chs', 'cottage'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 98, protein_g: 11, carb_g: 3.4, fat_g: 4.3, fiber_g: 0 },
    typical_serving_g: 113,
    source: 'fridge'
  },
  whey_isolate: {
    canonical_name: 'whey isolate',
    aliases: ['whey isolate', 'w iso', 'whey iso', 'protein powder', 'whey'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 400, protein_g: 90, carb_g: 3, fat_g: 1, fiber_g: 0 },
    typical_serving_g: 30,
    source: 'pantry'
  },
  shrimp: {
    canonical_name: 'shrimp',
    aliases: ['shrimp', 'prawns'],
    category: 'protein',
    is_animal_protein: true,
    macros_per_100g: { cal: 99, protein_g: 24, carb_g: 0.2, fat_g: 0.3, fiber_g: 0 },
    typical_serving_g: 113,
    source: 'frozen'
  },

  // CARBS
  white_rice: {
    canonical_name: 'white rice',
    aliases: ['rice', 'white rice', 'cooked rice', 'rice cups'],
    category: 'carb',
    is_animal_protein: false,
    macros_per_100g: { cal: 130, protein_g: 2.7, carb_g: 28, fat_g: 0.3, fiber_g: 0.4 },
    typical_serving_g: 150,
    source: 'pantry'
  },
  oats: {
    canonical_name: 'oats',
    aliases: ['oats', 'oatmeal', 'rolled oats'],
    category: 'carb',
    is_animal_protein: false,
    macros_per_100g: { cal: 389, protein_g: 17, carb_g: 66, fat_g: 7, fiber_g: 11 },
    typical_serving_g: 40,
    source: 'pantry'
  },
  sweet_potato: {
    canonical_name: 'sweet potato',
    aliases: ['sweet potato', 'sweet potatoes', 'yam'],
    category: 'carb',
    is_animal_protein: false,
    macros_per_100g: { cal: 90, protein_g: 2, carb_g: 21, fat_g: 0.2, fiber_g: 3.3 },
    typical_serving_g: 130,
    source: 'pantry'
  },
  pasta: {
    canonical_name: 'pasta',
    aliases: ['pasta', 'noodles', 'spaghetti', 'penne'],
    category: 'carb',
    is_animal_protein: false,
    macros_per_100g: { cal: 158, protein_g: 5.8, carb_g: 31, fat_g: 0.9, fiber_g: 1.8 },
    typical_serving_g: 140,
    source: 'pantry'
  },
  tortilla: {
    canonical_name: 'tortilla',
    aliases: ['tortilla', 'wrap', 'tortillas'],
    category: 'carb',
    is_animal_protein: false,
    macros_per_100g: { cal: 304, protein_g: 8, carb_g: 49, fat_g: 8, fiber_g: 3 },
    typical_serving_g: 50,
    source: 'pantry'
  },
  potato: {
    canonical_name: 'potato',
    aliases: ['potato', 'potatoes', 'white potato'],
    category: 'carb',
    is_animal_protein: false,
    macros_per_100g: { cal: 77, protein_g: 2, carb_g: 17, fat_g: 0.1, fiber_g: 2.2 },
    typical_serving_g: 150,
    source: 'pantry'
  },
  banana: {
    canonical_name: 'banana',
    aliases: ['banana', 'bananas'],
    category: 'carb',
    is_animal_protein: false,
    macros_per_100g: { cal: 89, protein_g: 1.1, carb_g: 23, fat_g: 0.3, fiber_g: 2.6 },
    typical_serving_g: 120,
    source: 'pantry'
  },
  bagel: {
    canonical_name: 'bagel',
    aliases: ['bagel', 'bagels'],
    category: 'carb',
    is_animal_protein: false,
    macros_per_100g: { cal: 257, protein_g: 10, carb_g: 50, fat_g: 1.5, fiber_g: 2.3 },
    typical_serving_g: 90,
    source: 'pantry'
  },

  // FATS
  avocado: {
    canonical_name: 'avocado',
    aliases: ['avocado', 'avo'],
    category: 'fat',
    is_animal_protein: false,
    macros_per_100g: { cal: 160, protein_g: 2, carb_g: 8.5, fat_g: 15, fiber_g: 6.7 },
    typical_serving_g: 100,
    source: 'fridge'
  },
  peanut_butter: {
    canonical_name: 'peanut butter',
    aliases: ['peanut butter', 'pb', 'peanutbutter'],
    category: 'fat',
    is_animal_protein: false,
    macros_per_100g: { cal: 588, protein_g: 25, carb_g: 20, fat_g: 50, fiber_g: 6 },
    typical_serving_g: 32,
    source: 'pantry'
  },
  olive_oil: {
    canonical_name: 'olive oil',
    aliases: ['olive oil', 'evoo', 'oil'],
    category: 'fat',
    is_animal_protein: false,
    macros_per_100g: { cal: 884, protein_g: 0, carb_g: 0, fat_g: 100, fiber_g: 0 },
    typical_serving_g: 14,
    source: 'pantry'
  },
  almonds: {
    canonical_name: 'almonds',
    aliases: ['almonds', 'almond'],
    category: 'fat',
    is_animal_protein: false,
    macros_per_100g: { cal: 579, protein_g: 21, carb_g: 22, fat_g: 50, fiber_g: 12 },
    typical_serving_g: 28,
    source: 'pantry'
  },

  // VEGETABLES & FRUITS
  spinach: {
    canonical_name: 'spinach',
    aliases: ['spinach'],
    category: 'veg_fruit',
    is_animal_protein: false,
    macros_per_100g: { cal: 23, protein_g: 2.9, carb_g: 3.6, fat_g: 0.4, fiber_g: 2.2 },
    typical_serving_g: 60,
    source: 'fridge'
  },
  broccoli: {
    canonical_name: 'broccoli',
    aliases: ['broccoli'],
    category: 'veg_fruit',
    is_animal_protein: false,
    macros_per_100g: { cal: 34, protein_g: 2.8, carb_g: 7, fat_g: 0.4, fiber_g: 2.6 },
    typical_serving_g: 91,
    source: 'fridge'
  },
  bell_pepper: {
    canonical_name: 'bell pepper',
    aliases: ['bell pepper', 'pepper', 'peppers'],
    category: 'veg_fruit',
    is_animal_protein: false,
    macros_per_100g: { cal: 26, protein_g: 1, carb_g: 6, fat_g: 0.3, fiber_g: 2.1 },
    typical_serving_g: 120,
    source: 'fridge'
  },
  berries: {
    canonical_name: 'berries',
    aliases: ['berries', 'mixed berries', 'blueberries', 'strawberries'],
    category: 'veg_fruit',
    is_animal_protein: false,
    macros_per_100g: { cal: 57, protein_g: 0.7, carb_g: 14, fat_g: 0.3, fiber_g: 2.4 },
    typical_serving_g: 80,
    source: 'frozen'
  },
  tomato: {
    canonical_name: 'tomato',
    aliases: ['tomato', 'tomatoes'],
    category: 'veg_fruit',
    is_animal_protein: false,
    macros_per_100g: { cal: 18, protein_g: 0.9, carb_g: 3.9, fat_g: 0.2, fiber_g: 1.2 },
    typical_serving_g: 100,
    source: 'fridge'
  }
};

// Find ingredient by user input
export function findAIIngredient(input: string): IngredientData | null {
  const normalized = input.toLowerCase().trim();

  for (const key in AI_INGREDIENT_DATABASE) {
    const ingredient = AI_INGREDIENT_DATABASE[key];
    if (ingredient.aliases.some(alias =>
      normalized.includes(alias) || alias.includes(normalized)
    )) {
      return ingredient;
    }
  }

  return null;
}

// Calculate macros for a specific gram amount
export function calculateMacros(ingredient: IngredientData, grams: number): NutrientData {
  const factor = grams / 100;
  return {
    cal: Math.round(ingredient.macros_per_100g.cal * factor * 10) / 10,
    protein_g: Math.round(ingredient.macros_per_100g.protein_g * factor * 10) / 10,
    carb_g: Math.round(ingredient.macros_per_100g.carb_g * factor * 10) / 10,
    fat_g: Math.round(ingredient.macros_per_100g.fat_g * factor * 10) / 10,
    fiber_g: Math.round(ingredient.macros_per_100g.fiber_g * factor * 10) / 10
  };
}

// Sum macros
export function sumMacros(macros: NutrientData[]): NutrientData {
  return macros.reduce((sum, m) => ({
    cal: Math.round((sum.cal + m.cal) * 10) / 10,
    protein_g: Math.round((sum.protein_g + m.protein_g) * 10) / 10,
    carb_g: Math.round((sum.carb_g + m.carb_g) * 10) / 10,
    fat_g: Math.round((sum.fat_g + m.fat_g) * 10) / 10,
    fiber_g: Math.round((sum.fiber_g + m.fiber_g) * 10) / 10
  }), { cal: 0, protein_g: 0, carb_g: 0, fat_g: 0, fiber_g: 0 });
}

// Divide macros by servings
export function divideMacros(macros: NutrientData, servings: number): NutrientData {
  return {
    cal: Math.round((macros.cal / servings) * 10) / 10,
    protein_g: Math.round((macros.protein_g / servings) * 10) / 10,
    carb_g: Math.round((macros.carb_g / servings) * 10) / 10,
    fat_g: Math.round((macros.fat_g / servings) * 10) / 10,
    fiber_g: Math.round((macros.fiber_g / servings) * 10) / 10
  };
}
