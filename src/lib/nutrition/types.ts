// Nutrition data types for food lookup and macro tracking

export type Macro = {
  kcal: number;
  protein_g: number;
  carb_g: number;
  fat_g: number;
  fiber_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  base_ref: "per_100g" | "per_serving";
  serving?: { grams?: number; desc?: string };
  source: "off" | "fdc";
  confidence: number;
  raw?: unknown;
  notes?: string[];
};

export type GetMacrosInput = {
  upc?: string;
  text?: string;
  name?: string;
  amount?: number;
  unit?: string; // g, oz, cup, slice, etc.
};

export type GetMacrosResult = Macro & {
  scaled?: {
    grams: number;
    kcal: number;
    protein_g: number;
    carb_g: number;
    fat_g: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
  };
  cannot_scale?: boolean;
  food_name?: string;
};

export type OFFProduct = {
  product?: {
    product_name?: string;
    serving_size?: string;
    nutriments?: {
      'energy-kcal_100g'?: number;
      'energy-kj_100g'?: number;
      'proteins_100g'?: number;
      'carbohydrates_100g'?: number;
      'fat_100g'?: number;
      'fiber_100g'?: number;
      'sugars_100g'?: number;
      'sodium_100g'?: number;
      'energy-kcal_serving'?: number;
      'proteins_serving'?: number;
      'carbohydrates_serving'?: number;
      'fat_serving'?: number;
    };
  };
  status: number;
  status_verbose?: string;
};

export type FDCFood = {
  fdcId: number;
  description: string;
  dataType: string;
  foodNutrients: Array<{
    nutrientName: string;
    nutrientNumber?: string;
    unitName: string;
    value: number;
  }>;
  foodPortions?: Array<{
    gramWeight: number;
    modifier?: string;
    portionDescription?: string;
    amount?: number;
  }>;
  gtinUpc?: string;
};

export type FDCSearchResult = {
  foods: FDCFood[];
  totalHits: number;
};
