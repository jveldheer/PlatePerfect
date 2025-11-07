export interface Supplement {
  name: string;
  what_it_is: string;
  key_benefits: string[];
  weight_based_dosing: boolean;
  dose: string;
  timing: string;
  notes?: string;
}

export interface SupplementSection {
  id: string;
  title: string;
  items: Supplement[];
}

export interface QuickStartStack {
  name: string;
  items: string[];
}

export const supplementSections: SupplementSection[] = [
  {
    id: 'foundational_protein_recovery',
    title: 'Foundational Protein & Recovery',
    items: [
      {
        name: 'Whey protein',
        what_it_is: 'Fast-digesting dairy protein (high leucine)',
        key_benefits: [
          'Stimulates muscle protein synthesis',
          'Convenient post-training protein'
        ],
        weight_based_dosing: true,
        dose: '0.25–0.40 g/kg/meal (≈20–40 g)',
        timing: 'Post-workout or any meal to hit daily protein'
      },
      {
        name: 'Casein protein',
        what_it_is: 'Slow-digesting dairy protein',
        key_benefits: [
          'Supports overnight muscle protein synthesis',
          'Increases satiety'
        ],
        weight_based_dosing: true,
        dose: '30–40 g (≈0.3 g/kg)',
        timing: '30–60 min before bed or between meals'
      },
      {
        name: 'Creatine monohydrate',
        what_it_is: 'Boosts muscle phosphocreatine',
        key_benefits: [
          'Increases strength and power',
          'Improves sprint capacity',
          'Supports lean mass'
        ],
        weight_based_dosing: true,
        dose: 'Load: 0.3 g/kg/day × 5–7 days → Maintain: 3–5 g/day (or 0.03 g/kg/day)',
        timing: 'Any time daily; consistency is more important than timing'
      },
      {
        name: 'Collagen peptides / gelatin',
        what_it_is: 'Hydrolyzed connective-tissue proteins',
        key_benefits: [
          'Supports tendon and ligament health',
          'Aids joint comfort'
        ],
        weight_based_dosing: false,
        dose: 'Gelatin 15 g + ~50 mg vitamin C; or hydrolyzed collagen 10–15 g (30 g can increase acute collagen synthesis)',
        timing: '~60 min before tendon/ligament loading or daily with meals'
      },
      {
        name: 'Fish oil (EPA + DHA)',
        what_it_is: 'Marine omega-3 fatty acids',
        key_benefits: [
          'Supports joint comfort and recovery',
          'Cardiometabolic support'
        ],
        weight_based_dosing: false,
        dose: '1–3 g/day combined EPA + DHA',
        timing: 'With meals (split if >1 g/day)'
      }
    ]
  },
  {
    id: 'acute_performance_ergogenics',
    title: 'Acute Performance Ergogenics',
    items: [
      {
        name: 'Caffeine',
        what_it_is: 'Central nervous system stimulant',
        key_benefits: [
          'Enhances power and endurance',
          'Improves focus',
          'Lowers perceived exertion'
        ],
        weight_based_dosing: true,
        dose: '3–6 mg/kg',
        timing: '30–60 min pre-training; avoid late day'
      },
      {
        name: 'Beta-alanine',
        what_it_is: 'Carnosine precursor',
        key_benefits: [
          'Improves repeated high-intensity efforts (~1–4 min)'
        ],
        weight_based_dosing: false,
        dose: '3.2–6.4 g/day, split doses for 4+ weeks',
        timing: 'Daily; timing not critical'
      },
      {
        name: 'Citrulline',
        what_it_is: 'Nitric-oxide precursor',
        key_benefits: [
          'Increases blood flow',
          'Improves repetitions-to-fatigue in hard sets'
        ],
        weight_based_dosing: false,
        dose: 'L-citrulline 3–6 g or citrulline malate (2:1) ~8 g',
        timing: '30–60 min pre-training'
      },
      {
        name: 'Arginine',
        what_it_is: 'Nitric-oxide amino acid',
        key_benefits: [
          'Alternative to citrulline (generally less reliable orally)'
        ],
        weight_based_dosing: false,
        dose: '6–10 g',
        timing: '30–60 min pre-training (if used; most prefer citrulline)'
      },
      {
        name: 'Coenzyme Q10 (CoQ10)',
        what_it_is: 'Mitochondrial cofactor',
        key_benefits: [
          'Supports cellular energy',
          'Modest support for endurance/work output in some studies'
        ],
        weight_based_dosing: false,
        dose: '100–300 mg with fat',
        timing: 'With a fat-containing meal'
      }
    ]
  },
  {
    id: 'inflammation_joints_immune',
    title: 'Inflammation, Joints, & Immune Support',
    items: [
      {
        name: 'Turmeric / Curcumin',
        what_it_is: 'Anti-inflammatory polyphenol',
        key_benefits: [
          'Reduces DOMS',
          'Supports joint comfort'
        ],
        weight_based_dosing: false,
        dose: '500–1000 mg curcuminoids with piperine or in phytosome form',
        timing: 'With meals (1–2×/day)'
      },
      {
        name: 'Vitamin C',
        what_it_is: 'Water-soluble antioxidant vitamin',
        key_benefits: [
          'Immune support',
          'Enhances collagen cross-linking when paired with gelatin/collagen'
        ],
        weight_based_dosing: false,
        dose: '200–500 mg/day',
        timing: 'With breakfast or away from the training window'
      },
      {
        name: 'Quercetin',
        what_it_is: 'Plant flavonoid',
        key_benefits: [
          'Immune support during heavy blocks',
          'Modest endurance signals in some data'
        ],
        weight_based_dosing: false,
        dose: '500–1000 mg/day',
        timing: 'With meals'
      },
      {
        name: 'Zinc',
        what_it_is: 'Essential mineral',
        key_benefits: [
          'Supports immune function',
          'Acts as a recovery co-factor'
        ],
        weight_based_dosing: false,
        dose: '15–30 mg/day (Tolerable Upper Intake Level = 40 mg/day)',
        timing: 'With food; separate from iron/calcium by 2+ hours'
      }
    ]
  },
  {
    id: 'sleep_stress_cognitive',
    title: 'Sleep, Stress, & Cognitive Support',
    items: [
      {
        name: 'Ashwagandha (root extract)',
        what_it_is: 'Adaptogenic herb (e.g., KSM-66®, Sensoril®)',
        key_benefits: [
          'Improves stress resilience',
          'Supports sleep quality',
          'Small strength/VO₂ gains in some studies'
        ],
        weight_based_dosing: false,
        dose: '300–600 mg/day',
        timing: 'AM and/or PM'
      },
      {
        name: 'Rhodiola rosea',
        what_it_is: 'Adaptogenic herb',
        key_benefits: [
          'Reduces mental/physical fatigue',
          'Supports mood under load'
        ],
        weight_based_dosing: false,
        dose: '200–400 mg standardized (~3% rosavins/1% salidroside)',
        timing: 'Morning or 30–60 min pre-session'
      },
      {
        name: 'Melatonin',
        what_it_is: 'Sleep-onset hormone',
        key_benefits: [
          'Speeds sleep onset',
          'Helps circadian/jet-lag alignment'
        ],
        weight_based_dosing: false,
        dose: '0.3–3 mg',
        timing: '60–90 min before bed'
      },
      {
        name: 'GABA',
        what_it_is: 'Inhibitory neurotransmitter',
        key_benefits: [
          'Relaxation',
          'Sleep onset support in some users'
        ],
        weight_based_dosing: false,
        dose: '100–300 mg',
        timing: '30–60 min before bed'
      },
      {
        name: 'Apigenin',
        what_it_is: 'Chamomile flavone',
        key_benefits: [
          'Calm and sleep depth support (isolated apigenin is experimental; chamomile extract has more human data)'
        ],
        weight_based_dosing: false,
        dose: '25–50 mg isolated; or chamomile extract ~270 mg twice daily',
        timing: 'Evening'
      },
      {
        name: 'Lion\'s mane (Hericium erinaceus)',
        what_it_is: 'Nootropic mushroom',
        key_benefits: [
          'Supports focus and learning',
          'May modulate nerve growth factors (early human evidence)'
        ],
        weight_based_dosing: false,
        dose: '500–1000 mg fruiting-body extract, 1–2×/day',
        timing: 'Morning and/or early afternoon'
      },
      {
        name: 'Panax ginseng (Asian ginseng)',
        what_it_is: 'Adaptogenic root',
        key_benefits: [
          'Perceived energy and cognition',
          'Variable endurance effects'
        ],
        weight_based_dosing: false,
        dose: '200–400 mg standardized (~3–5% ginsenosides)',
        timing: 'Morning'
      }
    ]
  },
  {
    id: 'gut_micronutrients_general_health',
    title: 'Gut, Micronutrients, & General Health',
    items: [
      {
        name: 'Probiotics',
        what_it_is: 'Live beneficial microbes',
        key_benefits: [
          'GI comfort under load',
          'Reduced URTI symptoms with certain strains'
        ],
        weight_based_dosing: false,
        dose: '5–20B CFU/day (strain-specific)',
        timing: 'Daily with food'
      },
      {
        name: 'Colostrum (bovine)',
        what_it_is: 'Bioactive dairy fraction',
        key_benefits: [
          'GI barrier support',
          'Immune support during heavy training blocks'
        ],
        weight_based_dosing: false,
        dose: '10–20 g/day',
        timing: 'Morning or split doses',
        notes: 'World Anti-Doping Agency (WADA) advises against use for tested athletes due to IGF-1 concerns, although it is not prohibited.'
      },
      {
        name: 'Glutamine',
        what_it_is: 'Conditionally essential amino acid',
        key_benefits: [
          'Supports GI integrity',
          'Immune support during high volume/heat'
        ],
        weight_based_dosing: false,
        dose: '5–10 g/day',
        timing: 'After training or before bed'
      },
      {
        name: 'Multivitamin',
        what_it_is: 'Broad micronutrient backstop',
        key_benefits: [
          'Fills gaps when intake dips or during travel'
        ],
        weight_based_dosing: false,
        dose: 'Per product label',
        timing: 'With a meal'
      },
      {
        name: 'Vitamin B-complex',
        what_it_is: 'B-vitamin blend',
        key_benefits: [
          'Energy metabolism co-factors',
          'Useful when dietary intake is low'
        ],
        weight_based_dosing: false,
        dose: 'Per product label (e.g., B-50 or B-100)',
        timing: 'With breakfast'
      },
      {
        name: 'Magnesium (glycinate/taurate/citrate)',
        what_it_is: 'Essential mineral',
        key_benefits: [
          'Improves sleep quality',
          'Supports muscle/nerve function',
          'Supports glucose handling'
        ],
        weight_based_dosing: false,
        dose: '200–400 mg elemental magnesium',
        timing: 'Evening or with meals'
      },
      {
        name: 'Vitamin D3',
        what_it_is: 'Fat-soluble vitamin/hormone-like nutrient',
        key_benefits: [
          'Supports bone, muscle, and immune function',
          'Low status common in winter'
        ],
        weight_based_dosing: false,
        dose: '600–800 IU/day (RDA). Upper limit (UL) = 4,000 IU/day',
        timing: 'With a fat-containing meal'
      },
      {
        name: 'Vitamin K2 (MK-7)',
        what_it_is: 'Fat-soluble vitamin',
        key_benefits: [
          'Synergistic with D3 for calcium handling and bone health'
        ],
        weight_based_dosing: false,
        dose: '90–200 mcg/day',
        timing: 'With a fat-containing meal'
      },
      {
        name: 'Greens powders',
        what_it_is: 'Dehydrated vegetable/herb blends',
        key_benefits: [
          'Convenient phytonutrients on low-vegetable days'
        ],
        weight_based_dosing: false,
        dose: '1 scoop per product label',
        timing: 'Morning with water',
        notes: 'Choose third-party tested products.'
      },
      {
        name: 'Dried organ powders',
        what_it_is: 'Desiccated liver/organ blends',
        key_benefits: [
          'Provides heme iron, B12, retinol, and choline'
        ],
        weight_based_dosing: false,
        dose: '3–6 capsules or 10–15 g powder',
        timing: 'With meals'
      }
    ]
  },
  {
    id: 'endurance_extras',
    title: 'Endurance-leaning Extras',
    items: [
      {
        name: 'Cordyceps',
        what_it_is: 'Endurance-focused mushroom',
        key_benefits: [
          'Perceived energy support',
          'Altitude support',
          'Mixed performance data in studies'
        ],
        weight_based_dosing: false,
        dose: '1–3 g powder or 1000–1500 mg extract',
        timing: '30–60 min pre-training'
      }
    ]
  }
];

export const quickStartStacks: QuickStartStack[] = [
  {
    name: 'Daily base (all seasons)',
    items: [
      'Creatine 3–5 g',
      'Fish oil 1–3 g EPA + DHA (with meals)',
      'Magnesium 200–400 mg (evening)',
      'Vitamin D3 600–800 IU/day + Vitamin K2 90–200 mcg/day (with a fat-containing meal)',
      'Multivitamin (with breakfast)'
    ]
  },
  {
    name: 'Strength or mixed session (training day)',
    items: [
      '30–60 min pre: Caffeine 3–6 mg/kg + L-citrulline 3–6 g or citrulline malate ~8 g',
      'Daily: Beta-alanine 3.2–6.4 g (split doses)',
      'Post: Whey 20–40 g (or any high-quality protein to reach daily target)'
    ]
  },
  {
    name: 'Endurance / intervals',
    items: [
      '30–60 min pre: Caffeine 3–6 mg/kg ± L-citrulline 3–6 g (or citrulline malate ~8 g)',
      'Daily: Consider CoQ10 100–200 mg with fat'
    ]
  },
  {
    name: 'Tendon/ligament focus',
    items: [
      '~60 min pre-loading: Gelatin 15 g + ~50 mg vitamin C (or collagen 10–15 g)'
    ]
  },
  {
    name: 'Heavy block / travel',
    items: [
      'Probiotic 5–20B CFU/day',
      'Vitamin C 200–500 mg/day',
      'Quercetin 500–1000 mg/day',
      'Colostrum 10–20 g/day (skip if you are a tested athlete due to WADA advisory)'
    ]
  },
  {
    name: 'Sleep & stress',
    items: [
      '30–90 min pre-bed (pick 1–2): Melatonin 0.3–3 mg, GABA 100–300 mg, Apigenin 25–50 mg',
      'Daytime: Ashwagandha 300–600 mg/day; Rhodiola 200–400 mg AM; Lion\'s mane 500–1000 mg AM; Panax ginseng 200–400 mg AM'
    ]
  }
];
