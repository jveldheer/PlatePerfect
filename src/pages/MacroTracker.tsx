import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMacros } from '../contexts/MacroContext';

export default function MacroTracker() {
  const { userProfile, macroGoals, consumedMacros, resetTracker, getGoalDirection, addToTracker } = useMacros();

  // Manual logging state
  const [showManualLog, setShowManualLog] = useState(false);
  const [manualCalories, setManualCalories] = useState('');
  const [manualProtein, setManualProtein] = useState('');
  const [manualCarbs, setManualCarbs] = useState('');
  const [manualFat, setManualFat] = useState('');

  const handleManualLog = () => {
    const calories = parseFloat(manualCalories) || 0;
    const protein = parseFloat(manualProtein) || 0;
    const carbs = parseFloat(manualCarbs) || 0;
    const fat = parseFloat(manualFat) || 0;

    if (calories > 0 || protein > 0 || carbs > 0 || fat > 0) {
      addToTracker({ calories, protein, carbs, fat });
      // Reset form
      setManualCalories('');
      setManualProtein('');
      setManualCarbs('');
      setManualFat('');
      setShowManualLog(false);
    }
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4" style={{
          fontFamily: 'Bebas Neue, sans-serif',
          color: 'var(--yellow)',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Macro Tracker
        </h1>
        <p className="text-base sm:text-lg font-semibold" style={{ color: 'var(--light-text)' }}>
          Track your daily nutrition progress
        </p>
      </div>

      {/* Goal Summary */}
      <div className="bg-gradient-to-br from-primary-50 to-athletic-50 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base text-gray-700 font-semibold">Your Goal</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
              {goalDirection}
            </p>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">
              {userProfile.currentWeightLb} lbs → {userProfile.targetWeightLb} lbs
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <button
              onClick={() => setShowManualLog(!showManualLog)}
              className="px-4 py-2 min-h-[44px] bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors touch-manipulation inline-flex items-center"
            >
              ➕ Log Food
            </button>
            <Link
              to="/recipes"
              className="px-4 py-2 min-h-[44px] bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700 transition-colors touch-manipulation inline-flex items-center"
            >
              Browse Recipes
            </Link>
            <button
              onClick={resetTracker}
              className="px-4 py-2 min-h-[44px] bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors touch-manipulation"
            >
              Reset Day
            </button>
          </div>
        </div>
      </div>

      {/* Manual Logging Form */}
      {showManualLog && (
        <div className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 border-4 border-green-500">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Log Food Manually</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Calories (kcal)</label>
              <input
                type="number"
                value={manualCalories}
                onChange={(e) => setManualCalories(e.target.value)}
                placeholder="e.g., 450"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 text-gray-900 font-semibold text-lg"
                style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Protein (g)</label>
              <input
                type="number"
                value={manualProtein}
                onChange={(e) => setManualProtein(e.target.value)}
                placeholder="e.g., 30"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 text-gray-900 font-semibold text-lg"
                style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Carbs (g)</label>
              <input
                type="number"
                value={manualCarbs}
                onChange={(e) => setManualCarbs(e.target.value)}
                placeholder="e.g., 45"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-gray-900 font-semibold text-lg"
                style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Fat (g)</label>
              <input
                type="number"
                value={manualFat}
                onChange={(e) => setManualFat(e.target.value)}
                placeholder="e.g., 15"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 font-semibold text-lg"
                style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleManualLog}
              className="flex-1 px-6 py-3 min-h-[44px] bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors touch-manipulation text-lg"
            >
              Add to Tracker
            </button>
            <button
              onClick={() => setShowManualLog(false)}
              className="px-6 py-3 min-h-[44px] bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
      <div className="bg-blue-900 rounded-xl p-4 sm:p-6 border-4 border-blue-500 shadow-lg">
        <h4 className="text-base sm:text-lg font-bold mb-3 flex items-center" style={{ color: 'var(--yellow)' }}>
          <span className="text-xl sm:text-2xl mr-2">💡</span>
          Tracking Tips
        </h4>
        <ul className="space-y-2 text-sm sm:text-base font-semibold" style={{ color: 'var(--white)' }}>
          <li className="flex items-start">
            <span className="mr-2 text-green-400">●</span>
            <span>Green = On track (90-110% of goal)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-yellow-400">●</span>
            <span>Yellow = Getting close (70-90% of goal)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-red-400">●</span>
            <span>Red = Need more (below 70%)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-orange-400">●</span>
            <span>Orange = Over goal (above 110%)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
