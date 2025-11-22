import type { AIMealResponse, AIContext } from './aiMealGenerator';

const AI_SYSTEM_PROMPT = `Create 3 high-protein athlete meals. Return ONLY valid JSON:
{
  "context": { /* echo back context */ },
  "meals": [
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
  ],
  "summary": { "macro_sums_all_meals": { "cal": 1500, "protein_g": 120, "carb_g": 150, "fat_g": 45, "fiber_g": 24 } }
}

Rules: 3 meals, hit target macros ±5%, animal protein, all fields required, pure JSON.`;


/**
 * Generate 3 meals using AI via our secure Vercel API endpoint
 * This keeps API keys secure on the server side
 */
export async function generateMealsWithAI(
  context: AIContext,
  userIngredients: string[]
): Promise<AIMealResponse> {
  console.log('🎯 Goal:', context.goal);
  console.log('📊 Target macros per meal:', context.target_macros_per_meal);

  const userMessage = `Create 3 meals matching these targets:

Macros per meal: ${context.target_macros_per_meal.cal}cal, ${context.target_macros_per_meal.protein_g}g protein, ${context.target_macros_per_meal.carb_g}g carbs, ${context.target_macros_per_meal.fat_g}g fat
${userIngredients.length > 0 ? `Ingredients: ${userIngredients.join(', ')}` : 'Any ingredients'}

Return complete JSON.`;

  try {
    console.log('🚀 Starting API request to Vercel serverless function...');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 70000); // 70 second timeout (10s buffer for Pro 60s limit)

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
      max_tokens: 2000
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
    let aiResponse: AIMealResponse;
    try {
      aiResponse = JSON.parse(cleanedContent);
      console.log('✅ Successfully parsed AI response');
    } catch (parseError: any) {
      console.error('❌ Failed to parse AI response as JSON:', parseError);
      console.error('Raw content received:', content);
      console.error('Cleaned content:', cleanedContent);
      throw new Error(`Invalid JSON from AI: ${parseError.message}`);
    }

    // Validate response structure
    if (!aiResponse || !aiResponse.meals || !Array.isArray(aiResponse.meals)) {
      throw new Error('AI response missing meals array');
    }

    if (aiResponse.meals.length < 3) {
      console.error(`❌ Expected 3 meals, got ${aiResponse.meals.length}`);
      throw new Error(`AI returned ${aiResponse.meals.length} meals instead of 3`);
    }

    // Validate each meal
    for (let i = 0; i < aiResponse.meals.length; i++) {
      const meal = aiResponse.meals[i];
      if (!meal.title) throw new Error(`Meal ${i + 1} missing title`);
      if (!meal.macros_per_serving) throw new Error(`Meal ${i + 1} missing macros_per_serving`);
      if (!meal.ingredients || !Array.isArray(meal.ingredients)) {
        throw new Error(`Meal ${i + 1} missing ingredients array`);
      }
    }

    console.log(`✅ AI response validated - ${aiResponse.meals.length} meals generated`);
    return aiResponse;
  } catch (error: any) {
    console.error('❌ generateMealsWithAI failed:', error);

    // If it's an abort error (timeout)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    // Re-throw the error as-is (it already has a good message from above)
    throw error;
  }
}
