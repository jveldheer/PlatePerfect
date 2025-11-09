import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMacros } from '../contexts/MacroContext';
import { buildAIContext, generateAIMealsFallback, type AIMealResponse } from '../utils/aiMealGenerator';
import { generateMealsWithAI } from '../utils/openaiService';

function MealGenerator() {
  const { macroGoals, consumedMacros } = useMacros();
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [aiResponse, setAiResponse] = useState<AIMealResponse | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [savedMeals, setSavedMeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingAI, setUsingAI] = useState(false);
  const [loadingSeconds, setLoadingSeconds] = useState(0);
  const [mealServings, setMealServings] = useState<{[key: string]: number}>({});

  // Load saved meals on mount
  useEffect(() => {
    const saved = localStorage.getItem('veldheerfuellab_saved_meals');
    if (saved) {
      try {
        setSavedMeals(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved meals', e);
      }
    }
  }, []);

  // Track loading time for user feedback
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
    setUsingAI(false);

    const ingredientList = ingredientsInput
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const apiKey = localStorage.getItem('openai_api_key');

    try {
      if (apiKey) {
        // Try to use real AI
        setUsingAI(true);
        const context = buildAIContext(macroGoals, consumedMacros);
        const result = await generateMealsWithAI(context, ingredientList);

        if (result.meals.length === 0) {
          setError('No meals found. Please try again.');
          setShowResults(false);
        } else {
          setAiResponse(result);
          setShowResults(true);
        }
      } else {
        // Fall back to local generation
        setUsingAI(false);
        const result = generateAIMealsFallback(ingredientList, macroGoals, consumedMacros);

        if (result.meals.length === 0) {
          setError('No meals found. Please try again.');
          setShowResults(false);
        } else {
          setAiResponse(result);
          setShowResults(true);
        }
      }
    } catch (err: any) {
      console.error('Error generating meals:', err);

      // If AI fails, fall back to local generation
      if (apiKey) {
        setError(`AI generation failed: ${err.message}. Falling back to local generation...`);
        setUsingAI(false);

        try {
          const result = generateAIMealsFallback(ingredientList, macroGoals, consumedMacros);
          setAiResponse(result);
          setShowResults(true);
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr);
          setError('Failed to generate meals. Please try again.');
          setShowResults(false);
        }
      } else {
        setError(err.message || 'An error occurred while generating meals.');
        setShowResults(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveMeal = (meal: any) => {
    const newSavedMeals = [...savedMeals, { ...meal, savedAt: new Date().toISOString() }];
    setSavedMeals(newSavedMeals);
    localStorage.setItem('veldheerfuellab_saved_meals', JSON.stringify(newSavedMeals));
    alert('✅ Recipe saved! View it in Saved Recipes.');
  };

  const isMealSaved = (mealName: string) => {
    return savedMeals.some(m => m.name === mealName);
  };

  const getMealServings = (mealTitle: string) => {
    return mealServings[mealTitle] || 1;
  };

  const updateMealServings = (mealTitle: string, servings: number) => {
    setMealServings(prev => ({
      ...prev,
      [mealTitle]: Math.max(1, servings)
    }));
  };

  const remainingMacros = macroGoals && consumedMacros ? {
    calories: Math.max(0, macroGoals.calories - consumedMacros.calories),
    protein: Math.max(0, macroGoals.protein_g - consumedMacros.protein_g),
    carbs: Math.max(0, macroGoals.carbs_g - consumedMacros.carbs_g),
    fat: Math.max(0, macroGoals.fat_g - consumedMacros.fat_g)
  } : null;

  const getCookingMethodIcon = (method: string) => {
    switch (method) {
      case 'no_cook': return '🥗';
      case 'minimal_cook': return '⚡';
      case 'full_cook': return '🍳';
      case 'freestyle': return '🎨';
      default: return '🍽️';
    }
  };

  const getCookingMethodColor = (method: string) => {
    switch (method) {
      case 'no_cook': return 'bg-green-50 border-green-500 text-green-800';
      case 'minimal_cook': return 'bg-blue-50 border-blue-500 text-blue-800';
      case 'full_cook': return 'bg-orange-50 border-orange-500 text-orange-800';
      case 'freestyle': return 'bg-purple-50 border-purple-500 text-purple-800';
      default: return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            ⚡ Fuel Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Get complete meal ideas personalized to your nutrition goals!
          </p>

          {/* AI Status Notice */}
          {!localStorage.getItem('openai_api_key') && (
            <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-yellow-800">
                    <strong>Using fallback mode.</strong> For true AI-generated meals, add your OpenAI API key in{' '}
                    <Link to="/settings" className="font-semibold underline">Settings</Link>.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Macro Status */}
        {remainingMacros && (
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              📊 Your Remaining Macros Today
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs sm:text-sm text-gray-600">Calories</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600">
                  {remainingMacros.calories}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-xs sm:text-sm text-gray-600">Protein</div>
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {remainingMacros.protein}g
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-xs sm:text-sm text-gray-600">Carbs</div>
                <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                  {remainingMacros.carbs}g
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-xs sm:text-sm text-gray-600">Fat</div>
                <div className="text-xl sm:text-2xl font-bold text-purple-600">
                  {remainingMacros.fat}g
                </div>
              </div>
            </div>
          </div>
        )}

        {!macroGoals && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">💡</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">
                  <Link to="/profile" className="font-semibold underline">
                    Set up your macro goals
                  </Link>
                  {' '}to get personalized meal suggestions based on your remaining macros!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Generate Section */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
            🎯 Generate Meal Ideas
          </h2>

          {/* Optional Ingredient Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🍎 Ingredients You Have (Optional)
            </label>
            <input
              type="text"
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              placeholder="e.g., chicken, rice, broccoli (separate with commas)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to get suggestions based only on your macro goals
            </p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isLoading ? (
              <div className="flex flex-col items-center gap-1">
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating with AI... {loadingSeconds}s
                </span>
                {loadingSeconds > 30 && (
                  <span className="text-xs opacity-90">
                    This can take up to 2 minutes - please wait...
                  </span>
                )}
              </div>
            ) : (
              '✨ Generate Meal Ideas'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 whitespace-pre-line font-medium mb-2">{error}</p>
                {error.includes('No content received') && (
                  <div className="text-xs text-red-700 mt-2 space-y-1">
                    <p>This could mean:</p>
                    <ul className="list-disc list-inside ml-2">
                      <li>GPT-5-mini might have API restrictions</li>
                      <li>Your API key might not have access to this model</li>
                      <li>The response was cut off or filtered</li>
                    </ul>
                    <p className="mt-2 font-medium">💡 The app automatically fell back to local generation which still works great!</p>
                  </div>
                )}
                <p className="text-xs text-red-600 mt-2">
                  💡 Check the browser console (F12) for detailed debugging information
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && aiResponse && aiResponse.meals && aiResponse.context && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg p-6 text-white">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  🔬 {aiResponse.meals.length} Elite Athlete Meals Generated
                </h2>
                {usingAI && (
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">
                    🤖 AI-Powered
                  </span>
                )}
              </div>
              <p className="text-base sm:text-lg opacity-95">
                Goal: {aiResponse.context?.goal?.toUpperCase() || 'MAINTAIN'} | Target per meal: {Math.round(aiResponse.context?.target_macros_per_meal?.cal || 0)} cal, {Math.round(aiResponse.context?.target_macros_per_meal?.protein_g || 0)}g protein
              </p>
            </div>

            {/* Organize meals by cooking method */}
            {['no_cook', 'minimal_cook', 'full_cook'].map((cookMethod) => {
              const methodMeals = aiResponse.meals.filter(m => m.category === cookMethod);
              if (methodMeals.length === 0) return null;

              return (
                <div key={cookMethod} className="space-y-4">
                  {/* Cooking Method Header */}
                  <div className={`p-4 rounded-lg border-2 ${getCookingMethodColor(cookMethod)}`}>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <span className="text-2xl">{getCookingMethodIcon(cookMethod)}</span>
                      {cookMethod === 'no_cook' && 'No Cook Options (Fridge/Pantry)'}
                      {cookMethod === 'minimal_cook' && 'Minimal Cook Options (Microwave/Toaster)'}
                      {cookMethod === 'full_cook' && 'Full Cook Options (Pan/Oven/Bake)'}
                    </h3>
                  </div>

                  {/* Meals in this category */}
                  {methodMeals.map((meal, index) => {
                    // Defensive checks for meal properties
                    if (!meal || !meal.title) {
                      console.warn('Skipping invalid meal at index', index);
                      return null;
                    }

                    const totalTime = (meal.prep_time_min || 0) + (meal.cook_time_min || 0);
                    const performanceTags = Array.isArray(meal.performance_tags) ? meal.performance_tags : [];
                    const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients : [];
                    const instructions = Array.isArray(meal.instructions) ? meal.instructions : [];

                    return (
                      <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* Meal Header */}
                        <div className={`p-4 border-l-4 ${getCookingMethodColor(meal.category || 'freestyle')}`}>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getCookingMethodIcon(meal.category || 'freestyle')}</span>
                              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                {meal.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              {totalTime > 0 && (
                                <span className="bg-white px-3 py-1 rounded-full font-medium">
                                  ⏱️ {totalTime} min total
                                </span>
                              )}
                              {meal.skill_level && (
                                <span className="bg-blue-100 px-3 py-1 rounded-full font-medium text-blue-800">
                                  {meal.skill_level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Meal Details */}
                        <div className="p-4 sm:p-5">
                          {/* Performance Tags */}
                          {performanceTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {performanceTags.map((tag, i) => (
                                <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  ⚡ {tag.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Macros */}
                          {meal.macros_per_serving && (
                            <div className="grid grid-cols-4 gap-2 mb-4">
                              <div className="text-center bg-blue-50 rounded-lg p-2">
                                <div className="text-xs text-gray-600">Calories</div>
                                <div className="text-lg font-bold text-blue-600">{Math.round(meal.macros_per_serving.cal || 0)}</div>
                              </div>
                              <div className="text-center bg-green-50 rounded-lg p-2">
                                <div className="text-xs text-gray-600">Protein</div>
                                <div className="text-lg font-bold text-green-600">{Math.round(meal.macros_per_serving.protein_g || 0)}g</div>
                              </div>
                              <div className="text-center bg-yellow-50 rounded-lg p-2">
                                <div className="text-xs text-gray-600">Carbs</div>
                                <div className="text-lg font-bold text-yellow-600">{Math.round(meal.macros_per_serving.carb_g || 0)}g</div>
                              </div>
                              <div className="text-center bg-purple-50 rounded-lg p-2">
                                <div className="text-xs text-gray-600">Fat</div>
                                <div className="text-lg font-bold text-purple-600">{Math.round(meal.macros_per_serving.fat_g || 0)}g</div>
                              </div>
                            </div>
                          )}

                          {/* Serving Size Scaler */}
                          <div className="mb-4 bg-gray-50 rounded-lg p-3 border-2 border-gray-200">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                              <div className="flex items-center gap-3">
                                <label className="font-bold text-gray-900 text-sm">
                                  🍽️ Servings:
                                </label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateMealServings(meal.title, getMealServings(meal.title) - 1)}
                                    className="w-8 h-8 bg-white border-2 border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-100 active:scale-95 transition-all"
                                  >
                                    −
                                  </button>
                                  <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                                    {getMealServings(meal.title)}
                                  </span>
                                  <button
                                    onClick={() => updateMealServings(meal.title, getMealServings(meal.title) + 1)}
                                    className="w-8 h-8 bg-white border-2 border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-100 active:scale-95 transition-all"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                              {meal.serving_size_explanation && (
                                <p className="text-sm font-semibold text-gray-900">
                                  💡 {meal.serving_size_explanation}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Ingredients */}
                          {ingredients.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-bold text-gray-900 mb-2 text-base">🛒 Ingredients ({getMealServings(meal.title)} serving{getMealServings(meal.title) > 1 ? 's' : ''}):</h4>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                {ingredients.map((ingredient, i) => {
                                  const servings = getMealServings(meal.title);
                                  const scaledQuantity = (ingredient?.quantity || 0) * servings;
                                  return (
                                    <li key={i} className="flex items-start bg-gray-50 p-2 rounded-lg border border-gray-200">
                                      <span className="text-green-600 mr-2 font-bold">•</span>
                                      <span className="font-semibold text-gray-900">
                                        {scaledQuantity > 0 ? scaledQuantity.toFixed(1) : ''} {ingredient?.unit || ''} {ingredient?.canonical_name || ingredient?.user_input || 'Unknown ingredient'}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}

                          {/* Instructions */}
                          {instructions.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-bold text-gray-900 mb-2 text-base">📝 Instructions:</h4>
                              <ol className="list-decimal list-inside space-y-2 text-sm">
                                {instructions.map((step, i) => (
                                  <li key={i} className="font-semibold text-gray-900 leading-relaxed">
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Notes */}
                          {meal.notes && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-4 border-2 border-blue-200">
                              <p className="text-sm font-semibold text-gray-900 italic">💡 {meal.notes}</p>
                            </div>
                          )}

                          {/* Save Button */}
                          <button
                            onClick={() => saveMeal(meal)}
                            disabled={isMealSaved(meal.title)}
                            className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                              isMealSaved(meal.title)
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
                            }`}
                          >
                            {isMealSaved(meal.title) ? '✓ Saved' : '💾 Save This Recipe'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Browse All Recipes */}
            <div className="text-center mt-6">
              <Link
                to="/recipes"
                className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-md"
              >
                Browse Full Recipe Library →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealGenerator;
