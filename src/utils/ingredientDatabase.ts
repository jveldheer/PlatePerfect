// Standard ingredient database with nutrition info (per standard serving)
export interface IngredientInfo {
  name: string;
  aliases: string[]; // Different ways to refer to this ingredient
  standardSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const ingredientDatabase: Record<string, IngredientInfo> = {
  tuna: {
    name: 'Tuna',
    aliases: ['tuna', 'canned tuna', 'tuna can'],
    standardSize: '5 oz can',
    calories: 120,
    protein: 26,
    carbs: 0,
    fat: 1
  },
  chicken: {
    name: 'Chicken Breast',
    aliases: ['chicken', 'chicken breast', 'grilled chicken'],
    standardSize: '6 oz',
    calories: 180,
    protein: 38,
    carbs: 0,
    fat: 4
  },
  rice: {
    name: 'White Rice',
    aliases: ['rice', 'white rice', 'cooked rice'],
    standardSize: '1 cup cooked',
    calories: 200,
    protein: 4,
    carbs: 45,
    fat: 0
  },
  pasta: {
    name: 'Pasta',
    aliases: ['pasta', 'noodles', 'spaghetti', 'penne'],
    standardSize: '2 oz dry (1 cup cooked)',
    calories: 200,
    protein: 7,
    carbs: 42,
    fat: 1
  },
  eggs: {
    name: 'Eggs',
    aliases: ['egg', 'eggs', 'whole eggs'],
    standardSize: '2 large eggs',
    calories: 140,
    protein: 12,
    carbs: 1,
    fat: 10
  },
  groundBeef: {
    name: 'Ground Beef',
    aliases: ['ground beef', 'beef', 'hamburger meat'],
    standardSize: '4 oz (85% lean)',
    calories: 240,
    protein: 20,
    carbs: 0,
    fat: 17
  },
  salmon: {
    name: 'Salmon',
    aliases: ['salmon', 'salmon fillet'],
    standardSize: '5 oz',
    calories: 280,
    protein: 34,
    carbs: 0,
    fat: 15
  },
  groundTurkey: {
    name: 'Ground Turkey',
    aliases: ['ground turkey', 'turkey', 'turkey meat'],
    standardSize: '4 oz (93% lean)',
    calories: 160,
    protein: 22,
    carbs: 0,
    fat: 8
  },
  shrimp: {
    name: 'Shrimp',
    aliases: ['shrimp', 'prawns'],
    standardSize: '4 oz',
    calories: 110,
    protein: 23,
    carbs: 1,
    fat: 2
  },
  beans: {
    name: 'Black Beans',
    aliases: ['beans', 'black beans', 'kidney beans', 'canned beans'],
    standardSize: '1 cup',
    calories: 240,
    protein: 15,
    carbs: 40,
    fat: 1
  },
  quinoa: {
    name: 'Quinoa',
    aliases: ['quinoa'],
    standardSize: '1 cup cooked',
    calories: 220,
    protein: 8,
    carbs: 40,
    fat: 4
  },
  sweetPotato: {
    name: 'Sweet Potato',
    aliases: ['sweet potato', 'sweet potatoes', 'yam', 'yams'],
    standardSize: '1 medium (5 oz)',
    calories: 130,
    protein: 2,
    carbs: 30,
    fat: 0
  },
  broccoli: {
    name: 'Broccoli',
    aliases: ['broccoli'],
    standardSize: '1 cup',
    calories: 30,
    protein: 3,
    carbs: 6,
    fat: 0
  },
  spinach: {
    name: 'Spinach',
    aliases: ['spinach'],
    standardSize: '2 cups raw',
    calories: 15,
    protein: 2,
    carbs: 2,
    fat: 0
  },
  avocado: {
    name: 'Avocado',
    aliases: ['avocado'],
    standardSize: '1/2 medium',
    calories: 120,
    protein: 1,
    carbs: 6,
    fat: 11
  },
  oats: {
    name: 'Oats',
    aliases: ['oats', 'oatmeal', 'rolled oats'],
    standardSize: '1/2 cup dry',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3
  },
  banana: {
    name: 'Banana',
    aliases: ['banana', 'bananas'],
    standardSize: '1 medium',
    calories: 105,
    protein: 1,
    carbs: 27,
    fat: 0
  },
  peanutButter: {
    name: 'Peanut Butter',
    aliases: ['peanut butter', 'pb'],
    standardSize: '2 tbsp',
    calories: 190,
    protein: 8,
    carbs: 7,
    fat: 16
  },
  greekYogurt: {
    name: 'Greek Yogurt',
    aliases: ['greek yogurt', 'yogurt'],
    standardSize: '1 cup',
    calories: 150,
    protein: 20,
    carbs: 11,
    fat: 4
  },
  proteinPowder: {
    name: 'Protein Powder',
    aliases: ['protein powder', 'whey protein', 'protein'],
    standardSize: '1 scoop (30g)',
    calories: 120,
    protein: 24,
    carbs: 3,
    fat: 1
  }
};

// Find ingredient by user input (handles variations)
export function findIngredient(input: string): IngredientInfo | null {
  const normalized = input.toLowerCase().trim();

  for (const key in ingredientDatabase) {
    const ingredient = ingredientDatabase[key];
    if (ingredient.aliases.some(alias => normalized.includes(alias) || alias.includes(normalized))) {
      return ingredient;
    }
  }

  return null;
}
