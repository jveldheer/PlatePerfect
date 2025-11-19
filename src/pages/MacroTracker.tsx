import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMacros } from '../contexts/MacroContext';
import BarcodeScanner from '../components/BarcodeScanner';
import { lookupBarcode, searchProducts, type NutritionData } from '../utils/openFoodFactsService';

export default function MacroTracker() {
  const { userProfile, macroGoals, consumedMacros, resetTracker, getGoalDirection, addToTracker } = useMacros();

  const [showScanner, setShowScanner] = useState(false);
  const [scannedFood, setScannedFood] = useState<NutritionData | null>(null);
  const [servings, setServings] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Manual search states
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NutritionData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Custom macro entry states
  const [showCustomMacros, setShowCustomMacros] = useState(false);
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');

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
        setError('Product not found in database. Try scanning again or search manually.');
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

      setSuccessMessage(`Added ${scannedFood.name} (${servings} serving${servings !== 1 ? 's' : ''}) to tracker!`);
      setTimeout(() => setSuccessMessage(''), 3000);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a food name to search');
      return;
    }

    console.log('🔍 Starting search for:', searchQuery);
    setIsSearching(true);
    setError('');
    setSearchResults([]); // Clear previous results

    try {
      console.log('📡 Calling searchProducts API...');
      const results = await searchProducts(searchQuery, 10);
      console.log('✅ Search completed, found', results.length, 'results');

      if (results.length === 0) {
        setError(`No results found for "${searchQuery}". Try:\n• Different spelling\n• Brand names (e.g., "Chobani yogurt")\n• Generic terms (e.g., "banana", "chicken breast")`);
        setSearchResults([]);
      } else {
        setSearchResults(results);
        setError(''); // Clear any previous errors
      }
    } catch (err: any) {
      console.error('❌ Error searching for food:', err);

      // More specific error messages
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError('Network error: Unable to connect to food database. Check your internet connection and try again.');
      } else if (err.message?.includes('429')) {
        setError('Too many requests. Please wait a moment and try again.');
      } else if (err.message?.includes('500') || err.message?.includes('503')) {
        setError('Food database is temporarily unavailable. Please try again in a few moments.');
      } else {
        setError(`Search failed: ${err.message || 'Unknown error'}. Please try again.`);
      }

      setSearchResults([]);
    } finally {
      setIsSearching(false);
      console.log('🏁 Search process completed');
    }
  };

  const handleSelectSearchResult = (food: NutritionData) => {
    setScannedFood(food);
    setServings(1);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    setError('');
  };

  const handleAddCustomMacros = () => {
    const calories = parseFloat(customCalories);
    const protein = parseFloat(customProtein);
    const carbs = parseFloat(customCarbs);
    const fat = parseFloat(customFat);

    if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
      setError('Please enter valid numbers for all macro fields');
      return;
    }

    if (calories < 0 || protein < 0 || carbs < 0 || fat < 0) {
      setError('Macro values cannot be negative');
      return;
    }

    addToTracker({
      calories,
      protein,
      carbs,
      fat
    }, 1);

    setSuccessMessage(`Added custom entry (${calories} cal) to tracker!`);
    setTimeout(() => setSuccessMessage(''), 3000);

    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setShowCustomMacros(false);
    setError('');
  };

  if (!userProfile || !macroGoals) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 px-4">
        <div className="card p-8">
          <span className="text-6xl mb-4 block">🎯</span>
          <h2 className="vlv-heading text-3xl mb-4">
            Set Up Your Macro Goals
          </h2>
          <p className="vlv-text mb-6">
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="vlv-heading text-4xl mb-4">
          ⚡ Macro Tracker
        </h1>
        <p className="vlv-text">
          Track your daily nutrition progress and dominate your goals
        </p>
      </div>

      {/* Goal Summary Card */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="text-center sm:text-left">
            <p className="vlv-subtext mb-1">Your Goal</p>
            <p className="vlv-heading text-2xl capitalize mb-2">
              {goalDirection}
            </p>
            <p className="vlv-subtext">
              {userProfile.currentWeightLb} lbs → {userProfile.targetWeightLb} lbs
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
            <button
              onClick={() => setShowScanner(true)}
              className="px-4 py-3 min-h-[44px] rounded-lg font-bold transition-all duration-300 touch-manipulation inline-flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '1.5px'
              }}
            >
              <span>📷</span>
              <span>SCAN</span>
            </button>
            <button
              onClick={() => setShowSearch(true)}
              className="px-4 py-3 min-h-[44px] rounded-lg font-bold transition-all duration-300 touch-manipulation inline-flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: '#FFFFFF',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '1.5px'
              }}
            >
              <span>🔍</span>
              <span>SEARCH</span>
            </button>
            <button
              onClick={() => setShowCustomMacros(true)}
              className="px-4 py-3 min-h-[44px] rounded-lg font-bold transition-all duration-300 touch-manipulation inline-flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, var(--yellow) 0%, var(--gold) 100%)',
                color: '#000000',
                boxShadow: '0 4px 15px var(--glow)',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '1.5px'
              }}
            >
              <span>📊</span>
              <span>CUSTOM</span>
            </button>
            <Link
              to="/recipes"
              className="px-4 py-3 min-h-[44px] rounded-lg font-bold transition-all duration-300 touch-manipulation inline-flex items-center"
              style={{
                backgroundColor: 'var(--dark-gray)',
                color: 'var(--yellow)',
                border: '2px solid var(--yellow)',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '1.5px'
              }}
            >
              RECIPES
            </Link>
            <button
              onClick={resetTracker}
              className="px-4 py-3 min-h-[44px] rounded-lg font-bold transition-all duration-300 touch-manipulation"
              style={{
                backgroundColor: '#1A1A1A',
                color: '#CCCCCC',
                border: '2px solid var(--border)',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '1.5px'
              }}
            >
              RESET
            </button>
          </div>
        </div>
      </div>

      {/* Macro Progress Cards */}
      <div className="space-y-6">
        {/* Calories */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="vlv-heading text-2xl mb-1">Calories</h3>
              <p className="vlv-text text-lg">
                {Math.round(consumedMacros.calories)} / {macroGoals.calories} kcal
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold" style={{ color: 'var(--yellow)' }}>
                {Math.round(caloriesPercent)}%
              </p>
              <p className="vlv-subtext">
                {macroGoals.calories - Math.round(consumedMacros.calories)} left
              </p>
            </div>
          </div>
          <div className="w-full rounded-full h-4 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
            <div
              className={`h-full transition-all duration-300 ${getProgressColor(caloriesPercent)}`}
              style={{ width: `${caloriesPercent}%` }}
            />
          </div>
        </div>

        {/* Protein */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="vlv-heading text-2xl mb-1">Protein</h3>
              <p className="vlv-text text-lg">
                {Math.round(consumedMacros.protein_g)} / {macroGoals.protein_g}g
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold" style={{ color: 'var(--red)' }}>
                {Math.round(proteinPercent)}%
              </p>
              <p className="vlv-subtext">
                {macroGoals.protein_g - Math.round(consumedMacros.protein_g)}g left
              </p>
            </div>
          </div>
          <div className="w-full rounded-full h-4 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
            <div
              className="h-full transition-all duration-300 bg-red-500"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="vlv-heading text-2xl mb-1">Carbs</h3>
              <p className="vlv-text text-lg">
                {Math.round(consumedMacros.carbs_g)} / {macroGoals.carbs_g}g
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold" style={{ color: '#FFD700' }}>
                {Math.round(carbsPercent)}%
              </p>
              <p className="vlv-subtext">
                {macroGoals.carbs_g - Math.round(consumedMacros.carbs_g)}g left
              </p>
            </div>
          </div>
          <div className="w-full rounded-full h-4 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
            <div
              className="h-full transition-all duration-300 bg-yellow-500"
              style={{ width: `${carbsPercent}%` }}
            />
          </div>
        </div>

        {/* Fat */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="vlv-heading text-2xl mb-1">Fat</h3>
              <p className="vlv-text text-lg">
                {Math.round(consumedMacros.fat_g)} / {macroGoals.fat_g}g
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold" style={{ color: 'var(--blue)' }}>
                {Math.round(fatPercent)}%
              </p>
              <p className="vlv-subtext">
                {macroGoals.fat_g - Math.round(consumedMacros.fat_g)}g left
              </p>
            </div>
          </div>
          <div className="w-full rounded-full h-4 overflow-hidden" style={{ backgroundColor: '#1A1A1A' }}>
            <div
              className="h-full transition-all duration-300 bg-blue-500"
              style={{ width: `${fatPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tips Card */}
      <div className="card" style={{ borderLeft: '6px solid var(--yellow)' }}>
        <h4 className="vlv-heading text-xl mb-3 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Tracking Tips
        </h4>
        <ul className="space-y-2 vlv-text">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>📷 Scan packaged foods • 🔍 Search products • 📊 Enter custom macros</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">•</span>
            <span>Green = On track (90-110% of goal)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500">•</span>
            <span>Yellow = Getting close (70-90% of goal)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500">•</span>
            <span>Red = Need more (below 70%)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500">•</span>
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

      {/* Custom Macro Entry Modal */}
      {showCustomMacros && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowCustomMacros(false);
                setCustomCalories('');
                setCustomProtein('');
                setCustomCarbs('');
                setCustomFat('');
                setError('');
              }}
              className="float-right text-2xl font-bold transition-colors"
              style={{ color: 'var(--gray)' }}
            >
              ×
            </button>

            <h2 className="vlv-heading text-2xl mb-4">📊 Custom Macro Entry</h2>

            <p className="vlv-text mb-6">
              Enter macros directly for meals, custom foods, or quick tracking.
            </p>

            {/* Calories Input */}
            <div className="mb-4">
              <label className="vlv-heading text-sm mb-2 block">
                Calories (kcal) *
              </label>
              <input
                type="number"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                placeholder="e.g., 250"
                min="0"
                step="1"
                autoFocus
              />
            </div>

            {/* Protein Input */}
            <div className="mb-4">
              <label className="vlv-heading text-sm mb-2 block">
                Protein (g) *
              </label>
              <input
                type="number"
                value={customProtein}
                onChange={(e) => setCustomProtein(e.target.value)}
                placeholder="e.g., 30"
                min="0"
                step="0.1"
              />
            </div>

            {/* Carbs Input */}
            <div className="mb-4">
              <label className="vlv-heading text-sm mb-2 block">
                Carbohydrates (g) *
              </label>
              <input
                type="number"
                value={customCarbs}
                onChange={(e) => setCustomCarbs(e.target.value)}
                placeholder="e.g., 20"
                min="0"
                step="0.1"
              />
            </div>

            {/* Fat Input */}
            <div className="mb-4">
              <label className="vlv-heading text-sm mb-2 block">
                Fat (g) *
              </label>
              <input
                type="number"
                value={customFat}
                onChange={(e) => setCustomFat(e.target.value)}
                placeholder="e.g., 8"
                min="0"
                step="0.1"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={handleAddCustomMacros}
              disabled={!customCalories || !customProtein || !customCarbs || !customFat}
              className="btn-primary w-full mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Tracker
            </button>

            {/* Info Box */}
            <div className="rounded-lg p-4" style={{
              backgroundColor: '#1A1A1A',
              borderLeft: '4px solid var(--yellow)'
            }}>
              <p className="vlv-heading text-sm mb-1">
                💡 Quick Tip
              </p>
              <p className="vlv-subtext text-sm">
                Use this for restaurant meals, homemade dishes, or when you know the exact macros.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Food Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseSearch}
              className="float-right text-2xl font-bold transition-colors"
              style={{ color: 'var(--gray)' }}
            >
              ×
            </button>

            <h2 className="vlv-heading text-2xl mb-4">🔍 Search Food</h2>

            {/* Search Input */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for food (e.g., 'banana', 'chicken breast')"
                  disabled={isSearching}
                  className="flex-1"
                  autoFocus
                />
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? '🔍 Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && showSearch && (
              <div className="mb-4 p-4 rounded-lg border-2"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: '#EF4444'
                }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div className="flex-1">
                    <p className="vlv-heading text-sm mb-1" style={{ color: '#FCA5A5' }}>
                      Search Error
                    </p>
                    <p className="vlv-text text-sm whitespace-pre-line">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={() => setError('')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h3 className="vlv-heading text-lg mb-2">
                  Found {searchResults.length} results:
                </h3>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {searchResults.map((food, index) => (
                    <button
                      key={`${food.barcode}-${index}`}
                      onClick={() => handleSelectSearchResult(food)}
                      className="w-full text-left p-4 rounded-lg transition-all duration-300"
                      style={{
                        backgroundColor: '#1A1A1A',
                        border: '2px solid var(--border)'
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {food.imageUrl && (
                          <img
                            src={food.imageUrl}
                            alt={food.name}
                            className="w-16 h-16 object-contain rounded"
                            style={{ backgroundColor: '#2A2A2A' }}
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="vlv-text font-bold">{food.name}</h4>
                          {food.brand && (
                            <p className="vlv-subtext text-sm">{food.brand}</p>
                          )}
                          <p className="vlv-subtext text-sm mt-1">
                            {food.servingSize} - {food.calories} cal
                          </p>
                          <div className="flex gap-3 text-xs mt-1" style={{ color: 'var(--gray)' }}>
                            <span>P: {food.protein}g</span>
                            <span>C: {food.carbs}g</span>
                            <span>F: {food.fat}g</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No results message */}
            {!isSearching && searchResults.length === 0 && searchQuery && !error && (
              <div className="text-center py-8">
                <p className="vlv-text text-lg">No results found</p>
                <p className="vlv-subtext text-sm mt-2">Try a different search term</p>
              </div>
            )}

            {/* Loading state */}
            {isSearching && (
              <div className="text-center py-8">
                <div className="animate-spin text-4xl mb-2">🔍</div>
                <p className="vlv-text">Searching...</p>
              </div>
            )}

            {/* Help text */}
            <div className="mt-4 rounded-lg p-4" style={{
              backgroundColor: '#1A1A1A',
              borderLeft: '4px solid var(--blue)'
            }}>
              <p className="vlv-subtext text-sm">
                <strong style={{ color: 'var(--white)' }}>Tip:</strong> Search for specific brands or products for best results.
                Examples: "Chobani yogurt", "Pepsi cola", "Clif bar"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="card p-8 text-center">
            <div className="animate-spin text-5xl mb-4">⏳</div>
            <p className="vlv-heading text-xl">Looking up product...</p>
          </div>
        </div>
      )}

      {/* Food Details Modal */}
      {scannedFood && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="float-right text-2xl font-bold transition-colors"
              style={{ color: 'var(--gray)' }}
            >
              ×
            </button>

            <h2 className="vlv-heading text-2xl mb-4">Add to Tracker</h2>

            {/* Product Image */}
            {scannedFood.imageUrl && (
              <img
                src={scannedFood.imageUrl}
                alt={scannedFood.name}
                className="w-full h-48 object-contain mb-4 rounded-lg"
                style={{ backgroundColor: '#1A1A1A' }}
              />
            )}

            {/* Product Info */}
            <div className="mb-4">
              <h3 className="vlv-text text-xl font-bold">{scannedFood.name}</h3>
              {scannedFood.brand && (
                <p className="vlv-subtext text-sm">{scannedFood.brand}</p>
              )}
              <p className="vlv-subtext text-sm mt-1">Serving: {scannedFood.servingSize}</p>
            </div>

            {/* Servings Input */}
            <div className="mb-4">
              <label className="vlv-heading text-sm mb-2 block">
                Number of Servings
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setServings(Math.max(0.5, servings - 0.5))}
                  className="px-4 py-2 rounded-lg font-bold transition-colors"
                  style={{
                    backgroundColor: '#1A1A1A',
                    color: 'var(--white)',
                    border: '2px solid var(--border)'
                  }}
                >
                  −
                </button>
                <input
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  step="0.5"
                  min="0.5"
                  className="w-20 text-center"
                />
                <button
                  onClick={() => setServings(servings + 0.5)}
                  className="px-4 py-2 rounded-lg font-bold transition-colors"
                  style={{
                    backgroundColor: '#1A1A1A',
                    color: 'var(--white)',
                    border: '2px solid var(--border)'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Nutrition Info */}
            <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#1A1A1A' }}>
              <h4 className="vlv-heading text-lg mb-2">
                Nutrition (for {servings} serving{servings !== 1 ? 's' : ''})
              </h4>
              <div className="grid grid-cols-2 gap-2 vlv-text text-sm">
                <div>
                  <span style={{ color: 'var(--gray)' }}>Calories:</span>
                  <span className="font-bold ml-2" style={{ color: 'var(--white)' }}>
                    {Math.round(scannedFood.calories * servings)}
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--gray)' }}>Protein:</span>
                  <span className="font-bold ml-2" style={{ color: 'var(--white)' }}>
                    {Math.round(scannedFood.protein * servings * 10) / 10}g
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--gray)' }}>Carbs:</span>
                  <span className="font-bold ml-2" style={{ color: 'var(--white)' }}>
                    {Math.round(scannedFood.carbs * servings * 10) / 10}g
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--gray)' }}>Fat:</span>
                  <span className="font-bold ml-2" style={{ color: 'var(--white)' }}>
                    {Math.round(scannedFood.fat * servings * 10) / 10}g
                  </span>
                </div>
                {scannedFood.fiber && (
                  <div>
                    <span style={{ color: 'var(--gray)' }}>Fiber:</span>
                    <span className="font-bold ml-2" style={{ color: 'var(--white)' }}>
                      {Math.round(scannedFood.fiber * servings * 10) / 10}g
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleAddFood}
                className="btn-primary flex-1"
              >
                Add to Tracker
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-3 rounded-lg font-bold transition-colors"
                style={{
                  backgroundColor: '#1A1A1A',
                  color: 'var(--gray)',
                  border: '2px solid var(--border)'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {error && !scannedFood && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="card max-w-md w-full">
            <div className="text-center mb-4">
              <span className="text-5xl">⚠️</span>
            </div>
            <h3 className="vlv-heading text-xl mb-2 text-center">Error</h3>
            <p className="vlv-text mb-4 text-center">{error}</p>
            <button
              onClick={() => setError('')}
              className="btn-primary w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="rounded-lg px-6 py-4 shadow-lg flex items-center gap-3"
            style={{
              background: 'linear-gradient(135deg, var(--green) 0%, #059669 100%)',
              color: '#FFFFFF'
            }}
          >
            <span className="text-2xl">✅</span>
            <p className="font-bold">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
