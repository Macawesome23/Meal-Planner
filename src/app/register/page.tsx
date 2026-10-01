'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { ChefHat, Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name
      });

      dispatch(setUser({
        id: userCredential.user.uid,
        name: name,
        email: userCredential.user.email || '',
      }));
      
      toast.success('Account created successfully! Welcome!');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-[#FDFBF7]">
      {/* Left side: Beautiful Background Image */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1495195129352-aeb325a55b65?auto=format&fit=crop&q=80" 
          alt="Fresh ingredients" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
        <div className="absolute bottom-20 left-16 right-16">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
            <span className="text-white text-sm font-bold tracking-wide">Syncs seamlessly to all devices</span>
          </div>
          <h2 className="text-5xl font-serif font-black text-white mb-6 leading-tight">
            Your personal sous-chef.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Ready when you are.
            </span>
          </h2>
          <p className="text-gray-300 text-xl font-medium leading-relaxed max-w-lg">
            Create your account today to save your favorite recipes, organize your weekly prep, and master the art of cooking.
          </p>
        </div>
      </div>

      {/* Right side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 pt-28 pb-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-orange-900/5 border border-orange-50/50">
          <div className="flex justify-start mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <ChefHat className="text-white w-7 h-7" />
            </div>
          </div>
          <h1 className="text-3xl font-black font-serif text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8 font-medium">Start planning your master meals today.</p>

          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl mb-6 font-medium text-sm">{error}</div>}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                placeholder="Gordon Ramsay"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                placeholder="chef@culina.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-70 flex justify-center items-center shadow-lg shadow-orange-500/25 mt-4 group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>Sign Up <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 font-medium text-sm">
            Already have an account? <Link href="/login" className="text-gray-900 font-bold hover:underline transition-colors">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
