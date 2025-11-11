// Nutrition module types for open-data food lookup

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
  error?: string;
};

export type NutritionConfig = {
  fdcApiKey: string;
};
