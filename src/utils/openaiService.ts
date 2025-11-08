import type { AIMealResponse, AIContext } from './aiMealGenerator';

const AI_SYSTEM_PROMPT = `You are an elite sports-nutrition meal generator inside an athlete-nutrition app. Be creative and practical for athletes. Use only the local ingredient and nutrient data provided by the app. Never call external services or the web.

Return ONLY valid JSON that matches the schema in this prompt. No prose. No markdown.

RESPONSE JSON SCHEMA
You must return a JSON object with the following structure:
{
  "context": {
    "athlete_id": string,
    "goal": "cut" | "maintain" | "bulk" | "refeed" | "pre_training" | "post_training",
    "target_macros_per_meal": { "cal": number, "protein_g": number, "carb_g": number, "fat_g": number, "fiber_g": number },
    "creative_mode": boolean,
    "category_preference": string[],
    "allowed_appliances": string[],
    "include_staples": boolean,
    "servings_default": number
  },
  "meals": [array of 6 meal objects],
  "summary": {
    "count_by_category": { "no_cook": number, "minimal_cook": number, "full_cook": number, "freestyle": number },
    "macro_sums_all_meals": { "cal": number, "protein_g": number, "carb_g": number, "fat_g": number, "fiber_g": number }
  }
}

IMPORTANT: The "context" field must be included and should echo back the context information provided in the user message (athlete_id, goal, target_macros_per_meal, creative_mode, category_preference, allowed_appliances, include_staples, servings_default).

The "summary" field must include:
- count_by_category: counts of meals by category (no_cook, minimal_cook, full_cook, freestyle)
- macro_sums_all_meals: sum of macros_total from all 6 meals

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

Athlete ID: ${context.athlete_id}
Goal: ${context.goal}
Target macros per meal: ${context.target_macros_per_meal.cal} cal, ${context.target_macros_per_meal.protein_g}g protein, ${context.target_macros_per_meal.carb_g}g carbs, ${context.target_macros_per_meal.fat_g}g fat, ${context.target_macros_per_meal.fiber_g}g fiber
${userIngredients.length > 0 ? `User ingredients: ${userIngredients.join(', ')}` : 'No specific ingredients - generate creative meals'}
Allowed appliances: ${context.allowed_appliances.join(', ')}
Category preference: ${context.category_preference.join(', ')}
Creative mode: ${context.creative_mode}
Include staples: ${context.include_staples}
Default servings: ${context.servings_default}

Return ONLY the JSON response matching the schema. Remember to include the "context" object with all the fields above, the "meals" array with 6 meals, and the "summary" object with count_by_category and macro_sums_all_meals.`;

  try {
    console.log('🚀 Starting API request to OpenAI...');
    console.log('🎯 Target goal:', context.goal);

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout

    const requestBody = {
      model: 'gpt-4o',
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
      temperature: 0.8,
      max_tokens: 3000,
      response_format: { type: 'json_object' }
    };

    console.log('📤 Request details:', {
      model: requestBody.model,
      temperature: requestBody.temperature,
      maxTokens: requestBody.max_tokens,
      systemPromptLength: AI_SYSTEM_PROMPT.length,
      userMessageLength: userMessage.length,
      responseFormat: requestBody.response_format
    });

    let response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
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
      let errorMessage = 'OpenAI API error';
      try {
        const errorData = await response.json();
        console.error('❌ API error response:', errorData);
        errorMessage = errorData.error?.message || `API returned status ${response.status}`;
      } catch (e) {
        console.error('❌ Could not parse error response');
        errorMessage = `API request failed with status ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
      console.log('✅ Successfully parsed JSON response');
    } catch (parseError: any) {
      console.error('❌ Failed to parse response as JSON:', parseError);
      throw new Error('Invalid JSON response from OpenAI API');
    }

    // Detailed diagnostic information
    const diagnostic = {
      hasChoices: !!data.choices,
      choicesCount: data.choices?.length || 0,
      hasFirstChoice: !!data.choices?.[0],
      hasMessage: !!data.choices?.[0]?.message,
      hasContent: !!data.choices?.[0]?.message?.content,
      contentLength: data.choices?.[0]?.message?.content?.length || 0,
      finishReason: data.choices?.[0]?.finish_reason || 'none',
      role: data.choices?.[0]?.message?.role || 'none',
      hasError: !!data.error,
      errorMessage: data.error?.message || 'none'
    };

    console.log('📊 Response diagnostic:', diagnostic);

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('❌ No content in AI response');
      console.error('Full response:', JSON.stringify(data, null, 2));

      // Show diagnostic info in the error message for mobile users
      throw new Error(
        `OpenAI returned no content. Diagnostic:\n` +
        `• Has choices: ${diagnostic.hasChoices}\n` +
        `• Choices count: ${diagnostic.choicesCount}\n` +
        `• Has message: ${diagnostic.hasMessage}\n` +
        `• Content length: ${diagnostic.contentLength}\n` +
        `• Finish reason: ${diagnostic.finishReason}\n` +
        `• Role: ${diagnostic.role}\n` +
        `• Has error: ${diagnostic.hasError}\n` +
        `• Error msg: ${diagnostic.errorMessage}\n` +
        `Full response: ${JSON.stringify(data).substring(0, 200)}`
      );
    }

    console.log('✅ Received', content.length, 'characters of content');

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
    console.error('❌ generateMealsWithAI failed:', error);

    // If it's an abort error (timeout)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }

    // Re-throw the error as-is (it already has a good message from above)
    throw error;
  }
}
