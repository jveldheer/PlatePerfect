import type { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    id: 'recipe-001',
    title: 'Power Oatmeal Bowl',
    category: 'breakfast',
    difficulty: 'beginner',
    economics: '$',
    description: 'A protein-packed breakfast that provides sustained energy for morning workouts',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    servingSizeAmount: '1.5 cups',
    servingSizeVisual: 'Size of a large coffee mug',
    servingSizeGrams: 350,
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
    economics: '$$',
    description: 'Perfectly cooked, juicy chicken breast - a meal prep staple',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    servingSizeAmount: '6 oz',
    servingSizeVisual: 'Size of a deck of cards or your palm',
    servingSizeGrams: 170,
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
    economics: '$',
    description: 'A nutrient-dense vegetarian bowl packed with complex carbs and plant protein',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    servingSizeAmount: '2 cups',
    servingSizeVisual: 'Size of two fists together',
    servingSizeGrams: 400,
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
    economics: '$',
    description: 'Fast-absorbing protein and carbs for optimal muscle recovery',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    servingSizeAmount: '16 oz',
    servingSizeVisual: 'Large coffee cup or water bottle',
    servingSizeGrams: 475,
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
    economics: '$$$',
    description: 'Omega-3 rich salmon with a homemade teriyaki glaze',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    servingSizeAmount: '6 oz',
    servingSizeVisual: 'Size of a checkbook or deck of cards',
    servingSizeGrams: 170,
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
    economics: '$',
    description: 'No-bake portable snacks perfect for pre-training fuel',
    prepTime: 15,
    cookTime: 0,
    servings: 12,
    servingSizeAmount: '1 ball',
    servingSizeVisual: 'Size of a ping pong ball or large walnut',
    servingSizeGrams: 35,
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
  },
  // VIRAL TIKTOK BREAKFAST RECIPES
  {
    id: 'recipe-007',
    title: 'High Protein Overnight Oats',
    category: 'breakfast',
    difficulty: 'beginner',
    economics: '$',
    description: 'Viral TikTok overnight oats with 44g protein - prep 5 jars for the week in under 10 minutes',
    prepTime: 10,
    cookTime: 0,
    servings: 5,
    servingSizeAmount: '1.5 cups',
    servingSizeVisual: 'Size of a large coffee mug or mason jar',
    servingSizeGrams: 350,
    athleteNotes: 'This viral TikTok recipe is perfect for meal prep. With 44g of protein per serving and slow-digesting carbs, it provides sustained energy for morning workouts or all-day fuel. Make 5 jars on Sunday and grab-and-go all week!',
    requiredSkills: ['prep-001', 'prep-003'],
    tags: ['viral-tiktok', 'no-cook', 'meal-prep', 'high-protein', 'vegetarian'],
    mealPrepNotes: 'Make 5 jars at once. Store in fridge for up to 5 days. The oats get better as they sit overnight. Top with fresh fruit right before eating.',
    storageInstructions: 'Store in sealed mason jars or containers in refrigerator for up to 5 days. Do not freeze. Add toppings fresh each morning.',
    videoUrl: 'https://www.tiktok.com/@makayla_thomas_fit/video/7490292940456168734',
    nutritionInfo: {
      calories: 425,
      protein: 44,
      carbs: 48,
      fat: 8,
      fiber: 8,
      servings: 5
    },
    ingredients: [
      { item: 'Old fashioned rolled oats', amount: '5 cups', notes: 'Not instant oats' },
      { item: 'Protein powder', amount: '5 scoops (150g)', notes: 'Vanilla or chocolate' },
      { item: 'Greek yogurt', amount: '1.25 cups (300g)', notes: 'Non-fat or low-fat' },
      { item: 'Chia seeds', amount: '5 tablespoons' },
      { item: 'Milk of choice', amount: '4 cups', notes: 'Almond, oat, or dairy' },
      { item: 'Honey or maple syrup', amount: '5 tablespoons', notes: 'Optional for sweetness' },
      { item: 'Cinnamon', amount: '2 teaspoons' },
      { item: 'Vanilla extract', amount: '2 teaspoons' },
      { item: 'Fresh berries', amount: '2 cups', notes: 'For topping' },
      { item: 'Banana slices', amount: '2 bananas', notes: 'For topping' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Get 5 mason jars or meal prep containers ready.',
        detailedExplanation: 'Line up 5 pint-sized (16oz) mason jars or sealable containers on your counter. This assembly line approach makes the process fast and easy. Make sure all containers are clean and dry.',
        timeEstimate: 1
      },
      {
        step: 2,
        instruction: 'Add dry ingredients to each jar: 1 cup oats, 1 scoop protein powder, 1 tablespoon chia seeds.',
        detailedExplanation: 'Go down the line adding the same ingredients to each jar. Add 1 cup of rolled oats to each jar (use a 1-cup measuring cup). Then add 1 scoop of protein powder to each. Finally, add 1 tablespoon of chia seeds to each jar. The chia seeds will absorb liquid and create a pudding-like texture.',
        skillTip: 'Level off your measuring cups for accuracy - this ensures consistent macros in each jar.',
        timeEstimate: 3
      },
      {
        step: 3,
        instruction: 'Add wet ingredients: about 1/4 cup Greek yogurt and 3/4 cup milk to each jar.',
        detailedExplanation: 'Add a heaping 1/4 cup (about 60g) of Greek yogurt to each jar. Then pour in about 3/4 cup of milk. The exact amount can vary based on how thick you like your oats - add more milk for thinner consistency, less for thicker. The Greek yogurt adds extra protein and creaminess.',
        timeEstimate: 3
      },
      {
        step: 4,
        instruction: 'Add flavorings: 1 tablespoon honey, a pinch of cinnamon, and a few drops of vanilla to each jar.',
        detailedExplanation: 'Drizzle 1 tablespoon of honey into each jar (or use maple syrup or skip if your protein powder is already sweet). Add a generous pinch of cinnamon and about 1/2 teaspoon of vanilla extract to each jar. These add flavor without extra calories.',
        timeEstimate: 2
      },
      {
        step: 5,
        instruction: 'Seal and shake each jar vigorously for 30 seconds.',
        detailedExplanation: 'Put the lid on the first jar and shake it hard for 30 seconds. You want everything completely mixed with no dry clumps at the bottom. Repeat with all 5 jars. This is where the magic happens - the shaking distributes the protein powder evenly and starts the overnight soaking process.',
        skillTip: 'Make sure the lid is tight before shaking! Check the bottom of the jar after shaking to ensure no dry oats are stuck.',
        timeEstimate: 3
      },
      {
        step: 6,
        instruction: 'Refrigerate overnight or at least 4 hours.',
        detailedExplanation: 'Place all 5 jars in the refrigerator. The oats need at least 4 hours to fully absorb the liquid and soften, but overnight (8-12 hours) is ideal. The chia seeds will create a gel-like consistency that makes the oats creamy and thick.',
        timeEstimate: 1
      },
      {
        step: 7,
        instruction: 'In the morning, add fresh toppings and enjoy cold or warmed up.',
        detailedExplanation: 'Take one jar out of the fridge. Give it a quick stir. Top with fresh berries, sliced banana, nuts, or any toppings you like. You can eat it cold straight from the jar, or microwave for 1-2 minutes if you prefer warm oatmeal. The oats are ready to eat!',
        skillTip: 'Add toppings fresh each morning to keep them from getting soggy. Save time by pre-portioning toppings in small containers.',
        timeEstimate: 2
      }
    ]
  },
  {
    id: 'recipe-008',
    title: 'High Protein Egg Muffin Bites',
    category: 'breakfast',
    difficulty: 'beginner',
    economics: '$',
    description: 'TikTok famous egg bites with cottage cheese - make 24 in under an hour for the whole week',
    prepTime: 15,
    cookTime: 25,
    servings: 6,
    servingSizeAmount: '4 muffins',
    servingSizeVisual: 'Four standard muffin-sized bites',
    servingSizeGrams: 200,
    athleteNotes: 'These viral egg bites pack 20g protein per serving and are perfect for grab-and-go mornings. The cottage cheese makes them extra creamy and protein-rich. Meal prep on Sunday and have breakfast ready all week!',
    requiredSkills: ['safety-001', 'safety-002', 'prep-003'],
    tags: ['viral-tiktok', 'high-protein', 'meal-prep', 'freezer-friendly', 'low-carb'],
    mealPrepNotes: 'Make 2 dozen at once in muffin tins. Store in fridge for 5 days or freeze for 2 months. Reheat in microwave for 30-60 seconds.',
    storageInstructions: 'Refrigerate in airtight container for up to 5 days. Freeze in freezer bags for up to 2 months. Reheat from frozen in microwave for 60-90 seconds.',
    videoUrl: 'https://www.tiktok.com/@cookingforgains/video/7505910620659649835',
    nutritionInfo: {
      calories: 195,
      protein: 20,
      carbs: 4,
      fat: 11,
      fiber: 1,
      servings: 6
    },
    ingredients: [
      { item: 'Large eggs', amount: '12' },
      { item: 'Cottage cheese', amount: '2 cups (450g)', notes: 'Blended smooth' },
      { item: 'Shredded cheddar cheese', amount: '1 cup', notes: 'Or Mexican blend' },
      { item: 'Cooked bacon', amount: '8 strips', notes: 'Chopped' },
      { item: 'Fresh spinach', amount: '2 cups', notes: 'Chopped' },
      { item: 'Red bell pepper', amount: '1/2 cup', notes: 'Diced small' },
      { item: 'Green onions', amount: '1/4 cup', notes: 'Sliced' },
      { item: 'Salt', amount: '1 teaspoon' },
      { item: 'Black pepper', amount: '1/2 teaspoon' },
      { item: 'Garlic powder', amount: '1 teaspoon' },
      { item: 'Onion powder', amount: '1 teaspoon' },
      { item: 'Cooking spray', amount: 'As needed' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Preheat oven to 350°F and spray two 12-cup muffin tins with cooking spray.',
        detailedExplanation: 'Turn your oven to 350°F and let it preheat fully. While it heats, take two standard 12-cup muffin tins and spray each cup generously with cooking spray. Get the bottom and sides well - this prevents sticking. If you don\'t have two tins, you can bake in batches.',
        timeEstimate: 3
      },
      {
        step: 2,
        instruction: 'Blend cottage cheese until completely smooth in a blender.',
        detailedExplanation: 'Add 2 cups of cottage cheese to a blender. Blend on high for 30-60 seconds until it\'s completely smooth with no lumps. This is the secret to making these egg bites super creamy like Starbucks! The blended cottage cheese adds tons of protein without changing the flavor.',
        skillTip: 'Don\'t skip blending the cottage cheese - it\'s what makes these viral egg bites so creamy!',
        timeEstimate: 2
      },
      {
        step: 3,
        instruction: 'In a large bowl, whisk together eggs, blended cottage cheese, and all seasonings.',
        detailedExplanation: 'Crack all 12 eggs into a large mixing bowl. Add the blended cottage cheese, salt, pepper, garlic powder, and onion powder. Whisk vigorously for 1-2 minutes until everything is completely combined and slightly frothy. The mixture should be uniform with no streaks of white or yellow.',
        timeEstimate: 3
      },
      {
        step: 4,
        instruction: 'Add mix-ins: bacon, spinach, bell pepper, green onions, and half the cheese.',
        detailedExplanation: 'Cook your bacon until crispy, then chop it into small pieces. Chop the spinach, dice the bell pepper, and slice the green onions. Add all these to the egg mixture along with half the shredded cheese (save the other half for topping). Stir gently to distribute the mix-ins evenly throughout.',
        skillTip: 'You can customize the mix-ins! Try ham and Swiss, sausage and peppers, or mushrooms and feta.',
        timeEstimate: 5
      },
      {
        step: 5,
        instruction: 'Pour egg mixture into prepared muffin cups, filling each about 3/4 full.',
        detailedExplanation: 'Use a ladle or large measuring cup to pour the egg mixture into each muffin cup. Fill them about 3/4 of the way full - they\'ll puff up slightly as they bake. Try to distribute the mix-ins evenly so each cup gets some bacon, veggies, and cheese. It\'s okay if they\'re not perfect!',
        timeEstimate: 3
      },
      {
        step: 6,
        instruction: 'Top each muffin with remaining shredded cheese.',
        detailedExplanation: 'Sprinkle the remaining shredded cheese evenly over the tops of all the muffins. This creates a nice cheesy crust on top when they bake. Use about 1-2 teaspoons of cheese per muffin.',
        timeEstimate: 1
      },
      {
        step: 7,
        instruction: 'Bake for 22-25 minutes until set and lightly golden on top.',
        detailedExplanation: 'Place both muffin tins in the preheated oven. Set a timer for 22 minutes. The egg bites are done when the centers are set (no longer jiggly) and the tops are lightly golden. A toothpick inserted in the center should come out clean. If they\'re still jiggly, bake 2-3 more minutes.',
        skillTip: 'Don\'t overbake! Remove them as soon as they\'re set - they\'ll continue cooking slightly as they cool.',
        timeEstimate: 25
      },
      {
        step: 8,
        instruction: 'Cool for 5 minutes, then remove from tin and store.',
        detailedExplanation: 'Let the egg bites cool in the tin for 5 minutes. This makes them easier to remove without breaking. Then run a butter knife around the edges of each one and pop them out. Let them cool completely before storing. Store in meal prep containers - 4 egg bites per container for easy grab-and-go breakfasts.',
        timeEstimate: 5
      }
    ]
  },
  {
    id: 'recipe-009',
    title: 'English Muffin Breakfast Sandwiches',
    category: 'breakfast',
    difficulty: 'beginner',
    economics: '$$',
    description: 'Viral TikTok sheet pan breakfast sandwiches - prep 12 freezer-friendly sandwiches in 30 minutes',
    prepTime: 10,
    cookTime: 17,
    servings: 12,
    servingSizeAmount: '1 sandwich',
    servingSizeVisual: 'Standard breakfast sandwich size',
    servingSizeGrams: 200,
    athleteNotes: 'These viral meal prep breakfast sandwiches have 28g protein each and can be frozen for a month. Perfect for busy athletes who need quick, nutritious breakfasts. Microwave from frozen in 90 seconds!',
    requiredSkills: ['safety-001', 'safety-002', 'prep-003'],
    tags: ['viral-tiktok', 'meal-prep', 'freezer-friendly', 'high-protein', 'portable'],
    mealPrepNotes: 'Make a full batch of 12 sandwiches. Wrap individually in parchment paper, then store in freezer bags. Grab one in the morning and microwave for 90 seconds.',
    storageInstructions: 'Refrigerate for up to 5 days. Freeze wrapped sandwiches for up to 1 month. Reheat from frozen: microwave 90 seconds, flipping halfway.',
    videoUrl: 'https://www.tiktok.com/@momnutritionist/video/7495467283918245163',
    nutritionInfo: {
      calories: 328,
      protein: 28,
      carbs: 27,
      fat: 12,
      fiber: 3,
      servings: 12
    },
    ingredients: [
      { item: 'Large eggs', amount: '18' },
      { item: 'Milk', amount: '1/2 cup' },
      { item: 'Salt', amount: '1 teaspoon' },
      { item: 'Black pepper', amount: '1/2 teaspoon' },
      { item: 'Diced bell peppers', amount: '1 cup', notes: 'Mixed colors' },
      { item: 'Diced onions', amount: '1/2 cup' },
      { item: 'Fresh spinach', amount: '2 cups', notes: 'Chopped' },
      { item: 'Cooked turkey sausage', amount: '1 lb', notes: 'Crumbled' },
      { item: 'Shredded cheese', amount: '2 cups', notes: 'Cheddar or your choice' },
      { item: 'English muffins', amount: '12', notes: 'Whole wheat preferred' },
      { item: 'Cooking spray', amount: 'As needed' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Preheat oven to 350°F and spray a large rimmed baking sheet.',
        detailedExplanation: 'Turn oven to 350°F. Take an 18x13 inch rimmed baking sheet (half sheet pan) and spray it generously with cooking spray. Make sure you get the corners and edges well. You can also line it with parchment paper for even easier cleanup.',
        timeEstimate: 2
      },
      {
        step: 2,
        instruction: 'Whisk eggs with milk, salt, and pepper in a large bowl.',
        detailedExplanation: 'Crack all 18 eggs into a very large bowl. Add the milk, salt, and pepper. Whisk vigorously for 1-2 minutes until the mixture is completely uniform and slightly frothy. The milk makes the eggs fluffy and tender.',
        timeEstimate: 3
      },
      {
        step: 3,
        instruction: 'Add vegetables, cooked sausage, and 1 cup cheese to egg mixture.',
        detailedExplanation: 'Add the diced peppers, onions, chopped spinach, crumbled cooked turkey sausage, and 1 cup of shredded cheese to the eggs. Stir gently to distribute everything evenly. Save the other cup of cheese for topping.',
        skillTip: 'Make sure your sausage is fully cooked and cooled before adding to the eggs.',
        timeEstimate: 2
      },
      {
        step: 4,
        instruction: 'Pour egg mixture onto prepared baking sheet and spread evenly.',
        detailedExplanation: 'Pour all of the egg mixture onto your prepared baking sheet. Use a spatula to spread it out evenly so it covers the entire pan in a uniform layer. Make sure the veggies and sausage are distributed evenly throughout. The layer should be about 1/2 inch thick.',
        timeEstimate: 2
      },
      {
        step: 5,
        instruction: 'Sprinkle remaining cheese on top and bake for 15-17 minutes.',
        detailedExplanation: 'Sprinkle the remaining 1 cup of cheese evenly over the top of the egg mixture. Place in the preheated oven and bake for 15-17 minutes. The eggs are done when they\'re set in the center (no longer jiggly) and lightly golden on top. They should pull away slightly from the edges of the pan.',
        skillTip: 'Don\'t overbake - the eggs will continue cooking slightly after you remove them from the oven.',
        timeEstimate: 17
      },
      {
        step: 6,
        instruction: 'Let cool for 5 minutes, then cut into 12 squares.',
        detailedExplanation: 'Remove the pan from the oven and let it cool for 5 minutes. This makes cutting easier. Use a sharp knife or pizza cutter to cut the sheet of eggs into 12 equal squares (cut into 3 rows and 4 columns). Each square should be about 4x3 inches - the perfect size for an English muffin.',
        timeEstimate: 3
      },
      {
        step: 7,
        instruction: 'Toast English muffins and assemble sandwiches.',
        detailedExplanation: 'Split all 12 English muffins and toast them lightly. Place one egg square on the bottom half of each muffin. Top with the other half of the muffin. The eggs should fit perfectly!',
        timeEstimate: 5
      },
      {
        step: 8,
        instruction: 'Wrap each sandwich and store in freezer.',
        detailedExplanation: 'Let the sandwiches cool completely. Wrap each sandwich individually in parchment paper or plastic wrap. Then place all wrapped sandwiches in a large freezer bag. Label with the date. To reheat: microwave one sandwich (still wrapped) for 90 seconds, flipping halfway through.',
        skillTip: 'Leave the sandwich wrapped when microwaving - it steams perfectly and stays moist!',
        timeEstimate: 5
      }
    ]
  },
  // VIRAL TIKTOK LUNCH RECIPES
  {
    id: 'recipe-010',
    title: 'Mexican Chicken Rice Bowl',
    category: 'lunch',
    difficulty: 'beginner',
    economics: '$',
    description: 'Viral TikTok one-pan Mexican chicken and rice - 45g protein per serving',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    servingSizeAmount: '2 cups',
    servingSizeVisual: 'Size of two fists together',
    servingSizeGrams: 400,
    athleteNotes: 'This viral TikTok meal prep has 45g protein and 47g carbs per serving - perfect macros for muscle building and recovery. The one-pan method makes cleanup easy. Make 4 servings on Sunday for easy lunches all week!',
    requiredSkills: ['knife-002', 'cook-002', 'cook-004', 'safety-002'],
    tags: ['viral-tiktok', 'high-protein', 'one-pan', 'meal-prep', 'mexican'],
    mealPrepNotes: 'Store in individual containers for 4-5 days. Reheats perfectly in microwave. The flavors get even better after a day!',
    storageInstructions: 'Refrigerate in airtight containers for up to 5 days. Reheat in microwave for 2-3 minutes. Can freeze for up to 2 months.',
    videoUrl: 'https://www.tiktok.com/@makayla_thomas_fit/video/7487694493911715103',
    nutritionInfo: {
      calories: 450,
      protein: 45,
      carbs: 47,
      fat: 9,
      fiber: 6,
      servings: 4
    },
    ingredients: [
      { item: 'Chicken breast', amount: '750g', notes: 'Cut into cubes' },
      { item: 'Basmati rice', amount: '1 cup dry (210g)' },
      { item: 'Black beans', amount: '1 cup (100g)', notes: 'Drained and rinsed' },
      { item: 'Red bell pepper', amount: '1 large', notes: 'Diced' },
      { item: 'Onion', amount: '1 medium', notes: 'Diced' },
      { item: 'Chicken stock or water', amount: '1.5 cups (300ml)' },
      { item: 'Olive oil', amount: '2 teaspoons' },
      { item: 'Oregano', amount: '2 teaspoons' },
      { item: 'Paprika', amount: '2 teaspoons' },
      { item: 'Cumin', amount: '1 teaspoon' },
      { item: 'Chili powder', amount: '1 teaspoon' },
      { item: 'Garlic powder', amount: '1 teaspoon' },
      { item: 'Salt and pepper', amount: '1 teaspoon each' },
      { item: 'Fresh lime', amount: '1 whole', notes: 'Juiced' },
      { item: 'Fresh cilantro', amount: '1/4 cup', notes: 'Chopped, for garnish' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Season chicken with spices and lime juice, marinate 10 minutes.',
        detailedExplanation: 'Cut chicken breast into 1-inch cubes. Place in a bowl and add 1 teaspoon each of oregano, paprika, cumin, chili powder, garlic powder, salt, and pepper. Squeeze the juice of one whole lime over the chicken. Toss well to coat every piece. Let it sit for 10 minutes while you prep the vegetables. This marinade adds amazing flavor!',
        skillTip: 'Cutting chicken into uniform cubes ensures even cooking.',
        timeEstimate: 5
      },
      {
        step: 2,
        instruction: 'Heat oil in large pan and cook chicken until golden, about 6-8 minutes.',
        detailedExplanation: 'Heat 2 teaspoons of olive oil in a large, deep skillet or pan over medium-high heat. Once the oil is shimmering, add the marinated chicken in a single layer. Let it cook undisturbed for 3-4 minutes to develop a golden crust, then flip and cook another 3-4 minutes. The chicken doesn\'t need to be fully cooked yet - it will finish cooking with the rice.',
        skillTip: 'Don\'t overcrowd the pan - cook in batches if needed for the best browning.',
        timeEstimate: 8
      },
      {
        step: 3,
        instruction: 'Remove chicken and sauté onions and peppers until soft.',
        detailedExplanation: 'Transfer the chicken to a plate and set aside. In the same pan (don\'t wash it - those brown bits add flavor!), add the diced onion and bell pepper. Cook over medium heat, stirring occasionally, for 4-5 minutes until they\'re soft and the onion is translucent.',
        timeEstimate: 5
      },
      {
        step: 4,
        instruction: 'Add uncooked rice and remaining spices, toast for 1-2 minutes.',
        detailedExplanation: 'Add the dry rice to the pan with the vegetables. Add the remaining 1 teaspoon each of oregano, paprika, cumin, chili powder, garlic powder, salt, and pepper. Stir everything together and let the rice toast in the spices for 1-2 minutes. You\'ll smell the spices become fragrant - this step builds incredible flavor!',
        skillTip: 'Toasting the rice with spices before adding liquid is a game-changer for flavor.',
        timeEstimate: 2
      },
      {
        step: 5,
        instruction: 'Add chicken stock and black beans, bring to boil then simmer covered.',
        detailedExplanation: 'Pour in 1.5 cups of chicken stock (or water). Add the black beans. Stir everything together, making sure the rice is evenly distributed. Bring to a boil over high heat. Once boiling, reduce heat to low, cover with a tight-fitting lid, and let simmer for 12-15 minutes. Don\'t lift the lid during this time!',
        skillTip: 'Keep the lid on while simmering - lifting it releases steam and the rice won\'t cook properly.',
        timeEstimate: 15
      },
      {
        step: 6,
        instruction: 'Stir halfway through, add chicken back in during last 5 minutes.',
        detailedExplanation: 'After about 7 minutes, quickly lift the lid and give everything a gentle stir to prevent sticking. Add the chicken back into the pan, nestling it into the rice. Cover again and continue cooking for the remaining 5 minutes. The rice should absorb all the liquid and be tender.',
        timeEstimate: 1
      },
      {
        step: 7,
        instruction: 'Fluff with fork, garnish with cilantro, and portion into containers.',
        detailedExplanation: 'Turn off the heat and let it sit covered for 2 minutes. Remove the lid and fluff the rice with a fork, mixing in the chicken. Taste and add more salt if needed. Garnish with fresh chopped cilantro. Divide into 4 equal portions in meal prep containers. Each serving is about 2 cups.',
        skillTip: 'Let it sit for 2 minutes before fluffing - this makes the rice extra fluffy and perfectly cooked.',
        timeEstimate: 3
      }
    ]
  },
  {
    id: 'recipe-011',
    title: 'Salad Supreme Pasta Salad',
    category: 'lunch',
    difficulty: 'beginner',
    economics: '$',
    description: 'The famous TikTok pasta salad that everyone is making - perfect cold lunch for meal prep',
    prepTime: 15,
    cookTime: 12,
    servings: 8,
    servingSizeAmount: '1.5 cups',
    servingSizeVisual: 'Size of a large cereal bowl',
    servingSizeGrams: 350,
    athleteNotes: 'This viral pasta salad is refreshing and filling. With 15g protein per serving, it\'s great for recovery days or lighter training. The best part? It tastes even better after sitting overnight, making it perfect for meal prep!',
    requiredSkills: ['cook-001', 'knife-002', 'prep-003'],
    tags: ['viral-tiktok', 'meal-prep', 'vegetarian', 'cold-lunch', 'no-reheat'],
    mealPrepNotes: 'Make the full batch and store in a large container. Portion out servings as needed. Stays fresh for 5-7 days and flavors improve over time.',
    storageInstructions: 'Store in airtight container in refrigerator for up to 7 days. Toss before serving. Do not freeze.',
    videoUrl: 'https://www.tiktok.com/@hunt4shredz/video/7518805084499627277',
    nutritionInfo: {
      calories: 385,
      protein: 15,
      carbs: 48,
      fat: 15,
      fiber: 4,
      servings: 8
    },
    ingredients: [
      { item: 'Rotini pasta', amount: '1 lb box', notes: 'Tricolor if available' },
      { item: 'English cucumber', amount: '1 large', notes: 'Diced' },
      { item: 'Cherry tomatoes', amount: '2 cups', notes: 'Halved' },
      { item: 'Red onion', amount: '1/2 medium', notes: 'Finely diced' },
      { item: 'Salami', amount: '8 oz', notes: 'Diced (optional)' },
      { item: 'Provolone cheese', amount: '8 oz', notes: 'Cubed (optional)' },
      { item: 'Kalamata olives', amount: '1 cup', notes: 'Halved' },
      { item: 'Pepperoncini peppers', amount: '1/2 cup', notes: 'Sliced' },
      { item: 'Italian dressing', amount: '16 oz bottle', notes: 'Wishbone or Olive Garden' },
      { item: 'Salad Supreme seasoning', amount: '3-4 tablespoons', notes: 'This is the secret ingredient!' },
      { item: 'Black pepper', amount: '1 teaspoon' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Cook pasta according to package directions, then rinse with cold water.',
        detailedExplanation: 'Bring a large pot of salted water to a boil. Add the rotini pasta and cook for 10-12 minutes until al dente (tender but still slightly firm). Drain the pasta in a colander, then rinse it under cold running water for 1-2 minutes. This stops the cooking and cools it down for the salad. Shake off excess water.',
        skillTip: 'Rinsing pasta is usually not recommended, but for pasta salad you want to cool it quickly and remove excess starch.',
        timeEstimate: 15
      },
      {
        step: 2,
        instruction: 'While pasta cooks, dice all vegetables and proteins.',
        detailedExplanation: 'Dice the cucumber into small pieces (about 1/2 inch). Cut cherry tomatoes in half. Finely dice the red onion. If using salami and provolone, cut both into small cubes (about 1/2 inch). Halve the olives and slice the pepperoncini. Put everything in a very large mixing bowl.',
        skillTip: 'Keep all pieces roughly the same size for the best texture and even distribution in each bite.',
        timeEstimate: 10
      },
      {
        step: 3,
        instruction: 'Add cooled pasta to the bowl with all the vegetables.',
        detailedExplanation: 'Once your pasta is completely cooled and drained well, add it to the large bowl with all your chopped vegetables, meat, and cheese. The pasta should be at room temperature or cool - never add hot pasta to the vegetables as it will make them soggy.',
        timeEstimate: 2
      },
      {
        step: 4,
        instruction: 'Add entire bottle of Italian dressing and Salad Supreme seasoning.',
        detailedExplanation: 'Pour the entire 16oz bottle of Italian dressing over everything. Then generously sprinkle 3-4 tablespoons of Salad Supreme seasoning over the top. This seasoning blend is what makes this pasta salad go viral - it has sesame seeds, paprika, and other spices that add amazing flavor. Don\'t be shy with it!',
        skillTip: 'Salad Supreme seasoning is found in the spice aisle. It\'s the SECRET to this viral recipe!',
        timeEstimate: 1
      },
      {
        step: 5,
        instruction: 'Toss everything together until evenly coated.',
        detailedExplanation: 'Using a large spoon or tongs, toss everything together thoroughly. Make sure every piece of pasta and every vegetable is coated with dressing. Mix for a good 2-3 minutes, getting to the bottom of the bowl. The dressing and seasoning should be evenly distributed throughout.',
        timeEstimate: 3
      },
      {
        step: 6,
        instruction: 'Cover and refrigerate overnight for best flavor.',
        detailedExplanation: 'Transfer the pasta salad to an airtight container (or cover the bowl tightly with plastic wrap). Refrigerate for at least 4 hours, but overnight is best. This gives time for the pasta to absorb the dressing and all the flavors to meld together. Trust the process - it gets SO much better after sitting!',
        skillTip: 'This pasta salad tastes good right away but AMAZING after sitting overnight. Patience pays off!',
        timeEstimate: 1
      },
      {
        step: 7,
        instruction: 'Before serving, toss again and adjust seasoning if needed.',
        detailedExplanation: 'Take the pasta salad out of the fridge and give it a good toss. The pasta may have absorbed some dressing overnight. Taste it - you can add more Salad Supreme seasoning or a splash more dressing if needed. Serve cold. Each serving is about 1.5 cups.',
        timeEstimate: 2
      }
    ]
  },
  {
    id: 'recipe-012',
    title: 'High Protein Burrito Bowl',
    category: 'lunch',
    difficulty: 'intermediate',
    economics: '$$',
    description: 'TikTok famous burrito bowl with homemade creamy green sauce - 53g protein!',
    prepTime: 20,
    cookTime: 15,
    servings: 4,
    servingSizeAmount: '2.5 cups',
    servingSizeVisual: 'Large restaurant-style bowl',
    servingSizeGrams: 450,
    athleteNotes: 'This viral meal prep packs 53g protein and is one of the best weight loss recipes on TikTok. High protein and high volume keep you full for hours. Perfect for athletes in a calorie deficit or anyone wanting to build muscle while staying lean.',
    requiredSkills: ['knife-002', 'cook-001', 'cook-004', 'safety-002'],
    tags: ['viral-tiktok', 'high-protein', 'meal-prep', 'mexican', 'gluten-free'],
    mealPrepNotes: 'Store green sauce separately from other components. Assemble bowls fresh or store lettuce separately to keep it crisp. Lasts 4-5 days.',
    storageInstructions: 'Refrigerate components in separate containers for up to 5 days. Green sauce keeps for 3-4 days in a sealed bottle. Freeze chicken for up to 2 months.',
    videoUrl: 'https://www.tiktok.com/@makayla_thomas_fit/video/7507053493782449438',
    nutritionInfo: {
      calories: 508,
      protein: 53,
      carbs: 56,
      fat: 8,
      fiber: 9,
      servings: 4
    },
    ingredients: [
      { item: 'Chicken breast', amount: '600g', notes: 'Cut into cubes' },
      { item: 'Basmati rice', amount: '208g dry', notes: 'About 560g cooked' },
      { item: 'Black beans', amount: '120g', notes: 'Drained and rinsed' },
      { item: 'Sweetcorn', amount: '120g' },
      { item: 'Shredded lettuce', amount: '2 cups' },
      { item: 'Red bell pepper', amount: '1', notes: 'Diced' },
      { item: 'Red onion', amount: '1/4 cup', notes: 'Diced' },
      { item: 'Lime', amount: '2', notes: '1 for chicken, 1 for sauce' },
      { item: 'Tomato paste', amount: '50g' },
      { item: 'For Chicken Seasoning:', amount: '' },
      { item: 'Oregano', amount: '1 teaspoon' },
      { item: 'Cumin', amount: '1 teaspoon' },
      { item: 'Paprika', amount: '1 teaspoon' },
      { item: 'Garlic powder', amount: '1 teaspoon' },
      { item: 'Chili flakes', amount: '1 teaspoon' },
      { item: 'Salt and pepper', amount: '1 teaspoon each' },
      { item: 'For Green Sauce:', amount: '' },
      { item: 'Avocado', amount: '80g (1/2 medium)' },
      { item: 'Fat-free Greek yogurt', amount: '120g' },
      { item: 'Fresh cilantro', amount: 'Large handful' },
      { item: 'Garlic powder', amount: '1/2 teaspoon' },
      { item: 'Salt and pepper', amount: '1/2 teaspoon each' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Make the creamy green sauce by blending all sauce ingredients.',
        detailedExplanation: 'In a blender, add half an avocado (about 80g), 120g fat-free Greek yogurt, a large handful of fresh cilantro leaves, juice from half a lime, 1/2 teaspoon garlic powder, and 1/2 teaspoon each of salt and pepper. Blend on high for 30-60 seconds until completely smooth and creamy. Pour into a bottle or container and refrigerate. This makes about 1 cup of sauce.',
        skillTip: 'This creamy green sauce is the star of the recipe - it\'s what makes it go viral! Each serving uses about 20g (1 tablespoon).',
        timeEstimate: 3
      },
      {
        step: 2,
        instruction: 'Season cubed chicken with all spices and lime juice.',
        detailedExplanation: 'Cut chicken breast into 1-inch cubes. Place in a bowl and add oregano, cumin, paprika, garlic powder, chili flakes, salt, and pepper. Squeeze the juice of one whole lime over the chicken. Mix well with your hands to coat every piece. Let marinate while you prep the rice.',
        timeEstimate: 5
      },
      {
        step: 3,
        instruction: 'Cook rice with tomato paste and Mexican spices.',
        detailedExplanation: 'In a medium saucepan, add 208g dry basmati rice (rinsed), 2 cups water, 50g tomato paste, and 1 teaspoon each of salt, garlic powder, cumin, and paprika. Stir everything together. Bring to a boil, then reduce to low heat, cover, and simmer for 12-15 minutes until rice is tender and water is absorbed. Fluff with a fork and stir in chopped cilantro.',
        skillTip: 'The tomato paste turns the rice orange and adds amazing flavor - this is what makes it "Mexican rice"!',
        timeEstimate: 15
      },
      {
        step: 4,
        instruction: 'Cook seasoned chicken in a hot pan until golden and cooked through.',
        detailedExplanation: 'Heat a large skillet over medium-high heat. Spray with cooking spray or add 1 teaspoon oil. Add the marinated chicken in a single layer. Cook for 3 minutes without moving, then flip. Cook another 3 minutes until golden brown on all sides and cooked through (internal temp 165°F). Remove from heat.',
        skillTip: 'Don\'t move the chicken around - let it sit to develop a nice crust!',
        timeEstimate: 6
      },
      {
        step: 5,
        instruction: 'Warm black beans and corn together.',
        detailedExplanation: 'In a small pan or microwave, warm the black beans and corn together. You can add a pinch of cumin and salt for extra flavor. They just need to be warmed through, about 2 minutes.',
        timeEstimate: 2
      },
      {
        step: 6,
        instruction: 'Assemble bowls with all components.',
        detailedExplanation: 'In each of 4 meal prep containers, add: 140g cooked Mexican rice as the base, 30g black beans, 30g corn, 140g cooked chicken pieces, a handful of shredded lettuce, diced red peppers and onions, and a wedge of lime on the side. Pack 20g (about 1.5 tablespoons) of green sauce in a small container on the side.',
        skillTip: 'Store the green sauce and lettuce separately from hot ingredients to keep them fresh!',
        timeEstimate: 5
      },
      {
        step: 7,
        instruction: 'To serve, heat bowl (except lettuce), add lettuce and drizzle with green sauce.',
        detailedExplanation: 'When ready to eat, microwave the bowl (without lettuce) for 2-3 minutes until heated through. Add the fresh shredded lettuce on top and drizzle with the cold creamy green sauce. Squeeze the lime wedge over everything. Mix it all together and enjoy! The combination of warm and cold, with that creamy sauce, is perfection.',
        timeEstimate: 3
      }
    ]
  },
  // VIRAL TIKTOK DINNER RECIPES
  {
    id: 'recipe-013',
    title: 'Sheet Pan Harvest Chicken Dinner',
    category: 'dinner',
    difficulty: 'beginner',
    economics: '$$',
    description: 'Viral 20-minute TikTok sheet pan dinner - just chop, toss, and bake!',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    servingSizeAmount: '2 cups',
    servingSizeVisual: 'Large dinner plate portion',
    servingSizeGrams: 400,
    athleteNotes: 'This viral sheet pan dinner provides balanced nutrition with 42g protein, healthy carbs from sweet potatoes, and tons of vitamins from Brussels sprouts. Perfect for athletes who need nutritious meals with minimal effort!',
    requiredSkills: ['knife-002', 'cook-003', 'prep-003'],
    tags: ['viral-tiktok', 'sheet-pan', 'one-pan', 'high-protein', 'quick'],
    mealPrepNotes: 'Make the full sheet pan and divide into 4 containers. Reheats beautifully in the oven at 350°F for 10 minutes or microwave for 2-3 minutes.',
    storageInstructions: 'Refrigerate in airtight containers for up to 4 days. Reheat in oven for best results. Can freeze for up to 2 months.',
    videoUrl: 'https://www.tiktok.com/@aussiefitness/video/7536935888459189522',
    nutritionInfo: {
      calories: 445,
      protein: 42,
      carbs: 38,
      fat: 14,
      fiber: 8,
      servings: 4
    },
    ingredients: [
      { item: 'Chicken apple sausage', amount: '1 package (12oz)', notes: 'Sliced into rounds' },
      { item: 'Brussels sprouts', amount: '1 lb', notes: 'Trimmed and halved' },
      { item: 'Sweet potato', amount: '1 lb', notes: 'Cubed' },
      { item: 'Red onion', amount: '1 medium', notes: 'Cut into wedges' },
      { item: 'Honeycrisp apple', amount: '1 large', notes: 'Cubed' },
      { item: 'Olive oil', amount: '3 tablespoons' },
      { item: 'Minced garlic', amount: '2 tablespoons' },
      { item: 'Honey', amount: '2 tablespoons' },
      { item: 'Salt', amount: '1 teaspoon' },
      { item: 'Black pepper', amount: '1/2 teaspoon' },
      { item: 'Fresh thyme', amount: '1 teaspoon', notes: 'Optional' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Preheat oven to 425°F and line a large baking sheet with parchment.',
        detailedExplanation: 'Turn your oven to 425°F - this high heat will make everything crispy and caramelized! While it preheats, line a large rimmed baking sheet (18x13 inch) with parchment paper for easy cleanup.',
        timeEstimate: 2
      },
      {
        step: 2,
        instruction: 'Chop all ingredients into similar-sized pieces.',
        detailedExplanation: 'Cut sweet potatoes into 3/4-inch cubes. Trim the ends off Brussels sprouts and cut them in half lengthwise. Cut the red onion into wedges. Cube the apple into 3/4-inch pieces. Slice the chicken sausage into 1/2-inch thick rounds. Keeping everything similar in size ensures even cooking.',
        skillTip: 'Uniform sizing is key for sheet pan dinners - everything cooks at the same rate!',
        timeEstimate: 8
      },
      {
        step: 3,
        instruction: 'Make the honey garlic sauce in a small bowl.',
        detailedExplanation: 'In a small bowl, whisk together 3 tablespoons olive oil, 2 tablespoons minced garlic (about 6 cloves), 2 tablespoons honey, 1 teaspoon salt, 1/2 teaspoon pepper, and thyme if using. Mix until the honey is fully incorporated and the sauce is smooth.',
        timeEstimate: 2
      },
      {
        step: 4,
        instruction: 'Toss all chopped ingredients with the sauce on the sheet pan.',
        detailedExplanation: 'Put all your chopped vegetables, apple, and sausage directly on the baking sheet. Pour the honey garlic sauce over everything. Use your hands or a large spoon to toss everything together until every piece is coated with the sauce. Spread everything out in a single layer - don\'t pile it up or it will steam instead of roast.',
        skillTip: 'Don\'t overcrowd the pan! Use two pans if needed for maximum crispiness.',
        timeEstimate: 3
      },
      {
        step: 5,
        instruction: 'Roast for 20 minutes, tossing halfway through.',
        detailedExplanation: 'Place the sheet pan in the preheated 425°F oven. Set a timer for 10 minutes. After 10 minutes, take the pan out and use a spatula to toss everything around, flipping the Brussels sprouts so they brown on both sides. Return to the oven for another 10 minutes. Everything should be golden brown and caramelized.',
        timeEstimate: 20
      },
      {
        step: 6,
        instruction: 'Optional: Broil for 2-3 minutes for extra crispiness.',
        detailedExplanation: 'If you want everything extra crispy and caramelized, turn on the broiler to high. Place the sheet pan on the top rack and broil for 2-3 minutes, watching carefully so nothing burns. The edges should get slightly charred and crispy. Remove from oven and let cool 2 minutes before serving.',
        skillTip: 'Watch carefully when broiling - things can go from golden to burned quickly!',
        timeEstimate: 3
      },
      {
        step: 7,
        instruction: 'Divide into 4 portions and enjoy or store for meal prep.',
        detailedExplanation: 'The whole sheet pan makes 4 generous servings. Divide everything evenly into 4 meal prep containers. Each portion should have a good mix of sausage, Brussels sprouts, sweet potato, onion, and apple. The sweet and savory flavors are amazing together!',
        timeEstimate: 3
      }
    ]
  },
  {
    id: 'recipe-014',
    title: 'Slow Cooker Honey Teriyaki Chicken',
    category: 'dinner',
    difficulty: 'beginner',
    economics: '$',
    description: 'Viral TikTok crockpot recipe - dump ingredients and walk away for 5 hours',
    prepTime: 10,
    cookTime: 300,
    servings: 8,
    servingSizeAmount: '1.5 cups',
    servingSizeVisual: 'Heaping dinner plate portion',
    servingSizeGrams: 380,
    athleteNotes: 'Set it and forget it! This viral slow cooker recipe makes 8 high-protein servings with 40g protein each. Perfect for Sunday meal prep. The slow cooking makes the chicken incredibly tender and flavorful.',
    requiredSkills: ['prep-001', 'prep-003'],
    tags: ['viral-tiktok', 'slow-cooker', 'meal-prep', 'high-protein', 'asian-fusion'],
    mealPrepNotes: 'Freezes beautifully! Make the full batch, portion into containers, and freeze half. Thaw in fridge overnight and reheat.',
    storageInstructions: 'Refrigerate for up to 5 days. Freeze in portions for up to 3 months. Reheat with a splash of water to loosen the sauce.',
    videoUrl: 'https://www.tiktok.com/@stealth_health_life/video/7433199223354510622',
    nutritionInfo: {
      calories: 515,
      protein: 40,
      carbs: 65,
      fat: 9,
      fiber: 2,
      servings: 8
    },
    ingredients: [
      { item: 'Chicken thighs', amount: '3 lbs (1360g)', notes: 'Boneless, skinless' },
      { item: 'Soy sauce', amount: '5 tablespoons (75g)', notes: 'Low-sodium preferred' },
      { item: 'Dark soy sauce', amount: '2 tablespoons (30g)' },
      { item: 'Honey', amount: '4 tablespoons (80g)' },
      { item: 'Mirin', amount: '4 tablespoons (60g)', notes: 'Rice wine' },
      { item: 'Ginger paste', amount: '2 tablespoons (30g)' },
      { item: 'Garlic paste', amount: '1 tablespoon (15g)' },
      { item: 'Cornstarch slurry:', amount: '' },
      { item: 'Cornstarch', amount: '3 tablespoons' },
      { item: 'Cold water', amount: '4 tablespoons' },
      { item: 'For Serving:', amount: '' },
      { item: 'Short grain rice', amount: '2.5 cups dry (480g)', notes: 'Makes about 7 cups cooked' },
      { item: 'Green onions', amount: '2 stalks', notes: 'Sliced for garnish' },
      { item: 'Sesame seeds', amount: '2 tablespoons', notes: 'For garnish' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Add chicken thighs to slow cooker.',
        detailedExplanation: 'Place all 3 pounds of boneless, skinless chicken thighs directly into your slow cooker. No need to brown them first - just put them right in! Spread them out in a relatively even layer.',
        skillTip: 'Chicken thighs stay juicier than breasts in the slow cooker, but you can use breasts if you prefer.',
        timeEstimate: 1
      },
      {
        step: 2,
        instruction: 'Mix sauce ingredients and pour over chicken.',
        detailedExplanation: 'In a bowl or measuring cup, whisk together the soy sauce, dark soy sauce, honey, mirin, ginger paste, and garlic paste. Mix well until the honey is fully incorporated. Pour this sauce mixture evenly over all the chicken in the slow cooker. Use a spoon to make sure each piece gets coated.',
        timeEstimate: 3
      },
      {
        step: 3,
        instruction: 'Cook on HIGH for 4-5 hours or LOW for 5-6 hours.',
        detailedExplanation: 'Put the lid on the slow cooker. Set it to HIGH and cook for 4-5 hours, or set to LOW and cook for 5-6 hours. The chicken is done when it\'s very tender and shreds easily with a fork. There will be a lot of liquid in the pot - that\'s normal!',
        skillTip: 'HIGH = 4-5 hours, LOW = 5-6 hours. Both work great - choose based on your schedule!',
        timeEstimate: 300
      },
      {
        step: 4,
        instruction: 'Remove chicken and shred with two forks.',
        detailedExplanation: 'Carefully remove the chicken pieces from the slow cooker and place them on a cutting board or large plate. Use two forks to shred the chicken - it should fall apart very easily. Set the shredded chicken aside.',
        timeEstimate: 5
      },
      {
        step: 5,
        instruction: 'Make cornstarch slurry and add to sauce in slow cooker.',
        detailedExplanation: 'In a small bowl, mix 3 tablespoons cornstarch with 4 tablespoons cold water. Stir with a fork until completely smooth with no lumps. Turn the slow cooker to HIGH if it wasn\'t already. Pour the cornstarch slurry into the liquid in the slow cooker and stir well. Let it sit uncovered for 15-20 minutes. The sauce will thicken into a glossy, thick teriyaki glaze.',
        skillTip: 'Adding the cornstarch at the END is key - this lets you control how thick the sauce becomes.',
        timeEstimate: 20
      },
      {
        step: 6,
        instruction: 'Return shredded chicken to thickened sauce and toss to coat.',
        detailedExplanation: 'Once the sauce has thickened, add all the shredded chicken back into the slow cooker. Toss everything together so the chicken is completely coated in the thick, glossy teriyaki sauce. Taste and add more soy sauce or honey if needed.',
        timeEstimate: 2
      },
      {
        step: 7,
        instruction: 'Serve over rice with green onions and sesame seeds.',
        detailedExplanation: 'Cook your rice according to package directions (2.5 cups dry rice makes about 7 cups cooked). Divide rice into 8 bowls or meal prep containers (about 7/8 cup rice per serving). Top each with the honey teriyaki chicken (about 1.5 cups per serving). Garnish with sliced green onions and sesame seeds. The combination is incredible!',
        timeEstimate: 5
      }
    ]
  },
  {
    id: 'recipe-015',
    title: 'Salmon Rice Bowl (Emily Mariko)',
    category: 'dinner',
    difficulty: 'beginner',
    economics: '$$$',
    description: 'The TikTok recipe that broke the internet - leftover salmon and rice transformed with an ice cube trick',
    prepTime: 5,
    cookTime: 3,
    servings: 1,
    servingSizeAmount: '1.5 cups',
    servingSizeVisual: 'Large cereal bowl',
    servingSizeGrams: 350,
    athleteNotes: 'This viral TikTok sensation is perfect for using leftover salmon and rice. With 38g protein and healthy omega-3 fats, it\'s ideal for muscle recovery and reducing inflammation. The best part? Ready in under 10 minutes!',
    requiredSkills: ['prep-002'],
    tags: ['viral-tiktok', 'quick', 'high-protein', 'omega-3', 'leftovers'],
    mealPrepNotes: 'Meal prep by cooking a batch of rice and salmon on Sunday. Store separately and assemble fresh bowls throughout the week using this viral method.',
    storageInstructions: 'Store cooked rice and salmon separately in refrigerator for up to 5 days. Assemble fresh when ready to eat using the ice cube method.',
    videoUrl: 'https://www.tiktok.com/@emilymariko/video/7010506729012219141',
    nutritionInfo: {
      calories: 520,
      protein: 38,
      carbs: 52,
      fat: 16,
      fiber: 5,
      servings: 1
    },
    ingredients: [
      { item: 'Leftover cooked salmon', amount: '5-6 oz (140-170g)', notes: 'Any preparation' },
      { item: 'Leftover cooked rice', amount: '1 cup (200g)', notes: 'White or brown rice' },
      { item: 'Ice cube', amount: '1', notes: 'The secret ingredient!' },
      { item: 'Kewpie mayo', amount: '1 tablespoon' },
      { item: 'Soy sauce', amount: '1-2 teaspoons' },
      { item: 'Sriracha', amount: '1 teaspoon', notes: 'Or to taste' },
      { item: 'Avocado', amount: '1/4', notes: 'Sliced' },
      { item: 'Kimchi', amount: '2-3 tablespoons', notes: 'Optional but recommended' },
      { item: 'Roasted seaweed snacks', amount: '1 packet', notes: 'For serving' }
    ],
    instructions: [
      {
        step: 1,
        instruction: 'Place cold leftover salmon in a microwave-safe bowl and flake with a fork.',
        detailedExplanation: 'Take your leftover salmon straight from the fridge - it should be cold. Place it in a microwave-safe bowl. Use a fork to break it up into chunks and flakes. Don\'t worry about making it perfect - rough flakes are fine. This is what makes this recipe so genius - it uses leftovers!',
        skillTip: 'This works with ANY cooked salmon - baked, grilled, pan-seared, even canned salmon!',
        timeEstimate: 1
      },
      {
        step: 2,
        instruction: 'Top salmon with cold rice and place one ice cube on top.',
        detailedExplanation: 'Add your cold leftover rice right on top of the salmon flakes. Pack it down gently so it covers the salmon. Now here\'s the viral trick: place ONE ice cube right in the center on top of the rice. This is what Emily Mariko does in her viral TikTok!',
        skillTip: 'The ice cube is KEY! It steams the rice as it microwaves, keeping it moist and fluffy instead of dry.',
        timeEstimate: 1
      },
      {
        step: 3,
        instruction: 'Cover with parchment paper and microwave for 1.5-2 minutes.',
        detailedExplanation: 'Tear off a piece of parchment paper and place it directly on top of the bowl, covering the rice and ice cube. Microwave on high for 1.5 to 2 minutes. The ice cube will melt and steam the rice while reheating everything. You\'ll see the parchment paper puff up from the steam - that\'s perfect!',
        skillTip: 'Parchment paper (not plastic wrap!) traps steam and prevents splatters. This is part of what made the video go viral!',
        timeEstimate: 2
      },
      {
        step: 4,
        instruction: 'Remove from microwave and discard parchment. Mix salmon and rice together.',
        detailedExplanation: 'Carefully remove the bowl from the microwave (it will be hot!). Take off and discard the parchment paper. Use a fork to mix the flaked salmon and rice together thoroughly. The rice should be steaming hot, fluffy, and perfectly reheated. The salmon will be warm and incorporated throughout.',
        timeEstimate: 1
      },
      {
        step: 5,
        instruction: 'Add Kewpie mayo, soy sauce, and sriracha. Mix well.',
        detailedExplanation: 'Drizzle about 1 tablespoon of Kewpie mayo (Japanese mayo - it\'s richer and sweeter than American mayo), 1-2 teaspoons of soy sauce, and a squirt of sriracha over the rice and salmon mixture. Use your fork to mix everything together really well. The mayo makes it creamy, the soy adds umami, and the sriracha gives it a kick.',
        skillTip: 'Kewpie mayo is found in the Asian section. It\'s creamier than regular mayo and makes a huge difference!',
        timeEstimate: 1
      },
      {
        step: 6,
        instruction: 'Top with sliced avocado, kimchi, and serve with seaweed.',
        detailedExplanation: 'Slice your avocado and fan it over the top of the bowl. Add a spoonful of kimchi on the side (the tangy, spicy flavor is amazing with this!). Serve with a packet of roasted seaweed snacks - you tear off pieces and use them to scoop up bites of the rice bowl. This is exactly how Emily eats it in the viral video!',
        timeEstimate: 2
      },
      {
        step: 7,
        instruction: 'Optional: Add more toppings and enjoy immediately.',
        detailedExplanation: 'Some people add cucumber slices, edamame, or sesame seeds. The base recipe is salmon + rice + ice cube, but you can customize with whatever you like! Eat it while it\'s hot. The combination of warm rice, creamy mayo, spicy sriracha, cool avocado, and tangy kimchi is why this recipe went viral with millions of views.',
        skillTip: 'Make this your own! The ice cube trick works with any protein and rice combo.',
        timeEstimate: 1
      }
    ]
  }
];
