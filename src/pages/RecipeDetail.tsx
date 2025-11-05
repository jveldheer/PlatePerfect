import { useParams, Link, useNavigate } from 'react-router-dom';
import { recipes } from '../data/recipes';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
        <Link to="/recipes" className="btn-primary">
          Back to Recipes
        </Link>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/recipes')}
        className="mb-6 flex items-center text-primary-600 hover:text-primary-700 font-medium"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Recipes
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-athletic-100 text-athletic-800">
            {getCategoryLabel(recipe.category)}
          </span>
          {recipe.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {recipe.title}
        </h1>

        <p className="text-lg text-gray-600 mb-6">
          {recipe.description}
        </p>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Prep Time</p>
            <p className="text-xl font-bold text-gray-900">{recipe.prepTime} min</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Cook Time</p>
            <p className="text-xl font-bold text-gray-900">{recipe.cookTime} min</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Total Time</p>
            <p className="text-xl font-bold text-gray-900">{recipe.prepTime + recipe.cookTime} min</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Servings</p>
            <p className="text-xl font-bold text-gray-900">{recipe.servings}</p>
          </div>
        </div>
      </div>

      {/* Athlete Notes */}
      <div className="bg-athletic-50 rounded-xl shadow-lg p-8 mb-6 border-l-4 border-athletic-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-3xl mr-3">💪</span>
          Why This Recipe for Athletes
        </h2>
        <p className="text-gray-800 leading-relaxed">
          {recipe.athleteNotes}
        </p>
      </div>

      {/* TikTok Video */}
      {recipe.videoUrl && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-3xl mr-3">🎥</span>
            Video Tutorial
          </h2>
          <a
            href={recipe.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mx-auto max-w-2xl group"
          >
            <div className="bg-gradient-to-br from-[#25F4EE] via-[#FE2C55] to-[#000000] p-1 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
              <div className="bg-white rounded-xl p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#25F4EE] to-[#FE2C55] rounded-xl flex items-center justify-center">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">Watch on TikTok</p>
                      <p className="text-sm text-gray-600">Click to view full recipe video</p>
                    </div>
                  </div>
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-[#FE2C55] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Opens in a new tab
                  </p>
                </div>
              </div>
            </div>
          </a>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Nutrition Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-2">📊</span>
              Nutrition Facts
            </h2>
            <p className="text-sm text-gray-500 mb-4">Per Serving</p>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b-2 border-gray-900">
                <span className="font-semibold text-gray-700">Calories</span>
                <span className="text-xl font-bold text-gray-900">
                  {recipe.nutritionInfo.calories}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Protein</span>
                <span className="font-semibold text-primary-600">
                  {recipe.nutritionInfo.protein}g
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Carbohydrates</span>
                <span className="font-semibold text-primary-600">
                  {recipe.nutritionInfo.carbs}g
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">Fat</span>
                <span className="font-semibold text-primary-600">
                  {recipe.nutritionInfo.fat}g
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Fiber</span>
                <span className="font-semibold text-primary-600">
                  {recipe.nutritionInfo.fiber}g
                </span>
              </div>
            </div>

            {/* Macros Visual */}
            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Macronutrient Breakdown</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Protein</span>
                    <span>{Math.round((recipe.nutritionInfo.protein * 4 / recipe.nutritionInfo.calories) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${Math.round((recipe.nutritionInfo.protein * 4 / recipe.nutritionInfo.calories) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Carbs</span>
                    <span>{Math.round((recipe.nutritionInfo.carbs * 4 / recipe.nutritionInfo.calories) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-athletic-600 h-2 rounded-full"
                      style={{ width: `${Math.round((recipe.nutritionInfo.carbs * 4 / recipe.nutritionInfo.calories) * 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Fat</span>
                    <span>{Math.round((recipe.nutritionInfo.fat * 9 / recipe.nutritionInfo.calories) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${Math.round((recipe.nutritionInfo.fat * 9 / recipe.nutritionInfo.calories) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients and Instructions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ingredients */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🛒</span>
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-medium text-gray-900">{ingredient.amount}</span>
                    {' '}
                    <span className="text-gray-700">{ingredient.item}</span>
                    {ingredient.notes && (
                      <span className="text-sm text-gray-500 italic"> ({ingredient.notes})</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">👨‍🍳</span>
              Instructions
            </h2>
            <div className="space-y-8">
              {recipe.instructions.map((step) => (
                <div key={step.step} className="flex">
                  <div className="flex-shrink-0 w-10 h-10 bg-athletic-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.instruction}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      {step.detailedExplanation}
                    </p>
                    {step.skillTip && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm text-blue-900">
                          <span className="font-semibold">💡 Skill Tip:</span> {step.skillTip}
                        </p>
                      </div>
                    )}
                    {step.timeEstimate && (
                      <p className="mt-2 text-sm text-gray-500 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Approximately {step.timeEstimate} minute{step.timeEstimate !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Meal Prep & Storage */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-50 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📦</span>
            Meal Prep Notes
          </h2>
          <p className="text-gray-800 leading-relaxed">
            {recipe.mealPrepNotes}
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🧊</span>
            Storage Instructions
          </h2>
          <p className="text-gray-800 leading-relaxed">
            {recipe.storageInstructions}
          </p>
        </div>
      </div>

      {/* Required Skills */}
      {recipe.requiredSkills.length > 0 && (
        <div className="bg-primary-50 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">📚</span>
            Skills You'll Practice
          </h2>
          <p className="text-gray-700 mb-4">
            This recipe uses the following cooking skills. Review them before you start:
          </p>
          <div className="flex flex-wrap gap-3">
            {recipe.requiredSkills.map((skillId) => (
              <Link
                key={skillId}
                to={`/skills/${skillId}`}
                className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-primary-600 font-medium hover:bg-primary-50"
              >
                View Skill →
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
