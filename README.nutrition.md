# Nutrition Module

Production-ready nutrition lookup module powered by USDA FoodData Central and Open Food Facts.

## Features

- **Multi-source data**: Combines USDA FoodData Central (generic foods) and Open Food Facts (barcodes)
- **Smart routing**: Automatically selects the best data source based on input
- **Unit conversion**: Supports g, kg, oz, lb, cup, and more
- **Portion scaling**: Calculate macros for specific serving sizes
- **LRU caching**: Fast lookups with intelligent cache management
- **Type-safe**: Full TypeScript support
- **Quality scoring**: Confidence ratings and energy validation

## Installation

### 1. Install Dependencies

```bash
npm install zod lru-cache
npm install -D vitest @vitest/ui
```

### 2. Get API Key

Get a free USDA FoodData Central API key:
https://fdc.nal.usda.gov/api-key-signup.html

### 3. Configure Environment

Add to `.env.local`:

```env
FDC_API_KEY=your_api_key_here
```

### 4. Validate Environment (Optional)

Call `validateEnv()` on app startup to ensure API key is configured:

```typescript
import { validateEnv } from '@/lib/nutrition';

// In your app startup or layout
validateEnv();
```

## Usage

### Basic Lookup

```typescript
import { getMacros } from '@/lib/nutrition';

// Lookup by UPC/barcode
const result = await getMacros({ upc: '737628064502' });

// Search by food name
const result = await getMacros({ name: 'chicken breast raw' });

// Text search
const result = await getMacros({ text: 'oats rolled old fashioned' });
```

### With Portion Calculation

```typescript
const result = await getMacros({
  name: 'oats',
  amount: 1,
  unit: 'cup'
});

// Result includes both per-100g and scaled values
console.log(result.kcal);         // per 100g
console.log(result.scaled.kcal);  // for 1 cup
```

### Response Format

```typescript
{
  // Base macros (per 100g or per serving)
  kcal: 389,
  protein_g: 16.9,
  carb_g: 66.3,
  fat_g: 6.9,
  fiber_g: 10.6,          // optional
  sugar_g: 0.8,           // optional
  sodium_mg: 5,           // optional

  // Metadata
  base_ref: "per_100g",
  source: "off",           // or "fdc"
  confidence: 0.85,        // 0-1 quality score

  // Serving info
  serving: {
    grams: 40,
    desc: "1 serving (40g)"
  },

  // Scaled values (if amount/unit provided)
  scaled: {
    grams: 234,            // 1 cup = 234g
    kcal: 910,
    protein_g: 39.5,
    carb_g: 155.2,
    fat_g: 16.1
  },

  // Quality notes
  notes: [
    "Energy mismatch: reported 389 kcal vs calculated 402 kcal from macros"
  ]
}
```

### Supported Units

**Weight**: g, kg, oz, lb
**Volume**: cup, tbsp, tsp, ml, l
**Descriptive**: serving, slice, piece, portion

Volume and descriptive units require serving size information from the food database.

### Batch Lookups

```typescript
import { getBatchMacros } from '@/lib/nutrition';

const results = await getBatchMacros([
  { name: 'chicken breast' },
  { upc: '737628064502' },
  { name: 'oats', amount: 1, unit: 'cup' }
]);

// Handle results (may include errors)
results.forEach((result, i) => {
  if ('error' in result) {
    console.error(`Item ${i} failed:`, result.error);
  } else {
    console.log(`Item ${i}: ${result.kcal} kcal`);
  }
});
```

## API Route

The module includes a Next.js API route at `/api/macros`:

### GET Request

```bash
curl "http://localhost:3000/api/macros?name=chicken%20breast&amount=200&unit=g"
```

### POST Request

```bash
curl -X POST http://localhost:3000/api/macros \
  -H "Content-Type: application/json" \
  -d '{"name":"chicken breast","amount":200,"unit":"g"}'
```

### Response

```json
{
  "ok": true,
  "data": {
    "kcal": 165,
    "protein_g": 31.0,
    "carb_g": 0.0,
    "fat_g": 3.6,
    "source": "fdc",
    "confidence": 0.90,
    "scaled": {
      "grams": 200,
      "kcal": 330,
      "protein_g": 62.0,
      "carb_g": 0.0,
      "fat_g": 7.2
    }
  }
}
```

## React Component

Example implementation:

```typescript
import MacroLookup from '@/components/MacroLookup';

export default function Page() {
  return (
    <div>
      <h1>Nutrition Tracker</h1>
      <MacroLookup />
    </div>
  );
}
```

## Testing

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run specific test file
npm test units.test.ts
```

## Data Sources

### USDA FoodData Central

- Used for generic foods (chicken, oats, rice, etc.)
- Prioritizes: Foundation > SR Legacy > Branded
- Includes portion information and micronutrients
- Free API key required

### Open Food Facts

- Used for UPC/barcode lookups
- Community-contributed database
- No API key required
- Falls back to FDC if data incomplete

## Caching

- **UPC lookups**: 1 hour TTL
- **Name searches**: 24 hour TTL
- **Max entries**: 1000 items
- **Algorithm**: LRU (Least Recently Used)

```typescript
import { getCacheStats, clearCache } from '@/lib/nutrition';

// View cache statistics
const stats = getCacheStats();
console.log(stats);

// Clear cache
clearCache();
```

## Attribution

Always include attribution in your UI:

```typescript
import { nutritionAttribution } from '@/lib/nutrition';

const attribution = nutritionAttribution();

// In your footer or about page:
<div>
  <p>{attribution.fdc} - <a href={attribution.fdcUrl}>{attribution.fdcUrl}</a></p>
  <p>{attribution.off} - <a href={attribution.offUrl}>{attribution.offUrl}</a></p>
</div>
```

## Confidence Scoring

Results include a confidence score (0-1) based on:

- Data source quality (Foundation > SR Legacy > Branded > OFF)
- Energy calculation validation (macros should match calories)
- Completeness of nutrient data
- Presence of serving size information

Use confidence scores to:
- Filter low-quality results
- Show warnings to users
- Prioritize data sources

## Error Handling

```typescript
try {
  const result = await getMacros({ name: 'unknown food' });
  console.log(result);
} catch (error) {
  // Errors include:
  // - "No nutrition data found for..."
  // - "Must provide at least one of: upc, text, or name"
  // - "FDC_API_KEY environment variable is required"
  console.error(error.message);
}
```

## Limitations

1. **Volume conversions**: Cup/tbsp/tsp conversions assume serving sizes from the database. Accuracy varies by ingredient density.

2. **Branded foods**: Quality varies in branded food databases. Check confidence scores.

3. **Recipe calculations**: This module looks up individual ingredients. Recipe calculations require separate logic.

4. **Rate limits**: FDC API has rate limits. Implement exponential backoff for production use.

5. **Cache invalidation**: Cached data may become stale. Consider cache warming strategies for production.

## Future Enhancements

- Recipe calculation support
- Meal planning integration
- Custom food database
- Offline mode with IndexedDB
- Image recognition for barcodes
- Nutrient goal tracking
- Export to popular fitness apps

## Troubleshooting

### "FDC_API_KEY environment variable is required"

Get an API key from https://fdc.nal.usda.gov/api-key-signup.html and add to `.env.local`.

### "Cannot convert cup to grams"

The food doesn't have serving size information. Use weight units (g, oz) instead.

### Low confidence scores

Some foods have incomplete or inconsistent data. Cross-reference with other sources or use a different search term.

### Network errors

Check internet connection and FDC API status. Implement retry logic for production.

## License

This module uses data from:
- USDA FoodData Central (public domain)
- Open Food Facts (ODbL)

Ensure proper attribution in your application.
