import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMacros } from '../contexts/MacroContext';
import BarcodeScanner from '../components/BarcodeScanner';
import { lookupBarcode, type NutritionData } from '../utils/openFoodFactsService';

export default function MacroTracker() {
  const { userProfile, macroGoals, consumedMacros, resetTracker, getGoalDirection, addToTracker } = useMacros();

  const [showScanner, setShowScanner] = useState(false);
  const [scannedFood, setScannedFood] = useState<NutritionData | null>(null);
  const [servings, setServings] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleScan = async (barcode: string) => {
    setShowScanner(false);
    setIsLoading(true);
    setError('');

    try {
      const foodData = await lookupBarcode(barcode);

      if (foodData) {
        setScannedFood(foodData);
        setServings(1);
      } else {
        setError('Product not found in database. Try scanning again or enter manually.');
      }
    } catch (err) {
      console.error('Error looking up barcode:', err);
      setError('Failed to look up product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFood = () => {
    if (scannedFood) {
      addToTracker({
        calories: scannedFood.calories,
        protein: scannedFood.protein,
        carbs: scannedFood.carbs,
        fat: scannedFood.fat
      }, servings);

      // Reset
      setScannedFood(null);
      setServings(1);
      setError('');
    }
  };

  const handleCloseModal = () => {
    setScannedFood(null);
    setServings(1);
    setError('');
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
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-end">
            <button
              onClick={() => setShowScanner(true)}
              className="px-4 py-2 min-h-[44px] bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors touch-manipulation inline-flex items-center gap-2"
            >
              <span>📷</span>
              <span>Scan Food</span>
            </button>
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
            <span>Use "Scan Food" to quickly add products by barcode</span>
          </li>
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

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleScan}
          onError={(err) => {
            setError(err);
            setShowScanner(false);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="animate-spin text-5xl mb-4">⏳</div>
            <p className="text-lg font-semibold text-gray-900">Looking up product...</p>
          </div>
        </div>
      )}

      {/* Food Details Modal */}
      {scannedFood && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="float-right text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add to Tracker</h2>

            {/* Product Image */}
            {scannedFood.imageUrl && (
              <img
                src={scannedFood.imageUrl}
                alt={scannedFood.name}
                className="w-full h-48 object-contain mb-4 rounded-lg bg-gray-50"
              />
            )}

            {/* Product Info */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{scannedFood.name}</h3>
              {scannedFood.brand && (
                <p className="text-sm text-gray-600">{scannedFood.brand}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">Serving: {scannedFood.servingSize}</p>
            </div>

            {/* Servings Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Servings
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                  className="px-3 py-2 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
                >
                  −
                </button>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  step="0.5"
                  min="0.5"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center"
                />
                <button
                  onClick={() => setServings(servings + 0.5)}
                  className="px-3 py-2 bg-gray-200 rounded-lg font-bold hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Nutrition Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-2">
                Nutrition (for {servings} serving{servings !== 1 ? 's' : ''})
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Calories:</span>
                  <span className="font-semibold ml-2">{Math.round(scannedFood.calories * servings)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Protein:</span>
                  <span className="font-semibold ml-2">{Math.round(scannedFood.protein * servings * 10) / 10}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Carbs:</span>
                  <span className="font-semibold ml-2">{Math.round(scannedFood.carbs * servings * 10) / 10}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Fat:</span>
                  <span className="font-semibold ml-2">{Math.round(scannedFood.fat * servings * 10) / 10}g</span>
                </div>
                {scannedFood.fiber && (
                  <div>
                    <span className="text-gray-600">Fiber:</span>
                    <span className="font-semibold ml-2">{Math.round(scannedFood.fiber * servings * 10) / 10}g</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleAddFood}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Add to Tracker
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {error && !scannedFood && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <span className="text-5xl">⚠️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Error</h3>
            <p className="text-gray-600 mb-4 text-center">{error}</p>
            <button
              onClick={() => setError('')}
              className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
