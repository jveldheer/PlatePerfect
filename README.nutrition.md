# Nutrition Lookup Module

Production-ready open-data nutrition module that powers food lookup and macro counting using USDA FoodData Central (FDC) for generic foods and Open Food Facts (OFF) for barcodes.

## Features

- **Barcode Lookup**: Scan or enter UPC/barcodes to get instant nutrition data
- **Text Search**: Search for any food by name (e.g., "chicken breast", "brown rice")
- **Smart Fallbacks**: OFF → FDC GTIN → FDC text search for maximum coverage
- **Unit Conversion**: Supports g, kg, oz, lb, cups, servings
- **Portion Scaling**: Automatically scales macros to your specified amount
- **In-Memory Cache**: LRU cache with reasonable TTLs (1hr OFF, 24hr FDC)
- **Confidence Scoring**: Know how reliable the data is
- **Energy Validation**: Sanity checks using Atwater factors

## Installation

### 1. Get API Key

Sign up for a free USDA FoodData Central API key:
https://fdc.nal.usda.gov/api-key-signup.html

### 2. Configure Environment

Add to your `.env.local`:

```bash
VITE_FDC_API_KEY=your_api_key_here
```

### 3. Initialize Module

In your main app file:

```typescript
import { initNutrition } from './lib/nutrition';

// Initialize on app startup
initNutrition({
  fdcApiKey: import.meta.env.VITE_FDC_API_KEY
});
```

## Usage

### Basic Search

```typescript
import { getMacros } from './lib/nutrition';

// Search by name
const result = await getMacros({
  text: 'chicken breast raw',
  amount: 200,
  unit: 'g'
});

console.log(result);
// {
//   kcal: 220,
//   protein_g: 46,
//   carb_g: 0,
//   fat_g: 4.8,
//   source: 'fdc',
//   confidence: 0.9,
//   scaled: {
//     grams: 200,
//     kcal: 220,
//     protein_g: 46,
//     carb_g: 0,
//     fat_g: 4.8
//   }
// }
```

### Barcode Lookup

```typescript
// Lookup by UPC/barcode
const result = await getMacros({
  upc: '737628064502',
  amount: 1,
  unit: 'serving'
});
```

### Get Base Nutrition (per 100g)

```typescript
// Without amount/unit, returns per-100g values
const result = await getMacros({
  text: 'oats'
});
// Result will have base per_100g values without scaled field
```

## API Reference

### `getMacros(input: GetMacrosInput): Promise<GetMacrosResult>`

**Input:**
```typescript
{
  upc?: string;        // Barcode/UPC for product lookup
  text?: string;       // Free text search query
  name?: string;       // Alternative to text
  amount?: number;     // Quantity (optional)
  unit?: string;       // Unit: g, oz, lb, cup, serving (optional)
}
```

**Output:**
```typescript
{
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  base_ref: 'per_100g' | 'per_serving';
  serving?: { grams?: number; desc?: string };
  source: 'off' | 'fdc';
  confidence: number;  // 0-1 score
  scaled?: {           // Only present if amount+unit provided
    grams: number;
    kcal: number;
    protein_g: number;
    carb_g: number;
    fat_g: number;
  };
  cannot_scale?: boolean;  // True if scaling failed
  error?: string;          // Error message if scaling failed
}
```

## Data Sources

### USDA FoodData Central (FDC)
- Generic foods (chicken, rice, vegetables)
- Branded products by GTIN
- Requires free API key
- Data ranked: Foundation > SR Legacy > Branded

### Open Food Facts (OFF)
- Barcode/UPC product database
- No API key required
- Community-contributed data
- Used as primary source for barcodes

## Unit Conversions

Supported units:
- **Weight**: g, gram, kg, kilogram, oz, ounce, lb, pound
- **Volume**: cup, tbsp, tsp (requires serving size data)
- **Count**: piece, slice, serving (requires serving size data)

## Confidence Scoring

The module calculates a confidence score (0-1) based on:
- Data source quality (Foundation > SR Legacy > Branded)
- Completeness of nutrition data
- Energy sanity check (labeled kcal vs. calculated from macros)
- Presence of optional nutrients

## Caching

- **OFF results**: Cached for 1 hour
- **FDC results**: Cached for 24 hours
- **Max cache size**: 1000 items (LRU eviction)
- **Cache keys**: `upc:{barcode}` or `name:{canonical_name}`

## Error Handling

```typescript
try {
  const result = await getMacros({ text: 'invalid food xyz' });
} catch (error) {
  // Error: Food not found
}

try {
  const result = await getMacros({
    text: 'chicken',
    amount: 1,
    unit: 'cup'  // Volume unit without serving data
  });
  if (result.cannot_scale) {
    console.log(result.error);  // Cannot convert cup to grams
  }
} catch (error) {
  console.error(error);
}
```

## Attribution

Always include attribution in your app footer:

```typescript
import { nutritionAttribution } from './lib/nutrition';

const attr = nutritionAttribution();
// {
//   fdc: 'Nutrition data from USDA FoodData Central',
//   fdcUrl: 'https://fdc.nal.usda.gov/',
//   off: 'Barcode data from Open Food Facts',
//   offUrl: 'https://world.openfoodfacts.org/'
// }
```

## React Component Integration

The enhanced MacroTracker component includes:
- Food search and barcode lookup
- Automatic nutrition calculation
- Portion scaling
- Manual entry fallback
- Today's totals tracking

See `src/pages/MacroTrackerWithLookup.tsx` for the full implementation.

## Limitations & Future Work

**Current Limitations:**
- Volume conversions (cup, tbsp) require serving size data
- OFF data quality varies (community-contributed)
- Some foods may have incomplete nutrient profiles
- No database persistence (in-memory cache only)

**Future Enhancements:**
- Add recipe builder with ingredient scaling
- Persistent cache with IndexedDB
- Favorite foods quick-access
- Meal history and analytics
- Custom food database
- Photo-based food recognition
- Integration with fitness tracking APIs

## License

This module uses open data sources:
- USDA FoodData Central: Public domain
- Open Food Facts: ODbL license

## Support

For issues or questions:
- FDC API docs: https://fdc.nal.usda.gov/api-guide.html
- OFF API docs: https://wiki.openfoodfacts.org/API
