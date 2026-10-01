import { getRecipeById } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Clock, Flame, ChevronLeft, CheckCircle2, ChefHat } from 'lucide-react';
import SaveRecipeButton from '@/components/SaveRecipeButton';
import AddToCalendarDropdown from '@/components/AddToCalendarDropdown';

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = await getRecipeById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-4 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center text-gray-500 hover:text-orange-500 font-bold transition-colors bg-white px-4 py-2 rounded-full shadow-sm">
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Planner
        </Link>
        <div className="flex items-center">
          <SaveRecipeButton recipe={recipe} />
          <AddToCalendarDropdown recipe={recipe} />
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[50vh] min-h-[400px] relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-transparent to-transparent z-10" />
        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 relative z-20 -mt-32">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-14 border border-gray-100">
          
          <div className="flex flex-wrap gap-2 mb-6">
            {recipe.dietaryTags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-black uppercase tracking-wider rounded-lg">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-6 leading-tight">
            {recipe.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-12 py-6 border-y border-gray-100">
            <div className="flex items-center text-gray-600 font-medium">
              <Clock className="w-6 h-6 mr-2 text-orange-400" />
              <span className="text-lg">{recipe.prepTime} min prep</span>
            </div>
            <div className="flex items-center text-gray-600 font-medium">
              <Flame className="w-6 h-6 mr-2 text-red-400" />
              <span className="text-lg">{recipe.calories} calories</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-bold text-gray-400 uppercase tracking-wider ml-auto border-l border-gray-200 pl-6">
              <span>Protein: <span className="text-gray-900">{recipe.protein}g</span></span>
              <span>Carbs: <span className="text-gray-900">{recipe.carbs}g</span></span>
              <span>Fat: <span className="text-gray-900">{recipe.fat}g</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Ingredients */}
            <div className="md:col-span-5">
              <h2 className="text-2xl font-black font-serif text-gray-900 mb-6 flex items-center">
                <CheckCircle2 className="w-6 h-6 mr-2 text-orange-500" />
                Ingredients
              </h2>
              <ul className="space-y-4">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center p-4 bg-gray-50 rounded-2xl font-medium text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-orange-400 mr-4" />
                    {ing.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="md:col-span-7">
              <h2 className="text-2xl font-black font-serif text-gray-900 mb-6 flex items-center">
                <ChefHat className="w-6 h-6 mr-2 text-orange-500" />
                Instructions
              </h2>
              <div className="space-y-8">
                {recipe.instructions ? recipe.instructions.map((step, i) => (
                  <div key={i} className="flex">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black text-lg mr-6">
                      {i + 1}
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed pt-1">
                      {step}
                    </p>
                  </div>
                )) : (
                  <p className="text-gray-500 italic">No instructions provided for this recipe.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
