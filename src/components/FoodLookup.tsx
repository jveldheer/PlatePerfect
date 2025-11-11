import { useState } from 'react';
import { getMacros, type GetMacrosResult } from '../lib/nutrition';

interface FoodLookupProps {
  onAddToTracker?: (macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
  compact?: boolean;
}

export default function FoodLookup({ onAddToTracker, compact = false }: FoodLookupProps) {
  const [mode, setMode] = useState<'upc' | 'text' | 'name'>('upc');
  const [query, setQuery] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('g');
  const [result, setResult] = useState<GetMacrosResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLookup() {
    if (!query.trim()) {
      setError('Please enter a search term or barcode');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const input: any = {};
      input[mode] = query;

      if (amount && unit) {
        input.amount = parseFloat(amount);
        input.unit = unit;
      }

      const data = await getMacros(input);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch nutrition data');
      console.error('Food lookup error:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToTracker() {
    if (!result || !onAddToTracker) return;

    const macros = result.scaled || {
      kcal: result.kcal,
      protein_g: result.protein_g,
      carb_g: result.carb_g,
      fat_g: result.fat_g,
    };

    onAddToTracker({
      calories: macros.kcal,
      protein: macros.protein_g,
      carbs: macros.carb_g,
      fat: macros.fat_g,
    });

    // Reset form
    setQuery('');
    setAmount('');
    setResult(null);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      handleLookup();
    }
  }

  return (
    <div className={`space-y-4 ${compact ? 'text-sm' : ''}`}>
      {/* Search Mode and Query */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="border-2 border-gray-300 px-3 py-2 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 bg-white text-gray-900 font-medium"
          >
            <option value="upc">Barcode (UPC)</option>
            <option value="text">Search Text</option>
            <option value="name">Food Name</option>
          </select>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              mode === 'upc'
                ? 'e.g., 737628064502'
                : mode === 'text'
                ? 'e.g., chicken breast raw'
                : 'e.g., banana'
            }
            className="flex-1 border-2 border-gray-300 px-3 py-2 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-gray-900 font-medium"
          />
        </div>

        {/* Amount and Unit */}
        <div className="flex gap-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Amount (optional)"
            step="0.1"
            className="w-32 border-2 border-gray-300 px-3 py-2 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-gray-900 font-medium"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="border-2 border-gray-300 px-3 py-2 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 bg-white text-gray-900 font-medium"
          >
            <option value="g">grams (g)</option>
            <option value="oz">ounces (oz)</option>
            <option value="lb">pounds (lb)</option>
            <option value="cup">cup</option>
            <option value="tbsp">tablespoon</option>
            <option value="tsp">teaspoon</option>
            <option value="serving">serving</option>
            <option value="piece">piece</option>
            <option value="slice">slice</option>
          </select>

          <button
            onClick={handleLookup}
            disabled={loading}
            className="px-6 py-2 min-h-[44px] bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-400 transition-colors touch-manipulation"
          >
            {loading ? 'Looking up...' : 'Look Up'}
          </button>
        </div>

        {mode === 'upc' && (
          <p className="text-xs text-gray-600">
            Tip: Use your phone's camera to scan barcodes, or type the numbers manually
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
          <p className="text-red-900 font-semibold">Error</p>
          <p className="text-red-800 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white border-2 border-green-500 rounded-xl p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900">
                {result.food_name || 'Food Item'}
              </h3>
              <p className="text-xs text-gray-600">
                Source: {result.source === 'off' ? 'Open Food Facts' : 'USDA FoodData'} •
                Confidence: {Math.round(result.confidence * 100)}%
              </p>
            </div>
          </div>

          {/* Macro Display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">
                {result.scaled?.kcal ?? result.kcal}
              </p>
              <p className="text-xs text-gray-600">Calories</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-600">
                {result.scaled?.protein_g ?? result.protein_g}g
              </p>
              <p className="text-xs text-gray-600">Protein</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {result.scaled?.carb_g ?? result.carb_g}g
              </p>
              <p className="text-xs text-gray-600">Carbs</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {result.scaled?.fat_g ?? result.fat_g}g
              </p>
              <p className="text-xs text-gray-600">Fat</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              Base: {result.base_ref === 'per_100g' ? 'Per 100g' : 'Per serving'}
              {result.serving?.desc && ` (${result.serving.desc})`}
            </p>
            {result.scaled && (
              <p className="text-green-700 font-semibold">
                Showing values for {result.scaled.grams}g
              </p>
            )}
            {result.fiber_g !== undefined && (
              <p>Fiber: {result.scaled?.fiber_g ?? result.fiber_g}g</p>
            )}
            {result.sugar_g !== undefined && (
              <p>Sugar: {result.scaled?.sugar_g ?? result.sugar_g}g</p>
            )}
            {result.sodium_mg !== undefined && (
              <p>Sodium: {result.scaled?.sodium_mg ?? result.sodium_mg}mg</p>
            )}
          </div>

          {/* Notes */}
          {result.notes && result.notes.length > 0 && (
            <div className="text-xs text-orange-700 bg-orange-50 rounded p-2">
              {result.notes.map((note, i) => (
                <p key={i}>⚠️ {note}</p>
              ))}
            </div>
          )}

          {/* Actions */}
          {onAddToTracker && (
            <button
              onClick={handleAddToTracker}
              className="w-full px-6 py-3 min-h-[44px] bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors touch-manipulation"
            >
              Add to Tracker
            </button>
          )}
        </div>
      )}
    </div>
  );
}
