export interface CookingSkill {
  id: string;
  title: string;
  category: 'knife-skills' | 'cooking-methods' | 'food-safety' | 'prep-techniques' | 'equipment';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  detailedSteps: string[];
  tips: string[];
  commonMistakes: string[];
  videoUrl?: string;
  estimatedTime: number; // in minutes
}

export interface NutritionInfo {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  servings: number;
}

export interface Recipe {
  id: string;
  title: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'post-workout' | 'pre-workout';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  nutritionInfo: NutritionInfo;
  athleteNotes: string; // Why this meal is good for athletes
  requiredSkills: string[]; // IDs of cooking skills needed
  mealPrepNotes: string;
  storageInstructions: string;
  tags: string[];
  videoUrl?: string; // TikTok or YouTube video URL
}

export interface Ingredient {
  item: string;
  amount: string;
  notes?: string;
}

export interface InstructionStep {
  step: number;
  instruction: string;
  detailedExplanation: string; // Thorough explanation for novices
  skillTip?: string; // Related cooking skill tip
  timeEstimate?: number; // minutes for this step
}

export interface UserProgress {
  completedSkills: string[];
  favoriteRecipes: string[];
  cookedRecipes: { recipeId: string; date: string; notes: string }[];
}
