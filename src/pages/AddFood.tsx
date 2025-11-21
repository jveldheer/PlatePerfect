import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMacros } from '../contexts/MacroContext';
import BarcodeScanner from '../components/BarcodeScanner';
import { lookupBarcode, type NutritionData } from '../utils/openFoodFactsService';

export default function AddFood() {
  const { addToTracker } = useMacros();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'barcode' | 'manual'>('barcode');
  const [showScanner, setShowScanner] = useState(false);
  const [scannedFood, setScannedFood] = useState<NutritionData | null>(null);
  const [servings, setServings] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Manual entry states
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [customName, setCustomName] = useState('');

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
        setError('Product not found in database. Try entering macros manually.');
      }
    } catch (err) {
      console.error('Error looking up barcode:', err);
      setError('Failed to look up product. Please try again or enter macros manually.');
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

      setSuccessMessage(`Added ${scannedFood.name} to tracker!`);
      setTimeout(() => {
        navigate('/');
      }, 1500);

      setScannedFood(null);
      setServings(1);
      setError('');
    }
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

    setSuccessMessage(`Added ${customName || 'custom entry'} to tracker!`);
    setTimeout(() => {
      navigate('/');
    }, 1500);

    setCustomCalories('');
    setCustomProtein('');
    setCustomCarbs('');
    setCustomFat('');
    setCustomName('');
    setError('');
  };

  const handleCloseModal = () => {
    setScannedFood(null);
    setServings(1);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-3">
          🍽️ Add Food
        </h1>
        <p className="text-lg text-gray-200">
          Track your nutrition by scanning barcodes or entering macros manually
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="card border-green-500" style={{ backgroundColor: '#065F46' }}>
          <p className="vlv-text text-center text-white font-bold">
            ✅ {successMessage}
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="card p-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab('barcode')}
            className={`py-3 px-4 rounded-lg font-bold transition-all ${
              activeTab === 'barcode'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            📷 Scan Barcode
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-3 px-4 rounded-lg font-bold transition-all ${
              activeTab === 'manual'
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            ✏️ Enter Manually
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="card border-red-500" style={{ backgroundColor: '#7F1D1D' }}>
          <p className="vlv-text text-red-200">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Barcode Scanner Tab */}
      {activeTab === 'barcode' && (
        <div className="card">
          <h2 className="vlv-heading text-2xl mb-4">Scan Product Barcode</h2>
          <p className="vlv-text mb-6">
            Use your phone's camera to scan the barcode on any packaged food product.
          </p>

          <button
            onClick={() => setShowScanner(true)}
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Loading...' : '📷 Open Camera Scanner'}
          </button>

          {showScanner && (
            <BarcodeScanner
              onScan={handleScan}
              onError={(error) => setError(error)}
              onClose={() => setShowScanner(false)}
            />
          )}

          {/* Scanned Food Details */}
          {scannedFood && (
            <div className="mt-6 p-6 rounded-xl" style={{ backgroundColor: '#1A1A1A', border: '3px solid var(--yellow)' }}>
              <h3 className="vlv-heading text-xl mb-4">
                {scannedFood.name}
              </h3>
              {scannedFood.brand && (
                <p className="vlv-subtext text-sm mb-2">{scannedFood.brand}</p>
              )}
              <p className="vlv-subtext text-sm mb-4">Serving: {scannedFood.servingSize}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="vlv-subtext text-xs">Calories</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--yellow)' }}>
                    {scannedFood.calories * servings}
                  </p>
                </div>
                <div>
                  <p className="vlv-subtext text-xs">Protein</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--red)' }}>
                    {(scannedFood.protein * servings).toFixed(1)}g
                  </p>
                </div>
                <div>
                  <p className="vlv-subtext text-xs">Carbs</p>
                  <p className="text-2xl font-bold" style={{ color: '#FFD700' }}>
                    {(scannedFood.carbs * servings).toFixed(1)}g
                  </p>
                </div>
                <div>
                  <p className="vlv-subtext text-xs">Fat</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--blue)' }}>
                    {(scannedFood.fat * servings).toFixed(1)}g
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="vlv-heading text-sm mb-2 block">
                  Number of Servings
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={servings}
                  onChange={(e) => setServings(parseFloat(e.target.value) || 1)}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddFood}
                  className="btn-primary flex-1"
                >
                  ✅ Add to Tracker
                </button>
                <button
                  onClick={handleCloseModal}
                  className="btn-secondary flex-1"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Entry Tab */}
      {activeTab === 'manual' && (
        <div className="card">
          <h2 className="vlv-heading text-2xl mb-4">Enter Macros Manually</h2>
          <p className="vlv-text mb-6">
            Enter nutrition information from any food label or meal you've prepared.
          </p>

          <div className="space-y-4">
            <div>
              <label className="vlv-heading text-sm mb-2 block">
                Food Name (Optional)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., Grilled Chicken"
              />
            </div>

            <div>
              <label className="vlv-heading text-sm mb-2 block">
                Calories
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                placeholder="e.g., 250"
                required
              />
            </div>

            <div>
              <label className="vlv-heading text-sm mb-2 block">
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={customProtein}
                onChange={(e) => setCustomProtein(e.target.value)}
                placeholder="e.g., 30"
                required
              />
            </div>

            <div>
              <label className="vlv-heading text-sm mb-2 block">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={customCarbs}
                onChange={(e) => setCustomCarbs(e.target.value)}
                placeholder="e.g., 15"
                required
              />
            </div>

            <div>
              <label className="vlv-heading text-sm mb-2 block">
                Fat (g)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={customFat}
                onChange={(e) => setCustomFat(e.target.value)}
                placeholder="e.g., 8"
                required
              />
            </div>

            <button
              onClick={handleAddCustomMacros}
              className="btn-primary w-full"
            >
              ✅ Add to Tracker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
