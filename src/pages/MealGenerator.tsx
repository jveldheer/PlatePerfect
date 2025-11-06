import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMacros } from '../contexts/MacroContext';
import { generateMealSuggestions } from '../utils/mealGenerator';
import { recipes } from '../data/recipes';
import type { Recipe } from '../types';

function MealGenerator() {
  const { macroGoals, consumedMacros } = useMacros();
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [suggestions, setSuggestions] = useState<ReturnType<typeof generateMealSuggestions> | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Auto-generate when component loads if user has macro goals
  useEffect(() => {
    if (macroGoals && consumedMacros) {
      handleGenerate();
    }
  }, []);

  const handleGenerate = () => {
    const ingredientList = ingredientsInput
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);

    const result = generateMealSuggestions(ingredientList, macroGoals, consumedMacros);
    setSuggestions(result);
    setShowResults(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  const quickIngredients = [
    ['chicken', 'rice', 'broccoli'],
    ['eggs', 'oats', 'banana'],
    ['salmon', 'sweet potato', 'asparagus'],
    ['ground turkey', 'beans', 'peppers'],
    ['greek yogurt', 'berries', 'granola'],
    ['protein powder', 'banana', 'spinach']
  ];

  const handleQuickSelect = (ingredientSet: string[]) => {
    setIngredientsInput(ingredientSet.join(', '));
    const result = generateMealSuggestions(ingredientSet, macroGoals, consumedMacros);
    setSuggestions(result);
    setShowResults(true);
  };

  const remainingMacros = macroGoals && consumedMacros ? {
    calories: Math.max(0, macroGoals.calories - consumedMacros.calories),
    protein: Math.max(0, macroGoals.protein_g - consumedMacros.protein_g),
    carbs: Math.max(0, macroGoals.carbs_g - consumedMacros.carbs_g),
    fat: Math.max(0, macroGoals.fat_g - consumedMacros.fat_g)
  } : null;

  const matchedRecipes = suggestions?.recipeMatches
    .map(title => recipes.find(r => r.title === title))
    .filter((r): r is Recipe => r !== undefined) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-20">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            🤖 AI Meal Generator
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Tell me what ingredients you have, and I'll suggest meals that fit your goals!
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

        {/* Ingredient Input */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
            🥘 What ingredients do you have?
          </h2>
          <div className="mb-4">
            <input
              type="text"
              value={ingredientsInput}
              onChange={(e) => setIngredientsInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., chicken, rice, broccoli, olive oil"
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Enter ingredients separated by commas
            </p>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-md active:scale-95"
          >
            ✨ Generate Meal Ideas
          </button>

          {/* Quick Select */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Quick Select Common Combinations:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickIngredients.map((ingredientSet, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSelect(ingredientSet)}
                  className="text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  {ingredientSet.join(', ')}
                </button>
              ))}
            </div>
          </div>
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

            {/* Suggested Macros */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                🎯 Target Macros for This Meal
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-xs sm:text-sm text-gray-600">Calories</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {suggestions.suggestedMacros.calories}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="text-xs sm:text-sm text-gray-600">Protein</div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {suggestions.suggestedMacros.protein}g
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="text-xs sm:text-sm text-gray-600">Carbs</div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                    {suggestions.suggestedMacros.carbs}g
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="text-xs sm:text-sm text-gray-600">Fat</div>
                  <div className="text-xl sm:text-2xl font-bold text-purple-600">
                    {suggestions.suggestedMacros.fat}g
                  </div>
                </div>
              </div>
            </div>

            {/* Meal Ideas */}
            {suggestions.mealIdeas.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  💡 Meal Ideas with Your Ingredients
                </h3>
                <ul className="space-y-2">
                  {suggestions.mealIdeas.map((idea, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700 text-sm sm:text-base">{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Matching Recipes */}
            {matchedRecipes.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  📖 Recipes You Can Make
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matchedRecipes.map((recipe) => (
                    <Link
                      key={recipe.id}
                      to={`/recipes/${recipe.id}`}
                      className="block bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-4 border-2 border-transparent hover:border-blue-500 transition-all hover:shadow-lg"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {recipe.title}
                      </h4>
                      <div className="flex flex-wrap gap-2 text-xs mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {recipe.nutritionInfo.protein}g protein
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                          {recipe.nutritionInfo.calories} cal
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {recipe.prepTime + recipe.cookTime} min
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {recipe.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {suggestions.tips.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                  💪 Pro Tips
                </h3>
                <ul className="space-y-2">
                  {suggestions.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-sm sm:text-base">{tip.split(' ')[0]}</span>
                      <span className="text-gray-700 text-sm sm:text-base">
                        {tip.split(' ').slice(1).join(' ')}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Browse All Recipes */}
            <div className="text-center">
              <Link
                to="/recipes"
                className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-md"
              >
                Browse All Recipes →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealGenerator;
