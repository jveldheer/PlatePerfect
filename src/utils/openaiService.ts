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

  const userMessage = `Generate 6 athlete meals with the following context:

Goal: ${context.goal}
Target macros per meal: ${context.target_macros_per_meal.cal} cal, ${context.target_macros_per_meal.protein_g}g protein, ${context.target_macros_per_meal.carb_g}g carbs, ${context.target_macros_per_meal.fat_g}g fat
${userIngredients.length > 0 ? `User ingredients: ${userIngredients.join(', ')}` : 'No specific ingredients - generate creative meals'}
Allowed appliances: ${context.allowed_appliances.join(', ')}
Category preference: ${context.category_preference.join(', ')}

Return ONLY the JSON response matching the schema.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
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
        temperature: 0.9,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate meals');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    const aiResponse: AIMealResponse = JSON.parse(content);

    // Validate the response
    if (!aiResponse.meals || aiResponse.meals.length !== 6) {
      throw new Error('AI did not return exactly 6 meals');
    }

    // Check for duplicate titles
    const titles = aiResponse.meals.map(m => m.title);
    const uniqueTitles = new Set(titles);
    if (uniqueTitles.size !== 6) {
      throw new Error('AI returned duplicate meal titles');
    }

    return aiResponse;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}
