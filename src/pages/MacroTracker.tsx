import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMacros } from '../contexts/MacroContext';

export default function MacroTracker() {
  const { userProfile, macroGoals, consumedMacros, resetTracker, getGoalDirection, addToTracker } = useMacros();

  // Manual entry form state
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const caloriesNum = parseFloat(calories) || 0;
    const proteinNum = parseFloat(protein) || 0;
    const carbsNum = parseFloat(carbs) || 0;
    const fatNum = parseFloat(fat) || 0;

    // Add to tracker
    addToTracker({
      calories: caloriesNum,
      protein: proteinNum,
      carbs: carbsNum,
      fat: fatNum,
    });

    // Reset form
    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Optionally close the form
    setShowManualEntry(false);
  };

  if (!userProfile || !macroGoals) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <span className="text-5xl sm:text-6xl mb-4 block">🎯</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Set Up Your Macro Goals
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Calculate your personalized daily macros to start tracking your nutrition and reaching your goals.
          </p>
          <Link
            to="/profile"
            className="btn-primary min-h-[44px] inline-flex items-center justify-center touch-manipulation"
          >
            Calculate My Macros
          </Link>
        </div>
      </div>
    );
  }

  const goalDirection = getGoalDirection();

  const calculatePercentage = (consumed: number, goal: number) => {
    return Math.min((consumed / goal) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-red-500';
    if (percentage < 90) return 'bg-yellow-500';
    if (percentage <= 110) return 'bg-green-500';
    return 'bg-orange-500';
  };

  const caloriesPercent = calculatePercentage(consumedMacros.calories, macroGoals.calories);
  const proteinPercent = calculatePercentage(consumedMacros.protein_g, macroGoals.protein_g);
  const carbsPercent = calculatePercentage(consumedMacros.carbs_g, macroGoals.carbs_g);
  const fatPercent = calculatePercentage(consumedMacros.fat_g, macroGoals.fat_g);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Macro Tracker
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Track your daily nutrition progress
        </p>
      </div>

      {/* Goal Summary */}
      <div className="bg-gradient-to-br from-primary-50 to-athletic-50 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base text-gray-600">Your Goal</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
              {goalDirection}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {userProfile.currentWeightLb} lbs → {userProfile.targetWeightLb} lbs
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Link
              to="/recipes"
              className="px-4 py-2 min-h-[44px] bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors touch-manipulation inline-flex items-center"
            >
              Browse Recipes
            </Link>
            <button
              onClick={resetTracker}
              className="px-4 py-2 min-h-[44px] bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors touch-manipulation"
            >
              Reset Day
            </button>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 animate-fade-in">
          <div className="flex items-center">
            <span className="text-2xl mr-3">✅</span>
            <p className="text-green-800 font-medium">
              Successfully added to your daily tracker!
            </p>
          </div>
        </div>
      )}

      {/* Manual Entry */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={() => setShowManualEntry(!showManualEntry)}
          className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">✏️</span>
            <div className="text-left">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                Log Custom Meal
              </h3>
              <p className="text-sm text-gray-600">
                Manually add calories from other foods
              </p>
            </div>
          </div>
          <span className="text-2xl text-gray-400">
            {showManualEntry ? '▼' : '▶'}
          </span>
        </button>

        {showManualEntry && (
          <form onSubmit={handleManualSubmit} className="px-4 sm:px-6 pb-6 border-t border-gray-200">
            <div className="pt-4 space-y-4">
              {/* Meal Name (Optional) */}
              <div>
                <label htmlFor="mealName" className="block text-sm font-medium text-gray-700 mb-1">
                  Meal Name (Optional)
                </label>
                <input
                  type="text"
                  id="mealName"
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="e.g., Chipotle Bowl, Protein Bar, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Macros Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Calories */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">
                    Calories <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="calories"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Protein */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">
                    Protein (g) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="protein"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                {/* Carbs */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">
                    Carbs (g) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="carbs"
                    value={carbs}
                    onChange={(e) => setCarbs(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Fat */}
                <div className="col-span-2 sm:col-span-1">
                  <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">
                    Fat (g) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="fat"
                    value={fat}
                    onChange={(e) => setFat(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.1"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 min-h-[44px] bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors touch-manipulation"
                >
                  Add to Tracker
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMealName('');
                    setCalories('');
                    setProtein('');
                    setCarbs('');
                    setFat('');
                  }}
                  className="px-4 py-3 min-h-[44px] bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors touch-manipulation"
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Macro Progress */}
      <div className="space-y-4 sm:space-y-6">
        {/* Calories */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Calories</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {Math.round(consumedMacros.calories)} / {macroGoals.calories} kcal
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-bold text-primary-600">
                {Math.round(caloriesPercent)}%
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {macroGoals.calories - Math.round(consumedMacros.calories)} left
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${getProgressColor(caloriesPercent)}`}
              style={{ width: `${caloriesPercent}%` }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Protein</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {Math.round(consumedMacros.protein_g)} / {macroGoals.protein_g}g
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-bold text-red-600">
                {Math.round(proteinPercent)}%
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {macroGoals.protein_g - Math.round(consumedMacros.protein_g)}g left
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 bg-red-500`}
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Carbs</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {Math.round(consumedMacros.carbs_g)} / {macroGoals.carbs_g}g
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                {Math.round(carbsPercent)}%
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {macroGoals.carbs_g - Math.round(consumedMacros.carbs_g)}g left
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 bg-yellow-500`}
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
        </div>

        {/* Fat */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Fat</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {Math.round(consumedMacros.fat_g)} / {macroGoals.fat_g}g
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {Math.round(fatPercent)}%
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {macroGoals.fat_g - Math.round(consumedMacros.fat_g)}g left
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 bg-blue-500`}
              style={{ width: `${fatPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-l-4 border-blue-500">
        <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-2 flex items-center">
          <span className="text-xl sm:text-2xl mr-2">💡</span>
          Tracking Tips
        </h4>
        <ul className="space-y-2 text-sm sm:text-base text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Green = On track (90-110% of goal)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Yellow = Getting close (70-90% of goal)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Red = Need more (below 70%)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Orange = Over goal (above 110%)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
