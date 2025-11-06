import type { MacroOutputs } from './macroCalculator';

export interface ConsumedMacros {
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

export interface MealSuggestion {
  mealType: string;
  reason: string;
  suggestedMacros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  mealIdeas: string[];
  recipeMatches: string[];
  tips: string[];
}

// Ingredient categories for smart matching
const proteinSources = ['chicken', 'beef', 'turkey', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'eggs', 'egg', 'protein powder', 'protein', 'greek yogurt', 'yogurt', 'cottage cheese', 'tofu', 'tempeh', 'beans', 'lentils', 'chickpeas'];
const carbSources = ['rice', 'pasta', 'bread', 'oats', 'oatmeal', 'quinoa', 'potato', 'potatoes', 'sweet potato', 'sweet potatoes', 'tortilla', 'bagel', 'cereal', 'granola'];
const veggieSources = ['broccoli', 'spinach', 'kale', 'lettuce', 'tomato', 'tomatoes', 'cucumber', 'peppers', 'pepper', 'onion', 'onions', 'garlic', 'carrots', 'celery', 'zucchini', 'squash', 'cauliflower', 'brussels sprouts', 'green beans', 'asparagus', 'mushrooms', 'avocado'];
const fatSources = ['oil', 'olive oil', 'butter', 'cheese', 'nuts', 'peanut butter', 'almond butter', 'avocado', 'seeds', 'chia seeds'];
const fruitSources = ['banana', 'bananas', 'apple', 'apples', 'berries', 'strawberries', 'blueberries', 'raspberries', 'orange', 'grapes', 'pineapple', 'mango', 'peach'];

function categorizeIngredients(ingredients: string[]) {
  const normalized = ingredients.map(i => i.toLowerCase().trim());

  return {
    proteins: normalized.filter(i => proteinSources.some(ps => i.includes(ps))),
    carbs: normalized.filter(i => carbSources.some(cs => i.includes(cs))),
    veggies: normalized.filter(i => veggieSources.some(vs => i.includes(vs))),
    fats: normalized.filter(i => fatSources.some(fs => i.includes(fs))),
    fruits: normalized.filter(i => fruitSources.some(fs => i.includes(fs)))
  };
}

function calculateNeededMacros(
  macroGoals: MacroOutputs | null,
  consumed: ConsumedMacros | null
): { calories: number; protein: number; carbs: number; fat: number } | null {
  if (!macroGoals || !consumed) return null;

  return {
    calories: Math.max(0, macroGoals.calories - consumed.calories),
    protein: Math.max(0, macroGoals.protein_g - consumed.protein_g),
    carbs: Math.max(0, macroGoals.carbs_g - consumed.carbs_g),
    fat: Math.max(0, macroGoals.fat_g - consumed.fat_g)
  };
}

function determineMealType(needed: { calories: number; protein: number; carbs: number; fat: number } | null): string {
  if (!needed) return 'balanced';

  const totalCaloriesNeeded = needed.calories;

  // Determine what the user needs most
  if (totalCaloriesNeeded < 200) return 'light-snack';
  if (totalCaloriesNeeded < 400) return 'snack';

  // For meals, check protein priority (important for athletes)
  const proteinPercent = needed.protein / (needed.protein + needed.carbs + needed.fat) || 0;

  if (proteinPercent > 0.4) return 'high-protein';
  if (needed.carbs > needed.protein * 2) return 'carb-focused';

  return 'balanced';
}

export function generateMealSuggestions(
  ingredients: string[],
  macroGoals: MacroOutputs | null,
  consumed: ConsumedMacros | null
): MealSuggestion {
  const categorized = categorizeIngredients(ingredients);
  const needed = calculateNeededMacros(macroGoals, consumed);
  const mealType = determineMealType(needed);

  const suggestions: MealSuggestion = {
    mealType: '',
    reason: '',
    suggestedMacros: {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    },
    mealIdeas: [],
    recipeMatches: [],
    tips: []
  };

  // Determine suggested macros for this meal
  if (needed) {
    const targetCalories = mealType === 'light-snack' ? 150 : mealType === 'snack' ? 300 : 500;
    const remainingCalories = needed.calories;

    suggestions.suggestedMacros.calories = Math.min(targetCalories, remainingCalories);
    suggestions.suggestedMacros.protein = Math.round(Math.min(needed.protein, suggestions.suggestedMacros.calories * 0.3 / 4));
    suggestions.suggestedMacros.carbs = Math.round(Math.min(needed.carbs, suggestions.suggestedMacros.calories * 0.45 / 4));
    suggestions.suggestedMacros.fat = Math.round(Math.min(needed.fat, suggestions.suggestedMacros.calories * 0.25 / 9));
  } else {
    // No macro goals set, suggest balanced meal
    suggestions.suggestedMacros = {
      calories: 500,
      protein: 35,
      carbs: 50,
      fat: 15
    };
  }

  // Generate meal type and reason
  switch (mealType) {
    case 'high-protein':
      suggestions.mealType = 'High Protein Meal';
      suggestions.reason = needed ?
        `You need ${needed.protein}g more protein today. Let's prioritize protein-rich foods!` :
        'A protein-focused meal to support muscle recovery and growth.';
      break;
    case 'carb-focused':
      suggestions.mealType = 'Carb-Fueling Meal';
      suggestions.reason = needed ?
        `You need ${needed.carbs}g more carbs today. Perfect for pre-workout fuel!` :
        'A carb-focused meal for energy and performance.';
      break;
    case 'light-snack':
      suggestions.mealType = 'Light Snack';
      suggestions.reason = needed ?
        `You only need ${needed.calories} more calories today. A light snack should do it!` :
        'A light snack to tide you over.';
      break;
    case 'snack':
      suggestions.mealType = 'Protein Snack';
      suggestions.reason = 'A satisfying snack to keep you fueled between meals.';
      break;
    default:
      suggestions.mealType = 'Balanced Meal';
      suggestions.reason = 'A well-balanced meal with protein, carbs, and healthy fats.';
  }

  // Generate specific meal ideas based on available ingredients
  if (categorized.proteins.length > 0 && categorized.carbs.length > 0) {
    const protein = categorized.proteins[0];
    const carb = categorized.carbs[0];

    if (protein.includes('chicken')) {
      suggestions.mealIdeas.push(`Grilled ${protein} with ${carb}`);
      suggestions.recipeMatches.push('Grilled Chicken Breast with Herbs', 'Mexican Chicken Rice Bowl', 'High Protein Chicken Fried Rice');
    } else if (protein.includes('egg')) {
      suggestions.mealIdeas.push(`Scrambled ${protein} with ${carb}`);
      suggestions.recipeMatches.push('High Protein Egg Muffin Bites', 'English Muffin Breakfast Sandwiches');
    } else if (protein.includes('salmon') || protein.includes('fish')) {
      suggestions.mealIdeas.push(`Baked ${protein} with ${carb}`);
      suggestions.recipeMatches.push('Teriyaki Salmon with Broccoli', 'Salmon Rice Bowl (Emily Mariko)');
    } else {
      suggestions.mealIdeas.push(`Seasoned ${protein} over ${carb}`);
    }

    if (categorized.veggies.length > 0) {
      suggestions.mealIdeas.push(`Stir-fry with ${protein}, ${categorized.veggies[0]}, and ${carb}`);
    }
  }

  if (categorized.proteins.length > 0 && categorized.veggies.length > 0) {
    suggestions.mealIdeas.push(`Protein bowl: ${categorized.proteins[0]} with roasted ${categorized.veggies[0]}`);
    if (categorized.proteins.some(p => p.includes('turkey') || p.includes('beef'))) {
      suggestions.recipeMatches.push('Loaded Sweet Potato Meal Prep');
    }
  }

  if (categorized.carbs.some(c => c.includes('oat'))) {
    suggestions.mealIdeas.push('High protein overnight oats');
    suggestions.recipeMatches.push('Power Oatmeal Bowl', 'High Protein Overnight Oats');
  }

  if (categorized.carbs.some(c => c.includes('sweet potato'))) {
    suggestions.mealIdeas.push('Loaded sweet potato with protein and toppings');
    suggestions.recipeMatches.push('Sweet Potato and Black Bean Bowl', 'Loaded Sweet Potato Meal Prep');
  }

  if (categorized.proteins.some(p => p.includes('protein powder'))) {
    if (categorized.fruits.length > 0) {
      suggestions.mealIdeas.push('Protein smoothie with fresh fruit');
      suggestions.recipeMatches.push('Post-Workout Protein Smoothie');
    }
    suggestions.mealIdeas.push('Protein pancakes');
    suggestions.recipeMatches.push('Protein Pancake Meal Prep');
  }

  if (categorized.proteins.some(p => p.includes('yogurt') || p.includes('greek yogurt'))) {
    suggestions.mealIdeas.push('Greek yogurt protein parfait');
    suggestions.recipeMatches.push('Greek Yogurt Protein Parfait Prep');
  }

  // Add general tips based on macro needs and ingredients
  if (needed && needed.protein > 30) {
    suggestions.tips.push('💪 Focus on protein-rich ingredients for muscle recovery');
    if (categorized.proteins.length === 0) {
      suggestions.tips.push('⚠️ Consider adding: chicken, eggs, greek yogurt, or protein powder');
    }
  }

  if (needed && needed.carbs > 50) {
    suggestions.tips.push('⚡ Add complex carbs for sustained energy');
    if (categorized.carbs.length === 0) {
      suggestions.tips.push('⚠️ Consider adding: rice, sweet potato, oats, or whole grain bread');
    }
  }

  if (categorized.veggies.length === 0) {
    suggestions.tips.push('🥗 Don\'t forget vegetables for vitamins and fiber!');
  }

  if (mealType === 'high-protein' && categorized.proteins.length > 0) {
    suggestions.tips.push('🔥 Cook your protein with minimal oil to keep calories in check');
  }

  if (categorized.proteins.length > 0 && categorized.carbs.length > 0 && categorized.veggies.length > 0) {
    suggestions.tips.push('✅ Great ingredient variety! You can make a complete balanced meal');
  }

  // If no specific ideas were generated, provide general guidance
  if (suggestions.mealIdeas.length === 0) {
    if (ingredients.length === 0) {
      suggestions.mealIdeas.push('Enter ingredients you have available to get personalized meal suggestions!');
      suggestions.tips.push('💡 Try: "chicken, rice, broccoli" or "eggs, oats, banana"');
    } else {
      suggestions.mealIdeas.push('Mix and match your ingredients creatively!');
      if (categorized.proteins.length > 0) {
        suggestions.mealIdeas.push(`Cook ${categorized.proteins[0]} as your protein base`);
      }
      if (categorized.carbs.length > 0) {
        suggestions.mealIdeas.push(`Use ${categorized.carbs[0]} for energy`);
      }
    }
  }

  // Remove duplicate recipe matches
  suggestions.recipeMatches = [...new Set(suggestions.recipeMatches)];

  return suggestions;
}

export function estimateMealMacros(mealDescription: string): { calories: number; protein: number; carbs: number; fat: number } {
  let calories = 300;
  let protein = 25;
  let carbs = 30;
  let fat = 10;

  const desc = mealDescription.toLowerCase();

  // Adjust based on meal description
  if (desc.includes('chicken') || desc.includes('turkey')) {
    protein += 15;
    calories += 60;
  }
  if (desc.includes('salmon') || desc.includes('fish')) {
    protein += 15;
    fat += 8;
    calories += 130;
  }
  if (desc.includes('rice') || desc.includes('pasta')) {
    carbs += 30;
    calories += 120;
  }
  if (desc.includes('sweet potato')) {
    carbs += 25;
    calories += 100;
  }
  if (desc.includes('oats') || desc.includes('oatmeal')) {
    carbs += 20;
    protein += 5;
    calories += 100;
  }
  if (desc.includes('protein powder')) {
    protein += 20;
    calories += 100;
  }

  return { calories, protein, carbs, fat };
}
