import type { AIMealResponse, AIContext } from './aiMealGenerator';

const AI_SYSTEM_PROMPT = `You're a creative chef creating ONE unique, delicious high-protein meal for foodie millennials.

CRITICAL MEASUREMENT RULES:
- Meat/Poultry/Fish: Use pounds (lb) or ounces (oz) ONLY
- Liquids: Use cups, tablespoons (tbsp), teaspoons (tsp)
- Dry ingredients: Use cups, tablespoons (tbsp), teaspoons (tsp)
- Small amounts: Use teaspoons (tsp) or tablespoons (tbsp)
- NEVER use grams - always US imperial measurements

TIMING RULES (BE REALISTIC - DON'T GUESS):
Common cooking times:
- White rice: 18-20min, Brown rice: 40-45min, Quinoa: 15min, Pasta: 8-12min
- Pan-sear steak (medium): 3-4min per side + 2min rest
- Pan-sear chicken breast: 6-7min per side
- Grill chicken thighs: 5-6min per side
- Roast vegetables 425°F: 20-25min
- Sauté vegetables: 5-8min
- Boil eggs: 6-7min soft, 10-12min hard
Total time = prep_time_min + cook_time_min (if user wants 15min total, rice alone won't work)

Return ONLY valid JSON:
{
  "title": "Creative Meal Name",
  "description": "Brief mouthwatering description",
  "category": "full_cook",
  "skill_level": "easy",
  "prep_time_min": 10,
  "cook_time_min": 20,
  "servings": 1,
  "ingredients": [
    {
      "canonical_name": "Chicken Breast",
      "amount": "6 oz",
      "macros": { "cal": 187, "protein_g": 35, "carb_g": 0, "fat_g": 4, "fiber_g": 0 }
    }
  ],
  "instructions": ["Detailed step with specific temps/times"],
  "macros_per_serving": { "cal": 500, "protein_g": 40, "carb_g": 50, "fat_g": 15, "fiber_g": 8 }
}

QUALITY RULES:
- Make it CREATIVE and UNIQUE (not basic/boring)
- Add interesting spices, sauces, or cooking techniques
- Simple but restaurant-quality flavor
- Instructions must be clear and specific (include temps, times)
- All fields required, pure JSON only`;


/**
 * Generate a single meal - for sequential generation with progress
 */
export async function generateSingleMeal(
  context: AIContext,
  userIngredients: string[],
  mealNumber: number,
  skillLevel?: string,
  maxTotalTime?: number
): Promise<any> {
  console.log(`🍽️  Generating meal ${mealNumber}/3...`);

  // Build strict constraints
  const timeConstraint = maxTotalTime
    ? `CRITICAL TIME LIMIT: prep_time_min + cook_time_min MUST be ≤ ${maxTotalTime} minutes total.
${maxTotalTime <= 15 ? 'For quick meals, use: pre-cooked rice/quinoa, tortillas, quick-cooking proteins (shrimp, thin-cut chicken, eggs), no-cook bases (wraps, salads).' : ''}
Be realistic - if rice takes 18min to cook, you can't fit it in a 15min meal. Account for actual cooking times.`
    : '';

  const skillConstraint = skillLevel
    ? `SKILL LEVEL: ${skillLevel}. ${
        skillLevel === 'beginner' ? 'Use simple techniques only - no complex knife work, no precise temperatures, max 5 ingredients.' :
        skillLevel === 'intermediate' ? 'Can use moderate techniques - some knife work, basic sauce-making, 5-8 ingredients.' :
        'Can use advanced techniques - precision cooking, complex flavors, 8+ ingredients.'
      }`
    : '';

  const userMessage = `Create 1 CREATIVE meal (meal #${mealNumber}) with these STRICT requirements:

MACROS (±5%):
- Calories: ${context.target_macros_per_meal.cal}
- Protein: ${context.target_macros_per_meal.protein_g}g
- Carbs: ${context.target_macros_per_meal.carb_g}g
- Fat: ${context.target_macros_per_meal.fat_g}g

${timeConstraint}

${skillConstraint}

${userIngredients.length > 0 ? `MUST FEATURE: ${userIngredients.join(', ')}` : 'Use any ingredients'}

VARIETY (meal #${mealNumber} of 3):
Make this COMPLETELY DIFFERENT from other meals by varying:
- Cooking method: ${mealNumber === 1 ? 'grilled/pan-seared' : mealNumber === 2 ? 'roasted/baked' : 'air-fried/sautéed'}
- Cuisine: ${mealNumber === 1 ? 'Mediterranean/Middle Eastern' : mealNumber === 2 ? 'Asian/Latin' : 'American/European'}
- Base: ${mealNumber === 1 ? 'rice/quinoa/farro' : mealNumber === 2 ? 'sweet potato/cauliflower rice/pasta' : 'wraps/flatbread/salad'}
- Flavor: ${mealNumber === 1 ? 'bright/citrusy/herbaceous' : mealNumber === 2 ? 'spicy/bold/umami' : 'savory/rich/tangy'}

MEASUREMENTS:
- Meat: oz or lb (e.g., "6 oz chicken breast", "0.5 lb ground beef")
- Liquids: cups, tbsp, tsp (e.g., "1 cup water", "2 tbsp olive oil")
- Dry goods: cups, tbsp, tsp (e.g., "1/2 cup rice", "1 tsp cumin")

Return complete JSON with creative title and mouthwatering description.`;

  try {
    console.log('🚀 Starting API request to Vercel serverless function...');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout per meal

    const requestBody = {
      messages: [
        {
          role: 'system',
          content: AI_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 1000
    };

    console.log('📤 Request details:', {
      systemPromptLength: AI_SYSTEM_PROMPT.length,
      userMessageLength: userMessage.length
    });

    let response;
    try {
      // Call our Vercel API endpoint instead of OpenAI directly
      const apiUrl = import.meta.env.PROD ? '/api/openai' : 'http://localhost:5173/api/openai';

      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      console.error('❌ Fetch error:', fetchError);
      throw new Error(`Network error: ${fetchError.message}`);
    }

    clearTimeout(timeoutId);
    console.log('✅ Got response, status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Server error';
      try {
        const errorData = await response.json();
        console.error('❌ API error response:', errorData);
        errorMessage = errorData.error || `Server returned status ${response.status}`;
      } catch (e) {
        console.error('❌ Could not parse error response');
        if (response.status === 504) {
          errorMessage = 'Request timed out (504). Try with fewer ingredients or simpler options.';
        } else {
          errorMessage = `Server request failed with status ${response.status}`;
        }
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
      console.log('✅ Successfully parsed JSON response');
    } catch (parseError: any) {
      console.error('❌ Failed to parse response as JSON:', parseError);
      throw new Error('Invalid JSON response from server');
    }

    const content = data.content;

    if (!content) {
      console.error('❌ No content in response');
      throw new Error('Server returned no content');
    }

    console.log('✅ Received', content.length, 'characters of content');

    // Clean up response - remove markdown code blocks if present
    let cleanedContent = content.trim();

    // Remove ```json and ``` markers if present
    if (cleanedContent.startsWith('```')) {
      const lines = cleanedContent.split('\n');
      // Remove first line (```json or ```)
      lines.shift();
      // Remove last line if it's just ```
      if (lines[lines.length - 1].trim() === '```') {
        lines.pop();
      }
      cleanedContent = lines.join('\n').trim();
    }

    // Parse JSON with detailed error handling
    let meal: any;
    try {
      meal = JSON.parse(cleanedContent);
      console.log(`✅ Meal ${mealNumber} parsed successfully`);
    } catch (parseError: any) {
      console.error('❌ Failed to parse AI response as JSON:', parseError);
      throw new Error(`Invalid JSON from AI: ${parseError.message}`);
    }

    // Validate meal structure
    if (!meal || !meal.title) {
      throw new Error('Meal missing title');
    }

    if (!meal.macros_per_serving) {
      throw new Error('Meal missing macros_per_serving');
    }

    if (!meal.ingredients || !Array.isArray(meal.ingredients)) {
      throw new Error('Meal missing ingredients array');
    }

    // Validate time constraints if provided
    if (maxTotalTime) {
      const totalTime = (meal.prep_time_min || 0) + (meal.cook_time_min || 0);
      if (totalTime > maxTotalTime) {
        console.warn(`⚠️ Meal ${mealNumber} exceeds time limit: ${totalTime}min > ${maxTotalTime}min`);
        // Still return it but log the warning
      }
    }

    // Validate skill level constraints
    if (skillLevel === 'beginner' && meal.ingredients?.length > 7) {
      console.warn(`⚠️ Meal ${mealNumber} has too many ingredients for beginner: ${meal.ingredients.length}`);
    }

    console.log(`✅ Meal ${mealNumber} validated: ${meal.title} (${meal.prep_time_min + meal.cook_time_min}min total)`);
    return meal;
  } catch (error: any) {
    console.error(`❌ generateSingleMeal ${mealNumber} failed:`, error);

    // If it's an abort error (timeout)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    // Re-throw the error as-is (it already has a good message from above)
    throw error;
  }
}

/**
 * Legacy function - generates all 3 meals at once
 * Use generateSingleMeal() for better reliability
 */
export async function generateMealsWithAI(
  context: AIContext,
  userIngredients: string[]
): Promise<AIMealResponse> {
  console.log('🎯 Generating 3 meals sequentially...');

  const meals: any[] = [];

  for (let i = 1; i <= 3; i++) {
    const meal = await generateSingleMeal(context, userIngredients, i, undefined, undefined);
    meals.push(meal);
  }

  return {
    context,
    meals,
    summary: {
      count_by_category: {},
      macro_sums_all_meals: {
        cal: meals.reduce((sum, m) => sum + (m.macros_per_serving?.cal || 0), 0),
        protein_g: meals.reduce((sum, m) => sum + (m.macros_per_serving?.protein_g || 0), 0),
        carb_g: meals.reduce((sum, m) => sum + (m.macros_per_serving?.carb_g || 0), 0),
        fat_g: meals.reduce((sum, m) => sum + (m.macros_per_serving?.fat_g || 0), 0),
        fiber_g: meals.reduce((sum, m) => sum + (m.macros_per_serving?.fiber_g || 0), 0)
      }
    }
  };
}
