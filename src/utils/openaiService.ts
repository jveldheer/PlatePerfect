import type { AIMealResponse, AIContext } from './aiMealGenerator';

const AI_SYSTEM_PROMPT = `Return ONLY JSON: { "context": {...}, "meals": [3 items with: title, category (no_cook/minimal_cook/full_cook), skill_level (easy/moderate), ingredients with macros, instructions], "summary": {...} }. 3 high-protein meals. Hit macros ±5%. Animal protein. Brief.`;


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

  const userMessage = `Target: ${context.target_macros_per_meal.cal}cal, ${context.target_macros_per_meal.protein_g}gP, ${context.target_macros_per_meal.carb_g}gC, ${context.target_macros_per_meal.fat_g}gF per meal. ${userIngredients.length > 0 ? userIngredients.join(', ') : 'Any'}. JSON only.`;

  try {
    console.log('🚀 Starting API request to Vercel serverless function...');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout (buffer for network)

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
      max_tokens: 1500
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
