import type { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    id: 'recipe-001',
    title: 'Power Oatmeal Bowl',
    category: 'breakfast',
    difficulty: 'beginner',
    description: 'A protein-packed breakfast that provides sustained energy for morning workouts',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    athleteNotes: 'Complex carbs from oats provide lasting energy, while protein and healthy fats support muscle recovery. Perfect pre-workout meal 1-2 hours before training.',
    requiredSkills: ['cook-001', 'prep-001'],
    tags: ['high-protein', 'pre-workout', 'vegetarian', 'quick'],
    mealPrepNotes: 'Can prep dry ingredients for 5 servings in advance. Store in containers and just add liquid when ready to cook. Overnight oats version works great too.',
    storageInstructions: 'Store cooked oatmeal in refrigerator for up to 3 days. Reheat with a splash of milk. Toppings should be added fresh.',
    nutritionInfo: {
      calories: 520,
      protein: 25,
      carbs: 68,
      fat: 16,
      fiber: 10,
      servings: 1
    },
    ingredients: [
      { item: 'Rolled oats', amount: '1/2 cup', notes: 'Old-fashioned, not instant' },
      { item: 'Water or milk', amount: '1 cup', notes: 'Milk adds extra protein' },
      { item: 'Protein powder', amount: '1 scoop (25g)', notes: 'Any flavor - vanilla or chocolate work well' },
      { item: 'Banana', amount: '1 medium', notes: 'Sliced' },
      { item: 'Almond butter', amount: '1 tablespoon' },
      { item: 'Chia seeds', amount: '1 tablespoon' },
      { item: 'Honey', amount: '1 teaspoon', notes: 'Optional for sweetness' },
      { item: 'Cinnamon', amount: '1/4 teaspoon' },
      { item: 'Salt', amount: 'Pinch' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Add oats, water/milk, cinnamon, and salt to a small saucepan.',
        detailedExplanation: 'Use a 2-quart saucepan for easy stirring. Measure your oats by spooning them into a dry measuring cup and leveling off - don\'t pack them down. The salt might seem unnecessary but it enhances the sweetness and prevents bland oatmeal.',
        timeEstimate: 1
      },
      {
        step: 2,
        instruction: 'Turn heat to medium-high and bring to a gentle boil, stirring occasionally.',
        detailedExplanation: 'Place the pan on the burner and turn heat to medium-high. You\'ll see small bubbles forming around the edges first, then larger bubbles breaking the surface - that\'s a boil. Stir every 30 seconds or so to prevent sticking. This should take 2-3 minutes.',
        skillTip: 'This is boiling - large bubbles rapidly breaking the surface. Review skill cook-001 for more details.',
        timeEstimate: 3
      },
      {
        step: 3,
        instruction: 'Reduce heat to low and simmer for 5 minutes, stirring frequently.',
        detailedExplanation: 'Turn the heat down to low - the oatmeal should now have tiny bubbles gently breaking the surface, not a rolling boil. This is simmering. Stir every minute to keep it from sticking to the bottom. The oats will absorb the liquid and become creamy. If it gets too thick, add a splash more liquid.',
        skillTip: 'Simmering uses gentle heat for even cooking. The oatmeal should barely bubble.',
        timeEstimate: 5
      },
      {
        step: 4,
        instruction: 'Remove from heat and stir in protein powder immediately.',
        detailedExplanation: 'Turn off the burner and remove the pan from heat. Add your protein powder now while the oatmeal is very hot - this helps it incorporate smoothly. Stir vigorously with a spoon or whisk until no clumps remain. The mixture will thicken as the protein powder absorbs moisture.',
        timeEstimate: 1
      },
      {
        step: 5,
        instruction: 'Transfer to a bowl and add toppings.',
        detailedExplanation: 'Pour the oatmeal into your serving bowl. Slice your banana into coins about 1/4-inch thick. Add the sliced banana, then drizzle the almond butter over the top (microwave it for 10 seconds if it\'s hard to drizzle). Sprinkle chia seeds evenly over everything, and finish with honey if desired.',
        timeEstimate: 2
      }
    ]
  },
  {
    id: 'recipe-002',
    title: 'Grilled Chicken Breast with Herbs',
    category: 'lunch',
    difficulty: 'intermediate',
    description: 'Perfectly cooked, juicy chicken breast - a meal prep staple',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    athleteNotes: 'Lean protein essential for muscle repair and growth. Each serving provides 40g protein with minimal fat. Use this as your weekly meal prep protein base.',
    requiredSkills: ['knife-001', 'cook-004', 'safety-001', 'safety-002'],
    tags: ['high-protein', 'low-fat', 'meal-prep', 'post-workout'],
    mealPrepNotes: 'Cook all 4 servings at once. Slice after cooking for easy portioning. Use in salads, wraps, grain bowls, or with roasted vegetables throughout the week.',
    storageInstructions: 'Refrigerate in airtight container for up to 4 days. Freeze for up to 3 months. Reheat gently to avoid drying out - add a splash of chicken broth when reheating.',
    nutritionInfo: {
      calories: 185,
      protein: 40,
      carbs: 0,
      fat: 3,
      fiber: 0,
      servings: 4
    },
    ingredients: [
      { item: 'Chicken breasts', amount: '4 pieces (6 oz each)', notes: 'Boneless, skinless' },
      { item: 'Olive oil', amount: '2 tablespoons' },
      { item: 'Garlic powder', amount: '1 teaspoon' },
      { item: 'Dried oregano', amount: '1 teaspoon' },
      { item: 'Dried thyme', amount: '1/2 teaspoon' },
      { item: 'Salt', amount: '1 teaspoon' },
      { item: 'Black pepper', amount: '1/2 teaspoon' },
      { item: 'Lemon', amount: '1', notes: 'Cut into wedges for serving' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Remove chicken from refrigerator 20 minutes before cooking.',
        detailedExplanation: 'Take the chicken out of the fridge and let it sit on the counter. This brings it closer to room temperature, which helps it cook more evenly. Cold chicken on the outside can be overcooked by the time the inside reaches safe temperature. Set a timer so you don\'t forget about it.',
        skillTip: 'Room temperature proteins cook more evenly and develop better crusts.',
        timeEstimate: 1
      },
      {
        step: 2,
        instruction: 'Pat chicken completely dry with paper towels.',
        detailedExplanation: 'This step is crucial. Take 3-4 paper towels and press firmly on all sides of each chicken breast to remove all surface moisture. Wet chicken will steam instead of developing a nice golden crust. The paper towels should come away damp - if they\'re soaked, use more towels. Be thorough.',
        skillTip: 'Dry surfaces are essential for browning. Any moisture will create steam and prevent crust formation.',
        timeEstimate: 2
      },
      {
        step: 3,
        instruction: 'If chicken breasts are very thick, butterfly or pound them to even thickness.',
        detailedExplanation: 'Place chicken on cutting board. If any breast is thicker than 1 inch, you need to even it out. To butterfly: Hold your hand flat on top of the chicken, and carefully slice horizontally through the thickest part, stopping before you cut all the way through. Open it like a book. This helps everything cook at the same rate and prevents dry, overcooked edges.',
        timeEstimate: 3
      },
      {
        step: 4,
        instruction: 'Mix oil and seasonings, then coat chicken on all sides.',
        detailedExplanation: 'In a small bowl, combine olive oil, garlic powder, oregano, thyme, salt, and pepper. Stir with a spoon. Place chicken in a large bowl or on a plate. Pour the oil mixture over the chicken and use your hands to rub it all over every surface - top, bottom, and sides. Make sure it\'s evenly coated. Wash your hands immediately after handling raw chicken.',
        skillTip: 'Even seasoning ensures consistent flavor. Don\'t be shy - coat it well.',
        timeEstimate: 3
      },
      {
        step: 5,
        instruction: 'Preheat a grill pan or outdoor grill to medium-high heat.',
        detailedExplanation: 'If using a grill pan on the stove, place it over a burner set to medium-high and let it heat for 5 minutes. If using an outdoor grill, heat to 400-450°F. You want the surface hot enough that a drop of water sizzles immediately. This high heat creates the flavorful crust.',
        timeEstimate: 5
      },
      {
        step: 6,
        instruction: 'Place chicken on the grill and cook undisturbed for 5-7 minutes.',
        detailedExplanation: 'Carefully lay each chicken breast on the hot grill, placing it down away from you to prevent oil splatter toward you. You should hear an immediate sizzle. Now - and this is important - don\'t touch it. Don\'t move it, flip it, or press it with your spatula. Just let it cook. The heat is working to create a golden-brown crust. Set a timer for 6 minutes.',
        skillTip: 'Patience is key. The chicken will release from the grill when it\'s ready to flip.',
        timeEstimate: 6
      },
      {
        step: 7,
        instruction: 'Flip chicken and cook second side for 5-7 minutes until internal temp reaches 165°F.',
        detailedExplanation: 'After 6 minutes, try to lift a corner of the chicken with tongs. If it resists, give it another minute. When it releases easily, flip each piece over. Cook the second side the same way - no touching! After 5 minutes, insert your instant-read thermometer into the thickest part of the largest breast. You\'re looking for 165°F. If it\'s not there yet, check every minute.',
        skillTip: 'Always use a thermometer - it\'s the only reliable way to know chicken is both safe and not overcooked.',
        timeEstimate: 7
      },
      {
        step: 8,
        instruction: 'Remove from heat and rest for 5 minutes before slicing.',
        detailedExplanation: 'Transfer chicken to a clean plate (never the one that held raw chicken!). Tent loosely with aluminum foil if you have it. Set a timer for 5 minutes and resist the urge to cut into it. During this rest time, the juices redistribute throughout the meat. If you cut immediately, those juices run out onto the plate instead of staying in the chicken. After resting, slice against the grain into strips.',
        timeEstimate: 5
      }
    ]
  },
  {
    id: 'recipe-003',
    title: 'Sweet Potato and Black Bean Bowl',
    category: 'dinner',
    difficulty: 'beginner',
    description: 'A nutrient-dense vegetarian bowl packed with complex carbs and plant protein',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    athleteNotes: 'Sweet potatoes provide complex carbohydrates for glycogen replenishment. Black beans offer plant protein and fiber. Perfect post-workout meal for muscle recovery and sustained energy.',
    requiredSkills: ['knife-002', 'cook-001', 'cook-003', 'prep-001'],
    tags: ['vegetarian', 'high-fiber', 'meal-prep', 'post-workout'],
    mealPrepNotes: 'Each component can be prepped separately and assembled when ready to eat. Sweet potatoes stay crispy if stored separately from other ingredients.',
    storageInstructions: 'Store components separately in refrigerator for up to 5 days. Reheat sweet potatoes in oven at 400°F for 5 minutes to restore crispness.',
    nutritionInfo: {
      calories: 425,
      protein: 15,
      carbs: 72,
      fat: 9,
      fiber: 17,
      servings: 4
    },
    ingredients: [
      { item: 'Sweet potatoes', amount: '2 large', notes: 'About 1.5 lbs total' },
      { item: 'Olive oil', amount: '3 tablespoons', notes: 'Divided' },
      { item: 'Chili powder', amount: '1 teaspoon' },
      { item: 'Cumin', amount: '1 teaspoon' },
      { item: 'Salt', amount: '1 teaspoon', notes: 'Divided' },
      { item: 'Black pepper', amount: '1/2 teaspoon' },
      { item: 'Black beans', amount: '2 cans (15 oz each)', notes: 'Drained and rinsed' },
      { item: 'Red bell pepper', amount: '1 large', notes: 'Diced' },
      { item: 'Red onion', amount: '1/2 medium', notes: 'Diced' },
      { item: 'Garlic', amount: '3 cloves', notes: 'Minced' },
      { item: 'Lime', amount: '2', notes: 'Juiced' },
      { item: 'Fresh cilantro', amount: '1/4 cup', notes: 'Chopped' },
      { item: 'Brown rice', amount: '2 cups', notes: 'Cooked' },
      { item: 'Avocado', amount: '1', notes: 'Sliced, for serving' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Preheat oven to 425°F and line a baking sheet with parchment paper.',
        detailedExplanation: 'Turn your oven on to 425°F. While it heats, take a rimmed baking sheet (also called a sheet pan) and place a piece of parchment paper on it. Cut the parchment to fit if needed. This prevents sticking and makes cleanup easy. Let the oven preheat fully - it usually takes 10-15 minutes and most ovens beep when ready.',
        timeEstimate: 2
      },
      {
        step: 2,
        instruction: 'Peel and dice sweet potatoes into 3/4-inch cubes.',
        detailedExplanation: 'Use a vegetable peeler to remove the sweet potato skin, working away from your body. Rinse off any dirt. Place the potato on your cutting board. Cut it in half lengthwise, then place each half flat-side down for stability. Cut into 3/4-inch thick slices, then cut each slice into 3/4-inch strips. Finally, cut across the strips to create cubes. Try to keep them uniform in size so they cook evenly.',
        skillTip: 'Uniform sizes ensure everything cooks at the same rate. Use your knife skills from knife-002.',
        timeEstimate: 8
      },
      {
        step: 3,
        instruction: 'Toss sweet potatoes with 2 tablespoons oil, chili powder, cumin, 1/2 teaspoon salt, and pepper.',
        detailedExplanation: 'Put the diced sweet potatoes in a large bowl. Measure out 2 tablespoons of olive oil and pour it over the potatoes. Add the chili powder, cumin, half the salt, and the pepper. Use your hands or a large spoon to toss everything together until every piece is coated with oil and spices. The coating should look even.',
        timeEstimate: 2
      },
      {
        step: 4,
        instruction: 'Spread sweet potatoes in a single layer on prepared baking sheet and roast for 25-30 minutes.',
        detailedExplanation: 'Pour the seasoned sweet potatoes onto your parchment-lined baking sheet. Use your hands or a spatula to spread them out so they\'re in one layer with space between pieces - don\'t pile them up or they\'ll steam instead of roast. Place the baking sheet in the preheated oven on the middle rack. Set a timer for 15 minutes - you\'ll flip them halfway through cooking.',
        skillTip: 'Spreading in a single layer with space allows hot air to circulate and creates caramelization.',
        timeEstimate: 2
      },
      {
        step: 5,
        instruction: 'While sweet potatoes roast, dice bell pepper and onion.',
        detailedExplanation: 'For the bell pepper: Cut off the top and bottom, stand it upright, and slice down the sides to remove the walls of pepper, leaving the seedy core. Discard the core and seeds. Flatten the pepper pieces and dice into 1/2-inch pieces. For the onion: Cut in half from root to tip, peel off the papery skin, place flat-side down, and make cuts following the natural lines of the onion, then slice across to dice.',
        skillTip: 'Use the chopping technique from knife-002 for consistent dice.',
        timeEstimate: 5
      },
      {
        step: 6,
        instruction: 'After 15 minutes, flip sweet potatoes with a spatula and continue roasting for 10-15 more minutes.',
        detailedExplanation: 'When your timer goes off, carefully pull the baking sheet out of the oven (use oven mitts!). Use a spatula to flip each sweet potato piece over - the bottom sides should be golden brown. If they\'re sticking, they need another minute or two. Spread them out again and return to the oven for the remaining cooking time, until they\'re tender when pierced with a fork and crispy on the outside.',
        timeEstimate: 1
      },
      {
        step: 7,
        instruction: 'Heat remaining 1 tablespoon oil in a large skillet over medium heat.',
        detailedExplanation: 'Place a large skillet (10-12 inches) on the stove. Turn the heat to medium and let it warm up for 1 minute. Add 1 tablespoon of olive oil and swirl the pan so the oil coats the bottom. Wait about 30 seconds until the oil shimmers and moves easily when you tilt the pan. This means it\'s hot and ready.',
        timeEstimate: 2
      },
      {
        step: 8,
        instruction: 'Add bell pepper and onion, sauté for 5 minutes until softened.',
        detailedExplanation: 'Add the diced bell pepper and onion to the hot pan - you should hear a sizzle. Stir with a wooden spoon or spatula. Cook, stirring every minute or so, until the vegetables become tender and the onion turns translucent. This takes about 5 minutes. The vegetables should reduce in size and lose their raw crunch.',
        skillTip: 'This is sautéing - cooking quickly in a small amount of oil over medium-high heat.',
        timeEstimate: 5
      },
      {
        step: 9,
        instruction: 'Add minced garlic and cook for 30 seconds until fragrant.',
        detailedExplanation: 'Add the minced garlic to the pan with the peppers and onions. Stir immediately and constantly. Garlic cooks very quickly and can burn easily, which makes it bitter. You\'ll smell a wonderful aroma after about 30 seconds - that\'s when it\'s done. Any longer and it starts to brown too much.',
        skillTip: 'Always add garlic toward the end - it burns easily and becomes bitter.',
        timeEstimate: 1
      },
      {
        step: 10,
        instruction: 'Add black beans, remaining salt, and half the lime juice. Cook until heated through.',
        detailedExplanation: 'Open your cans of black beans and pour them into a colander in the sink. Rinse them under cold water for 30 seconds - this removes excess sodium and the starchy liquid. Let them drain well. Add the beans to the skillet along with the remaining 1/2 teaspoon salt and the juice from one lime. Stir everything together and cook for 3-4 minutes until the beans are hot throughout.',
        timeEstimate: 4
      },
      {
        step: 11,
        instruction: 'Assemble bowls with rice, black bean mixture, roasted sweet potatoes, avocado, and cilantro.',
        detailedExplanation: 'Get 4 serving bowls. In each bowl, add about 1/2 cup of cooked brown rice as the base. Add a scoop of the black bean mixture next to the rice. Place roasted sweet potatoes on the other side. Slice the avocado and fan a few slices over the top. Sprinkle with fresh cilantro and squeeze the remaining lime juice over everything. You can also add hot sauce, plain Greek yogurt, or salsa if desired.',
        timeEstimate: 3
      }
    ]
  },
  {
    id: 'recipe-004',
    title: 'Post-Workout Protein Smoothie',
    category: 'post-workout',
    difficulty: 'beginner',
    description: 'Fast-absorbing protein and carbs for optimal muscle recovery',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    athleteNotes: 'Consume within 30-60 minutes after training for optimal recovery. The 3:1 carb-to-protein ratio is ideal for glycogen replenishment and muscle protein synthesis.',
    requiredSkills: ['prep-001', 'prep-002'],
    tags: ['post-workout', 'high-protein', 'quick', 'vegetarian'],
    mealPrepNotes: 'Prep smoothie packs by portioning all ingredients except liquid into freezer bags. When ready to drink, dump contents into blender and add liquid.',
    storageInstructions: 'Best consumed immediately. Can be refrigerated for up to 24 hours - shake well before drinking.',
    nutritionInfo: {
      calories: 380,
      protein: 30,
      carbs: 52,
      fat: 6,
      fiber: 7,
      servings: 1
    },
    ingredients: [
      { item: 'Banana', amount: '1 large', notes: 'Frozen for creamier texture' },
      { item: 'Protein powder', amount: '1 scoop (30g)', notes: 'Vanilla or chocolate' },
      { item: 'Greek yogurt', amount: '1/2 cup', notes: 'Plain, non-fat or low-fat' },
      { item: 'Milk', amount: '1 cup', notes: 'Any type - dairy or plant-based' },
      { item: 'Spinach', amount: '1 cup', notes: 'Fresh or frozen' },
      { item: 'Peanut butter', amount: '1 tablespoon' },
      { item: 'Honey', amount: '1 tablespoon' },
      { item: 'Ice cubes', amount: '1/2 cup', notes: 'If using fresh banana' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Add liquid ingredients to blender first.',
        detailedExplanation: 'Start by pouring the milk into your blender. Then add the Greek yogurt. Putting liquids on the bottom helps the blender blades move more easily and prevents ingredients from getting stuck. This is especially important for less powerful blenders.',
        skillTip: 'Liquids first prevents blender jamming and helps achieve smooth consistency.',
        timeEstimate: 1
      },
      {
        step: 2,
        instruction: 'Add soft ingredients: banana, peanut butter, and honey.',
        detailedExplanation: 'Peel your banana if using fresh (frozen ones are usually already peeled). Break it into 3-4 chunks and drop them in the blender. Add the peanut butter - you can scoop it directly or measure it into a spoon first. Drizzle in the honey. These softer ingredients go in the middle layer.',
        timeEstimate: 1
      },
      {
        step: 3,
        instruction: 'Add protein powder and spinach.',
        detailedExplanation: 'Scoop the protein powder and add it to the blender. Don\'t worry if it sits on top - it\'ll blend in. Add your spinach leaves - if using fresh, pack them in loosely. If using frozen spinach, break apart any clumps first. Don\'t worry about the spinach - you won\'t taste it, but you\'ll get the nutrients.',
        timeEstimate: 1
      },
      {
        step: 4,
        instruction: 'Add ice if using fresh banana.',
        detailedExplanation: 'If your banana was fresh (not frozen), add about 1/2 cup of ice cubes. This makes the smoothie cold and thick like a milkshake. If you used a frozen banana, you don\'t need ice - the frozen banana does the job.',
        timeEstimate: 1
      },
      {
        step: 5,
        instruction: 'Blend on high for 45-60 seconds until completely smooth.',
        detailedExplanation: 'Put the lid on your blender securely - hold it down with your hand. Start on low speed for a few seconds to get things moving, then increase to high speed. Blend for 45-60 seconds. You might need to stop and scrape down the sides with a spatula if ingredients get stuck. The smoothie is ready when you don\'t see any chunks and the color is uniform. It should be thick but pourable.',
        skillTip: 'If too thick, add more milk. If too thin, add more ice or frozen fruit.',
        timeEstimate: 2
      }
    ]
  },
  {
    id: 'recipe-005',
    title: 'Teriyaki Salmon with Broccoli',
    category: 'dinner',
    difficulty: 'intermediate',
    description: 'Omega-3 rich salmon with a homemade teriyaki glaze',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    athleteNotes: 'Salmon provides high-quality protein and omega-3 fatty acids that reduce inflammation and support joint health. Ideal for recovery days and overall athletic performance.',
    requiredSkills: ['cook-004', 'cook-003', 'safety-001', 'safety-002', 'prep-001'],
    tags: ['high-protein', 'anti-inflammatory', 'omega-3', 'meal-prep'],
    mealPrepNotes: 'Cook salmon and broccoli separately. Store sauce on the side and drizzle when reheating to maintain best texture.',
    storageInstructions: 'Refrigerate for up to 3 days. Reheat fish gently at 275°F for 10 minutes to prevent drying out.',
    nutritionInfo: {
      calories: 385,
      protein: 42,
      carbs: 18,
      fat: 15,
      fiber: 4,
      servings: 4
    },
    ingredients: [
      { item: 'Salmon fillets', amount: '4 pieces (6 oz each)', notes: 'Skin on or off' },
      { item: 'Broccoli', amount: '1 large head', notes: 'Cut into florets' },
      { item: 'Soy sauce', amount: '1/3 cup', notes: 'Low-sodium preferred' },
      { item: 'Honey', amount: '3 tablespoons' },
      { item: 'Rice vinegar', amount: '2 tablespoons' },
      { item: 'Garlic', amount: '3 cloves', notes: 'Minced' },
      { item: 'Fresh ginger', amount: '1 tablespoon', notes: 'Grated' },
      { item: 'Cornstarch', amount: '1 tablespoon' },
      { item: 'Water', amount: '2 tablespoons' },
      { item: 'Sesame oil', amount: '1 tablespoon' },
      { item: 'Olive oil', amount: '2 tablespoons' },
      { item: 'Sesame seeds', amount: '1 tablespoon', notes: 'For garnish' },
      { item: 'Green onions', amount: '2', notes: 'Sliced, for garnish' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Make teriyaki sauce: Combine soy sauce, honey, rice vinegar, garlic, and ginger in a small saucepan.',
        detailedExplanation: 'Take a small saucepan (1-2 quart size) and add the soy sauce, honey, and rice vinegar. For the garlic: peel the cloves and mince them finely using your knife skills. For the ginger: use a spoon to scrape off the skin, then grate it on the small holes of a box grater or use a microplane. Add the garlic and ginger to the sauce. Stir everything together.',
        timeEstimate: 4
      },
      {
        step: 2,
        instruction: 'Bring sauce to a simmer over medium heat.',
        detailedExplanation: 'Place the saucepan on a burner and turn heat to medium. Watch the sauce as it heats - you\'ll see small bubbles forming around the edges first. After 3-4 minutes, gentle bubbles should be breaking the surface all over. This is simmering. Stir occasionally to prevent burning on the bottom.',
        skillTip: 'Simmering (gentle bubbles) versus boiling (rapid bubbles) - review cook-001.',
        timeEstimate: 4
      },
      {
        step: 3,
        instruction: 'Mix cornstarch and water, add to sauce, simmer 2 minutes until thickened.',
        detailedExplanation: 'In a small bowl, add 1 tablespoon cornstarch and 2 tablespoons cold water. Stir with a fork until completely smooth with no lumps - this is a "slurry." Pour the slurry into the simmering sauce while stirring constantly. Keep stirring for about 2 minutes. The sauce will thicken noticeably and become glossy. Remove from heat and stir in the sesame oil.',
        skillTip: 'Cornstarch must be mixed with cold water first to prevent lumps in the sauce.',
        timeEstimate: 3
      },
      {
        step: 4,
        instruction: 'Preheat oven to 400°F. Line a baking sheet with parchment.',
        detailedExplanation: 'Turn your oven to 400°F and let it preheat. Take a rimmed baking sheet and line it with parchment paper for easy cleanup. While the oven heats, you\'ll prepare the salmon and broccoli.',
        timeEstimate: 2
      },
      {
        step: 5,
        instruction: 'Pat salmon fillets dry and season with salt and pepper.',
        detailedExplanation: 'Take the salmon fillets and pat them completely dry on all sides with paper towels. This is crucial for getting a good sear. Season both sides with a pinch of salt and pepper. If the salmon has skin, check for any remaining scales by running your finger against the grain - remove any you find.',
        skillTip: 'Dry fish is essential for browning. Any moisture will cause steaming.',
        timeEstimate: 2
      },
      {
        step: 6,
        instruction: 'Heat 1 tablespoon olive oil in an oven-safe skillet over medium-high heat.',
        detailedExplanation: 'Place an oven-safe skillet (cast iron or stainless steel with metal handle) on the stove. Turn heat to medium-high and let it heat for 2 minutes. Add 1 tablespoon of olive oil and swirl to coat. Wait until the oil shimmers - it should look like it\'s moving when you tilt the pan. This means it\'s hot enough.',
        timeEstimate: 3
      },
      {
        step: 7,
        instruction: 'Place salmon skin-side up in skillet, sear for 3 minutes without moving.',
        detailedExplanation: 'Carefully place each salmon fillet in the hot pan, laying it down away from you to prevent splatter. If it has skin, place it skin-side UP first (we\'ll flip it). You should hear an immediate sizzle. Now don\'t touch it! Set a timer for 3 minutes. The salmon is developing a golden crust on the bottom.',
        skillTip: 'Let the fish develop a crust before attempting to flip - it will release when ready.',
        timeEstimate: 3
      },
      {
        step: 8,
        instruction: 'Flip salmon, brush with teriyaki sauce, transfer to oven for 6-8 minutes.',
        detailedExplanation: 'After 3 minutes, flip each piece of salmon over using a spatula - it should release easily. Use a brush or spoon to coat the top of each fillet with teriyaki sauce. Carefully transfer the entire skillet to the preheated oven (use oven mitts!). Set a timer for 6 minutes for medium doneness, 8 minutes for fully cooked.',
        skillTip: 'Target internal temperature for salmon: 145°F for well done, 125°F for medium.',
        timeEstimate: 1
      },
      {
        step: 9,
        instruction: 'While salmon cooks, toss broccoli with olive oil, salt, and pepper.',
        detailedExplanation: 'Cut your broccoli into evenly-sized florets (about 2 inches each). Put them in a large bowl with 1 tablespoon olive oil, 1/2 teaspoon salt, and 1/4 teaspoon pepper. Use your hands to toss everything together until the broccoli is evenly coated.',
        timeEstimate: 5
      },
      {
        step: 10,
        instruction: 'Spread broccoli on the prepared baking sheet and roast for 15-18 minutes.',
        detailedExplanation: 'Arrange the broccoli florets on your parchment-lined baking sheet in a single layer with space between each piece. Place in the oven alongside the salmon. Roast for 15-18 minutes until the edges are crispy and lightly charred. You don\'t need to flip them.',
        skillTip: 'High heat roasting creates caramelization - those brown, crispy edges are packed with flavor.',
        timeEstimate: 1
      },
      {
        step: 11,
        instruction: 'Remove salmon when it flakes easily with a fork, let rest 2 minutes.',
        detailedExplanation: 'After 6-8 minutes, carefully remove the skillet from the oven (oven mitts!). Press a fork gently into the thickest part of a fillet and twist - the fish should flake apart into layers. If using a thermometer, it should read 145°F. Transfer salmon to a plate and let it rest for 2 minutes.',
        timeEstimate: 1
      },
      {
        step: 12,
        instruction: 'Serve salmon over rice if desired, with roasted broccoli. Drizzle with remaining teriyaki sauce and garnish.',
        detailedExplanation: 'Place each salmon fillet on a plate with a portion of roasted broccoli. Add cooked rice if you\'d like. Drizzle additional teriyaki sauce over the salmon. Sprinkle with sesame seeds and sliced green onions for garnish and extra flavor.',
        timeEstimate: 2
      }
    ]
  },
  {
    id: 'recipe-006',
    title: 'Energy Protein Balls',
    category: 'snacks',
    difficulty: 'beginner',
    description: 'No-bake portable snacks perfect for pre-training fuel',
    prepTime: 15,
    cookTime: 0,
    servings: 12,
    athleteNotes: 'These provide quick energy from natural sugars and sustained energy from protein and healthy fats. Perfect pre-workout snack 30-60 minutes before training.',
    requiredSkills: ['prep-001', 'prep-002'],
    tags: ['no-cook', 'pre-workout', 'vegetarian', 'portable', 'meal-prep'],
    mealPrepNotes: 'Make a big batch on Sunday. These are portable and require no reheating - perfect for between classes or pre-practice.',
    storageInstructions: 'Store in airtight container in refrigerator for up to 2 weeks or freeze for up to 3 months.',
    nutritionInfo: {
      calories: 165,
      protein: 6,
      carbs: 22,
      fat: 7,
      fiber: 3,
      servings: 12
    },
    ingredients: [
      { item: 'Rolled oats', amount: '1 1/2 cups' },
      { item: 'Protein powder', amount: '1/2 cup (60g)', notes: 'Vanilla or chocolate' },
      { item: 'Peanut butter', amount: '2/3 cup', notes: 'Natural, creamy' },
      { item: 'Honey', amount: '1/2 cup' },
      { item: 'Mini chocolate chips', amount: '1/3 cup' },
      { item: 'Ground flaxseed', amount: '2 tablespoons' },
      { item: 'Vanilla extract', amount: '1 teaspoon' },
      { item: 'Salt', amount: '1/4 teaspoon' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Combine all ingredients in a large bowl.',
        detailedExplanation: 'Get a large mixing bowl - you need room to stir. Measure and add all ingredients: oats, protein powder, peanut butter, honey, chocolate chips, flaxseed, vanilla extract, and salt. If your peanut butter is hard to scoop, microwave the jar (with lid off) for 20-30 seconds to soften it. This makes mixing much easier.',
        skillTip: 'Measure sticky ingredients like honey and peanut butter in the same measuring cup - the residual oil from peanut butter helps honey slide out easily.',
        timeEstimate: 3
      },
      {
        step: 2,
        instruction: 'Stir until well combined and mixture holds together.',
        detailedExplanation: 'Use a large spoon or spatula to mix everything together. At first it will seem like there\'s not enough liquid - keep stirring. Press and fold the mixture against the side of the bowl. After 2-3 minutes of stirring, the oats will absorb moisture and everything will stick together. The mixture should be thick but moldable, similar to cookie dough.',
        skillTip: 'If mixture is too dry and won\'t hold together, add honey 1 tablespoon at a time. If too wet, add more oats.',
        timeEstimate: 4
      },
      {
        step: 3,
        instruction: 'Refrigerate mixture for 20 minutes to firm up.',
        detailedExplanation: 'Cover the bowl with plastic wrap or a lid and place it in the refrigerator. Set a timer for 20 minutes. This chilling step makes the mixture easier to shape into balls - warm mixture is too sticky to work with. While it chills, clean up your workspace.',
        timeEstimate: 1
      },
      {
        step: 4,
        instruction: 'Scoop about 2 tablespoons of mixture and roll into balls.',
        detailedExplanation: 'Take the bowl out of the fridge. Use a cookie scoop or spoon to scoop out about 2 tablespoons of mixture - roughly the size of a golf ball. Place it in your palm and roll between both hands to form a ball. If the mixture sticks to your hands, wet your hands slightly with cold water - this creates a non-stick surface. Place finished balls on a plate or baking sheet.',
        timeEstimate: 8
      },
      {
        step: 5,
        instruction: 'Store in refrigerator in an airtight container.',
        detailedExplanation: 'Once all balls are rolled, transfer them to an airtight container. Place parchment paper between layers if stacking to prevent sticking. Store in the refrigerator - they\'ll firm up more as they stay cold. These are ready to eat immediately but taste best after firming up for an hour.',
        timeEstimate: 2
      }
    ]
  }
];
