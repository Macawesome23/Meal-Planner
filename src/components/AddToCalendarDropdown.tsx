'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addToCalendar } from '@/store/slices/plannerSlice';
import { Recipe } from '@/types';
import { CalendarPlus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AddToCalendarDropdown({ recipe }: { recipe: Recipe }) {
  const [isOpen, setIsOpen] = useState(false);
  const [addedDay, setAddedDay] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

  const handleAdd = (day: typeof days[number]) => {
    dispatch(addToCalendar({ day, recipe }));
    setAddedDay(day);
    toast.success(`Added to ${day}!`);
    setTimeout(() => {
      setAddedDay(null);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-bold transition-all active:scale-95 shadow-sm ml-4"
      >
        <CalendarPlus className="w-5 h-5 mr-2" /> Add to Plan
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden z-50 py-2"
          >
            {days.map(day => (
              <button
                key={day}
                onClick={() => handleAdd(day)}
                className="w-full text-left px-4 py-2 hover:bg-orange-50 font-medium text-gray-700 flex justify-between items-center transition-colors"
              >
                {day}
                {addedDay === day && <Check className="w-4 h-4 text-green-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
