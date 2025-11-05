import type { NutritionInfo } from '../types';
import type { MacroOutputs } from './macroCalculator';

interface ConsumedMacros {
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

interface ServingRecommendation {
  recommendedServings: number;
  reason: string;
  macroContribution: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  percentOfGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

/**
 * Calculate recommended serving size based on user's remaining macro goals
 */
export function calculateRecommendedServings(
  recipeNutrition: NutritionInfo,
  macroGoals: MacroOutputs,
  consumedMacros: ConsumedMacros
): ServingRecommendation {
  // Calculate remaining macros
  const remaining = {
    calories: macroGoals.calories - consumedMacros.calories,
    protein: macroGoals.protein_g - consumedMacros.protein_g,
    carbs: macroGoals.carbs_g - consumedMacros.carbs_g,
    fat: macroGoals.fat_g - consumedMacros.fat_g,
  };

  // Prevent division by zero
  if (
    recipeNutrition.calories === 0 ||
    recipeNutrition.protein === 0 ||
    recipeNutrition.carbs === 0 ||
    recipeNutrition.fat === 0
  ) {
    return {
      recommendedServings: 1,
      reason: 'Standard serving',
      macroContribution: {
        calories: recipeNutrition.calories,
        protein: recipeNutrition.protein,
        carbs: recipeNutrition.carbs,
        fat: recipeNutrition.fat,
      },
      percentOfGoals: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      },
    };
  }

  // Calculate servings needed to fill each macro
  const servingsForCalories = remaining.calories / recipeNutrition.calories;
  const servingsForProtein = remaining.protein / recipeNutrition.protein;
  const servingsForCarbs = remaining.carbs / recipeNutrition.carbs;
  const servingsForFat = remaining.fat / recipeNutrition.fat;

  // Determine limiting factor (prioritize protein for athletes)
  let recommendedServings: number;
  let reason: string;

  // If protein is the primary need (common for athletes)
  if (remaining.protein > macroGoals.protein_g * 0.3) {
    recommendedServings = servingsForProtein;
    reason = 'Optimized for your protein goal';
  }
  // If calories are running low
  else if (remaining.calories < macroGoals.calories * 0.3) {
    recommendedServings = Math.min(servingsForCalories, servingsForProtein);
    reason = 'Fits your remaining calories';
  }
  // Balance all macros
  else {
    // Take the minimum to avoid going over any single macro
    const allServings = [servingsForCalories, servingsForProtein, servingsForCarbs, servingsForFat];
    recommendedServings = Math.min(...allServings);
    reason = 'Balanced for all your macros';
  }

  // Round to practical serving sizes (0.5, 1, 1.5, 2, 2.5, etc.)
  // Minimum 0.5, maximum 3 servings
  recommendedServings = Math.max(0.5, Math.min(3, recommendedServings));
  recommendedServings = Math.round(recommendedServings * 2) / 2; // Round to nearest 0.5

  // If we're close to goal, recommend 1 serving
  if (remaining.calories < recipeNutrition.calories * 0.3) {
    recommendedServings = 0.5;
    reason = 'Small portion - you\'re close to your daily goal';
  }

  // Calculate actual contribution with recommended servings
  const macroContribution = {
    calories: Math.round(recipeNutrition.calories * recommendedServings),
    protein: Math.round(recipeNutrition.protein * recommendedServings),
    carbs: Math.round(recipeNutrition.carbs * recommendedServings),
    fat: Math.round(recipeNutrition.fat * recommendedServings),
  };

  // Calculate percentage of daily goals this will provide
  const percentOfGoals = {
    calories: Math.round((macroContribution.calories / macroGoals.calories) * 100),
    protein: Math.round((macroContribution.protein / macroGoals.protein_g) * 100),
    carbs: Math.round((macroContribution.carbs / macroGoals.carbs_g) * 100),
    fat: Math.round((macroContribution.fat / macroGoals.fat_g) * 100),
  };

  return {
    recommendedServings,
    reason,
    macroContribution,
    percentOfGoals,
  };
}
