import { useState, useEffect } from 'react';
import { useMacros } from '../contexts/MacroContext';

export default function Profile() {
  const { userProfile, setUserProfile, macroGoals, getGoalDirection } = useMacros();

  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('16');
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setCurrentWeight(userProfile.currentWeightLb.toString());
      setTargetWeight(userProfile.targetWeightLb.toString());
      setActivityLevel(userProfile.activityKcalPerLb.toString());
      setShowResults(true);
    }
  }, [userProfile]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    const current = parseFloat(currentWeight);
    const target = parseFloat(targetWeight);
    const activity = parseFloat(activityLevel);

    if (isNaN(current) || current <= 0) {
      alert('Please enter a valid current weight');
      return;
    }

    if (isNaN(target) || target <= 0) {
      alert('Please enter a valid target weight');
      return;
    }

    if (isNaN(activity) || activity < 12 || activity > 20) {
      alert('Please enter an activity level between 12 and 20');
      return;
    }

    setUserProfile({
      currentWeightLb: current,
      targetWeightLb: target,
      activityKcalPerLb: activity,
    });

    setShowResults(true);
  };

  const goalDirection = getGoalDirection();

  const getGoalBadgeColor = () => {
    if (goalDirection === 'cutting') return 'bg-blue-100 text-blue-800';
    if (goalDirection === 'gaining') return 'bg-green-100 text-green-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getGoalIcon = () => {
    if (goalDirection === 'cutting') return '📉';
    if (goalDirection === 'gaining') return '📈';
    return '➡️';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Your Macro Goals
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate personalized daily macros based on your current weight, target weight, and activity level.
        </p>
      </div>

      {/* Calculator Form */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
          <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🎯</span>
          Calculate Your Macros
        </h2>

        <form onSubmit={handleCalculate} className="space-y-4 sm:space-y-6">
          {/* Current Weight */}
          <div>
            <label htmlFor="currentWeight" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Current Weight (lbs)
            </label>
            <input
              type="number"
              id="currentWeight"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              placeholder="e.g., 180"
              className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              step="0.1"
              required
            />
          </div>

          {/* Target Weight */}
          <div>
            <label htmlFor="targetWeight" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Target Weight (lbs)
            </label>
            <input
              type="number"
              id="targetWeight"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="e.g., 170"
              className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
              step="0.1"
              required
            />
          </div>

          {/* Activity Level */}
          <div>
            <label htmlFor="activityLevel" className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
              Activity Level (kcal per lb)
            </label>
            <select
              id="activityLevel"
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full px-4 py-3 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base"
            >
              <option value="13">Low Activity (13 kcal/lb) - Sedentary</option>
              <option value="15">Light Activity (15 kcal/lb) - 1-2 workouts/week</option>
              <option value="16">Moderate Activity (16 kcal/lb) - 3-4 workouts/week</option>
              <option value="17">High Activity (17 kcal/lb) - 5-6 workouts/week</option>
              <option value="18">Very High Activity (18 kcal/lb) - Daily training</option>
            </select>
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              Choose based on your weekly training volume and daily activity
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary min-h-[44px] text-base sm:text-lg font-semibold touch-manipulation"
          >
            Calculate My Macros
          </button>
        </form>
      </div>

      {/* Results */}
      {showResults && macroGoals && (
        <div className="space-y-4 sm:space-y-6">
          {/* Goal Direction Badge */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl sm:text-4xl">{getGoalIcon()}</span>
              <div>
                <p className="text-sm sm:text-base text-gray-600">Your Goal</p>
                <p className={`text-lg sm:text-xl font-bold capitalize px-3 py-1 rounded-full inline-block ${getGoalBadgeColor()}`}>
                  {goalDirection}
                </p>
              </div>
            </div>
            {macroGoals.debug.deltaLb > 0 && (
              <p className="text-center text-sm sm:text-base text-gray-600 mt-3">
                {Math.abs(macroGoals.debug.deltaLb)} lbs {goalDirection === 'gaining' ? 'to gain' : 'to lose'}
              </p>
            )}
          </div>

          {/* Daily Macro Goals */}
          <div className="bg-gradient-to-br from-primary-50 to-athletic-50 rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Your Daily Macro Goals
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {/* Calories */}
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Calories</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-600">
                  {macroGoals.calories}
                </p>
                <p className="text-xs text-gray-500 mt-1">kcal</p>
              </div>

              {/* Protein */}
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Protein</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">
                  {macroGoals.protein_g}g
                </p>
                <p className="text-xs text-gray-500 mt-1">grams</p>
              </div>

              {/* Carbs */}
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Carbs</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-600">
                  {macroGoals.carbs_g}g
                </p>
                <p className="text-xs text-gray-500 mt-1">grams</p>
              </div>

              {/* Fat */}
              <div className="bg-white rounded-xl p-4 sm:p-6 text-center shadow">
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Fat</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600">
                  {macroGoals.fat_g}g
                </p>
                <p className="text-xs text-gray-500 mt-1">grams</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white bg-opacity-50 rounded-lg">
              <p className="text-sm sm:text-base text-gray-700 text-center">
                <strong>Daily {goalDirection === 'cutting' ? 'Deficit' : goalDirection === 'gaining' ? 'Surplus' : 'Maintenance'}:</strong>{' '}
                {Math.abs(macroGoals.debug.calorieDeltaApplied)} calories
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border-l-4 border-blue-500">
            <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-2 flex items-center">
              <span className="text-xl sm:text-2xl mr-2">💡</span>
              How to Use Your Macros
            </h4>
            <ul className="space-y-2 text-sm sm:text-base text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Navigate to the Macro Tracker to see your daily progress</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Click "Add to Tracker" on any recipe to track your meals</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Protein is set at 1g per lb of your target weight for muscle support</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Update your profile anytime as you progress toward your goal</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
