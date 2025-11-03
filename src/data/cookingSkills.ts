import type { CookingSkill } from '../types';

export const cookingSkills: CookingSkill[] = [
  // KNIFE SKILLS
  {
    id: 'knife-001',
    title: 'How to Hold a Chef\'s Knife',
    category: 'knife-skills',
    difficulty: 'beginner',
    description: 'Learn the proper grip for safe and effective knife work',
    estimatedTime: 5,
    detailedSteps: [
      'Grip the handle firmly with your dominant hand, placing your thumb on one side and your index finger on the opposite side of the blade base',
      'Wrap your remaining three fingers around the handle for stability',
      'Keep your wrist straight and relaxed - avoid death-gripping the knife',
      'With your non-dominant hand, form a "claw" shape to hold the food, tucking your fingertips away from the blade',
      'Practice the motion without cutting first - get comfortable with the grip'
    ],
    tips: [
      'A sharp knife is safer than a dull one - it requires less pressure and is more predictable',
      'Keep the tip of the knife on the cutting board and use a rocking motion for most cuts',
      'Take your time - speed comes with practice, safety comes first'
    ],
    commonMistakes: [
      'Holding the knife too far back on the handle - reduces control',
      'Gripping too tightly - causes hand fatigue and reduces precision',
      'Not using the claw grip with your guide hand - risk of cutting fingers'
    ]
  },
  {
    id: 'knife-002',
    title: 'Basic Chopping Technique',
    category: 'knife-skills',
    difficulty: 'beginner',
    description: 'Master the fundamental chopping motion for vegetables',
    estimatedTime: 10,
    detailedSteps: [
      'Position your cutting board on a damp towel to prevent slipping',
      'Place the food item on the board and use your claw hand to hold it steady',
      'Keep the knife tip on the board and lift only the handle',
      'Use a rocking motion: down through the food, then forward slightly as you lift',
      'Move your guide hand backward after each cut, maintaining the claw position',
      'Keep cuts uniform in size for even cooking'
    ],
    tips: [
      'Start slow - accuracy is more important than speed',
      'Listen for a consistent rhythm - this indicates good technique',
      'If the food rolls, cut a thin slice off one side to create a flat, stable surface'
    ],
    commonMistakes: [
      'Lifting the entire knife off the board - wastes energy and reduces control',
      'Inconsistent cut sizes - leads to uneven cooking',
      'Moving too fast before mastering the technique'
    ]
  },
  {
    id: 'knife-003',
    title: 'Dicing Onions',
    category: 'knife-skills',
    difficulty: 'intermediate',
    description: 'Learn to dice onions efficiently and with minimal tears',
    estimatedTime: 15,
    detailedSteps: [
      'Cut the onion in half from root to tip (through the stem)',
      'Peel off the papery outer layers, but leave the root end intact',
      'Place one half flat-side down on the cutting board',
      'Make horizontal cuts parallel to the board, starting near the top and working down (don\'t cut through the root)',
      'Make vertical cuts from top to root, following the onion\'s natural lines (still don\'t cut the root)',
      'Finally, slice across perpendicular to your vertical cuts - the onion will fall into perfect dice',
      'The root holds everything together until the final cuts'
    ],
    tips: [
      'Chill the onion for 30 minutes before cutting to reduce tears',
      'Keep your knife sharp - less cell damage means fewer tear-inducing gases',
      'Leave the root intact as long as possible - it holds the onion together'
    ],
    commonMistakes: [
      'Cutting through the root too early - onion falls apart',
      'Making horizontal cuts too deep - can cut yourself',
      'Removing all the outer layers - you need one layer for structure'
    ]
  },

  // COOKING METHODS
  {
    id: 'cook-001',
    title: 'Boiling and Simmering',
    category: 'cooking-methods',
    difficulty: 'beginner',
    description: 'Understand the difference between boiling and simmering, and when to use each',
    estimatedTime: 10,
    detailedSteps: [
      'Fill a pot with water (usually 3/4 full to prevent overflow)',
      'Place on burner and turn heat to high for boiling',
      'BOILING: Large bubbles rapidly breaking the surface - 212°F/100°C at sea level',
      'SIMMERING: Small bubbles gently breaking the surface - 180-205°F/85-96°C',
      'To simmer, bring water to a boil first, then reduce heat to medium-low',
      'Add salt to the water (1 tablespoon per gallon for pasta) before it boils'
    ],
    tips: [
      'Use a lid to bring water to a boil faster',
      'Boiling is for pasta, blanching vegetables, and cooking potatoes',
      'Simmering is for soups, stews, rice, and delicate proteins',
      'Never boil meat proteins - they become tough; simmer instead'
    ],
    commonMistakes: [
      'Using too small a pot - water can boil over',
      'Adding salt too late - it takes longer to dissolve in cooler water',
      'Boiling when you should simmer - makes meat tough and breaks down vegetables too much'
    ]
  },
  {
    id: 'cook-002',
    title: 'Sautéing Basics',
    category: 'cooking-methods',
    difficulty: 'beginner',
    description: 'Learn to cook food quickly in a small amount of oil over high heat',
    estimatedTime: 15,
    detailedSteps: [
      'Choose the right pan - a wide, shallow pan with sloped sides is ideal',
      'Heat the pan over medium-high heat for 2-3 minutes until hot',
      'Add oil (1-2 tablespoons) and swirl to coat the pan',
      'Wait until the oil shimmers and moves easily - this means it\'s hot enough',
      'Add your food in a single layer - don\'t overcrowd the pan',
      'Let food cook undisturbed for 1-2 minutes to develop color',
      'Flip or stir food, then continue cooking until done',
      'Food should sizzle when it hits the pan - if not, the pan isn\'t hot enough'
    ],
    tips: [
      'Pat food dry before sautéing - moisture causes steaming instead of browning',
      'Don\'t move food around too much - let it develop a crust',
      'Use oils with high smoke points: avocado, grapeseed, or refined olive oil',
      'Season food after sautéing - salt draws out moisture if added too early'
    ],
    commonMistakes: [
      'Overcrowding the pan - causes steaming instead of sautéing',
      'Not heating the pan enough - food sticks and won\'t brown',
      'Using too little oil - food sticks to the pan',
      'Adding food to cold oil - it absorbs too much oil and becomes greasy'
    ]
  },
  {
    id: 'cook-003',
    title: 'Roasting in the Oven',
    category: 'cooking-methods',
    difficulty: 'beginner',
    description: 'Master dry-heat cooking for vegetables and proteins',
    estimatedTime: 20,
    detailedSteps: [
      'Preheat your oven to the required temperature (usually 400-450°F for roasting)',
      'While oven heats, prep your food: cut vegetables to uniform size, pat proteins dry',
      'Toss vegetables or proteins with oil, salt, and pepper in a large bowl',
      'Arrange in a single layer on a rimmed baking sheet - don\'t overcrowd',
      'Place in the preheated oven on the middle rack',
      'For vegetables: roast 20-30 minutes, flipping halfway through',
      'For proteins: use a meat thermometer to check internal temperature',
      'Let proteins rest for 5-10 minutes after removing from oven'
    ],
    tips: [
      'Preheat the oven fully - this ensures even cooking',
      'Use parchment paper or a silicone mat for easy cleanup',
      'Leave space between food pieces - crowding causes steaming',
      'Higher heat (425-450°F) creates better browning and caramelization'
    ],
    commonMistakes: [
      'Not preheating the oven - leads to uneven cooking',
      'Overcrowding the pan - vegetables steam instead of roast',
      'Opening the oven door too often - releases heat and extends cooking time',
      'Not drying proteins before roasting - prevents browning'
    ]
  },
  {
    id: 'cook-004',
    title: 'Pan-Searing Proteins',
    category: 'cooking-methods',
    difficulty: 'intermediate',
    description: 'Create a flavorful crust on chicken, fish, or meat',
    estimatedTime: 20,
    detailedSteps: [
      'Remove protein from refrigerator 20-30 minutes before cooking to bring to room temperature',
      'Pat the protein completely dry with paper towels - this is crucial',
      'Season generously with salt and pepper on both sides',
      'Heat a heavy-bottomed pan (cast iron or stainless steel) over medium-high heat',
      'Add oil with high smoke point and let it heat until shimmering',
      'Gently lay protein in the pan away from you to prevent splatter',
      'Don\'t touch it for 3-5 minutes - let the crust develop',
      'When the protein releases easily from the pan, flip it over',
      'Cook the second side until desired internal temperature is reached',
      'Remove from heat and let rest for 5 minutes before cutting'
    ],
    tips: [
      'Use a meat thermometer: chicken 165°F, fish 145°F, steak 135°F for medium-rare',
      'The protein will release from the pan when it\'s ready to flip - be patient',
      'For thick proteins, finish in a 400°F oven after searing both sides',
      'Don\'t cut into the protein to check doneness - use a thermometer to keep juices inside'
    ],
    commonMistakes: [
      'Using cold protein straight from fridge - cooks unevenly',
      'Not drying the surface - prevents browning',
      'Moving or flipping too early - crust doesn\'t form',
      'Using too low heat - protein steams instead of sears'
    ]
  },

  // FOOD SAFETY
  {
    id: 'safety-001',
    title: 'Preventing Cross-Contamination',
    category: 'food-safety',
    difficulty: 'beginner',
    description: 'Learn to keep raw and cooked foods separate to prevent foodborne illness',
    estimatedTime: 10,
    detailedSteps: [
      'Use separate cutting boards: one for raw meat/poultry/fish, one for vegetables and ready-to-eat foods',
      'Wash hands with soap and water for 20 seconds after handling raw proteins',
      'Never place cooked food back on a plate that held raw food',
      'Clean and sanitize cutting boards, knives, and counters after working with raw proteins',
      'Keep raw meat on the bottom shelf of the refrigerator to prevent drips onto other foods',
      'Use different utensils for raw and cooked foods'
    ],
    tips: [
      'Color-code your cutting boards: red for meat, green for vegetables, white for dairy',
      'Sanitize cutting boards with a dilute bleach solution (1 tablespoon bleach per gallon of water)',
      'When in doubt, wash it - extra washing is always safer',
      'Pay attention to handles - they often get overlooked when cleaning'
    ],
    commonMistakes: [
      'Using the same cutting board for everything without washing between uses',
      'Wiping down surfaces with a dirty sponge - spreads bacteria',
      'Not washing hands between handling different food types',
      'Storing raw meat above ready-to-eat foods in the fridge'
    ]
  },
  {
    id: 'safety-002',
    title: 'Safe Internal Temperatures',
    category: 'food-safety',
    difficulty: 'beginner',
    description: 'Know the safe internal temperatures for different proteins',
    estimatedTime: 10,
    detailedSteps: [
      'Invest in a reliable instant-read meat thermometer',
      'Insert thermometer into the thickest part of the protein, avoiding bone',
      'Wait for the reading to stabilize (usually 3-5 seconds for instant-read)',
      'Safe minimum temperatures: Chicken/Turkey 165°F, Ground meats 160°F, Fish 145°F, Beef/Pork steaks 145°F with 3-minute rest',
      'Remove protein from heat when it\'s 5°F below target - it will continue cooking while resting',
      'Let meat rest before cutting - allows juices to redistribute'
    ],
    tips: [
      'Clean your thermometer between uses to prevent cross-contamination',
      'For thick cuts, check temperature in multiple spots',
      'Remember: you can always cook it more, but you can\'t uncook it',
      'Keep a temperature guide on your phone for quick reference'
    ],
    commonMistakes: [
      'Relying on color alone - not accurate for doneness',
      'Cutting into meat to check doneness - releases precious juices',
      'Not calibrating your thermometer - can lead to inaccurate readings',
      'Touching bone with the thermometer - gives false high reading'
    ]
  },

  // PREP TECHNIQUES
  {
    id: 'prep-001',
    title: 'How to Measure Ingredients Accurately',
    category: 'prep-techniques',
    difficulty: 'beginner',
    description: 'Master dry and wet measurement techniques for consistent results',
    estimatedTime: 10,
    detailedSteps: [
      'DRY INGREDIENTS (flour, sugar, rice): Use dry measuring cups that can be leveled off',
      'Spoon ingredient into the measuring cup - don\'t pack it down or scoop directly',
      'Level off the top with a straight edge (knife back or spatula)',
      'WET INGREDIENTS: Use clear liquid measuring cups with pouring spouts',
      'Place measuring cup on level surface and pour liquid in',
      'Check at eye level - meniscus (curved surface) should hit the line',
      'For sticky liquids (honey, peanut butter), spray cup with oil first for easy release'
    ],
    tips: [
      'Brown sugar is the exception - it should be packed firmly into the cup',
      'Sift flour if the recipe calls for it - "1 cup sifted flour" is different from "1 cup flour, sifted"',
      'For accuracy in baking, use a kitchen scale to weigh ingredients',
      'One tablespoon = 3 teaspoons; 1/4 cup = 4 tablespoons'
    ],
    commonMistakes: [
      'Scooping flour directly with the measuring cup - packs it down and gives too much',
      'Measuring liquids in dry measuring cups - inaccurate measurements',
      'Not leveling off dry ingredients - can significantly alter recipe',
      'Measuring over the mixing bowl - if you overpour, the whole batch is ruined'
    ]
  },
  {
    id: 'prep-002',
    title: 'Proper Food Washing Techniques',
    category: 'prep-techniques',
    difficulty: 'beginner',
    description: 'Learn when and how to wash different foods',
    estimatedTime: 10,
    detailedSteps: [
      'ALWAYS WASH: All fruits and vegetables, even if you\'re peeling them',
      'NEVER WASH: Raw poultry, meat, or eggs - spreads bacteria around your sink',
      'For firm produce (apples, potatoes): Scrub under running water with a vegetable brush',
      'For leafy greens: Submerge in cold water, swish around, let sit 1-2 minutes, lift out (dirt sinks)',
      'For delicate berries: Rinse gently in a colander just before eating',
      'For herbs: Swish in cold water, then spin dry in a salad spinner',
      'Pat everything dry after washing - excess water can dilute flavors and prevent browning'
    ],
    tips: [
      'Wash produce right before use, not when you bring it home - stays fresher',
      'Cold water is best for washing produce',
      'You don\'t need special produce washes - running water is equally effective',
      'Pre-washed greens labeled "ready to eat" are safe to use without re-washing'
    ],
    commonMistakes: [
      'Washing meat or poultry - spreads contamination via splashing',
      'Not washing produce you\'ll peel - contaminants can transfer from knife to flesh',
      'Washing berries too far in advance - makes them soggy and moldy',
      'Using soap on produce - not food-safe and can leave residue'
    ]
  },
  {
    id: 'prep-003',
    title: 'Meal Prep Organization and Planning',
    category: 'prep-techniques',
    difficulty: 'intermediate',
    description: 'Efficiently prepare multiple meals in advance',
    estimatedTime: 30,
    detailedSteps: [
      'Choose 2-3 recipes that share common ingredients to reduce waste',
      'Make a detailed shopping list organized by grocery store section',
      'Set aside a 2-3 hour block of time, usually Sunday afternoon',
      'Start with tasks that take longest: cooking grains, roasting proteins, baking',
      'While those cook, prep vegetables, portion snacks, and make sauces',
      'Use an assembly line approach: do all chopping at once, all cooking at once',
      'Portion meals into individual containers as they finish',
      'Label containers with contents and date (use within 3-4 days)',
      'Store in refrigerator with newest meals in back, oldest in front'
    ],
    tips: [
      'Invest in quality glass containers - they last longer and reheat better',
      'Cook versatile proteins that work in multiple dishes (grilled chicken, ground turkey)',
      'Prep ingredients but don\'t combine until day-of for maximum freshness',
      'Freeze half of prepped meals if you won\'t eat them within 4 days'
    ],
    commonMistakes: [
      'Trying to prep too many different recipes - overwhelming and time-consuming',
      'Not labeling containers - forget what\'s in them or when you made them',
      'Combining hot and cold ingredients - creates condensation and sogginess',
      'Not considering variety - eating the same thing 5 days gets boring'
    ]
  },

  // EQUIPMENT
  {
    id: 'equip-001',
    title: 'Essential Kitchen Tools for Beginners',
    category: 'equipment',
    difficulty: 'beginner',
    description: 'Understanding basic kitchen equipment and their uses',
    estimatedTime: 15,
    detailedSteps: [
      'KNIVES: 8-inch chef\'s knife (all-purpose), paring knife (detail work), serrated bread knife',
      'CUTTING BOARDS: At least 2 - one for produce, one for raw proteins',
      'POTS & PANS: 10-12 inch skillet, medium saucepan (2-3 qt), large pot (6-8 qt for pasta)',
      'MIXING BOWLS: Set of 3-4 in various sizes',
      'MEASURING TOOLS: Dry measuring cups, liquid measuring cup, measuring spoons',
      'UTENSILS: Wooden spoon, spatula, tongs, whisk, can opener',
      'THERMOMETER: Instant-read meat thermometer',
      'BAKEWARE: Rimmed baking sheet, 9x13 inch baking dish'
    ],
    tips: [
      'Buy quality knives - they last longer and are safer than cheap ones',
      'Stainless steel or cast iron pans are best for beginners',
      'Don\'t buy unitasker tools - stick with multi-purpose equipment',
      'Take care of your tools: hand wash knives, season cast iron, avoid metal on non-stick'
    ],
    commonMistakes: [
      'Buying a large knife set when you only need 2-3 knives',
      'Putting knives in the dishwasher - dulls and damages them',
      'Using metal utensils on non-stick pans - scratches the coating',
      'Not having a meat thermometer - guessing doneness is unreliable'
    ]
  },
  {
    id: 'equip-002',
    title: 'Knife Sharpening and Maintenance',
    category: 'equipment',
    difficulty: 'intermediate',
    description: 'Keep your knives sharp and in good condition',
    estimatedTime: 20,
    detailedSteps: [
      'HONING (weekly): Use a honing steel to realign the knife edge',
      'Hold the steel vertically with tip resting on a towel',
      'Place knife against steel at 15-20 degree angle',
      'Draw knife down and across the steel in a sweeping motion',
      'Repeat 5-10 times per side, alternating sides',
      'SHARPENING (every 3-6 months): Use a whetstone or take to professional',
      'If using whetstone: soak stone, hold knife at 15-20 degrees, push across stone away from you',
      'STORAGE: Use a knife block, magnetic strip, or blade guards - never loose in a drawer'
    ],
    tips: [
      'A honing steel doesn\'t sharpen - it just realigns the edge',
      'Test sharpness on a tomato - should slice through skin with no pressure',
      'Professional sharpening costs $5-10 per knife and is worth it for beginners',
      'Store knives separately from other utensils to protect the edge'
    ],
    commonMistakes: [
      'Confusing honing with sharpening - they\'re different processes',
      'Using too steep an angle when honing - can damage the edge',
      'Throwing knives loose in a drawer - dulls and damages them',
      'Cutting on glass or marble cutting boards - instantly dulls knives'
    ]
  }
];
