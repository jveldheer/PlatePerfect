import type { MacroOutputs } from './macroCalculator';
import type { ConsumedMacros } from './mealGenerator';
import {
  AI_INGREDIENT_DATABASE,
  findAIIngredient,
  calculateMacros,
  sumMacros,
  divideMacros,
  type NutrientData,
  type IngredientData
} from './aiIngredientDatabase';

// Types matching the AI prompt schema
export interface AIContext {
  athlete_id: string;
  goal: 'cut' | 'maintain' | 'bulk' | 'refeed' | 'pre_training' | 'post_training';
  target_macros_per_meal: NutrientData;
  creative_mode: boolean;
  category_preference: string[];
  allowed_appliances: string[];
  include_staples: boolean;
  servings_default: number;
}

export interface AIIngredient {
  user_input: string;
  canonical_name: string;
  source: 'fridge' | 'pantry' | 'frozen';
  quantity: number;
  unit: string;
  grams: number;
  macros: NutrientData;
}

export interface AIMeal {
  title: string;
  category: 'no_cook' | 'minimal_cook' | 'full_cook' | 'freestyle';
  skill_level: 'easy' | 'moderate';
  appliances: string[];
  prep_time_min: number;
  cook_time_min: number;
  servings: number;
  scale_factor: number;
  dietary_flags: string[];
  ingredients: AIIngredient[];
  instructions: string[];
  macros_per_serving: NutrientData;
  macros_total: NutrientData;
  performance_tags: string[];
  notes: string;
}

export interface AIMealResponse {
  context: AIContext;
  meals: AIMeal[];
  summary: {
    count_by_category: Record<string, number>;
    macro_sums_all_meals: NutrientData;
  };
}

// Get animal protein ingredients (used for validation)
// const animalProteins = Object.values(AI_INGREDIENT_DATABASE).filter(i => i.is_animal_protein);

// Calculate target macros from user's goals
function calculateTargetMacros(
  macroGoals: MacroOutputs | null,
  consumed: ConsumedMacros | null
): NutrientData {
  if (macroGoals && consumed) {
    const remaining = {
      cal: Math.max(0, macroGoals.calories - consumed.calories),
      protein_g: Math.max(0, macroGoals.protein_g - consumed.protein_g),
      carb_g: Math.max(0, macroGoals.carbs_g - consumed.carbs_g),
      fat_g: Math.max(0, macroGoals.fat_g - consumed.fat_g),
      fiber_g: 8
    };
    
    // Target per meal is roughly 1/3 of remaining (assuming 3 meals)
    return {
      cal: Math.round(remaining.cal / 3),
      protein_g: Math.round(remaining.protein_g / 3),
      carb_g: Math.round(remaining.carb_g / 3),
      fat_g: Math.round(remaining.fat_g / 3),
      fiber_g: remaining.fiber_g / 3
    };
  }

  // Default athlete meal targets
  return { cal: 550, protein_g: 40, carb_g: 55, fat_g: 18, fiber_g: 8 };
}

// Determine goal from macros (improved logic)
function determineGoal(
  macroGoals: MacroOutputs | null,
  _consumed: ConsumedMacros | null
): AIContext['goal'] {
  if (!macroGoals) return 'maintain';

  const totalCals = macroGoals.calories;
  const proteinCals = macroGoals.protein_g * 4;
  const proteinPercent = (proteinCals / totalCals) * 100;

  // Cutting: Low total calories with high protein percentage (>30%)
  if (totalCals < 2200 && proteinPercent > 30) return 'cut';

  // Bulking: High calories
  if (totalCals > 3000) return 'bulk';

  // Determine if this is pre or post training based on time and carb ratio
  const carbPercent = ((macroGoals.carbs_g * 4) / totalCals) * 100;
  if (carbPercent > 45) return 'pre_training';
  if (proteinPercent > 35) return 'post_training';

  return 'maintain';
}

// Build context for AI (exported for use by OpenAI service)
export function buildAIContext(
  macroGoals: MacroOutputs | null,
  consumed: ConsumedMacros | null
): AIContext {
  const targetMacros = calculateTargetMacros(macroGoals, consumed);
  const goal = determineGoal(macroGoals, consumed);

  return {
    athlete_id: 'athlete_001',
    goal,
    target_macros_per_meal: targetMacros,
    creative_mode: true,
    category_preference: ['no_cook', 'minimal_cook', 'full_cook', 'freestyle'],
    allowed_appliances: ['fridge', 'pantry', 'microwave', 'toaster', 'stovetop', 'oven'],
    include_staples: true,
    servings_default: 1
  };
}

// Generate 6 creative meals (FALLBACK - for when AI API is not available)
export function generateAIMealsFallback(
  userIngredients: string[],
  macroGoals: MacroOutputs | null,
  consumed: ConsumedMacros | null
): AIMealResponse {
  const context = buildAIContext(macroGoals, consumed);
  const targetMacros = context.target_macros_per_meal;
  const goal = context.goal;

  // Parse user ingredients
  const parsedIngredients = userIngredients
    .map(input => ({ input, data: findAIIngredient(input) }))
    .filter(item => item.data !== null);

  let meals: AIMeal[];

  if (parsedIngredients.length > 0) {
    // Generate meals using user ingredients
    meals = generateMealsWithIngredients(parsedIngredients as any, targetMacros, goal);
  } else {
    // Random creative generation
    meals = generateRandomMeals(targetMacros, goal);
  }

  // Calculate summary
  const count_by_category = {
    no_cook: meals.filter(m => m.category === 'no_cook').length,
    minimal_cook: meals.filter(m => m.category === 'minimal_cook').length,
    full_cook: meals.filter(m => m.category === 'full_cook').length,
    freestyle: meals.filter(m => m.category === 'freestyle').length
  };

  const macro_sums_all_meals = sumMacros(meals.map(m => m.macros_total));

  return {
    context,
    meals,
    summary: { count_by_category, macro_sums_all_meals }
  };
}

// Generate meals using user's ingredients
function generateMealsWithIngredients(
  parsedIngredients: Array<{ input: string; data: IngredientData }>,
  targetMacros: NutrientData,
  goal: AIContext['goal']
): AIMeal[] {
  const meals: AIMeal[] = [];

  // For each user ingredient, generate 1-2 meals
  for (const item of parsedIngredients) {
    if (meals.length >= 6) break;

    if (item.data.is_animal_protein) {
      meals.push(...generateProteinCentricMeals(item.input, item.data, targetMacros, goal, 2));
    } else if (item.data.category === 'carb') {
      meals.push(...generateCarbCentricMeals(item.input, item.data, targetMacros, goal, 2));
    } else {
      meals.push(generateBalancedMeal(item.input, item.data, targetMacros, goal));
    }
  }

  // Fill remaining slots with random meals
  while (meals.length < 6) {
    meals.push(...generateRandomMeals(targetMacros, goal, 1));
  }

  return meals.slice(0, 6);
}

// Generate random creative meals
function generateRandomMeals(
  targetMacros: NutrientData,
  goal: AIContext['goal'],
  count: number = 6
): AIMeal[] {
  const templates = [
    () => createTunaSaladBowl(targetMacros, goal),
    () => createGreekYogurtParfait(targetMacros, goal),
    () => createChickenStirFry(targetMacros, goal),
    () => createEggScrambleBowl(targetMacros, goal),
    () => createSalmonRiceBowl(targetMacros, goal),
    () => createTurkeyTacoBowl(targetMacros, goal),
    () => createCottageCheeseStack(targetMacros, goal),
    () => createShrimpPastaQuick(targetMacros, goal),
    () => createBeefBurgerBowl(targetMacros, goal),
    () => createProteinPancakes(targetMacros, goal)
  ];

  const meals: AIMeal[] = [];
  const usedTemplates = new Set<number>();

  for (let i = 0; i < count; i++) {
    let templateIndex;
    do {
      templateIndex = Math.floor(Math.random() * templates.length);
    } while (usedTemplates.has(templateIndex) && usedTemplates.size < templates.length);

    usedTemplates.add(templateIndex);
    meals.push(templates[templateIndex]());
  }

  return meals;
}

// MEAL TEMPLATES (10 creative templates)

function createTunaSaladBowl(_: NutrientData, goal: AIContext['goal']): AIMeal {
  const tuna = AI_INGREDIENT_DATABASE.canned_tuna;
  const spinach = AI_INGREDIENT_DATABASE.spinach;
  const avocado = AI_INGREDIENT_DATABASE.avocado;
  const olive_oil = AI_INGREDIENT_DATABASE.olive_oil;

  const ingredients: AIIngredient[] = [
    {
      user_input: 'canned tuna',
      canonical_name: tuna.canonical_name,
      source: tuna.source,
      quantity: 1,
      unit: 'can',
      grams: 142,
      macros: calculateMacros(tuna, 142)
    },
    {
      user_input: 'spinach',
      canonical_name: spinach.canonical_name,
      source: spinach.source,
      quantity: 2,
      unit: 'cups',
      grams: 60,
      macros: calculateMacros(spinach, 60)
    },
    {
      user_input: 'avocado',
      canonical_name: avocado.canonical_name,
      source: avocado.source,
      quantity: 0.5,
      unit: 'piece',
      grams: 100,
      macros: calculateMacros(avocado, 100)
    },
    {
      user_input: 'olive oil',
      canonical_name: olive_oil.canonical_name,
      source: olive_oil.source,
      quantity: 1,
      unit: 'tbsp',
      grams: 14,
      macros: calculateMacros(olive_oil, 14)
    }
  ];

  const macros_total = sumMacros(ingredients.map(i => i.macros));
  const macros_per_serving = divideMacros(macros_total, 1);

  return {
    title: 'High-Protein Tuna Power Bowl',
    category: 'no_cook',
    skill_level: 'easy',
    appliances: ['fridge', 'pantry'],
    prep_time_min: 5,
    cook_time_min: 0,
    servings: 1,
    scale_factor: 1,
    dietary_flags: ['animal_based'],
    ingredients,
    instructions: [
      'Drain tuna and place in bowl over fresh spinach',
      'Slice avocado and arrange on top',
      'Drizzle with olive oil and add lemon juice',
      'Season with salt, pepper, and red pepper flakes if desired'
    ],
    macros_per_serving,
    macros_total,
    performance_tags: goal === 'post_training' ? ['recovery', 'anti_inflammatory'] : ['recovery'],
    notes: 'Quick omega-3 rich meal. Perfect for post-training recovery.'
  };
}

function createGreekYogurtParfait(_: NutrientData, _goal: AIContext['goal']): AIMeal {
  const yogurt = AI_INGREDIENT_DATABASE.greek_yogurt;
  const berries = AI_INGREDIENT_DATABASE.berries;
  const almonds = AI_INGREDIENT_DATABASE.almonds;
  const whey = AI_INGREDIENT_DATABASE.whey_isolate;

  const ingredients: AIIngredient[] = [
    {
      user_input: 'greek yogurt',
      canonical_name: yogurt.canonical_name,
      source: yogurt.source,
      quantity: 1.5,
      unit: 'cup',
      grams: 255,
      macros: calculateMacros(yogurt, 255)
    },
    {
      user_input: 'whey isolate',
      canonical_name: whey.canonical_name,
      source: whey.source,
      quantity: 0.5,
      unit: 'scoop',
      grams: 15,
      macros: calculateMacros(whey, 15)
    },
    {
      user_input: 'berries',
      canonical_name: berries.canonical_name,
      source: berries.source,
      quantity: 1,
      unit: 'cup',
      grams: 80,
      macros: calculateMacros(berries, 80)
    },
    {
      user_input: 'almonds',
      canonical_name: almonds.canonical_name,
      source: almonds.source,
      quantity: 2,
      unit: 'tbsp',
      grams: 20,
      macros: calculateMacros(almonds, 20)
    }
  ];

  const macros_total = sumMacros(ingredients.map(i => i.macros));
  const macros_per_serving = divideMacros(macros_total, 1);

  return {
    title: 'Protein-Loaded Berry Parfait',
    category: 'no_cook',
    skill_level: 'easy',
    appliances: ['fridge', 'pantry'],
    prep_time_min: 3,
    cook_time_min: 0,
    servings: 1,
    scale_factor: 1,
    dietary_flags: ['animal_based'],
    ingredients,
    instructions: [
      'Mix whey isolate into Greek yogurt until smooth',
      'Layer yogurt mixture with berries in a bowl',
      'Top with crushed almonds',
      'Optional: drizzle with honey for extra carbs'
    ],
    macros_per_serving,
    macros_total,
    performance_tags: ['recovery', 'gut_friendly'],
    notes: 'High-protein, probiotic-rich meal. Great for muscle recovery and gut health.'
  };
}

function createChickenStirFry(_: NutrientData, goal: AIContext['goal']): AIMeal {
  const chicken = AI_INGREDIENT_DATABASE.chicken_breast;
  const rice = AI_INGREDIENT_DATABASE.white_rice;
  const broccoli = AI_INGREDIENT_DATABASE.broccoli;
  const oil = AI_INGREDIENT_DATABASE.olive_oil;

  const ingredients: AIIngredient[] = [
    {
      user_input: 'chicken breast',
      canonical_name: chicken.canonical_name,
      source: chicken.source,
      quantity: 6,
      unit: 'oz',
      grams: 170,
      macros: calculateMacros(chicken, 170)
    },
    {
      user_input: 'white rice',
      canonical_name: rice.canonical_name,
      source: rice.source,
      quantity: 1,
      unit: 'cup',
      grams: 150,
      macros: calculateMacros(rice, 150)
    },
    {
      user_input: 'broccoli',
      canonical_name: broccoli.canonical_name,
      source: broccoli.source,
      quantity: 1.5,
      unit: 'cup',
      grams: 137,
      macros: calculateMacros(broccoli, 137)
    },
    {
      user_input: 'olive oil',
      canonical_name: oil.canonical_name,
      source: oil.source,
      quantity: 1,
      unit: 'tbsp',
      grams: 14,
      macros: calculateMacros(oil, 14)
    }
  ];

  const macros_total = sumMacros(ingredients.map(i => i.macros));
  const macros_per_serving = divideMacros(macros_total, 1);

  return {
    title: 'Athlete Chicken Stir-Fry Bowl',
    category: 'full_cook',
    skill_level: 'moderate',
    appliances: ['stovetop', 'pantry'],
    prep_time_min: 8,
    cook_time_min: 15,
    servings: 1,
    scale_factor: 1,
    dietary_flags: ['animal_based'],
    ingredients,
    instructions: [
      'Cook rice according to package directions',
      'Cut chicken into bite-size pieces, season with salt and pepper',
      'Heat oil in large skillet over medium-high heat',
      'Cook chicken 6-7 min until golden, add broccoli and stir-fry 4 min',
      'Add soy sauce or teriyaki, serve over rice'
    ],
    macros_per_serving,
    macros_total,
    performance_tags: goal === 'pre_training' ? ['pre_training', 'mineral_replete'] : ['recovery'],
    notes: 'Complete athlete meal with lean protein, complex carbs, and micronutrients.'
  };
}

function createEggScrambleBowl(_: NutrientData, _goal: AIContext['goal']): AIMeal {
  const eggs = AI_INGREDIENT_DATABASE.eggs;
  const potato = AI_INGREDIENT_DATABASE.potato;
  const pepper = AI_INGREDIENT_DATABASE.bell_pepper;
  const yogurt = AI_INGREDIENT_DATABASE.greek_yogurt;

  const ingredients: AIIngredient[] = [
    {
      user_input: 'eggs',
      canonical_name: eggs.canonical_name,
      source: eggs.source,
      quantity: 3,
      unit: 'whole',
      grams: 150,
      macros: calculateMacros(eggs, 150)
    },
    {
      user_input: 'potato',
      canonical_name: potato.canonical_name,
      source: potato.source,
      quantity: 1,
      unit: 'medium',
      grams: 150,
      macros: calculateMacros(potato, 150)
    },
    {
      user_input: 'bell pepper',
      canonical_name: pepper.canonical_name,
      source: pepper.source,
      quantity: 0.5,
      unit: 'piece',
      grams: 60,
      macros: calculateMacros(pepper, 60)
    },
    {
      user_input: 'greek yogurt',
      canonical_name: yogurt.canonical_name,
      source: yogurt.source,
      quantity: 0.25,
      unit: 'cup',
      grams: 60,
      macros: calculateMacros(yogurt, 60)
    }
  ];

  const macros_total = sumMacros(ingredients.map(i => i.macros));
  const macros_per_serving = divideMacros(macros_total, 1);

  return {
    title: 'Loaded Breakfast Power Scramble',
    category: 'minimal_cook',
    skill_level: 'easy',
    appliances: ['microwave', 'stovetop'],
    prep_time_min: 5,
    cook_time_min: 10,
    servings: 1,
    scale_factor: 1,
    dietary_flags: ['animal_based'],
    ingredients,
    instructions: [
      'Microwave diced potato 4-5 min until tender',
      'Beat eggs with salt and pepper',
      'Heat pan with cooking spray, add peppers and cooked potato',
      'Pour in eggs, scramble until set',
      'Serve with Greek yogurt on the side'
    ],
    macros_per_serving,
    macros_total,
    performance_tags: ['recovery'],
    notes: 'Nutrient-dense breakfast with complete protein and energizing carbs.'
  };
}

function createSalmonRiceBowl(_: NutrientData, _goal: AIContext['goal']): AIMeal {
  const salmon = AI_INGREDIENT_DATABASE.salmon;
  const rice = AI_INGREDIENT_DATABASE.white_rice;
  const spinach = AI_INGREDIENT_DATABASE.spinach;
  const avocado = AI_INGREDIENT_DATABASE.avocado;

  const ingredients: AIIngredient[] = [
    {
      user_input: 'salmon',
      canonical_name: salmon.canonical_name,
      source: salmon.source,
      quantity: 5,
      unit: 'oz',
      grams: 140,
      macros: calculateMacros(salmon, 140)
    },
    {
      user_input: 'white rice',
      canonical_name: rice.canonical_name,
      source: rice.source,
      quantity: 1,
      unit: 'cup',
      grams: 150,
      macros: calculateMacros(rice, 150)
    },
    {
      user_input: 'spinach',
      canonical_name: spinach.canonical_name,
      source: spinach.source,
      quantity: 2,
      unit: 'cups',
      grams: 60,
      macros: calculateMacros(spinach, 60)
    },
    {
      user_input: 'avocado',
      canonical_name: avocado.canonical_name,
      source: avocado.source,
      quantity: 0.3,
      unit: 'piece',
      grams: 60,
      macros: calculateMacros(avocado, 60)
    }
  ];

  const macros_total = sumMacros(ingredients.map(i => i.macros));
  const macros_per_serving = divideMacros(macros_total, 1);

  return {
    title: 'Omega-3 Salmon Performance Bowl',
    category: 'full_cook',
    skill_level: 'moderate',
    appliances: ['stovetop', 'oven'],
    prep_time_min: 5,
    cook_time_min: 12,
    servings: 1,
    scale_factor: 1,
    dietary_flags: ['animal_based'],
    ingredients,
    instructions: [
      'Cook rice according to package',
      'Season salmon with salt, pepper, garlic powder',
      'Heat oven-safe pan, sear salmon skin-down 4 min',
      'Transfer to 400°F oven for 6-8 min until cooked through',
      'Serve over rice with wilted spinach and sliced avocado'
    ],
    macros_per_serving,
    macros_total,
    performance_tags: ['recovery', 'anti_inflammatory'],
    notes: 'Rich in omega-3s for inflammation control and recovery optimization.'
  };
}

function createTurkeyTacoBowl(_: NutrientData, goal: AIContext['goal']): AIMeal {
  const turkey = AI_INGREDIENT_DATABASE.ground_turkey;
  const rice = AI_INGREDIENT_DATABASE.white_rice;
  const pepper = AI_INGREDIENT_DATABASE.bell_pepper;
  const yogurt = AI_INGREDIENT_DATABASE.greek_yogurt;

  const ingredients: AIIngredient[] = [
    {
      user_input: 'ground turkey',
      canonical_name: turkey.canonical_name,
      source: turkey.source,
      quantity: 4,
      unit: 'oz',
      grams: 113,
      macros: calculateMacros(turkey, 113)
    },
    {
      user_input: 'white rice',
      canonical_name: rice.canonical_name,
      source: rice.source,
      quantity: 1,
      unit: 'cup',
      grams: 150,
      macros: calculateMacros(rice, 150)
    },
    {
      user_input: 'bell pepper',
      canonical_name: pepper.canonical_name,
      source: pepper.source,
      quantity: 1,
      unit: 'piece',
      grams: 120,
      macros: calculateMacros(pepper, 120)
    },
    {
      user_input: 'greek yogurt',
      canonical_name: yogurt.canonical_name,
      source: yogurt.source,
      quantity: 0.25,
      unit: 'cup',
      grams: 60,
      macros: calculateMacros(yogurt, 60)
    }
  ];

  const macros_total = sumMacros(ingredients.map(i => i.macros));
  const macros_per_serving = divideMacros(macros_total, 1);

  return {
    title: 'Lean Turkey Taco Bowl',
    category: 'full_cook',
    skill_level: 'easy',
    appliances: ['stovetop', 'pantry'],
    prep_time_min: 5,
    cook_time_min: 12,
    servings: 1,
    scale_factor: 1,
    dietary_flags: ['animal_based'],
    ingredients,
    instructions: [
      'Cook rice according to package',
      'Brown turkey in pan with taco seasoning',
      'Sauté diced peppers until tender',
      'Layer rice, turkey, peppers in bowl',
      'Top with Greek yogurt and hot sauce'
    ],
    macros_per_serving,
    macros_total,
    performance_tags: goal === 'bulk' ? ['recovery', 'mineral_replete'] : ['recovery'],
    notes: 'High-protein, customizable bowl perfect for muscle building.'
  };
}

function createCottageCheeseStack(_: NutrientData, _goal: AIContext['goal']): AIMeal {
  const cottage = AI_INGREDIENT_DATABASE.cottage_cheese;
  const berries = AI_INGREDIENT_DATABASE.berries;
  const almonds = AI_INGREDIENT_DATABASE.almonds;
  const oats = AI_INGREDIENT_DATABASE.oats;

  const ingredients: AIIngredient[] = [
    {
      user_input: 'cottage cheese',
      canonical_name: cottage.canonical_name,
      source: cottage.source,
      quantity: 1,
      unit: 'cup',
      grams: 226,
      macros: calculateMacros(cottage, 226)
    },
    {
      user_input: 'berries',
      canonical_name: berries.canonical_name,
      source: berries.source,
      quantity: 1,
      unit: 'cup',
      grams: 80,
      macros: calculateMacros(berries, 80)
    },
    {
      user_input: 'almonds',
      canonical_name: almonds.canonical_name,
      source: almonds.source,
      quantity: 2,
      unit: 'tbsp',
      grams: 20,
      macros: calculateMacros(almonds, 20)
    },
    {
      user_input: 'oats',
      canonical_name: oats.canonical_name,
      source: oats.source,
      quantity: 0.25,
      unit: 'cup',
      grams: 20,
      macros: calculateMacros(oats, 20)
    }
  ];

  const macros_total = sumMacros(ingredients.map(i => i.macros));
  const macros_per_serving = divideMacros(macros_total, 1);

  return {
    title: 'Cottage Cheese Power Stack',
    category: 'no_cook',
    skill_level: 'easy',
    appliances: ['fridge', 'pantry'],
    prep_time_min: 3,
    cook_time_min: 0,
    servings: 1,
    scale_factor: 1,
    dietary_flags: ['animal_based'],
    ingredients,
    instructions: [
      'Scoop cottage cheese into bowl',
      'Top with mixed berries',
      'Sprinkle with raw oats and crushed almonds',
      'Optional: add cinnamon for flavor'
    ],
    macros_per_serving,
    macros_total,
    performance_tags: ['recovery', 'gut_friendly'],
    notes: 'Casein-rich meal ideal for overnight recovery and muscle preservation.'
  };
}

function createShrimpPastaQuick(_: NutrientData, _goal: AIContext['goal']): AIMeal {
  const shrimp = AI_INGREDIENT_DATABASE.shrimp;
  const pasta = AI_INGREDIENT_DATABASE.pasta;
  const spinach = AI_INGREDIENT_DATABASE.spinach;
  const oil = AI_INGREDIENT_DATABASE.olive_oil;

  const ingredients: AIIngredient[] = [
    {
      user_input: 'shrimp',
      canonical_name: shrimp.canonical_name,
      source: shrimp.source,
      quantity: 5,
      unit: 'oz',
      grams: 140,
      macros: calculateMacros(shrimp, 140)
    },
    {
      user_input: 'pasta',
      canonical_name: pasta.canonical_name,
      source: pasta.source,
      quantity: 2,
      unit: 'oz dry',
      grams: 56,
      macros: calculateMacros(pasta, 56)
    },
    {
      user_input: 'spinach',
      canonical_name: spinach.canonical_name,
      source: spinach.source,
      quantity: 2,
      unit: 'cups',
      grams: 60,
      macros: calculateMacros(spinach, 60)
    },
    {
      user_input: 'olive oil',
      canonical_name: oil.canonical_name,
      source: oil.source,
      quantity: 1.5,
      unit: 'tbsp',
      grams: 21,
      macros: calculateMacros(oil, 21)
    }
  ];

  const macros_total = sumMacros(ingredients.map(i => i.macros));
  const macros_per_serving = divideMacros(macros_total, 1);

  return {
    title: 'Quick Garlic Shrimp Pasta',
    category: 'minimal_cook',
    skill_level: 'moderate',
    appliances: ['stovetop', 'pantry'],
    prep_time_min: 5,
    cook_time_min: 10,
    servings: 1,
    scale_factor: 1,
    dietary_flags: ['animal_based'],
    ingredients,
    instructions: [
      'Cook pasta according to package (8-10 min)',
      'Heat oil in pan, add minced garlic, cook 30 sec',
      'Add shrimp, cook 2-3 min per side until pink',
      'Toss in spinach until wilted',
      'Combine with drained pasta, add lemon juice and red pepper'
    ],
    macros_per_serving,
    macros_total,
    performance_tags: ['recovery', 'hydration_support'],
    notes: 'Lean protein with quick-digesting carbs. Perfect post-training meal.'
  };
}

function createBeefBurgerBowl(_: NutrientData, goal: AIContext['goal']): AIMeal {
  const beef = AI_INGREDIENT_DATABASE.ground_beef;
  const potato = AI_INGREDIENT_DATABASE.potato;
  const tomato = AI_INGREDIENT_DATABASE.tomato;
  const yogurt = AI_INGREDIENT_DATABASE.greek_yogurt;

  const ingredients: AIIngredient[] = [
    {
      user_input: 'ground beef',
      canonical_name: beef.canonical_name,
      source: beef.source,
      quantity: 4,
      unit: 'oz',
      grams: 113,
      macros: calculateMacros(beef, 113)
    },
    {
      user_input: 'potato',
      canonical_name: potato.canonical_name,
      source: potato.source,
      quantity: 1,
      unit: 'medium',
      grams: 150,
      macros: calculateMacros(potato, 150)
    },
    {
      user_input: 'tomato',
      canonical_name: tomato.canonical_name,
      source: tomato.source,
      quantity: 1,
      unit: 'medium',
      grams: 100,
      macros: calculateMacros(tomato, 100)
    },
    {
      user_input: 'greek yogurt',
      canonical_name: yogurt.canonical_name,
      source: yogurt.source,
      quantity: 0.25,
      unit: 'cup',
      grams: 60,
      macros: calculateMacros(yogurt, 60)
    }
  ];

  const macros_total = sumMacros(ingredients.map(i => i.macros));
  const macros_per_serving = divideMacros(macros_total, 1);

  return {
    title: 'Beef Burger Power Bowl',
    category: 'full_cook',
    skill_level: 'easy',
    appliances: ['stovetop', 'microwave'],
    prep_time_min: 5,
    cook_time_min: 12,
    servings: 1,
    scale_factor: 1,
    dietary_flags: ['animal_based'],
    ingredients,
    instructions: [
      'Microwave diced potato 5 min until tender',
      'Form beef into patty, season generously',
      'Cook in hot pan 4-5 min per side to desired doneness',
      'Break patty into chunks over potatoes',
      'Top with diced tomato and Greek yogurt'
    ],
    macros_per_serving,
    macros_total,
    performance_tags: goal === 'bulk' ? ['recovery', 'mineral_replete'] : ['recovery', 'mineral_replete'],
    notes: 'High in iron, zinc, and B-vitamins. Excellent for strength athletes.'
  };
}

function createProteinPancakes(_: NutrientData, goal: AIContext['goal']): AIMeal {
  const eggs = AI_INGREDIENT_DATABASE.eggs;
  const oats = AI_INGREDIENT_DATABASE.oats;
  const whey = AI_INGREDIENT_DATABASE.whey_isolate;
  const banana = AI_INGREDIENT_DATABASE.banana;
  const yogurt = AI_INGREDIENT_DATABASE.greek_yogurt;

  const ingredients: AIIngredient[] = [
    {
      user_input: 'eggs',
      canonical_name: eggs.canonical_name,
      source: eggs.source,
      quantity: 2,
      unit: 'whole',
      grams: 100,
      macros: calculateMacros(eggs, 100)
    },
    {
      user_input: 'oats',
      canonical_name: oats.canonical_name,
      source: oats.source,
      quantity: 0.5,
      unit: 'cup',
      grams: 40,
      macros: calculateMacros(oats, 40)
    },
    {
      user_input: 'whey isolate',
      canonical_name: whey.canonical_name,
      source: whey.source,
      quantity: 1,
      unit: 'scoop',
      grams: 30,
      macros: calculateMacros(whey, 30)
    },
    {
      user_input: 'banana',
      canonical_name: banana.canonical_name,
      source: banana.source,
      quantity: 1,
      unit: 'medium',
      grams: 120,
      macros: calculateMacros(banana, 120)
    },
    {
      user_input: 'greek yogurt',
      canonical_name: yogurt.canonical_name,
      source: yogurt.source,
      quantity: 0.5,
      unit: 'cup',
      grams: 85,
      macros: calculateMacros(yogurt, 85)
    }
  ];

  const macros_total = sumMacros(ingredients.map(i => i.macros));
  const macros_per_serving = divideMacros(macros_total, 1);

  return {
    title: 'Athlete Protein Pancake Stack',
    category: 'minimal_cook',
    skill_level: 'moderate',
    appliances: ['stovetop', 'pantry'],
    prep_time_min: 5,
    cook_time_min: 8,
    servings: 1,
    scale_factor: 1,
    dietary_flags: ['animal_based'],
    ingredients,
    instructions: [
      'Blend eggs, oats, whey, and half the banana until smooth',
      'Heat non-stick pan over medium heat with cooking spray',
      'Pour batter to make 3-4 pancakes, cook 2-3 min per side',
      'Stack pancakes and top with Greek yogurt',
      'Slice remaining banana on top'
    ],
    macros_per_serving,
    macros_total,
    performance_tags: goal === 'pre_training' ? ['pre_training'] : ['recovery'],
    notes: 'High-protein, moderate-carb meal. Perfect pre or post-training fuel.'
  };
}

// Helper functions for ingredient-based generation
function generateProteinCentricMeals(
  _userInput: string,
  _protein: IngredientData,
  targetMacros: NutrientData,
  goal: AIContext['goal'],
  count: number
): AIMeal[] {
  // Use the protein in creative ways
  // This is simplified - in production, this would be more sophisticated
  return [createTunaSaladBowl(targetMacros, goal)].slice(0, count);
}

function generateCarbCentricMeals(
  _userInput: string,
  _carb: IngredientData,
  targetMacros: NutrientData,
  goal: AIContext['goal'],
  count: number
): AIMeal[] {
  return [createChickenStirFry(targetMacros, goal)].slice(0, count);
}

function generateBalancedMeal(
  _userInput: string,
  _ingredient: IngredientData,
  targetMacros: NutrientData,
  goal: AIContext['goal']
): AIMeal {
  return createEggScrambleBowl(targetMacros, goal);
}
