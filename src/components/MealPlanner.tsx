'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/useDebounce';
import { fetchRecipes, fetchIngredientSuggestions } from '@/lib/api';
import { Recipe, FilterState } from '@/types';
import { 
  Search, Loader2, X, Plus, Filter, ShoppingCart, 
  Clock, Flame, ChefHat, CheckCircle2, ChevronRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MealPlanner() {
  const [myIngredients, setMyIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    dietary: [],
    maxPrepTime: null,
    maxCalories: null,
    minProtein: null
  });

  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);

  const debouncedInput = useDebounce(ingredientInput, 300);

  useEffect(() => {
    if (debouncedInput) {
      fetchIngredientSuggestions(debouncedInput).then(setSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedInput]);

  useEffect(() => {
    const getRecipes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRecipes(myIngredients);
        setRecipes(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch recipes.');
      } finally {
        setLoading(false);
      }
    };
    getRecipes();
  }, [myIngredients]);

  const addIngredient = (ingredient: string) => {
    if (ingredient && !myIngredients.includes(ingredient)) {
      setMyIngredients([...myIngredients, ingredient]);
      toast.success(`${ingredient} added to fridge!`);
    } else if (myIngredients.includes(ingredient)) {
      toast.error(`${ingredient} is already in your fridge`);
    }
    setIngredientInput('');
    setSuggestions([]);
  };

  const removeIngredient = (ingredient: string) => {
    setMyIngredients(myIngredients.filter(i => i !== ingredient));
  };

  const toggleDietaryFilter = (tag: string) => {
    setFilters(prev => {
      const current = prev.dietary;
      return current.includes(tag)
        ? { ...prev, dietary: current.filter(t => t !== tag) }
        : { ...prev, dietary: [...current, tag] };
    });
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      if (filters.maxPrepTime && recipe.prepTime > filters.maxPrepTime) return false;
      if (filters.maxCalories && recipe.calories > filters.maxCalories) return false;
      if (filters.dietary.length > 0) {
        const hasAllTags = filters.dietary.every(tag => recipe.dietaryTags.includes(tag));
        if (!hasAllTags) return false;
      }
      return true;
    });
  }, [recipes, filters]);

  const toggleRecipeSelection = (recipe: Recipe) => {
    if (selectedRecipes.find(r => r.id === recipe.id)) {
      setSelectedRecipes(selectedRecipes.filter(r => r.id !== recipe.id));
    } else {
      setSelectedRecipes([...selectedRecipes, recipe]);
    }
  };

  const missingIngredients = useMemo(() => {
    return Array.from(new Set(
      selectedRecipes.flatMap(r => r.ingredients.map(i => i.name))
    )).filter(ingredient => !myIngredients.some(myI => myI.toLowerCase() === ingredient.toLowerCase()));
  }, [selectedRecipes, myIngredients]);

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/40 to-[#FDFBF7]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center px-4 max-w-3xl w-full"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-6 leading-tight drop-shadow-lg">
            What's in your fridge?
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 font-medium drop-shadow-md">
            Type your ingredients, and we'll craft the perfect meal for you.
          </p>

          <div className="relative max-w-2xl mx-auto w-full group">
            <div className="absolute inset-0 bg-orange-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full overflow-hidden p-2 transition-all">
              <Search className="w-6 h-6 ml-4 text-orange-500" />
              <input
                type="text"
                aria-label="Search ingredients"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIngredient(ingredientInput)}
                placeholder="e.g. Chicken, Tomato, Garlic..."
                className="w-full bg-transparent p-4 outline-none text-lg text-gray-800 placeholder-gray-400 font-medium"
              />
              <button 
                onClick={() => addIngredient(ingredientInput)}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Add
              </button>
            </div>
            
            {/* Autocomplete Suggestions */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-20 w-full mt-4 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl max-h-60 overflow-y-auto overflow-hidden p-2"
                >
                  {suggestions.map(sugg => (
                    <motion.li 
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 237, 213, 0.5)' }}
                      key={sugg} 
                      onClick={() => addIngredient(sugg)}
                      className="px-6 py-3 rounded-xl cursor-pointer text-gray-800 font-medium flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-3 text-orange-400" /> {sugg}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        
        {/* Left Sidebar */}
        <div className="lg:col-span-3 space-y-10">
          
          {/* Selected Ingredients */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Your Pantry</h3>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {myIngredients.map(ing => (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    key={ing} 
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white border border-orange-100 shadow-sm text-gray-800"
                  >
                    {ing}
                    <button aria-label={`Remove ${ing}`} onClick={() => removeIngredient(ing)} className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              {myIngredients.length === 0 && (
                <p className="text-sm text-gray-400 italic">No ingredients added.</p>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-orange-500" />
              Refine Search
            </h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Dietary Needs</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'vegan', label: 'Vegan', activeClass: 'bg-green-500 text-white border-green-500 shadow-green-500/30' },
                    { id: 'vegetarian', label: 'Vegetarian', activeClass: 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/30' },
                    { id: 'gluten-free', label: 'Gluten Free', activeClass: 'bg-amber-500 text-white border-amber-500 shadow-amber-500/30' },
                    { id: 'dairy-free', label: 'Dairy Free', activeClass: 'bg-blue-500 text-white border-blue-500 shadow-blue-500/30' }
                  ].map(tag => {
                    const isActive = filters.dietary.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleDietaryFilter(tag.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border-2 ${
                          isActive 
                            ? tag.activeClass 
                            : 'bg-white text-gray-600 border-gray-100 hover:border-orange-200 hover:bg-orange-50'
                        }`}
                      >
                        {tag.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Prep Time</label>
                  <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">
                    {filters.maxPrepTime || 'Any'} mins
                  </span>
                </div>
                <input 
                  type="range"
                  aria-label="Filter by maximum preparation time"
                  min="5" max="60" step="5" 
                  value={filters.maxPrepTime || 60} 
                  onChange={e => setFilters({...filters, maxPrepTime: parseInt(e.target.value)})}
                  className="w-full accent-orange-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-700">Calories</label>
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                    {filters.maxCalories || 'Any'} kcal
                  </span>
                </div>
                <input 
                  type="range"
                  aria-label="Filter by maximum calories"
                  min="200" max="1500" step="100" 
                  value={filters.maxCalories || 1500} 
                  onChange={e => setFilters({...filters, maxCalories: parseInt(e.target.value)})}
                  className="w-full accent-red-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-9 relative">
          
          <div className="sticky top-24 z-30 flex justify-between items-end mb-8 bg-[#FDFBF7]/90 backdrop-blur-md py-4">
            <div>
              <h2 className="text-3xl font-black font-serif text-gray-900">
                {myIngredients.length > 0 ? 'Curated for You' : 'Popular Masterpieces'}
              </h2>
              <p className="text-gray-500 font-medium mt-1">
                {filteredRecipes.length} delectable {filteredRecipes.length === 1 ? 'recipe' : 'recipes'} found
              </p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShoppingListOpen(true)}
              className="flex items-center px-6 py-3 bg-gray-900 text-white rounded-full shadow-xl shadow-gray-900/20 font-bold"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Grocery List
              {missingIngredients.length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  {missingIngredients.length}
                </span>
              )}
            </motion.button>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
              <p className="text-gray-500 font-medium animate-pulse">Consulting the head chef...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex items-center">
              <X className="w-6 h-6 mr-3" /> {error}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <ChefHat className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No recipes found</h3>
              <p className="text-gray-500">Try adjusting your filters or adding different ingredients.</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVars}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {filteredRecipes.map(recipe => {
                const isSelected = selectedRecipes.some(r => r.id === recipe.id);
                return (
                  <motion.div 
                    variants={itemVars}
                    key={recipe.id} 
                    className="group bg-white rounded-[2rem] shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 flex flex-col"
                  >
                    <Link href={`/recipe/${recipe.id}`} className="block h-64 overflow-hidden relative cursor-pointer group-hover:opacity-90">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent z-10" />
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full relative"
                      >
                        <Image 
                          src={recipe.image} 
                          alt={`Image of ${recipe.title}`} 
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </motion.div>
                      
                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-xs font-black uppercase tracking-wider rounded-full text-orange-600 shadow-xl">
                          {recipe.prepTime} min
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <h3 className="font-black text-white text-2xl leading-tight mb-2 font-serif drop-shadow-md">
                          {recipe.title}
                        </h3>
                        <div className="flex items-center text-sm font-medium text-gray-200 space-x-4">
                          <span className="flex items-center"><Flame className="w-4 h-4 mr-1 text-orange-400" /> {recipe.calories} kcal</span>
                          <span className="flex items-center">P: {recipe.protein}g</span>
                        </div>
                      </div>
                    </Link>

                    <div className="p-6 flex-grow flex flex-col bg-white">
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {recipe.dietaryTags.slice(0,3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <button 
                          onClick={() => toggleRecipeSelection(recipe)}
                          className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all duration-300 flex justify-center items-center ${
                            isSelected
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                              : 'bg-gray-50 text-gray-900 hover:bg-orange-500 hover:text-white hover:shadow-xl hover:shadow-orange-500/30'
                          }`}
                        >
                          {isSelected ? (
                            <><CheckCircle2 className="w-5 h-5 mr-2" /> Added to Plan</>
                          ) : (
                            <><Plus className="w-5 h-5 mr-2" /> Add to Meal Plan</>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

        </div>
      </div>

      {/* Shopping List Modal */}
      <AnimatePresence>
        {shoppingListOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShoppingListOpen(false)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-black font-serif text-gray-900">Grocery List</h2>
                    <p className="text-gray-500 mt-1 font-medium">For your {selectedRecipes.length} selected meals</p>
                  </div>
                  <button 
                    aria-label="Close grocery list"
                    onClick={() => setShoppingListOpen(false)}
                    className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                
                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedRecipes.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                      <p className="text-lg text-gray-500 font-medium">No meals selected yet.</p>
                    </div>
                  ) : missingIngredients.length === 0 ? (
                    <div className="text-center py-12 bg-green-50 rounded-3xl border border-green-100">
                      <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                      <h3 className="text-xl font-bold text-green-800 mb-2">You're all set!</h3>
                      <p className="text-green-600 font-medium">You have all the ingredients in your pantry.</p>
                    </div>
                  ) : (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {missingIngredients.map(ing => (
                        <li key={ing} className="flex items-center text-lg font-medium text-gray-800 bg-gray-50 hover:bg-orange-50 p-4 rounded-2xl border border-gray-100 transition-colors">
                          <input 
                            type="checkbox" 
                            className="mr-4 w-6 h-6 text-orange-500 bg-white border-gray-300 rounded-xl focus:ring-orange-500 cursor-pointer accent-orange-500" 
                          />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              {missingIngredients.length > 0 && (
                <div className="bg-gray-50 p-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => {
                      const list = missingIngredients.map(i => `- [ ] ${i}`).join('\n');
                      navigator.clipboard.writeText(`My Grocery List:\n${list}`);
                      alert('Grocery list copied to clipboard!');
                    }}
                    className="flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-95"
                  >
                    Copy to Clipboard <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
