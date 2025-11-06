import type { AIMealResponse, AIContext } from './aiMealGenerator';

const AI_SYSTEM_PROMPT = `You are an elite sports-nutrition meal generator inside an athlete-nutrition app. Be creative and practical for athletes. Use only the local ingredient and nutrient data provided by the app. Never call external services or the web.

Return ONLY valid JSON that matches the schema in this prompt. No prose. No markdown.

HARD REQUIREMENTS
1) Produce exactly 6 distinct meals per request. Titles must be unique.
2) All meals are animal based. Each meal must include at least one animal-sourced protein per serving. Never output vegan or vegetarian meals.
   Allowed animal proteins: beef, bison, venison, pork, lamb, chicken, turkey, duck, eggs, egg whites, fish, shellfish, canned tuna, canned salmon, sardines, Greek yogurt, cottage cheese, cheese, whey isolate, casein, collagen, bone broth, ghee.
   If the user supplied ingredients contain no animal items, add one or more from the allowed protein pool.
3) Skill level must be "easy" or "moderate".
4) Every ingredient object must include both the original user_input and the canonical_name you corrected to, plus grams and its own macro contribution.
5) Compute and return accurate macros:
   - macros_total equals the sum of all ingredient macros in the meal
   - macros_per_serving equals macros_total divided by servings
   - Use grams for math. Round to one decimal place.
6) Support meal-prep scaling via "servings" and "scale_factor" fields. Do not re-invent scaling rules. Just return the fields and math consistent with them.
7) Categories are flexible. Use any mix of: "no_cook", "minimal_cook", "full_cook", or "freestyle". Creativity is encouraged. Keep prep friction low and steps concise.
8) If the user supplies NO ingredients, generate six meals at random from internal pools while meeting target macros.
9) Correct misspellings and shorthand. Always return both user_input and canonical_name.
   Common alias examples: grk yog → greek yogurt, cot chs → cottage cheese, chk|chkn|chikn → chicken, tky → turkey, g beef|lean gb → ground beef, salmn|slmn → salmon, tna → tuna, w iso|whey iso → whey isolate, csn → casein, egg whts → egg whites, sardns → sardines, avo → avocado, pb → peanut butter.
10) Use performance_tags when justified: ["recovery","pre_training","anti_inflammatory","gut_friendly","hydration_support","mineral_replete"].
11) Do not exceed the provided appliances and staples. When creativity suggests a method, pick a matching appliance set.
12) Obey the target_macros_per_meal as a guide. Aim within 5 percent when possible while keeping meals realistic for athletes.

CREATIVITY GUIDELINES
- Be inventive across cuisines and textures. Keep steps short, clear, and athlete friendly.
- Vary proteins, carbs, fats, produce, and flavors across the six meals.
- Examples are suggestions, not rules:
  No cook ideas: canned fish salads, cottage cheese fruit bowls, yogurt parfaits, wrap or rice cake stacks.
  Minimal cook ideas: toaster bagel or pita builds, microwave scrambles, microwave potato with dairy protein.
  Full cook ideas: stovetop scrambles, sheet-pan salmon or chicken, skillet stir fry, one-pot pasta with lean meat.

RANDOM GENERATION FALLBACK (when parsed_ingredients is empty)
- Build each meal from internal pools, always including at least one animal protein:
  proteins: chicken breast, ground turkey, turkey breast, lean beef, sirloin, pork tenderloin, eggs, egg whites, canned tuna, canned salmon, sardines, shrimp, salmon fillet, greek yogurt, cottage cheese, whey isolate, casein, collagen, bone broth, ghee
  carbs: oats, rice cups, tortillas, potatoes, sweet potatoes, pasta, quinoa, beans, chickpeas, bagels, pitas, rice cakes
  fats: avocado, olive oil, tahini, peanut butter, almonds, walnuts, pumpkin seeds, butter, mayo
  veg_fruit: spinach, kale, arugula, bell pepper, broccoli, mushrooms, onion, tomato, cucumber, berries, banana, apple, pineapple
  flavor: salsa, hot sauce, soy sauce, curry paste, pesto, mustard, garlic, lemon, vinegar, yogurt sauces, dried herbs, spices

GOAL OPTIMIZATION
- Try to land within 5 percent of target_macros_per_meal when possible.
- Pre_training: favor more carbohydrate, modest protein, lower fat and fiber if meal is close to activity.
- Post_training: favor higher protein with moderate to high carbohydrate and anti inflammatory tags when justified.
- Cut or maintain: emphasize protein density and produce volume.
- Bulk or refeed: emphasize carbohydrate energy and digestion friendly choices.

SELF VALIDATION BEFORE FINAL OUTPUT
- Exactly 6 meals present.
- Titles are unique.
- Every meal has at least one animal protein ingredient.
- Each meal has skill_level in {"easy","moderate"}.
- Ingredient objects include user_input, canonical_name, grams, and per ingredient macros.
- macros_total equals the sum of ingredient macros.
- macros_per_serving equals macros_total divided by servings.
- Output is valid JSON and nothing else.`;

export async function generateMealsWithAI(
  context: AIContext,
  userIngredients: string[]
): Promise<AIMealResponse> {
  const apiKey = localStorage.getItem('openai_api_key');

  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add your API key in Settings.');
  }

  // Validate API key format
  if (!apiKey.startsWith('sk-')) {
    throw new Error('Invalid API key format. OpenAI API keys should start with "sk-"');
  }

  console.log('🔑 API Key detected (first 10 chars):', apiKey.substring(0, 10) + '...');
  console.log('🎯 Goal:', context.goal);
  console.log('📊 Target macros per meal:', context.target_macros_per_meal);

  const userMessage = `Generate 6 athlete meals with the following context:

Goal: ${context.goal}
Target macros per meal: ${context.target_macros_per_meal.cal} cal, ${context.target_macros_per_meal.protein_g}g protein, ${context.target_macros_per_meal.carb_g}g carbs, ${context.target_macros_per_meal.fat_g}g fat
${userIngredients.length > 0 ? `User ingredients: ${userIngredients.join(', ')}` : 'No specific ingredients - generate creative meals'}
Allowed appliances: ${context.allowed_appliances.join(', ')}
Category preference: ${context.category_preference.join(', ')}

Return ONLY the JSON response matching the schema.`;

  try {
    console.log('🚀 Starting API request to OpenAI...');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout (2 minutes)

    const requestBody = {
      model: 'gpt-5-mini',
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
      // temperature not specified - gpt-5-mini only supports default value of 1
      max_completion_tokens: 2500, // GPT-5 models use max_completion_tokens instead of max_tokens
      response_format: { type: 'json_object' }
    };

    console.log('📤 Request model:', requestBody.model);
    console.log('📤 Request max_completion_tokens:', requestBody.max_completion_tokens);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('✅ Received response from OpenAI');
    console.log('📊 Response status:', response.status, response.statusText);

    if (!response.ok) {
      console.error('❌ API request failed with status:', response.status);

      let errorMessage = 'Failed to generate meals';
      try {
        const error = await response.json();
        console.error('❌ Error details:', error);
        errorMessage = error.error?.message || errorMessage;

        // Provide helpful messages for common errors
        if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your OpenAI API key in Settings.';
        } else if (response.status === 429) {
          errorMessage = 'Rate limit exceeded or quota reached. Please check your OpenAI account.';
        } else if (response.status === 500 || response.status === 503) {
          errorMessage = 'OpenAI service temporarily unavailable. Please try again in a moment.';
        }
      } catch (e) {
        console.error('❌ Could not parse error response:', e);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('📦 Parsed response data');

    const content = data.choices[0]?.message?.content;

    if (!content) {
      console.error('❌ No content in response:', data);
      throw new Error('No response from AI');
    }

    console.log('📝 Received content length:', content.length, 'characters');

    // Parse JSON with detailed error handling
    let aiResponse: AIMealResponse;
    try {
      aiResponse = JSON.parse(content);
      console.log('✅ Successfully parsed AI response');
    } catch (parseError: any) {
      console.error('❌ Failed to parse AI response as JSON:', parseError);
      console.error('Raw content received:', content);
      throw new Error(`Invalid JSON from AI: ${parseError.message}`);
    }

    // Validate response structure
    if (!aiResponse) {
      throw new Error('Parsed response is null or undefined');
    }

    if (!aiResponse.context) {
      console.error('❌ Missing context in AI response:', aiResponse);
      throw new Error('AI response missing context field');
    }

    if (!aiResponse.meals) {
      console.error('❌ Missing meals array in AI response:', aiResponse);
      throw new Error('AI response missing meals field');
    }

    if (!Array.isArray(aiResponse.meals)) {
      console.error('❌ Meals is not an array:', typeof aiResponse.meals);
      throw new Error('AI response meals field is not an array');
    }

    if (aiResponse.meals.length !== 6) {
      console.error(`❌ Expected 6 meals, got ${aiResponse.meals.length}`);
      throw new Error(`AI returned ${aiResponse.meals.length} meals instead of 6`);
    }

    // Validate each meal has required fields
    for (let i = 0; i < aiResponse.meals.length; i++) {
      const meal = aiResponse.meals[i];
      if (!meal.title) {
        throw new Error(`Meal ${i + 1} missing title`);
      }
      if (!meal.category) {
        throw new Error(`Meal ${i + 1} ("${meal.title}") missing category`);
      }
      if (!meal.macros_per_serving) {
        throw new Error(`Meal ${i + 1} ("${meal.title}") missing macros_per_serving`);
      }
      if (!meal.ingredients || !Array.isArray(meal.ingredients)) {
        throw new Error(`Meal ${i + 1} ("${meal.title}") missing or invalid ingredients array`);
      }
    }

    // Check for duplicate titles
    const titles = aiResponse.meals.map(m => m.title);
    const uniqueTitles = new Set(titles);
    if (uniqueTitles.size !== 6) {
      console.error('❌ Duplicate meal titles detected:', titles);
      throw new Error('AI returned duplicate meal titles');
    }

    console.log('✅ AI response validation passed - all 6 meals valid');
    return aiResponse;
  } catch (error: any) {
    // Log detailed error information
    console.error('❌ Error in generateMealsWithAI:', error);
    console.error('❌ Error type:', error.name);
    console.error('❌ Error message:', error.message);

    // If it's an abort error (timeout), provide specific message
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 2 minutes. OpenAI API might be slow - please try again.');
    }

    // Handle network/fetch errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to OpenAI API. Check your internet connection or firewall settings.');
    }

    // Handle generic fetch failures
    if (error.message === 'Load failed' || error.message.includes('Failed to fetch')) {
      console.error('❌ Fetch failed - possible causes:');
      console.error('   - CORS issue (unlikely with OpenAI API)');
      console.error('   - Network connectivity problem');
      console.error('   - Browser extension blocking request');
      console.error('   - Invalid API key causing immediate rejection');

      throw new Error(
        'Unable to connect to OpenAI API. This could be due to:\n' +
        '• Network connectivity issues\n' +
        '• Invalid API key format\n' +
        '• Browser extension blocking the request\n' +
        'Please check your API key in Settings and try again.'
      );
    }

    // Re-throw with context
    throw error;
  }
}
