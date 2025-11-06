import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { computeMacros } from '../utils/macroCalculator';
import type { MacroInputs, MacroOutputs } from '../utils/macroCalculator';

interface UserProfile {
  currentWeightLb: number;
  targetWeightLb: number;
  activityKcalPerLb: number;
}

interface ConsumedMacros {
  calories: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
}

interface MacroContextType {
  // User profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;

  // Calculated goals
  macroGoals: MacroOutputs | null;

  // Daily tracking
  consumedMacros: ConsumedMacros;
  addToTracker: (nutrition: { calories: number; protein: number; fat: number; carbs: number }, servings?: number) => void;
  resetTracker: () => void;

  // Helper
  getGoalDirection: () => 'cutting' | 'maintaining' | 'gaining' | null;
}

const MacroContext = createContext<MacroContextType | undefined>(undefined);

const STORAGE_KEY_PROFILE = 'veldheerfuellab_user_profile';
const STORAGE_KEY_CONSUMED = 'veldheerfuellab_consumed_macros';
const STORAGE_KEY_DATE = 'veldheerfuellab_tracker_date';

export function MacroProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [macroGoals, setMacroGoals] = useState<MacroOutputs | null>(null);
  const [consumedMacros, setConsumedMacros] = useState<ConsumedMacros>({
    calories: 0,
    protein_g: 0,
    fat_g: 0,
    carbs_g: 0,
  });

  // Load profile from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (stored) {
      try {
        const profile = JSON.parse(stored) as UserProfile;
        setUserProfileState(profile);
      } catch (e) {
        console.error('Failed to parse stored profile', e);
      }
    }

    // Load consumed macros (check if same day)
    const storedDate = localStorage.getItem(STORAGE_KEY_DATE);
    const today = new Date().toDateString();

    if (storedDate === today) {
      const storedConsumed = localStorage.getItem(STORAGE_KEY_CONSUMED);
      if (storedConsumed) {
        try {
          setConsumedMacros(JSON.parse(storedConsumed));
        } catch (e) {
          console.error('Failed to parse consumed macros', e);
        }
      }
    } else {
      // New day, reset tracker
      localStorage.setItem(STORAGE_KEY_DATE, today);
      localStorage.removeItem(STORAGE_KEY_CONSUMED);
    }
  }, []);

  // Recalculate goals when profile changes
  useEffect(() => {
    if (userProfile) {
      const inputs: MacroInputs = {
        currentWeightLb: userProfile.currentWeightLb,
        targetWeightLb: userProfile.targetWeightLb,
        activityKcalPerLb: userProfile.activityKcalPerLb,
      };
      const goals = computeMacros(inputs);
      setMacroGoals(goals);
    } else {
      setMacroGoals(null);
    }
  }, [userProfile]);

  // Save consumed macros to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONSUMED, JSON.stringify(consumedMacros));
  }, [consumedMacros]);

  const setUserProfile = (profile: UserProfile) => {
    setUserProfileState(profile);
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
  };

  const addToTracker = (
    nutrition: { calories: number; protein: number; fat: number; carbs: number },
    servings: number = 1
  ) => {
    setConsumedMacros((prev) => ({
      calories: prev.calories + nutrition.calories * servings,
      protein_g: prev.protein_g + nutrition.protein * servings,
      fat_g: prev.fat_g + nutrition.fat * servings,
      carbs_g: prev.carbs_g + nutrition.carbs * servings,
    }));
  };

  const resetTracker = () => {
    setConsumedMacros({
      calories: 0,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
    });
    localStorage.removeItem(STORAGE_KEY_CONSUMED);
  };

  const getGoalDirection = (): 'cutting' | 'maintaining' | 'gaining' | null => {
    if (!macroGoals) return null;
    const dir = macroGoals.debug.direction;
    if (dir === -1) return 'cutting';
    if (dir === 1) return 'gaining';
    return 'maintaining';
  };

  return (
    <MacroContext.Provider
      value={{
        userProfile,
        setUserProfile,
        macroGoals,
        consumedMacros,
        addToTracker,
        resetTracker,
        getGoalDirection,
      }}
    >
      {children}
    </MacroContext.Provider>
  );
}

export function useMacros() {
  const context = useContext(MacroContext);
  if (context === undefined) {
    throw new Error('useMacros must be used within a MacroProvider');
  }
  return context;
}
