import type { AIMealResponse, AIContext } from './aiMealGenerator';

const AI_SYSTEM_PROMPT = `Create 1 high-protein athlete meal. Return ONLY valid JSON:
{
  "title": "Meal Name",
  "category": "full_cook",
  "skill_level": "easy",
  "prep_time_min": 10,
  "cook_time_min": 20,
  "servings": 1,
  "ingredients": [
    { "canonical_name": "Chicken", "grams": 170, "macros": { "cal": 187, "protein_g": 35, "carb_g": 0, "fat_g": 4, "fiber_g": 0 } }
  ],
  "instructions": ["Step 1", "Step 2"],
  "macros_per_serving": { "cal": 500, "protein_g": 40, "carb_g": 50, "fat_g": 15, "fiber_g": 8 }
}

Rules: Hit macros ±5%, include animal protein, all fields required, pure JSON.`;


/**
 * Generate a single meal - for sequential generation with progress
 */
export async function generateSingleMeal(
  context: AIContext,
  userIngredients: string[],
  mealNumber: number
): Promise<any> {
  console.log(`🍽️  Generating meal ${mealNumber}/3...`);

  const userMessage = `Create 1 meal matching:
Macros: ${context.target_macros_per_meal.cal}cal, ${context.target_macros_per_meal.protein_g}g protein, ${context.target_macros_per_meal.carb_g}g carbs, ${context.target_macros_per_meal.fat_g}g fat
${userIngredients.length > 0 ? `Use: ${userIngredients.join(', ')}` : 'Any ingredients'}
Return JSON.`;

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
      max_tokens: 800
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

    console.log(`✅ Meal ${mealNumber} validated: ${meal.title}`);
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
    const meal = await generateSingleMeal(context, userIngredients, i);
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
