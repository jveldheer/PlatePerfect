import type { MacroOutputs } from './macroCalculator';

export interface ConsumedMacros {
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

export interface CompleteMealIdea {
  name: string;
  cookingMethod: 'no-cook' | 'minimal-cook' | 'normal-cook';
  ingredients: string[];
  instructions: string;
  estimatedTime: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  matchedRecipes?: string[];
}

export interface MealSuggestions {
  mealType: string;
  reason: string;
  meals: CompleteMealIdea[];
}

// Meal templates database
const noCookMeals: CompleteMealIdea[] = [
  {
    name: 'Greek Yogurt Power Bowl',
    cookingMethod: 'no-cook',
    ingredients: ['1 cup Greek yogurt', '1 scoop protein powder', '1/2 cup berries', '2 tbsp granola', '1 tbsp honey'],
    instructions: 'Mix Greek yogurt with protein powder. Top with berries, granola, and drizzle honey. Ready to eat!',
    estimatedTime: '2 minutes',
    macros: { calories: 380, protein: 42, carbs: 38, fat: 8 },
    matchedRecipes: ['Greek Yogurt Protein Parfait Prep']
  },
  {
    name: 'Protein-Packed Wrap',
    cookingMethod: 'no-cook',
    ingredients: ['1 large tortilla', '4 oz deli turkey', '2 slices cheese', '1/2 avocado', 'lettuce, tomato'],
    instructions: 'Layer turkey, cheese, sliced avocado, lettuce, and tomato on tortilla. Roll tightly and slice in half.',
    estimatedTime: '3 minutes',
    macros: { calories: 450, protein: 35, carbs: 32, fat: 18 }
  },
  {
    name: 'Cottage Cheese Protein Bowl',
    cookingMethod: 'no-cook',
    ingredients: ['1 cup cottage cheese', '1/2 cup pineapple chunks', '2 tbsp almonds', 'cinnamon'],
    instructions: 'Combine cottage cheese with pineapple. Top with almonds and sprinkle cinnamon. Enjoy!',
    estimatedTime: '2 minutes',
    macros: { calories: 320, protein: 32, carbs: 28, fat: 10 }
  },
  {
    name: 'Peanut Butter Banana Protein',
    cookingMethod: 'no-cook',
    ingredients: ['2 tbsp peanut butter', '1 banana', '1 scoop protein powder', '1 cup milk'],
    instructions: 'Blend peanut butter, banana, protein powder, and milk until smooth. Drink immediately.',
    estimatedTime: '3 minutes',
    macros: { calories: 420, protein: 35, carbs: 45, fat: 12 },
    matchedRecipes: ['Post-Workout Protein Smoothie']
  },
  {
    name: 'Tuna Salad Protein Pack',
    cookingMethod: 'no-cook',
    ingredients: ['1 can tuna (5oz)', '2 tbsp Greek yogurt', 'celery, diced', 'crackers or bread'],
    instructions: 'Mix drained tuna with Greek yogurt and diced celery. Serve with crackers or on bread.',
    estimatedTime: '4 minutes',
    macros: { calories: 280, protein: 40, carbs: 20, fat: 5 }
  },
  {
    name: 'Protein Cookie Dough Snack',
    cookingMethod: 'no-cook',
    ingredients: ['1/4 cup protein powder', '2 tbsp almond butter', '1 tbsp honey', '2 tbsp chocolate chips'],
    instructions: 'Mix protein powder, almond butter, and honey until dough forms. Fold in chocolate chips. Form into balls.',
    estimatedTime: '5 minutes',
    macros: { calories: 320, protein: 28, carbs: 32, fat: 10 },
    matchedRecipes: ['Protein Cookie Dough Bites']
  }
];

const minimalCookMeals: CompleteMealIdea[] = [
  {
    name: 'Microwave Protein Oatmeal',
    cookingMethod: 'minimal-cook',
    ingredients: ['1/2 cup oats', '1 cup milk', '1 scoop protein powder', '1 banana', '1 tbsp peanut butter'],
    instructions: 'Microwave oats with milk for 2 minutes. Stir in protein powder. Top with sliced banana and peanut butter.',
    estimatedTime: '4 minutes',
    macros: { calories: 480, protein: 38, carbs: 58, fat: 12 },
    matchedRecipes: ['Power Oatmeal Bowl']
  },
  {
    name: 'Toasted Protein Sandwich',
    cookingMethod: 'minimal-cook',
    ingredients: ['2 slices whole grain bread', '2 eggs', '1 slice cheese', '1 oz ham', 'spinach'],
    instructions: 'Toast bread. Microwave scrambled eggs (1 min). Layer eggs, cheese, ham, and spinach between toast.',
    estimatedTime: '5 minutes',
    macros: { calories: 420, protein: 32, carbs: 35, fat: 15 },
    matchedRecipes: ['English Muffin Breakfast Sandwiches']
  },
  {
    name: 'Quick Protein Quesadilla',
    cookingMethod: 'minimal-cook',
    ingredients: ['1 large tortilla', '1/2 cup shredded chicken', '1/4 cup cheese', 'salsa'],
    instructions: 'Microwave tortilla with chicken and cheese for 1 minute. Fold in half. Serve with salsa.',
    estimatedTime: '3 minutes',
    macros: { calories: 380, protein: 35, carbs: 28, fat: 12 }
  },
  {
    name: 'Rice Bowl with Leftover Protein',
    cookingMethod: 'minimal-cook',
    ingredients: ['1 cup cooked rice', '4 oz cooked chicken/salmon', '1 egg', 'soy sauce', 'frozen veggies'],
    instructions: 'Microwave rice, protein, and frozen veggies for 2 min. Top with fried egg and soy sauce.',
    estimatedTime: '5 minutes',
    macros: { calories: 520, protein: 42, carbs: 52, fat: 12 },
    matchedRecipes: ['Salmon Rice Bowl (Emily Mariko)', 'High Protein Chicken Fried Rice']
  },
  {
    name: 'Protein Mug Cake',
    cookingMethod: 'minimal-cook',
    ingredients: ['1 scoop protein powder', '1 egg', '2 tbsp oat flour', '1/4 tsp baking powder', '2 tbsp milk'],
    instructions: 'Mix all ingredients in a mug. Microwave for 90 seconds. Let cool 1 minute before eating.',
    estimatedTime: '4 minutes',
    macros: { calories: 240, protein: 28, carbs: 18, fat: 6 }
  },
  {
    name: 'Bagel with Protein Toppings',
    cookingMethod: 'minimal-cook',
    ingredients: ['1 whole grain bagel', '3 oz smoked salmon', '2 tbsp cream cheese', 'cucumber, tomato'],
    instructions: 'Toast bagel. Spread cream cheese, layer smoked salmon, cucumber slices, and tomato.',
    estimatedTime: '4 minutes',
    macros: { calories: 450, protein: 32, carbs: 48, fat: 14 }
  }
];

const normalCookMeals: CompleteMealIdea[] = [
  {
    name: 'Scrambled Eggs with Toast',
    cookingMethod: 'normal-cook',
    ingredients: ['3 eggs', '2 slices whole grain bread', '1/2 avocado', 'spinach', 'butter'],
    instructions: 'Scramble eggs in pan with butter. Toast bread. Serve eggs over toast with avocado and sautéed spinach.',
    estimatedTime: '8 minutes',
    macros: { calories: 480, protein: 28, carbs: 32, fat: 26 }
  },
  {
    name: 'Pan-Seared Chicken & Veggies',
    cookingMethod: 'normal-cook',
    ingredients: ['6 oz chicken breast', '1 cup broccoli', '1/2 cup rice', 'olive oil', 'garlic, seasoning'],
    instructions: 'Cook rice. Season and pan-sear chicken 6-7 min per side. Sauté broccoli with garlic. Serve together.',
    estimatedTime: '20 minutes',
    macros: { calories: 520, protein: 48, carbs: 45, fat: 12 },
    matchedRecipes: ['Grilled Chicken Breast with Herbs', 'Mexican Chicken Rice Bowl']
  },
  {
    name: 'Protein Pancakes',
    cookingMethod: 'normal-cook',
    ingredients: ['1/2 cup oat flour', '1 scoop protein powder', '2 eggs', '1/2 cup milk', 'banana'],
    instructions: 'Mix all ingredients into batter. Cook pancakes in pan 2-3 min per side. Top with banana slices.',
    estimatedTime: '12 minutes',
    macros: { calories: 450, protein: 42, carbs: 48, fat: 10 },
    matchedRecipes: ['Protein Pancake Meal Prep']
  },
  {
    name: 'Stir-Fry Protein Bowl',
    cookingMethod: 'normal-cook',
    ingredients: ['6 oz protein (chicken/beef/tofu)', '2 cups mixed vegetables', '1 cup rice', 'soy sauce', 'ginger'],
    instructions: 'Cook rice. Stir-fry protein and veggies in hot pan with oil, soy sauce, and ginger. Serve over rice.',
    estimatedTime: '18 minutes',
    macros: { calories: 540, protein: 45, carbs: 55, fat: 12 },
    matchedRecipes: ['High Protein Chicken Fried Rice']
  },
  {
    name: 'Baked Sweet Potato with Toppings',
    cookingMethod: 'normal-cook',
    ingredients: ['1 large sweet potato', '4 oz ground turkey', 'black beans', 'Greek yogurt', 'salsa', 'cheese'],
    instructions: 'Microwave sweet potato 8 min. Brown turkey in pan. Slice potato open, load with turkey, beans, yogurt, salsa.',
    estimatedTime: '15 minutes',
    macros: { calories: 520, protein: 42, carbs: 58, fat: 10 },
    matchedRecipes: ['Loaded Sweet Potato Meal Prep', 'Sweet Potato and Black Bean Bowl']
  },
  {
    name: 'Salmon with Roasted Vegetables',
    cookingMethod: 'normal-cook',
    ingredients: ['6 oz salmon fillet', 'asparagus', 'cherry tomatoes', 'olive oil', 'lemon', 'seasoning'],
    instructions: 'Season salmon and veggies with oil and spices. Bake at 400°F for 15 minutes. Squeeze lemon over top.',
    estimatedTime: '20 minutes',
    macros: { calories: 420, protein: 42, carbs: 12, fat: 22 },
    matchedRecipes: ['Teriyaki Salmon with Broccoli']
  }
];

function determineMealType(needed: { calories: number; protein: number; carbs: number; fat: number } | null): string {
  if (!needed) return 'balanced';

  const totalCaloriesNeeded = needed.calories;

  if (totalCaloriesNeeded < 250) return 'light-snack';
  if (totalCaloriesNeeded < 400) return 'snack';

  const proteinPercent = needed.protein / (needed.protein + needed.carbs + needed.fat) || 0;

  if (proteinPercent > 0.4) return 'high-protein';
  if (needed.carbs > needed.protein * 2) return 'carb-focused';

  return 'balanced';
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

function selectBestMeals(
  allMeals: CompleteMealIdea[],
  targetMacros: { calories: number; protein: number; carbs: number; fat: number } | null,
  count: number
): CompleteMealIdea[] {
  if (!targetMacros) {
    // No macro goals - return variety
    return allMeals.slice(0, count);
  }

  // Score each meal based on how well it fits remaining macros
  const scoredMeals = allMeals.map(meal => {
    let score = 0;

    // Prefer meals that don't exceed remaining calories
    if (meal.macros.calories <= targetMacros.calories * 1.1) {
      score += 10;
    }

    // Score based on protein match (important for athletes)
    const proteinDiff = Math.abs(meal.macros.protein - targetMacros.protein * 0.5);
    score += Math.max(0, 10 - proteinDiff / 5);

    // Bonus for high protein when needed
    if (targetMacros.protein > 30 && meal.macros.protein > 30) {
      score += 5;
    }

    // Bonus for appropriate calorie range
    if (meal.macros.calories >= targetMacros.calories * 0.3 && meal.macros.calories <= targetMacros.calories * 0.6) {
      score += 5;
    }

    return { meal, score };
  });

  // Sort by score and return top meals
  return scoredMeals
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.meal);
}

export function generateMealSuggestions(
  macroGoals: MacroOutputs | null,
  consumed: ConsumedMacros | null
): MealSuggestions {
  const needed = calculateNeededMacros(macroGoals, consumed);
  const mealType = determineMealType(needed);

  let mealTypeLabel = 'Balanced Meal Options';
  let reason = 'Here are some complete meal ideas to fuel your performance!';

  if (needed) {
    switch (mealType) {
      case 'high-protein':
        mealTypeLabel = 'High Protein Meal Options';
        reason = `You need ${needed.protein}g more protein today. These high-protein meals will help you hit your goals!`;
        break;
      case 'carb-focused':
        mealTypeLabel = 'Energy-Boosting Meal Options';
        reason = `You need ${needed.carbs}g more carbs today. These carb-rich meals are perfect for pre-workout fuel!`;
        break;
      case 'light-snack':
        mealTypeLabel = 'Light Snack Options';
        reason = `You only need ${needed.calories} more calories today. These light snacks are perfect!`;
        break;
      case 'snack':
        mealTypeLabel = 'Protein Snack Options';
        reason = 'Quick, satisfying snacks to keep you fueled between meals.';
        break;
      default:
        mealTypeLabel = 'Balanced Meal Options';
        reason = 'Well-balanced meals with protein, carbs, and healthy fats to fuel your day.';
    }
  }

  // Select 2 from each category (6 total), then filter to top 5 based on macros
  const selectedNoCook = selectBestMeals(noCookMeals, needed, 2);
  const selectedMinimalCook = selectBestMeals(minimalCookMeals, needed, 2);
  const selectedNormalCook = selectBestMeals(normalCookMeals, needed, 2);

  const allSelected = [...selectedNoCook, ...selectedMinimalCook, ...selectedNormalCook];

  // Return top 5 overall
  const finalMeals = selectBestMeals(allSelected, needed, 5);

  return {
    mealType: mealTypeLabel,
    reason,
    meals: finalMeals
  };
}
