export type Ingredient = {
  id: string;
  name: string;
  amount?: number;
  unit?: string;
};

export type Recipe = {
  id: string;
  title: string;
  image: string;
  prepTime: number; // in minutes
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  dietaryTags: string[];
  ingredients: Ingredient[];
  instructions?: string[];
};

export type FilterState = {
  dietary: string[];
  maxPrepTime: number | null;
  maxCalories: number | null;
  minProtein: number | null;
};

