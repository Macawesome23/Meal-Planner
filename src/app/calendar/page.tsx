'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFromCalendar } from '@/store/slices/plannerSlice';
import Link from 'next/link';
import { CalendarDays, X, ChevronRight } from 'lucide-react';

export default function CalendarPage() {
  const calendar = useAppSelector(state => state.planner.calendar);
  const dispatch = useAppDispatch();
  const days = Object.keys(calendar) as Array<keyof typeof calendar>;

  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-24">
      {/* Hero Banner */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/40 to-[#FDFBF7]" />
        
        <div className="relative z-10 text-center px-6 mt-10 flex flex-col items-center">
          <CalendarDays className="w-12 h-12 text-orange-400 mb-4 drop-shadow-md" />
          <h1 className="text-4xl md:text-6xl font-black font-serif text-white mb-4 drop-shadow-lg">
            Weekly Meal Plan
          </h1>
          <p className="text-xl text-gray-200 font-medium drop-shadow-md">
            Organize your week to stay on track.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        <div className="space-y-6">
          {days.map(day => (
            <div key={day} className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 flex-shrink-0">
                <h2 className="text-2xl font-black text-gray-900">{day}</h2>
                <p className="text-gray-400 font-medium text-sm mt-1">{calendar[day].length} meals planned</p>
              </div>
              
              <div className="flex-grow">
                {calendar[day].length === 0 ? (
                  <div className="h-full min-h-[100px] border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-6 bg-gray-50">
                    <p className="text-gray-400 font-medium text-center">No meals planned for {day}.<br/><Link href="/saved" className="text-orange-500 hover:underline">Add from Saved</Link></p>
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {calendar[day].map(recipe => (
                      <div key={recipe.id} className="relative flex-shrink-0 w-64 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-lg transition-all">
                        <Link href={`/recipe/${recipe.id}`} className="block">
                          <div className="h-32 overflow-hidden relative">
                            <img src={recipe.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                            <h3 className="absolute bottom-3 left-3 right-3 text-white font-bold leading-tight line-clamp-2 drop-shadow-md">
                              {recipe.title}
                            </h3>
                          </div>
                        </Link>
                        <button 
                          onClick={() => dispatch(removeFromCalendar({ day, recipeId: recipe.id }))}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 transition-colors shadow-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
