import type { CompleteMealIdea } from './mealGenerator';
import { findIngredient, type IngredientInfo } from './ingredientDatabase';

// Generate custom meals based on specific ingredients
export function generateCustomMealsForIngredients(ingredients: string[]): CompleteMealIdea[] {
  const customMeals: CompleteMealIdea[] = [];

  for (const ingredientInput of ingredients) {
    const ingredient = findIngredient(ingredientInput);

    if (ingredient) {
      // Generate 1-2 meals for each recognized ingredient
      const meals = generateMealsForIngredient(ingredient);
      customMeals.push(...meals);
    }
  }

  return customMeals;
}

function generateMealsForIngredient(ingredient: IngredientInfo): CompleteMealIdea[] {
  const meals: CompleteMealIdea[] = [];

  // Protein sources get multiple meal options
  if (ingredient.protein >= 15) {
    meals.push(...generateProteinMeals(ingredient));
  }

  // Carb sources get energy meal options
  if (ingredient.carbs >= 25) {
    meals.push(...generateCarbMeals(ingredient));
  }

  // If no meals generated (e.g., vegetable), generate a generic balanced meal
  if (meals.length === 0) {
    meals.push(generateBalancedMealWith(ingredient));
  }

  return meals;
}

function generateProteinMeals(protein: IngredientInfo): CompleteMealIdea[] {
  const meals: CompleteMealIdea[] = [];
  const key = protein.name.toLowerCase();

  if (key.includes('tuna')) {
    meals.push({
      name: 'Tuna Salad Bowl',
      cookingMethod: 'no-cook',
      ingredients: [
        `${protein.standardSize} ${protein.name}`,
        '2 cups mixed greens',
        '1/2 cup cherry tomatoes',
        '1/4 cup cucumber',
        '2 tbsp olive oil',
        '1 tbsp lemon juice'
      ],
      instructions: 'Drain tuna and place over mixed greens. Add tomatoes and cucumber. Drizzle with olive oil and lemon juice. Mix well and enjoy!',
      estimatedTime: '5 minutes',
      macros: {
        calories: protein.calories + 160,
        protein: protein.protein + 3,
        carbs: protein.carbs + 12,
        fat: protein.fat + 30
      }
    });

    meals.push({
      name: 'Tuna Avocado Wrap',
      cookingMethod: 'no-cook',
      ingredients: [
        `${protein.standardSize} ${protein.name}`,
        '1 large whole wheat tortilla',
        '1/2 avocado',
        'Lettuce and tomato',
        '1 tbsp Greek yogurt'
      ],
      instructions: 'Mix drained tuna with Greek yogurt. Mash avocado and spread on tortilla. Add tuna mixture, lettuce, and tomato. Roll tightly and slice.',
      estimatedTime: '5 minutes',
      macros: {
        calories: protein.calories + 280,
        protein: protein.protein + 8,
        carbs: protein.carbs + 35,
        fat: protein.fat + 15
      }
    });

    meals.push({
      name: 'Tuna Pasta Salad',
      cookingMethod: 'minimal-cook',
      ingredients: [
        `${protein.standardSize} ${protein.name}`,
        '2 oz pasta (1 cup cooked)',
        '1/4 cup diced bell pepper',
        '2 tbsp Italian dressing',
        '2 tbsp parmesan cheese'
      ],
      instructions: 'Cook pasta according to package (8-10 min). Drain and cool. Mix with drained tuna, bell pepper, and Italian dressing. Top with parmesan.',
      estimatedTime: '15 minutes',
      macros: {
        calories: protein.calories + 310,
        protein: protein.protein + 11,
        carbs: protein.carbs + 44,
        fat: protein.fat + 11
      }
    });
  }

  if (key.includes('chicken')) {
    meals.push({
      name: 'Grilled Chicken Bowl',
      cookingMethod: 'normal-cook',
      ingredients: [
        `${protein.standardSize} ${protein.name}`,
        '1 cup cooked rice',
        '1 cup steamed broccoli',
        '2 tbsp teriyaki sauce'
      ],
      instructions: 'Season chicken with salt and pepper. Cook in pan over medium-high heat, 6-7 min per side. Slice and serve over rice with broccoli. Drizzle with teriyaki sauce.',
      estimatedTime: '20 minutes',
      macros: {
        calories: protein.calories + 270,
        protein: protein.protein + 7,
        carbs: protein.carbs + 51,
        fat: protein.fat + 1
      }
    });

    meals.push({
      name: 'Chicken Caesar Wrap',
      cookingMethod: 'normal-cook',
      ingredients: [
        `${protein.standardSize} ${protein.name}`,
        '1 large tortilla',
        '1 cup romaine lettuce',
        '2 tbsp Caesar dressing',
        '2 tbsp parmesan cheese'
      ],
      instructions: 'Season and grill chicken until cooked through (6-7 min per side). Slice. Fill tortilla with lettuce, chicken, dressing, and parmesan. Roll and enjoy!',
      estimatedTime: '18 minutes',
      macros: {
        calories: protein.calories + 320,
        protein: protein.protein + 10,
        carbs: protein.carbs + 28,
        fat: protein.fat + 18
      }
    });
  }

  if (key.includes('salmon')) {
    meals.push({
      name: 'Pan-Seared Salmon with Veggies',
      cookingMethod: 'normal-cook',
      ingredients: [
        `${protein.standardSize} ${protein.name}`,
        '2 cups asparagus',
        '1 tbsp olive oil',
        'Lemon wedge',
        'Salt, pepper, garlic powder'
      ],
      instructions: 'Season salmon with salt, pepper, and garlic powder. Heat oil in pan over medium-high. Cook salmon skin-side down 5 min, flip and cook 3 min. Roast asparagus alongside. Serve with lemon.',
      estimatedTime: '15 minutes',
      macros: {
        calories: protein.calories + 190,
        protein: protein.protein + 5,
        carbs: protein.carbs + 10,
        fat: protein.fat + 16
      }
    });
  }

  if (key.includes('eggs')) {
    meals.push({
      name: 'Veggie Scramble',
      cookingMethod: 'minimal-cook',
      ingredients: [
        `${protein.standardSize}`,
        '1/2 cup diced bell peppers',
        '1/2 cup spinach',
        '2 tbsp cheese',
        'Salt and pepper'
      ],
      instructions: 'Beat eggs with salt and pepper. Heat pan with spray. Add peppers and spinach, cook 2 min. Add eggs, scramble until cooked. Top with cheese.',
      estimatedTime: '8 minutes',
      macros: {
        calories: protein.calories + 110,
        protein: protein.protein + 8,
        carbs: protein.carbs + 6,
        fat: protein.fat + 6
      }
    });

    meals.push({
      name: 'Egg and Toast Protein Plate',
      cookingMethod: 'minimal-cook',
      ingredients: [
        `${protein.standardSize}`,
        '2 slices whole grain toast',
        '1/2 avocado',
        'Hot sauce (optional)'
      ],
      instructions: 'Toast bread. Cook eggs your way (fried, scrambled, or poached). Mash avocado and spread on toast. Top with eggs. Add hot sauce if desired.',
      estimatedTime: '8 minutes',
      macros: {
        calories: protein.calories + 300,
        protein: protein.protein + 10,
        carbs: protein.carbs + 32,
        fat: protein.fat + 13
      }
    });
  }

  if (key.includes('beef')) {
    meals.push({
      name: 'Beef Taco Bowl',
      cookingMethod: 'normal-cook',
      ingredients: [
        `${protein.standardSize} ${protein.name}`,
        '1 cup cooked rice',
        '1/2 cup black beans',
        'Salsa, lettuce, cheese'
      ],
      instructions: 'Brown ground beef in pan, drain excess fat. Add taco seasoning. Serve over rice with black beans. Top with salsa, lettuce, and cheese.',
      estimatedTime: '15 minutes',
      macros: {
        calories: protein.calories + 420,
        protein: protein.protein + 20,
        carbs: protein.carbs + 66,
        fat: protein.fat + 6
      }
    });
  }

  if (key.includes('turkey')) {
    meals.push({
      name: 'Turkey Burger Bowl',
      cookingMethod: 'normal-cook',
      ingredients: [
        `${protein.standardSize} ${protein.name}`,
        '1 cup mixed greens',
        '1/4 cup diced tomato',
        '2 tbsp BBQ sauce',
        'Pickles (optional)'
      ],
      instructions: 'Form turkey into patty, season with salt and pepper. Cook in pan 5-6 min per side until done. Break into pieces and serve over greens with tomato and BBQ sauce.',
      estimatedTime: '15 minutes',
      macros: {
        calories: protein.calories + 90,
        protein: protein.protein + 3,
        carbs: protein.carbs + 18,
        fat: protein.fat + 1
      }
    });
  }

  if (key.includes('shrimp')) {
    meals.push({
      name: 'Garlic Butter Shrimp',
      cookingMethod: 'minimal-cook',
      ingredients: [
        `${protein.standardSize} ${protein.name}`,
        '1 cup cooked rice or pasta',
        '2 tbsp butter',
        '3 cloves garlic minced',
        'Lemon juice and parsley'
      ],
      instructions: 'Melt butter in pan, add garlic, cook 1 min. Add shrimp, cook 2-3 min per side until pink. Serve over rice or pasta with lemon juice and parsley.',
      estimatedTime: '10 minutes',
      macros: {
        calories: protein.calories + 410,
        protein: protein.protein + 4,
        carbs: protein.carbs + 45,
        fat: protein.fat + 24
      }
    });
  }

  return meals;
}

function generateCarbMeals(carb: IngredientInfo): CompleteMealIdea[] {
  const meals: CompleteMealIdea[] = [];
  const key = carb.name.toLowerCase();

  if (key.includes('rice')) {
    meals.push({
      name: 'Chicken Fried Rice',
      cookingMethod: 'normal-cook',
      ingredients: [
        `${carb.standardSize} ${carb.name}`,
        '4 oz diced chicken',
        '1 egg',
        '1/2 cup mixed vegetables',
        '2 tbsp soy sauce'
      ],
      instructions: 'Cook rice if needed. Scramble egg in pan, set aside. Cook chicken, add vegetables, then rice. Add soy sauce and egg, stir-fry 2-3 min.',
      estimatedTime: '15 minutes',
      macros: {
        calories: carb.calories + 310,
        protein: carb.protein + 35,
        carbs: carb.carbs + 12,
        fat: carb.fat + 12
      }
    });
  }

  if (key.includes('pasta')) {
    meals.push({
      name: 'Pasta with Marinara and Protein',
      cookingMethod: 'minimal-cook',
      ingredients: [
        `${carb.standardSize} ${carb.name}`,
        '6 oz grilled chicken or ground turkey',
        '1/2 cup marinara sauce',
        '2 tbsp parmesan cheese',
        'Italian seasoning'
      ],
      instructions: 'Cook pasta according to package directions (8-10 min). Heat marinara sauce. Toss pasta with sauce and cooked protein. Top with parmesan and Italian seasoning.',
      estimatedTime: '15 minutes',
      macros: {
        calories: carb.calories + 340,
        protein: carb.protein + 42,
        carbs: carb.carbs + 12,
        fat: carb.fat + 8
      }
    });
  }

  if (key.includes('sweet potato')) {
    meals.push({
      name: 'Loaded Sweet Potato',
      cookingMethod: 'minimal-cook',
      ingredients: [
        `${carb.standardSize} ${carb.name}`,
        '4 oz grilled chicken',
        '2 tbsp Greek yogurt',
        '2 tbsp shredded cheese',
        'Green onions'
      ],
      instructions: 'Microwave sweet potato for 5-6 min until soft. Cut open, add chicken, Greek yogurt, cheese, and green onions. Microwave 30 sec more to melt cheese.',
      estimatedTime: '10 minutes',
      macros: {
        calories: carb.calories + 290,
        protein: carb.protein + 36,
        carbs: carb.carbs + 8,
        fat: carb.fat + 9
      }
    });
  }

  if (key.includes('oats')) {
    meals.push({
      name: 'Protein Oatmeal Bowl',
      cookingMethod: 'minimal-cook',
      ingredients: [
        `${carb.standardSize} ${carb.name}`,
        '1 cup milk',
        '1 scoop protein powder',
        '1 banana',
        '1 tbsp peanut butter'
      ],
      instructions: 'Microwave oats with milk for 2-3 min. Stir in protein powder. Top with sliced banana and peanut butter. Ready to eat!',
      estimatedTime: '5 minutes',
      macros: {
        calories: carb.calories + 515,
        protein: carb.protein + 42,
        carbs: carb.carbs + 68,
        fat: carb.fat + 20
      }
    });
  }

  return meals;
}

function generateBalancedMealWith(ingredient: IngredientInfo): CompleteMealIdea {
  // Generic balanced meal for vegetables or other ingredients
  return {
    name: `${ingredient.name} Power Bowl`,
    cookingMethod: 'normal-cook',
    ingredients: [
      `${ingredient.standardSize} ${ingredient.name}`,
      '6 oz grilled chicken or protein of choice',
      '1 cup cooked rice or quinoa',
      '2 tbsp olive oil or dressing',
      'Seasonings to taste'
    ],
    instructions: `Cook protein of choice. Prepare ${ingredient.name.toLowerCase()} (steam, sauté, or serve raw). Serve over rice with olive oil and seasonings.`,
    estimatedTime: '20 minutes',
    macros: {
      calories: ingredient.calories + 500,
      protein: ingredient.protein + 42,
      carbs: ingredient.carbs + 45,
      fat: ingredient.fat + 18
    }
  };
}
