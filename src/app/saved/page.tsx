'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleSavedRecipe } from '@/store/slices/plannerSlice';
import Link from 'next/link';
import { Flame, Clock, BookmarkX, Bookmark } from 'lucide-react';

export default function SavedPage() {
  const savedRecipes = useAppSelector(state => state.planner.savedRecipes);
  const dispatch = useAppDispatch();

  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2076&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-[#FDFBF7]" />
        
        <div className="relative z-10 text-center px-6 mt-10">
          <h1 className="text-4xl md:text-6xl font-black font-serif text-white mb-4 drop-shadow-lg">
            Saved Masterpieces
          </h1>
          <p className="text-xl text-gray-200 font-medium drop-shadow-md">
            You have {savedRecipes.length} bookmarked {savedRecipes.length === 1 ? 'recipe' : 'recipes'}.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {savedRecipes.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-gray-800 mb-2">No saved recipes yet.</h2>
            <p className="text-gray-500 mb-6">Head over to the Explore page to find some culinary inspiration.</p>
            <Link href="/explore" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-orange-500/30 transition-transform hover:scale-105 active:scale-95 inline-block">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {savedRecipes.map(recipe => (
              <div key={recipe.id} className="relative group block bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                <Link href={`/recipe/${recipe.id}`}>
                  <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                    <img 
                      src={recipe.image} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-black font-serif text-xl leading-tight mb-2">
                        {recipe.title}
                      </h3>
                      <div className="flex items-center text-xs font-bold text-gray-200 space-x-3">
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1 text-orange-400" /> {recipe.prepTime}m</span>
                        <span className="flex items-center"><Flame className="w-3 h-3 mr-1 text-red-400" /> {recipe.calories}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                {/* Remove from Saved Button */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(toggleSavedRecipe(recipe));
                  }}
                  className="absolute top-4 right-4 p-3 bg-white/95 backdrop-blur-md rounded-full shadow-xl text-orange-500 hover:text-red-500 hover:scale-110 transition-all z-20"
                >
                  <BookmarkX className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
