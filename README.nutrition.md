# Nutrition Module Documentation

A production-ready nutrition lookup system for PlatePerfect that integrates **Open Food Facts** (barcode/UPC lookup) and **USDA FoodData Central** (comprehensive food database).

## Features

- 🔍 **Barcode Scanning**: Look up foods by UPC/barcode using Open Food Facts (no API key required)
- 🥗 **Food Search**: Search USDA's comprehensive food database by name or description
- 📊 **Accurate Macros**: Get calories, protein, carbs, fat, fiber, sugar, and sodium
- ⚖️ **Smart Scaling**: Automatic portion scaling for any amount and unit
- 💾 **Intelligent Caching**: LRU cache reduces API calls and improves performance
- ✅ **Data Quality**: Confidence scoring and energy sanity checks
- 🎯 **Easy Integration**: React component ready to drop into your tracker

## Installation

The nutrition module is already integrated into your project at `src/lib/nutrition/`.

No additional dependencies are required - it uses native `fetch` and TypeScript.

## Setup

### 1. For Barcode Lookup Only (Works Immediately)

Barcode lookup via Open Food Facts works out of the box with no configuration needed!

```tsx
import { getMacros } from './lib/nutrition';

const result = await getMacros({ upc: '737628064502' });
console.log(result.kcal, result.protein_g, result.carb_g, result.fat_g);
```

### 2. For Food Search (Requires API Key)

To enable food name/text search, you need a free USDA FoodData Central API key:

1. **Get API Key**: Visit https://fdc.nal.usda.gov/api-key-signup.html and sign up (free, instant)

2. **Create `.env` file** in your project root:
   ```env
   VITE_FDC_API_KEY=your_api_key_here
   ```

3. **Restart dev server**:
   ```bash
   npm run dev
   ```

⚠️ **Important**: The `.env` file exposes your API key in the browser. For production, consider using a backend proxy to keep the key secure.

## Usage

### Basic API Usage

```typescript
import { getMacros } from './lib/nutrition';

// Barcode lookup
const barcodeResult = await getMacros({
  upc: '737628064502'
});

// Food search
const searchResult = await getMacros({
  text: 'chicken breast raw'
});

// With portion scaling
const scaledResult = await getMacros({
  name: 'banana',
  amount: 150,
  unit: 'g'
});

console.log(scaledResult.scaled?.kcal); // Scaled to 150g
console.log(scaledResult.kcal); // Base per-100g value
```

### React Component

The `FoodLookup` component is already integrated into the Macro Tracker:

```tsx
import FoodLookup from './components/FoodLookup';
import { useMacros } from './contexts/MacroContext';

function MyComponent() {
  const { addToTracker } = useMacros();

  return (
    <FoodLookup onAddToTracker={addToTracker} />
  );
}
```

### In Macro Tracker

1. Navigate to **Macro Tracker** page
2. Click **"Look Up Food"** button
3. Choose lookup method:
   - **Barcode (UPC)**: Enter or scan a barcode
   - **Search Text**: Full search query like "raw chicken breast"
   - **Food Name**: Simple food name like "banana"
4. (Optional) Enter amount and unit for automatic scaling
5. Click **"Look Up"**
6. Click **"Add to Tracker"** to log the food

## Supported Units

### Weight Units (Always Supported)
- `g` - grams
- `kg` - kilograms
- `oz` - ounces
- `lb` - pounds
- `mg` - milligrams

### Volume/Count Units (Requires Serving Info)
- `cup`, `tbsp`, `tsp`
- `ml`, `l`, `fl oz`
- `serving`, `piece`, `slice`, `item`

Volume units are converted using the serving size information from the food database.

## Data Sources

### Open Food Facts (OFF)
- **What**: Crowdsourced barcode database with 2M+ products
- **Best for**: Packaged/branded foods with barcodes
- **Coverage**: Worldwide, mainly European and North American products
- **API Key**: Not required
- **Cache TTL**: 1 hour

### USDA FoodData Central (FDC)
- **What**: Official US nutrition database
- **Best for**: Generic foods (chicken, vegetables, grains, etc.)
- **Coverage**: 500K+ foods across Foundation, SR Legacy, and Branded datasets
- **API Key**: Required (free)
- **Cache TTL**: 24 hours

## Lookup Strategy

When you request nutrition data, the module uses this intelligent fallback chain:

### For UPC/Barcode:
1. Try **Open Food Facts** (fast, no key needed)
2. Fall back to **FDC by GTIN** (if OFF fails)
3. Fall back to **FDC by name** (if both above fail)

### For Text/Name:
1. Search **FDC database**
2. Rank results by data type quality (Foundation > SR Legacy > Branded)
3. Match form keywords (raw, cooked, grilled, etc.)
4. Return best match

## Response Format

```typescript
{
  kcal: 165,                    // Base calories
  protein_g: 31.0,              // Protein in grams
  carb_g: 0.0,                  // Carbohydrates in grams
  fat_g: 3.6,                   // Fat in grams
  fiber_g: 0.0,                 // Fiber (optional)
  sugar_g: 0.0,                 // Sugar (optional)
  sodium_mg: 74,                // Sodium (optional)
  base_ref: "per_100g",         // or "per_serving"
  serving: {
    grams: 140,
    desc: "1 breast, bone and skin removed"
  },
  source: "fdc",                // "off" or "fdc"
  confidence: 0.95,             // 0-1 quality score
  food_name: "Chicken, breast, raw",
  scaled: {                     // Only if amount/unit provided
    grams: 150,
    kcal: 248,
    protein_g: 46.5,
    carb_g: 0.0,
    fat_g: 5.4
  },
  notes: [                      // Quality warnings (if any)
    "Energy mismatch: labeled 165 kcal vs calculated 154 kcal"
  ]
}
```

## Confidence Scoring

The module assigns a confidence score (0-1) based on:

- **Data Source Quality**
  - FDC Foundation: 0.95
  - FDC SR Legacy: 0.90
  - FDC Branded: 0.75
  - OFF: 0.70 base

- **Data Completeness**
  - All macros present: +0.1
  - Energy sanity check passes: no penalty
  - Energy mismatch (>15%): -0.2

Use confidence to decide whether to trust the data or ask the user for manual verification.

## Error Handling

```typescript
try {
  const result = await getMacros({ upc: '12345' });
  console.log(result);
} catch (error) {
  if (error.message.includes('FDC API not configured')) {
    // Show API key setup instructions
  } else if (error.message.includes('No nutrition data found')) {
    // Food not in database
  } else {
    // Network or other error
  }
}
```

## Caching

The module uses an in-memory LRU cache:

- **Max Size**: 1,000 items
- **OFF TTL**: 1 hour (barcodes change rarely)
- **FDC TTL**: 24 hours (reference data is stable)
- **Cache Keys**:
  - UPC: `upc:737628064502`
  - Name: `name:chicken breast raw` (normalized)

Clear cache manually:
```typescript
import { clearCache } from './lib/nutrition';
clearCache();
```

## Examples

### Example 1: Scan Barcode

```typescript
// User scans barcode "078742080352"
const result = await getMacros({ upc: '078742080352' });

// Automatically uses Open Food Facts
// Result: Cheerios nutrition data
```

### Example 2: Search and Scale

```typescript
// User wants 6 oz of chicken breast
const result = await getMacros({
  text: 'chicken breast raw',
  amount: 6,
  unit: 'oz'
});

console.log(result.scaled.kcal);      // Calories for 6 oz
console.log(result.scaled.protein_g); // Protein for 6 oz
```

### Example 3: Check Data Quality

```typescript
const result = await getMacros({ name: 'oats' });

if (result.confidence < 0.7) {
  console.warn('Low confidence data, verify manually');
}

if (result.notes) {
  console.warn('Data quality issues:', result.notes);
}
```

## Attribution

Per the terms of service, include attribution in your app:

```typescript
import { nutritionAttribution } from './lib/nutrition';

const attribution = nutritionAttribution();
console.log(attribution.fdc);    // "Nutrition data from USDA FoodData Central"
console.log(attribution.off);    // "Barcode data from Open Food Facts"
console.log(attribution.fdcUrl); // https://fdc.nal.usda.gov/
console.log(attribution.offUrl); // https://world.openfoodfacts.org/
```

Add to your footer or about page:
```tsx
<footer>
  <p>Nutrition data from USDA FoodData Central</p>
  <p>Barcode data from Open Food Facts</p>
</footer>
```

## Limitations & Future Work

### Current Limitations
- FDC API key is exposed in browser (client-side)
- No camera barcode scanning (manual entry only)
- Volume units require serving info from database
- Cache is in-memory only (lost on page refresh)

### Future Enhancements
- Backend API proxy to secure FDC key
- Camera barcode scanner using `@zxing/library`
- LocalStorage persistence for cache
- Nutrition label photo OCR
- Recipe analyzer (combine multiple ingredients)
- Meal plan macro calculator
- User-contributed corrections
- Offline mode with bundled common foods

## Troubleshooting

### "FDC API not configured"
- Get API key from https://fdc.nal.usda.gov/api-key-signup.html
- Add to `.env` as `VITE_FDC_API_KEY=your_key`
- Restart dev server

### "No nutrition data found"
- Try different search terms ("raw chicken" vs "chicken breast")
- Use barcode if available
- Check spelling
- Try generic terms ("banana" not "Chiquita banana")

### Energy Mismatch Warnings
- Some foods have rounding errors in source data
- Calculated energy uses 4-4-9 rule (protein: 4 kcal/g, carbs: 4 kcal/g, fat: 9 kcal/g)
- Trust confidence score - below 0.7 may need manual verification

### Cannot Scale Error
- Serving size not available in database
- Use weight units (g, oz) instead of volume (cup, tbsp)
- Or accept base per-100g values

## API Reference

### `getMacros(input: GetMacrosInput): Promise<GetMacrosResult>`

Main function to look up nutrition data.

**Parameters:**
- `input.upc?: string` - UPC/barcode (12-13 digits)
- `input.text?: string` - Full search query
- `input.name?: string` - Food name
- `input.amount?: number` - Quantity for scaling
- `input.unit?: string` - Unit (g, oz, cup, etc.)

**Returns:** `GetMacrosResult` with macro data and optional scaled values

**Throws:** Error if no upc/text/name provided, or if lookup fails

## Support

- **Documentation**: This file
- **Setup Guide**: See "Setup" section above
- **Examples**: See "Examples" section above
- **Issues**: Check error messages for specific guidance

---

Built with ❤️ for PlatePerfect | Data from USDA FDC & Open Food Facts
