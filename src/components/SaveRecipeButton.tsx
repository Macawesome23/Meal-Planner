'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSavedRecipe } from '@/store/slices/plannerSlice';
import { Recipe } from '@/types';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SaveRecipeButton({ recipe }: { recipe: Recipe }) {
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector(state => state.planner.savedRecipes.some(r => r.id === recipe.id));

  const handleToggle = () => {
    dispatch(toggleSavedRecipe(recipe));
    if (isSaved) {
      toast.success('Removed from favorites');
    } else {
      toast.success('Added to favorites!');
    }
  };

  return (
    <button 
      onClick={handleToggle}
      className={`flex items-center px-6 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 ${
        isSaved 
          ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
          : 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/30'
      }`}
    >
      {isSaved ? (
        <><BookmarkCheck className="w-5 h-5 mr-2" /> Saved</>
      ) : (
        <><Bookmark className="w-5 h-5 mr-2" /> Save to Favorites</>
      )}
    </button>
  );
}
