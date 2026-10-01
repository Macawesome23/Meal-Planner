import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '@/types';

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

interface PlannerState {
  savedRecipes: Recipe[];
  calendar: Record<DayOfWeek, Recipe[]>;
}

const initialState: PlannerState = {
  savedRecipes: [],
  calendar: {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  },
};

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    toggleSavedRecipe(state, action: PayloadAction<Recipe>) {
      const exists = state.savedRecipes.find(r => r.id === action.payload.id);
      if (exists) {
        state.savedRecipes = state.savedRecipes.filter(r => r.id !== action.payload.id);
      } else {
        state.savedRecipes.push(action.payload);
      }
    },
    addToCalendar(state, action: PayloadAction<{ day: DayOfWeek; recipe: Recipe }>) {
      const { day, recipe } = action.payload;
      // Prevent duplicates on the same day
      if (!state.calendar[day].find(r => r.id === recipe.id)) {
        state.calendar[day].push(recipe);
      }
    },
    removeFromCalendar(state, action: PayloadAction<{ day: DayOfWeek; recipeId: string }>) {
      const { day, recipeId } = action.payload;
      state.calendar[day] = state.calendar[day].filter(r => r.id !== recipeId);
    },
  },
});

export const { toggleSavedRecipe, addToCalendar, removeFromCalendar } = plannerSlice.actions;
export default plannerSlice.reducer;
