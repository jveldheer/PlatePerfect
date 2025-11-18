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

  const getGoalBadgeStyle = () => {
    if (goalDirection === 'cutting') return { backgroundColor: '#3B82F6', color: '#FFFFFF' };
    if (goalDirection === 'gaining') return { backgroundColor: '#10B981', color: '#FFFFFF' };
    return { backgroundColor: 'var(--yellow)', color: '#000000' };
  };

  const getGoalIcon = () => {
    if (goalDirection === 'cutting') return '📉';
    if (goalDirection === 'gaining') return '📈';
    return '➡️';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="vlv-heading text-4xl mb-4">
          🎯 Your Macro Goals
        </h1>
        <p className="vlv-text max-w-2xl mx-auto">
          Calculate personalized daily macros based on your current weight, target weight, and activity level.
        </p>
      </div>

      {/* Calculator Form */}
      <div className="card">
        <h2 className="vlv-heading text-2xl mb-6 flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          Calculate Your Macros
        </h2>

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
            Calculate My Macros
          </button>
        </form>
      </div>

      {/* Results */}
      {showResults && macroGoals && (
        <div className="space-y-6">
          {/* Goal Direction Badge */}
          <div className="card text-center">
            <div className="flex flex-col items-center gap-3">
              <span className="text-5xl">{getGoalIcon()}</span>
              <div>
                <p className="vlv-subtext mb-2">Your Goal</p>
                <p className="text-xl font-bold capitalize px-4 py-2 rounded-full inline-block"
                   style={getGoalBadgeStyle()}>
                  {goalDirection}
                </p>
              </div>
            </div>
            {macroGoals.debug.deltaLb > 0 && (
              <p className="vlv-text mt-3">
                {Math.abs(macroGoals.debug.deltaLb)} lbs {goalDirection === 'gaining' ? 'to gain' : 'to lose'}
              </p>
            )}
          </div>

          {/* Daily Macro Goals */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, #2A2A2A 0%, #1A1A1A 100%)',
            borderColor: 'var(--yellow)'
          }}>
            <h3 className="vlv-heading text-2xl mb-6 text-center">
              Your Daily Macro Goals
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Calories */}
              <div className="rounded-xl p-6 text-center" style={{
                backgroundColor: '#1A1A1A',
                border: '3px solid var(--yellow)',
                boxShadow: '0 0 20px var(--glow)'
              }}>
                <p className="vlv-subtext text-sm mb-2">Calories</p>
                <p className="text-4xl font-bold" style={{ color: 'var(--yellow)' }}>
                  {macroGoals.calories}
                </p>
                <p className="vlv-subtext text-xs mt-1">kcal</p>
              </div>

              {/* Protein */}
              <div className="rounded-xl p-6 text-center" style={{
                backgroundColor: '#1A1A1A',
                border: '3px solid var(--red)',
                boxShadow: '0 0 20px rgba(255, 87, 34, 0.3)'
              }}>
                <p className="vlv-subtext text-sm mb-2">Protein</p>
                <p className="text-4xl font-bold" style={{ color: 'var(--red)' }}>
                  {macroGoals.protein_g}g
                </p>
                <p className="vlv-subtext text-xs mt-1">grams</p>
              </div>

              {/* Carbs */}
              <div className="rounded-xl p-6 text-center" style={{
                backgroundColor: '#1A1A1A',
                border: '3px solid #FFD700',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)'
              }}>
                <p className="vlv-subtext text-sm mb-2">Carbs</p>
                <p className="text-4xl font-bold" style={{ color: '#FFD700' }}>
                  {macroGoals.carbs_g}g
                </p>
                <p className="vlv-subtext text-xs mt-1">grams</p>
              </div>

              {/* Fat */}
              <div className="rounded-xl p-6 text-center" style={{
                backgroundColor: '#1A1A1A',
                border: '3px solid var(--blue)',
                boxShadow: '0 0 20px rgba(100, 181, 246, 0.3)'
              }}>
                <p className="vlv-subtext text-sm mb-2">Fat</p>
                <p className="text-4xl font-bold" style={{ color: 'var(--blue)' }}>
                  {macroGoals.fat_g}g
                </p>
                <p className="vlv-subtext text-xs mt-1">grams</p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg" style={{
              backgroundColor: '#1A1A1A',
              borderLeft: '4px solid var(--yellow)'
            }}>
              <p className="vlv-text text-center">
                <strong style={{ color: 'var(--yellow)' }}>
                  Daily {goalDirection === 'cutting' ? 'Deficit' : goalDirection === 'gaining' ? 'Surplus' : 'Maintenance'}:
                </strong>{' '}
                {Math.abs(macroGoals.debug.calorieDeltaApplied)} calories
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="card" style={{ borderLeft: '6px solid var(--blue)' }}>
            <h4 className="vlv-heading text-xl mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              How to Use Your Macros
            </h4>
            <ul className="space-y-2 vlv-text">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Navigate to the Macro Tracker to see your daily progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Click "Add to Tracker" on any recipe to track your meals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Protein is set at 1g per lb of your target weight for muscle support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Update your profile anytime as you progress toward your goal</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
