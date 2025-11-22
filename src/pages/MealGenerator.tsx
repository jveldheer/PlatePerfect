import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMacros } from '../contexts/MacroContext';
import { generateMealsWithAI } from '../utils/openaiService';

interface GeneratedMeal {
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: string;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  ingredients: Array<{
    item: string;
    amount: string;
    grams?: number;
  }>;
  instructions: string[];
  tags: string[];
  mealPrepNotes?: string;
}

export default function MealGenerator() {
  const { macroGoals, consumedMacros } = useMacros();

  // Step navigation
  const [currentStep, setCurrentStep] = useState(1);

  // Question answers
  const [prepTime, setPrepTime] = useState<string>('');
  const [mealPrep, setMealPrep] = useState<boolean>(false);
  const [cookingSkill, setCookingSkill] = useState<string>('');
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([]);
  const [ingredientsInput, setIngredientsInput] = useState('');

  // Results
  const [meals, setMeals] = useState<GeneratedMeal[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingSeconds, setLoadingSeconds] = useState(0);

  // Track loading time
  useEffect(() => {
    let interval: number | undefined;
    if (isLoading) {
      setLoadingSeconds(0);
      interval = window.setInterval(() => {
        setLoadingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build enhanced AI context based on user answers
      const ingredientList = ingredientsInput
        .split(',')
        .map(i => i.trim())
        .filter(i => i.length > 0);

      // Calculate remaining macros
      const remainingMacros = macroGoals && consumedMacros ? {
        calories: Math.max(0, macroGoals.calories - consumedMacros.calories),
        protein_g: Math.max(0, macroGoals.protein_g - consumedMacros.protein_g),
        carbs_g: Math.max(0, macroGoals.carbs_g - consumedMacros.carbs_g),
        fat_g: Math.max(0, macroGoals.fat_g - consumedMacros.fat_g)
      } : {
        calories: 500,
        protein_g: 30,
        carbs_g: 50,
        fat_g: 15
      };

      // Build context for AI with all required fields
      const context = {
        athlete_id: 'user-001', // Default user ID
        goal: 'maintain' as const, // Default goal - user can adjust based on their profile
        target_macros_per_meal: {
          cal: Math.round(remainingMacros.calories / 3), // Divide by 3 meals
          protein_g: Math.round(remainingMacros.protein_g / 3),
          carb_g: Math.round(remainingMacros.carbs_g / 3),
          fat_g: Math.round(remainingMacros.fat_g / 3),
          fiber_g: 8 // Default fiber target per meal
        },
        creative_mode: true, // Enable creative recipe generation
        category_preference: prepTime === 'quick' ? ['no_cook', 'minimal_cook'] :
                           prepTime === '15min' ? ['minimal_cook', 'full_cook'] :
                           ['full_cook', 'minimal_cook'],
        allowed_appliances: ["stove", "oven", "microwave", "air_fryer", "blender"],
        include_staples: true, // Allow common pantry staples
        servings_default: mealPrep ? 4 : 1, // More servings if meal prep is enabled
      };

      const response = await generateMealsWithAI(context, ingredientList);

      if (response.meals && response.meals.length > 0) {
        // Take only first 3 meals
        const formattedMeals = response.meals.slice(0, 3).map((meal: any) => ({
          title: meal.title,
          description: meal.description || 'Delicious athlete-focused meal',
          prepTime: meal.prep_time_min || 10,
          cookTime: meal.cook_time_min || 20,
          servings: meal.servings || 1,
          difficulty: meal.skill_level || 'easy',
          macros: {
            calories: meal.macros_per_serving?.cal || 0,
            protein: meal.macros_per_serving?.protein_g || 0,
            carbs: meal.macros_per_serving?.carb_g || 0,
            fat: meal.macros_per_serving?.fat_g || 0
          },
          ingredients: meal.ingredients?.map((ing: any) => ({
            item: ing.canonical_name || ing.user_input || 'ingredient',
            amount: `${ing.grams || 100}g`,
            grams: ing.grams || 100
          })) || [],
          instructions: meal.steps || [],
          tags: meal.tags || [],
          mealPrepNotes: meal.meal_prep_notes
        }));

        setMeals(formattedMeals);
        setShowResults(true);
      } else {
        setError('No meals generated. Please try again.');
      }
    } catch (err: any) {
      console.error('Error generating meals:', err);

      // Provide helpful error messages
      if (err.message?.includes('timed out') || err.message?.includes('AbortError') || err.message?.includes('504')) {
        setError('⏱️ Generation timed out. The AI is busy or your request is complex. Try again with: (1) Fewer ingredients, or (2) Simpler preferences. Usually works on second try!');
      } else if (err.message?.includes('500') || err.message?.includes('Server')) {
        setError('🔑 Server error - check that OpenAI API key is configured in Vercel environment variables.');
      } else if (err.message?.includes('context field')) {
        setError('AI response format error. Please try again - this usually resolves on retry.');
      } else {
        setError(err.message || 'Failed to generate meals. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return prepTime !== '';
      case 2: return cookingSkill !== '';
      case 3: return true; // Optional step
      case 4: return true; // Ready to generate
      default: return false;
    }
  };

  const handleSaveRecipe = (meal: GeneratedMeal) => {
    try {
      const saved = localStorage.getItem('plateperfect_saved_recipes') || '[]';
      const savedRecipes = JSON.parse(saved);
      const newRecipe = {
        ...meal,
        id: `generated-${Date.now()}`,
        savedAt: new Date().toISOString()
      };
      savedRecipes.push(newRecipe);
      localStorage.setItem('plateperfect_saved_recipes', JSON.stringify(savedRecipes));
      alert('✅ Recipe saved! View it in Saved Recipes.');
    } catch (error) {
      console.error('Failed to save recipe:', error);
      alert('❌ Failed to save recipe');
    }
  };

  const remainingMacros = macroGoals && consumedMacros ? {
    calories: Math.max(0, macroGoals.calories - consumedMacros.calories),
    protein: Math.max(0, macroGoals.protein_g - consumedMacros.protein_g),
    carbs: Math.max(0, macroGoals.carbs_g - consumedMacros.carbs_g),
    fat: Math.max(0, macroGoals.fat_g - consumedMacros.fat_g)
  } : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="vlv-heading text-4xl mb-4">
          ⚡ Fuel Generator
        </h1>
        <p className="vlv-text">
          Answer a few quick questions to get 3 elite, tasty recipes personalized to your goals
        </p>
      </div>

      {/* Remaining Macros */}
      {remainingMacros && !showResults && (
        <div className="card">
          <h2 className="vlv-heading text-xl mb-4">📊 Your Remaining Macros Today</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="vlv-subtext text-sm mb-1">Calories</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--yellow)' }}>
                {remainingMacros.calories}
              </p>
            </div>
            <div className="text-center">
              <p className="vlv-subtext text-sm mb-1">Protein</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--red)' }}>
                {remainingMacros.protein}g
              </p>
            </div>
            <div className="text-center">
              <p className="vlv-subtext text-sm mb-1">Carbs</p>
              <p className="text-3xl font-bold" style={{ color: '#FFD700' }}>
                {remainingMacros.carbs}g
              </p>
            </div>
            <div className="text-center">
              <p className="vlv-subtext text-sm mb-1">Fat</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--blue)' }}>
                {remainingMacros.fat}g
              </p>
            </div>
          </div>
        </div>
      )}

      {!showResults && (
        <>
          {/* Progress Indicator */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      step === currentStep
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black scale-110'
                        : step < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`h-1 w-12 md:w-24 transition-all ${
                        step < currentStep ? 'bg-green-500' : 'bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Prep Time */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="vlv-heading text-2xl mb-2">⏱️ How much time do you have?</h2>
                  <p className="vlv-subtext mb-6">Choose your maximum prep + cook time</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { value: 'quick', label: 'Quick', time: '< 15 min', icon: '⚡' },
                    { value: '15min', label: '15 Minutes', time: '15 min', icon: '🕐' },
                    { value: '30min', label: '30 Minutes', time: '30 min', icon: '🕑' },
                    { value: '30plus', label: '30+ Minutes', time: '30+ min', icon: '🕒' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setPrepTime(option.value)}
                      className={`p-6 rounded-xl border-3 transition-all duration-300 hover:scale-105 ${
                        prepTime === option.value
                          ? 'border-yellow-500 bg-gradient-to-br from-yellow-900 to-yellow-800 shadow-xl'
                          : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-4xl mb-2">{option.icon}</div>
                      <div className="vlv-heading text-lg mb-1">{option.label}</div>
                      <div className="vlv-subtext text-sm">{option.time}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Cooking Skill */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="vlv-heading text-2xl mb-2">👨‍🍳 What's your cooking level?</h2>
                  <p className="vlv-subtext mb-6">We'll match the complexity to your skills</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'beginner', label: 'Beginner', desc: 'Simple & easy', icon: '🥚' },
                    { value: 'intermediate', label: 'Intermediate', desc: 'Some experience', icon: '🍳' },
                    { value: 'advanced', label: 'Advanced', desc: 'Confident cook', icon: '👨‍🍳' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setCookingSkill(option.value)}
                      className={`p-6 rounded-xl border-3 transition-all duration-300 hover:scale-105 ${
                        cookingSkill === option.value
                          ? 'border-yellow-500 bg-gradient-to-br from-yellow-900 to-yellow-800 shadow-xl'
                          : 'border-gray-600 bg-gray-800 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-5xl mb-3">{option.icon}</div>
                      <div className="vlv-heading text-xl mb-1">{option.label}</div>
                      <div className="vlv-subtext text-sm">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Meal Prep & Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="vlv-heading text-2xl mb-2">📦 Meal Prep Options</h2>
                  <p className="vlv-subtext mb-6">Customize your recipes</p>
                </div>

                {/* Meal Prep Toggle */}
                <div
                  onClick={() => setMealPrep(!mealPrep)}
                  className={`p-6 rounded-xl border-3 cursor-pointer transition-all duration-300 hover:scale-102 ${
                    mealPrep
                      ? 'border-yellow-500 bg-gradient-to-br from-yellow-900 to-yellow-800'
                      : 'border-gray-600 bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{mealPrep ? '✅' : '☐'}</div>
                    <div>
                      <h3 className="vlv-heading text-xl mb-1">Meal Prep Friendly</h3>
                      <p className="vlv-subtext text-sm">
                        Get recipes you can make in bulk and store for the week
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dietary Preferences */}
                <div>
                  <label className="vlv-heading text-lg block mb-3">
                    Dietary Preferences (Optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { value: 'high_protein', label: 'Extra Protein', icon: '💪' },
                      { value: 'low_carb', label: 'Lower Carb', icon: '🥑' },
                      { value: 'dairy_free', label: 'Dairy Free', icon: '🥛' }
                    ].map((pref) => (
                      <button
                        key={pref.value}
                        onClick={() => {
                          if (dietaryPrefs.includes(pref.value)) {
                            setDietaryPrefs(dietaryPrefs.filter(p => p !== pref.value));
                          } else {
                            setDietaryPrefs([...dietaryPrefs, pref.value]);
                          }
                        }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          dietaryPrefs.includes(pref.value)
                            ? 'border-yellow-500 bg-yellow-900'
                            : 'border-gray-600 bg-gray-800'
                        }`}
                      >
                        <div className="text-3xl mb-1">{pref.icon}</div>
                        <div className="vlv-text text-sm">{pref.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Ingredients (Optional) */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="vlv-heading text-2xl mb-2">🥘 Any specific ingredients?</h2>
                  <p className="vlv-subtext mb-6">Optional - we'll create amazing recipes either way</p>
                </div>

                <div>
                  <label className="vlv-heading text-lg block mb-3">
                    Ingredients (comma separated)
                  </label>
                  <input
                    type="text"
                    value={ingredientsInput}
                    onChange={(e) => setIngredientsInput(e.target.value)}
                    placeholder="e.g., chicken, rice, broccoli"
                    className="w-full"
                  />
                  <p className="vlv-subtext text-sm mt-2">
                    Leave blank for creative AI-generated recipes, or enter what you have on hand
                  </p>
                </div>

                {/* Summary */}
                <div className="card" style={{ backgroundColor: '#1A1A1A' }}>
                  <h3 className="vlv-heading text-lg mb-3">📋 Your Selections:</h3>
                  <ul className="vlv-text space-y-2">
                    <li>⏱️ Time: <strong>{prepTime === 'quick' ? '< 15 min' : prepTime === '15min' ? '15 min' : prepTime === '30min' ? '30 min' : '30+ min'}</strong></li>
                    <li>👨‍🍳 Skill: <strong className="capitalize">{cookingSkill}</strong></li>
                    <li>📦 Meal Prep: <strong>{mealPrep ? 'Yes' : 'No'}</strong></li>
                    {dietaryPrefs.length > 0 && (
                      <li>🎯 Preferences: <strong>{dietaryPrefs.map(p => p.replace('_', ' ')).join(', ')}</strong></li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-700">
              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn-secondary px-6 py-3"
                >
                  ← Back
                </button>
              )}

              {currentStep < 4 && (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                  className="btn-primary px-6 py-3 ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              )}

              {currentStep === 4 && (
                <button
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="btn-primary px-8 py-4 ml-auto text-lg disabled:opacity-50"
                >
                  {isLoading ? `Generating... ${loadingSeconds}s` : '✨ Generate 3 Elite Recipes'}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="card text-center py-12">
          <div className="animate-spin text-6xl mb-4">⚡</div>
          <h3 className="vlv-heading text-2xl mb-2">Crafting Your Elite Recipes...</h3>
          <p className="vlv-text">AI is working its magic ({loadingSeconds}s)</p>
          <div className="mt-6 max-w-md mx-auto bg-gray-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="card" style={{ borderLeft: '6px solid var(--red)' }}>
          <h3 className="vlv-heading text-xl mb-2 flex items-center gap-2">
            <span className="text-3xl">⚠️</span>
            Error Generating Recipes
          </h3>
          <p className="vlv-text mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setShowResults(false);
            }}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results */}
      {showResults && meals.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="vlv-heading text-3xl">🎉 Your 3 Elite Recipes</h2>
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentStep(1);
                setPrepTime('');
                setCookingSkill('');
                setMealPrep(false);
                setDietaryPrefs([]);
                setIngredientsInput('');
              }}
              className="btn-secondary"
            >
              ← New Search
            </button>
          </div>

          {meals.map((meal, index) => (
            <div key={index} className="card hover:scale-101 transition-transform">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="vlv-heading text-2xl mb-2">{meal.title}</h3>
                  <p className="vlv-text">{meal.description}</p>
                </div>
                <div className="text-4xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
              </div>

              {/* Time & Difficulty */}
              <div className="flex gap-4 mb-4 flex-wrap">
                <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: '#1A1A1A', color: 'var(--yellow)' }}>
                  ⏱️ {meal.prepTime + meal.cookTime} min
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-bold capitalize" style={{ backgroundColor: '#1A1A1A', color: 'var(--yellow)' }}>
                  👨‍🍳 {meal.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: '#1A1A1A', color: 'var(--yellow)' }}>
                  🍽️ {meal.servings} serving{meal.servings > 1 ? 's' : ''}
                </span>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-4 gap-3 mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A' }}>
                <div className="text-center">
                  <p className="vlv-subtext text-xs mb-1">Calories</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--yellow)' }}>{meal.macros.calories}</p>
                </div>
                <div className="text-center">
                  <p className="vlv-subtext text-xs mb-1">Protein</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--red)' }}>{meal.macros.protein}g</p>
                </div>
                <div className="text-center">
                  <p className="vlv-subtext text-xs mb-1">Carbs</p>
                  <p className="text-2xl font-bold" style={{ color: '#FFD700' }}>{meal.macros.carbs}g</p>
                </div>
                <div className="text-center">
                  <p className="vlv-subtext text-xs mb-1">Fat</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--blue)' }}>{meal.macros.fat}g</p>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-6">
                <h4 className="vlv-heading text-lg mb-3">Ingredients:</h4>
                <ul className="vlv-text space-y-1">
                  {meal.ingredients.map((ing, i) => (
                    <li key={i}>• {ing.amount} {ing.item}</li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-6">
                <h4 className="vlv-heading text-lg mb-3">Instructions:</h4>
                <ol className="vlv-text space-y-2">
                  {meal.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-bold" style={{ color: 'var(--yellow)' }}>{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Meal Prep Notes */}
              {meal.mealPrepNotes && (
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1A1A1A', borderLeft: '4px solid var(--green)' }}>
                  <h4 className="vlv-heading text-sm mb-2">📦 Meal Prep Tip:</h4>
                  <p className="vlv-text text-sm">{meal.mealPrepNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleSaveRecipe(meal)}
                  className="btn-primary flex-1"
                >
                  💾 Save Recipe
                </button>
                <Link
                  to="/tracker"
                  className="btn-secondary flex-1 text-center"
                >
                  📊 Add to Tracker
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
