'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, Compass, Bookmark, CalendarDays, ChefHat, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, setLoading } from '@/store/slices/authSlice';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function Header() {
  const { user, isLoading } = useAppSelector(state => state.auth);
  const plannerState = useAppSelector(state => state.planner);
  const dispatch = useAppDispatch();

  // Firebase Auth Listener
  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        dispatch(setUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Chef (Phone)',
          email: firebaseUser.email || firebaseUser.phoneNumber || '',
          image: firebaseUser.photoURL || undefined
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  // Sync state to Redis when planner state changes and user is logged in
  useEffect(() => {
    if (user?.id) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      fetch(`${apiUrl}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...plannerState })
      }).catch(err => console.error('Failed to sync to microservice:', err));
    }
  }, [plannerState, user]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-orange-100 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:rotate-12 transition-transform">
            <ChefHat className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tight font-serif hidden sm:block">
            Culina<span className="text-orange-500">.</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="flex items-center text-gray-600 hover:text-orange-500 font-bold transition-colors">
            <Home className="w-5 h-5 mr-2" />
            <span>My Fridge</span>
          </Link>
          <Link href="/explore" className="flex items-center text-gray-600 hover:text-orange-500 font-bold transition-colors">
            <Compass className="w-5 h-5 mr-2" />
            <span>Explore</span>
          </Link>
          <Link href="/saved" className="flex items-center text-gray-600 hover:text-orange-500 font-bold transition-colors">
            <Bookmark className="w-5 h-5 mr-2" />
            <span>Saved</span>
          </Link>
          <Link href="/calendar" className="flex items-center text-gray-600 hover:text-orange-500 font-bold transition-colors">
            <CalendarDays className="w-5 h-5 mr-2" />
            <span>Calendar</span>
          </Link>
        </div>
        
        {/* Auth CTA */}
        <div className="flex items-center">
          {!isLoading && user ? (
            <div className="flex items-center space-x-4">
              {user.image && (
                <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border border-orange-200" />
              )}
              <span className="text-sm font-bold text-gray-700 hidden sm:block">
                {user.name.split(' ')[0]}
              </span>
              <button 
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-red-500 font-bold transition-colors p-2"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : !isLoading && !user ? (
            <Link 
              href="/login"
              className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full font-bold transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <div className="w-20 h-8 bg-gray-100 animate-pulse rounded-full"></div>
          )}
        </div>
      </div>
    </nav>
  );
}
