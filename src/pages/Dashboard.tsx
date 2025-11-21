import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMacros } from '../contexts/MacroContext';

export default function Dashboard() {
  const { userProfile, setUserProfile, macroGoals, consumedMacros, getGoalDirection } = useMacros();

  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('16');
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setCurrentWeight(userProfile.currentWeightLb.toString());
      setTargetWeight(userProfile.targetWeightLb.toString());
      setActivityLevel(userProfile.activityKcalPerLb.toString());
    } else {
      setShowCalculator(true);
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

    setShowCalculator(false);
  };

  const goalDirection = getGoalDirection();

  const calculatePercentage = (consumed: number, goal: number) => {
    return Math.min((consumed / goal) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return 'bg-red-500';
    if (percentage < 90) return 'bg-yellow-500';
    if (percentage <= 110) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
          🏋️ Fuel Lab Dashboard
        </h1>
        <p className="text-lg text-gray-200 max-w-3xl mx-auto">
          Track your nutrition, reach your goals, and fuel your performance.
        </p>
      </div>

      {/* Main Dashboard Grid */}
      {!showCalculator && macroGoals ? (
        <>
          {/* Today's Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="vlv-heading text-2xl">Today's Progress</h2>
              <Link to="/add-food" className="btn-primary text-sm py-2 px-4">
                + Add Food
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Calories */}
              <div className="rounded-xl p-4" style={{
                backgroundColor: '#1A1A1A',
                border: '3px solid var(--yellow)'
              }}>
                <p className="vlv-subtext text-xs mb-2">Calories</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--yellow)' }}>
                  {consumedMacros.calories} / {macroGoals.calories}
                </p>
                <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getProgressColor(calculatePercentage(consumedMacros.calories, macroGoals.calories))}`}
                    style={{ width: `${calculatePercentage(consumedMacros.calories, macroGoals.calories)}%` }}
                  />
                </div>
              </div>

              {/* Protein */}
              <div className="rounded-xl p-4" style={{
                backgroundColor: '#1A1A1A',
                border: '3px solid var(--red)'
              }}>
                <p className="vlv-subtext text-xs mb-2">Protein</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--red)' }}>
                  {consumedMacros.protein_g}g / {macroGoals.protein_g}g
                </p>
                <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getProgressColor(calculatePercentage(consumedMacros.protein_g, macroGoals.protein_g))}`}
                    style={{ width: `${calculatePercentage(consumedMacros.protein_g, macroGoals.protein_g)}%` }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div className="rounded-xl p-4" style={{
                backgroundColor: '#1A1A1A',
                border: '3px solid #FFD700'
              }}>
                <p className="vlv-subtext text-xs mb-2">Carbs</p>
                <p className="text-2xl font-bold" style={{ color: '#FFD700' }}>
                  {consumedMacros.carbs_g}g / {macroGoals.carbs_g}g
                </p>
                <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getProgressColor(calculatePercentage(consumedMacros.carbs_g, macroGoals.carbs_g))}`}
                    style={{ width: `${calculatePercentage(consumedMacros.carbs_g, macroGoals.carbs_g)}%` }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div className="rounded-xl p-4" style={{
                backgroundColor: '#1A1A1A',
                border: '3px solid var(--blue)'
              }}>
                <p className="vlv-subtext text-xs mb-2">Fat</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--blue)' }}>
                  {consumedMacros.fat_g}g / {macroGoals.fat_g}g
                </p>
                <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getProgressColor(calculatePercentage(consumedMacros.fat_g, macroGoals.fat_g))}`}
                    style={{ width: `${calculatePercentage(consumedMacros.fat_g, macroGoals.fat_g)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="vlv-subtext text-sm">
                  Goal: <span className="capitalize font-bold" style={{ color: 'var(--yellow)' }}>{goalDirection}</span>
                </p>
                <p className="vlv-subtext text-xs mt-1">
                  {userProfile?.currentWeightLb} lbs → {userProfile?.targetWeightLb} lbs
                </p>
              </div>
              <button
                onClick={() => setShowCalculator(true)}
                className="vlv-text text-sm underline hover:text-yellow-400"
              >
                Recalculate Goals
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/recipes" className="card p-6 hover:scale-105 transition-transform text-center">
              <span className="text-4xl mb-3 block">🍳</span>
              <h3 className="vlv-heading text-xl mb-2">Browse Recipes</h3>
              <p className="vlv-subtext text-sm">Find meals that fit your macros</p>
            </Link>

            <Link to="/meal-generator" className="card p-6 hover:scale-105 transition-transform text-center">
              <span className="text-4xl mb-3 block">🤖</span>
              <h3 className="vlv-heading text-xl mb-2">AI Meal Generator</h3>
              <p className="vlv-subtext text-sm">Generate custom meal ideas</p>
            </Link>

            <Link to="/skills" className="card p-6 hover:scale-105 transition-transform text-center">
              <span className="text-4xl mb-3 block">📚</span>
              <h3 className="vlv-heading text-xl mb-2">Learn Skills</h3>
              <p className="vlv-subtext text-sm">Master cooking techniques</p>
            </Link>
          </div>
        </>
      ) : (
        /* Macro Calculator */
        <div className="card max-w-2xl mx-auto">
          <h2 className="vlv-heading text-3xl mb-6 flex items-center gap-3">
            <span className="text-4xl">🎯</span>
            Calculate Your Macros
          </h2>

          <p className="vlv-text mb-6">
            Set up your personalized daily macro goals based on your current weight, target weight, and activity level.
          </p>

          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Current Weight */}
            <div>
              <label htmlFor="currentWeight">
                Current Weight (lbs)
              </label>
              <input
                type="number"
                id="currentWeight"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="e.g., 180"
                step="0.1"
                required
              />
            </div>

            {/* Target Weight */}
            <div>
              <label htmlFor="targetWeight">
                Target Weight (lbs)
              </label>
              <input
                type="number"
                id="targetWeight"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                placeholder="e.g., 170"
                step="0.1"
                required
              />
            </div>

            {/* Activity Level */}
            <div>
              <label htmlFor="activityLevel">
                Activity Level (kcal per lb)
              </label>
              <select
                id="activityLevel"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
              >
                <option value="13">Low Activity (13 kcal/lb) - Sedentary</option>
                <option value="15">Light Activity (15 kcal/lb) - 1-2 workouts/week</option>
                <option value="16">Moderate Activity (16 kcal/lb) - 3-4 workouts/week</option>
                <option value="17">High Activity (17 kcal/lb) - 5-6 workouts/week</option>
                <option value="18">Very High Activity (18 kcal/lb) - Daily training</option>
              </select>
              <p className="vlv-subtext mt-2 text-sm">
                Choose based on your weekly training volume and daily activity
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
            >
              🎯 Calculate My Macros
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
