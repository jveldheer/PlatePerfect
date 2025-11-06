import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SavedRecipes() {
  const [savedMeals, setSavedMeals] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('veldheerfuellab_saved_meals');
    if (saved) {
      setSavedMeals(JSON.parse(saved));
    }
  }, []);

  const deleteMeal = (index: number) => {
    const newSavedMeals = savedMeals.filter((_, i) => i !== index);
    setSavedMeals(newSavedMeals);
    localStorage.setItem('veldheerfuellab_saved_meals', JSON.stringify(newSavedMeals));
  };

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
      case 'no-cook': return 'No Cook (Fridge/Pantry)';
      case 'minimal-cook': return 'Minimal Cook (Microwave/Toaster)';
      case 'normal-cook': return 'Full Cook (Pan/Oven/Bake)';
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
            💾 Saved Recipes
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Your collection of saved meal ideas from the AI generator
          </p>
        </div>

        {/* Empty State */}
        {savedMeals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Saved Recipes Yet</h2>
            <p className="text-gray-600 mb-6">
              Use the Fuel Generator to create meal ideas and save your favorites!
            </p>
            <Link
              to="/meal-generator"
              className="inline-block bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-md"
            >
              Go to Fuel Generator
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Organize by cooking method */}
            {['no-cook', 'minimal-cook', 'normal-cook'].map((cookMethod) => {
              const methodMeals = savedMeals.filter(m => m.cookingMethod === cookMethod);
              if (methodMeals.length === 0) return null;

              return (
                <div key={cookMethod} className="space-y-4">
                  {/* Cooking Method Header */}
                  <div className={`p-4 rounded-lg border-2 ${getCookingMethodColor(cookMethod)}`}>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <span className="text-2xl">{getCookingMethodIcon(cookMethod)}</span>
                      {getCookingMethodLabel(cookMethod)}
                    </h3>
                  </div>

                  {/* Meals in this category */}
                  {methodMeals.map((meal) => {
                    const globalIndex = savedMeals.indexOf(meal);
                    return (
                      <div key={globalIndex} className="bg-white rounded-xl shadow-md overflow-hidden">
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
                              {meal.ingredients.map((ingredient: string, i: number) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  <span>{ingredient}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Instructions */}
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-800 mb-2">📝 Instructions:</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {meal.instructions}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => deleteMeal(globalIndex)}
                            className="w-full py-2 px-4 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all active:scale-95"
                          >
                            🗑️ Remove from Saved
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* Back to Generator */}
        {savedMeals.length > 0 && (
          <div className="text-center mt-8">
            <Link
              to="/meal-generator"
              className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all shadow-md"
            >
              ← Back to Fuel Generator
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedRecipes;
