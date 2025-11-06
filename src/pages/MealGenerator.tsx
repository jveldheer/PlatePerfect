import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMacros } from '../contexts/MacroContext';
import { generateMealSuggestions } from '../utils/mealGenerator';
import { recipes } from '../data/recipes';

function MealGenerator() {
  const { macroGoals, consumedMacros } = useMacros();
  const [suggestions, setSuggestions] = useState<ReturnType<typeof generateMealSuggestions> | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Auto-generate when component loads
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    const result = generateMealSuggestions(macroGoals, consumedMacros);
    setSuggestions(result);
    setShowResults(true);
  };

  const remainingMacros = macroGoals && consumedMacros ? {
    calories: Math.max(0, macroGoals.calories - consumedMacros.calories),
    protein: Math.max(0, macroGoals.protein_g - consumedMacros.protein_g),
    carbs: Math.max(0, macroGoals.carbs_g - consumedMacros.carbs_g),
    fat: Math.max(0, macroGoals.fat_g - consumedMacros.fat_g)
  } : null;

  const getCookingMethodIcon = (method: string) => {
    switch (method) {
      case 'no-cook': return '🥗';
      case 'minimal-cook': return '⚡';
      case 'normal-cook': return '🍳';
      default: return '🍽️';
    }
  };

  const getCookingMethodLabel = (method: string) => {
    switch (method) {
      case 'no-cook': return 'No Cook';
      case 'minimal-cook': return 'Quick (Microwave/Toaster)';
      case 'normal-cook': return 'Normal Cook (Pan/Oven)';
      default: return method;
    }
  };

  const getCookingMethodColor = (method: string) => {
    switch (method) {
      case 'no-cook': return 'bg-green-50 border-green-500 text-green-800';
      case 'minimal-cook': return 'bg-blue-50 border-blue-500 text-blue-800';
      case 'normal-cook': return 'bg-orange-50 border-orange-500 text-orange-800';
      default: return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            🤖 AI Meal Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Get complete meal ideas personalized to your nutrition goals!
          </p>
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

        {/* Generate Button */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
            🎯 Generate Meal Ideas
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Click to generate 5 complete meal ideas based on your nutrition needs (no ingredients required!)
          </p>

          <button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-md active:scale-95"
          >
            ✨ Generate New Meal Ideas
          </button>
        </div>

        {/* Results */}
        {showResults && suggestions && (
          <div className="space-y-6">
            {/* Meal Type & Reason */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-lg p-6 text-white">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                {suggestions.mealType}
              </h2>
              <p className="text-base sm:text-lg opacity-95">
                {suggestions.reason}
              </p>
            </div>

            {/* Complete Meal Ideas */}
            <div className="space-y-4">
              {suggestions.meals.map((meal, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* Meal Header */}
                  <div className={`p-4 border-l-4 ${getCookingMethodColor(meal.cookingMethod)}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCookingMethodIcon(meal.cookingMethod)}</span>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                          {meal.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="bg-white px-3 py-1 rounded-full font-medium">
                          ⏱️ {meal.estimatedTime}
                        </span>
                        <span className={`px-3 py-1 rounded-full font-medium ${getCookingMethodColor(meal.cookingMethod)}`}>
                          {getCookingMethodLabel(meal.cookingMethod)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meal Details */}
                  <div className="p-4 sm:p-5">
                    {/* Macros */}
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="text-center bg-blue-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600">Calories</div>
                        <div className="text-lg font-bold text-blue-600">{meal.macros.calories}</div>
                      </div>
                      <div className="text-center bg-green-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600">Protein</div>
                        <div className="text-lg font-bold text-green-600">{meal.macros.protein}g</div>
                      </div>
                      <div className="text-center bg-yellow-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600">Carbs</div>
                        <div className="text-lg font-bold text-yellow-600">{meal.macros.carbs}g</div>
                      </div>
                      <div className="text-center bg-purple-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600">Fat</div>
                        <div className="text-lg font-bold text-purple-600">{meal.macros.fat}g</div>
                      </div>
                    </div>

                    {/* Ingredients */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">🛒 Ingredients:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-700">
                        {meal.ingredients.map((ingredient, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span>{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Instructions */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">📝 Quick Instructions:</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {meal.instructions}
                      </p>
                    </div>

                    {/* Matched Recipes */}
                    {meal.matchedRecipes && meal.matchedRecipes.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">📖 Similar Recipes:</h4>
                        <div className="flex flex-wrap gap-2">
                          {meal.matchedRecipes.map((recipeName, i) => {
                            const recipe = recipes.find(r => r.title === recipeName);
                            return recipe ? (
                              <Link
                                key={i}
                                to={`/recipes/${recipe.id}`}
                                className="text-xs bg-white text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                              >
                                {recipeName}
                              </Link>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Browse All Recipes */}
            <div className="text-center">
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
