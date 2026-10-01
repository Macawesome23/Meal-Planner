'use server';

import { Recipe, Ingredient } from '@/types';

const BASE_URL = 'https://dummyjson.com/recipes';

// We fetch all recipes from DummyJSON (which is a fast, open, no-key-required API)
// and filter them based on the user's ingredients.
export const fetchRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  // Fetch all available recipes (limit=100 gets all of them on DummyJSON)
  const response = await fetch(`${BASE_URL}?limit=100`);

  if (!response.ok) {
    throw new Error('Failed to fetch recipes from the open API');
  }

  const data = await response.json();
  const lowerUserIngredients = ingredients.map(i => i.toLowerCase());

  // Transform DummyJSON response to our app's Recipe type
  const allRecipes: Recipe[] = data.recipes.map((item: any) => {
    
    // DummyJSON returns ingredients as an array of strings (e.g., "2 cups Flour")
    // We map them to our Ingredient type.
    const mappedIngredients: Ingredient[] = item.ingredients.map((ingStr: string, idx: number) => ({
      id: `${item.id}-${idx}`,
      name: ingStr, 
      amount: 1, // Dummy data doesn't split amounts cleanly, so we default to 1
      unit: ''
    }));

    // DummyJSON doesn't have macros like protein/carbs/fat, so we generate reasonable 
    // estimates based on calories to keep the UI fully functional for your resume!
    const calories = item.caloriesPerServing || Math.floor(Math.random() * 400 + 200);
    const protein = Math.floor(calories * 0.25 / 4);
    const carbs = Math.floor(calories * 0.45 / 4);
    const fat = Math.floor(calories * 0.30 / 9);

    return {
      id: item.id.toString(),
      title: item.name,
      image: item.image,
      prepTime: item.prepTimeMinutes || 0,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      dietaryTags: item.tags.map((t: string) => t.toLowerCase()),
      ingredients: mappedIngredients
    };
  });

  if (ingredients.length === 0) return allRecipes;

  // Filter recipes: Only return recipes where at least ONE ingredient matches what the user has
  const matchedRecipes = allRecipes.filter(recipe => {
    return recipe.ingredients.some(recipeIng => 
      lowerUserIngredients.some(userIng => {
        const regex = new RegExp(`\\b${userIng}\\b`, 'i');
        return regex.test(recipeIng.name.toLowerCase());
      })
    );
  });

  // Sort by how many ingredients match
  return matchedRecipes.sort((a, b) => {
    const aMatches = a.ingredients.filter(recipeIng => 
      lowerUserIngredients.some(userIng => new RegExp(`\\b${userIng}\\b`, 'i').test(recipeIng.name.toLowerCase()))
    ).length;
    const bMatches = b.ingredients.filter(recipeIng => 
      lowerUserIngredients.some(userIng => new RegExp(`\\b${userIng}\\b`, 'i').test(recipeIng.name.toLowerCase()))
    ).length;
    return bMatches - aMatches;
  });
};

// Autocomplete suggestions using a smart static list. 
const POPULAR_INGREDIENTS = [
  'Chicken', 'Beef', 'Pork', 'Salmon', 'Tofu', 'Eggs',
  'Rice', 'Pasta', 'Quinoa', 'Potatoes', 'Bread', 'Flour',
  'Tomato', 'Onion', 'Garlic', 'Spinach', 'Broccoli', 'Avocado',
  'Milk', 'Cheese', 'Butter', 'Olive Oil', 'Sugar', 'Salt'
];

export const fetchIngredientSuggestions = async (query: string): Promise<string[]> => {
  if (!query || query.trim() === '') return [];
  
  const lowerQuery = query.toLowerCase();
  const suggestions = POPULAR_INGREDIENTS.filter(ing => 
    ing.toLowerCase().includes(lowerQuery)
  );

  return suggestions;
};

// Fetch a single recipe by ID for the dedicated recipe page
export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) return null;
    
    const item = await response.json();
    
    const calories = item.caloriesPerServing || Math.floor(Math.random() * 400 + 200);
    const protein = Math.floor(calories * 0.25 / 4);
    const carbs = Math.floor(calories * 0.45 / 4);
    const fat = Math.floor(calories * 0.30 / 9);

    const mappedIngredients: Ingredient[] = item.ingredients.map((ingStr: string, idx: number) => ({
      id: `${item.id}-${idx}`,
      name: ingStr, 
      amount: 1,
      unit: ''
    }));

    return {
      id: item.id.toString(),
      title: item.name,
      image: item.image,
      prepTime: item.prepTimeMinutes || 0,
      calories: calories,
      protein: protein,
      carbs: carbs,
      fat: fat,
      dietaryTags: item.tags.map((t: string) => t.toLowerCase()),
      ingredients: mappedIngredients,
      instructions: item.instructions // We will add this to the Recipe type!
    } as any; 
  } catch (err) {
    console.error(err);
    return null;
  }
};
