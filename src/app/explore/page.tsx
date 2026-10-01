import { fetchRecipes } from '@/lib/api';
import Link from 'next/link';
import { Flame, Clock } from 'lucide-react';

export default async function ExplorePage() {
  // Pass empty array to fetch all recipes
  const allRecipes = await fetchRecipes([]);

  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-24">
      
      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-[#FDFBF7]" />
        
        <div className="relative z-10 text-center px-6 mt-10">
          <h1 className="text-4xl md:text-6xl font-black font-serif text-white mb-4 drop-shadow-lg">
            Explore Recipes
          </h1>
          <p className="text-xl text-gray-200 font-medium drop-shadow-md">
            Discover {allRecipes.length} curated culinary masterpieces.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allRecipes.map(recipe => (
            <Link 
              key={recipe.id}
              href={`/recipe/${recipe.id}`}
              className="group block bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
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
          ))}
        </div>
      </div>
    </main>
  );
}
