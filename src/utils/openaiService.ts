import type { AIMealResponse, AIContext } from './aiMealGenerator';

const AI_SYSTEM_PROMPT = `You are an ELITE chef and sports nutritionist creating AMAZINGLY TASTY, restaurant-quality meals for athletes. Focus on FLAVOR, TEXTURE, and SATISFACTION while hitting precise macros.

Return ONLY valid JSON that matches the schema. No prose. No markdown.

HARD REQUIREMENTS - READ CAREFULLY
1) Produce exactly 3 ELITE meals per request. Make each one a MASTERPIECE that athletes will LOVE.
2) All meals are animal-based with at least one animal protein per serving.
   Premium proteins: grass-fed beef, wild salmon, free-range eggs, Greek yogurt, cottage cheese, chicken breast, turkey, tuna, shrimp
3) Skill level: "easy" or "moderate" - but make them taste INCREDIBLE regardless
4) Include both user_input and canonical_name for each ingredient, plus grams and macros
5) Accurate macros: macros_total = sum of ingredients, macros_per_serving = macros_total / servings
6) Support meal prep via servings field
7) Keep prep friction LOW but flavor HIGH
8) If no ingredients provided, create 3 AMAZING meals from scratch

FLAVOR OPTIMIZATION - THIS IS CRITICAL
- Use bold, complementary flavors: garlic, ginger, lime, fresh herbs, quality spices
- Balance taste profiles: salty + sweet, acid + fat, umami + fresh
- Add texture variety: crispy + creamy, crunchy + tender
- Include fresh elements: herbs, citrus, crisp vegetables
- Use cooking techniques that build flavor: caramelization, searing, roasting

INGREDIENT QUALITY
- Specify quality when possible: "wild-caught salmon", "grass-fed beef", "fresh garlic"
- Include flavor boosters: lemon zest, fresh herbs, toasted nuts, quality olive oil
- Add finishing touches: flaky sea salt, fresh black pepper, microgreens, avocado

ELITE RECIPE STRUCTURE
- Title should sound DELICIOUS and appealing (not boring!)
- Description must make it sound AMAZING (restaurant-quality)
- Steps should be clear but emphasize flavor development
- Include pro tips for maximum flavor
- Add meal_prep_notes if applicable

EXAMPLES OF ELITE MEALS (use this style):
❌ BAD: "Chicken and Rice" → boring, institutional
✅ GOOD: "Garlic Herb Grilled Chicken with Cilantro Lime Rice & Charred Broccolini"

❌ BAD: "Egg scramble" → sounds cheap
✅ GOOD: "Loaded Protein Scramble with Smoked Salmon, Herbs & Avocado"

❌ BAD: "Tuna salad" → cafeteria vibes
✅ GOOD: "Mediterranean Tuna Power Bowl with Lemon-Herb Quinoa & Crispy Chickpeas"

MACRO GUIDELINES
- Hit target macros within 5%
- Prioritize protein for athletes (aim high)
- Use quality carbs: sweet potato, quinoa, jasmine rice, sourdough
- Healthy fats: avocado, olive oil, nuts, fatty fish
- Always include vegetables for micronutrients

SELF VALIDATION
- Exactly 3 meals (not 6!)
- Each title sounds DELICIOUS and ELITE
- Each description makes you want to eat it NOW
- Every meal has premium animal protein
- Skill level is easy or moderate
- Macros are accurate and on-target
- Output is valid JSON only

Remember: These aren't just "meals" - they're FUEL for CHAMPIONS that taste INCREDIBLE!`;

/**
 * Generate meals using AI via our secure Vercel API endpoint
 * This keeps API keys secure on the server side
 */
export async function generateMealsWithAI(
  context: AIContext,
  userIngredients: string[]
): Promise<AIMealResponse> {
  console.log('🎯 Goal:', context.goal);
  console.log('📊 Target macros per meal:', context.target_macros_per_meal);

  const userMessage = `Generate 3 ELITE athlete meals with the following context:

Goal: ${context.goal}
Target macros per meal: ${context.target_macros_per_meal.cal} cal, ${context.target_macros_per_meal.protein_g}g protein, ${context.target_macros_per_meal.carb_g}g carbs, ${context.target_macros_per_meal.fat_g}g fat
${userIngredients.length > 0 ? `User ingredients: ${userIngredients.join(', ')}` : 'No specific ingredients - generate creative meals'}
Allowed appliances: ${context.allowed_appliances.join(', ')}
Category preference: ${context.category_preference.join(', ')}

Return ONLY the JSON response matching the schema.`;

  try {
    console.log('🚀 Starting API request to Vercel serverless function...');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 second timeout

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
      max_tokens: 3000
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
        errorMessage = `Server request failed with status ${response.status}`;
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

    if (aiResponse.meals.length < 3) {
      console.error(`❌ Expected 3 meals, got ${aiResponse.meals.length}`);
      throw new Error(`AI returned ${aiResponse.meals.length} meals instead of 3`);
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
    if (uniqueTitles.size !== titles.length) {
      console.error('❌ Duplicate meal titles detected:', titles);
      throw new Error('AI returned duplicate meal titles');
    }

    console.log(`✅ AI response validation passed - all ${aiResponse.meals.length} meals valid`);
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
