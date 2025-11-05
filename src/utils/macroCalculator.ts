/**
 * Macro calculator for athletes pursuing a target weight.
 * Assumptions:
 * - Activity level: moderate–high by default (16 kcal/lb).
 * - Protein: >= 1 g per lb of TARGET weight (exactly 1 g/lb here).
 * - Fat: max of 30% calories OR 0.3 g/lb of TARGET weight (health floor).
 * - Carbs: fill remaining calories.
 *
 * Inputs and outputs use pounds (lb) and grams (g).
 */

export type MacroInputs = {
  /** Current bodyweight in pounds */
  currentWeightLb: number;
  /** Target (goal) bodyweight in pounds */
  targetWeightLb: number;
  /**
   * Calories per lb of CURRENT weight to reflect activity (15.5–17 typical).
   * Default 16 for moderate–high activity.
   */
  activityKcalPerLb?: number;
  /**
   * Absolute max daily surplus/deficit (kcal). Default 500.
   * We scale linearly up to this based on |target-current| (hits max at 10+ lb away).
   */
  calorieDeltaMax?: number;
  /**
   * Bodyweight gap (lb) at which the max surplus/deficit is reached. Default 10 lb.
   */
  deltaAtMax?: number;
  /**
   * Target fraction of calories from fat (default 0.30 = 30%).
   * We also enforce a fat floor by bodyweight.
   */
  fatRatio?: number;
  /**
   * Fat floor in g/lb of TARGET weight (default 0.30).
   */
  fatFloorPerLb?: number;
  /**
   * Rounds outputs to nearest N (e.g., 1, 5). Default 1.
   */
  roundTo?: number;
};

export type MacroOutputs = {
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  debug: {
    direction: -1 | 0 | 1; // -1 cut, 0 maintain, +1 gain
    deltaLb: number;
    calorieDeltaApplied: number;
    activityKcalPerLb: number;
    fatRatio: number;
    fatFloorPerLb: number;
  };
};

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
const roundToNearest = (x: number, n: number) => Math.round(x / n) * n;

/**
 * Compute daily calories and macros.
 */
export function computeMacros({
  currentWeightLb,
  targetWeightLb,
  activityKcalPerLb = 16,
  calorieDeltaMax = 500,
  deltaAtMax = 10,
  fatRatio = 0.30,
  fatFloorPerLb = 0.30,
  roundTo = 1,
}: MacroInputs): MacroOutputs {
  // --- Basic validation ---
  if (!(currentWeightLb > 0) || !(targetWeightLb > 0)) {
    throw new Error("currentWeightLb and targetWeightLb must be positive.");
  }
  if (activityKcalPerLb < 12 || activityKcalPerLb > 20) {
    // soft sanity bounds; still allowed
    console.warn("activityKcalPerLb is outside typical range (12–20). Proceeding.");
  }

  const Wc = currentWeightLb;
  const Wt = targetWeightLb;

  // Direction of change: -1 cut, 0 maintain, +1 gain
  const direction = (Math.sign(Wt - Wc) || 0) as -1 | 0 | 1;
  const deltaLb = Math.abs(Wt - Wc);

  // Scale surplus/deficit up to ±calorieDeltaMax, hitting max at deltaAtMax lb gap
  const scale = clamp(deltaLb / deltaAtMax, 0, 1);
  const calorieDeltaApplied = direction * (calorieDeltaMax * scale);

  // Calories based on activity against CURRENT weight, then add/subtract delta
  const caloriesRaw = activityKcalPerLb * Wc + calorieDeltaApplied;

  // Protein: at least 1 g/lb of TARGET (use exactly 1 g/lb here)
  const protein_g_raw = 1.0 * Wt;

  // Fat: choose the larger of floor (by TARGET) vs ratio of calories
  const fatFloor_g_raw = fatFloorPerLb * Wt;
  const fatFromRatio_g_raw = fatRatio * (caloriesRaw / 9);
  const fat_g_raw = Math.max(fatFloor_g_raw, fatFromRatio_g_raw);

  // Carbs fill the remainder (never negative)
  const carbs_g_raw = Math.max((caloriesRaw - 4 * protein_g_raw - 9 * fat_g_raw) / 4, 0);

  // Rounding for UI friendliness
  const r = (x: number) => roundToNearest(x, roundTo);

  return {
    calories: r(caloriesRaw),
    protein_g: r(protein_g_raw),
    fat_g: r(fat_g_raw),
    carbs_g: r(carbs_g_raw),
    debug: {
      direction,
      deltaLb,
      calorieDeltaApplied: Math.round(calorieDeltaApplied),
      activityKcalPerLb,
      fatRatio,
      fatFloorPerLb,
    },
  };
}
