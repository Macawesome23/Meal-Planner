'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { ChefHat, Loader2, Phone, Mail } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Setup reCAPTCHA for phone auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      }
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUser({
        id: userCredential.user.uid,
        name: userCredential.user.displayName || 'Chef',
        email: userCredential.user.email || '',
        image: userCredential.user.photoURL || undefined
      }));
      toast.success('Welcome back to your kitchen!');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!window.recaptchaVerifier) throw new Error("reCAPTCHA not initialized");
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      toast.success('Magic code sent!');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      if (window.recaptchaVerifier) window.recaptchaVerifier.clear();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    
    setLoading(true);
    setError('');

    try {
      const userCredential = await confirmationResult.confirm(otp);
      dispatch(setUser({
        id: userCredential.user.uid,
        name: 'Chef (Phone)',
        email: userCredential.user.phoneNumber || '',
      }));
      toast.success('Logged in successfully!');
      router.push('/');
    } catch (err: any) {
      setError('Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      dispatch(setUser({
        id: userCredential.user.uid,
        name: userCredential.user.displayName || 'Chef',
        email: userCredential.user.email || '',
        image: userCredential.user.photoURL || undefined
      }));
      toast.success('Signed in with Google!');
      router.push('/');
    } catch (err: any) {
      setError('Google Sign-In failed');
    }
  };

  return (
    <main className="min-h-screen flex bg-[#FDFBF7]">
      {/* Left side: Beautiful Background Image */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900">
        {/* We use standard img to avoid next/config issues if Unsplash is missing, though we added it before */}
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80" 
          alt="Appetizing meal prep" 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent"></div>
        <div className="absolute bottom-20 left-16 right-16">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-white text-sm font-bold tracking-wide">Over 10,000 recipes available</span>
          </div>
          <h2 className="text-5xl font-serif font-black text-white mb-6 leading-tight">
            Master your kitchen.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
              Plan every meal.
            </span>
          </h2>
          <p className="text-gray-300 text-xl font-medium leading-relaxed max-w-lg">
            Join thousands of food connoisseurs discovering new flavors and organizing their weekly culinary adventures.
          </p>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 pt-28 pb-12 overflow-y-auto">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2rem] shadow-2xl shadow-orange-900/5 border border-orange-50/50">
          <div id="recaptcha-container"></div>
          
          <div className="flex justify-start mb-8">
            <div className="w-14 h-14 bg-gradient-to-tr from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
              <ChefHat className="text-white w-7 h-7" />
            </div>
          </div>
          <h1 className="text-3xl font-black font-serif text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-8 font-medium">Log in to your Culina kitchen.</p>

          {/* Toggle Auth Method */}
          {!confirmationResult && (
            <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1 mb-8 shadow-inner">
              <button 
                onClick={() => setMethod('email')}
                className={`flex-1 py-2.5 font-bold rounded-lg transition-all ${method === 'email' ? 'bg-white shadow-md text-gray-900 scale-100' : 'text-gray-400 hover:text-gray-600 scale-95'}`}
              >
                <Mail className="w-4 h-4 inline mr-2" /> Email
              </button>
              <button 
                onClick={() => setMethod('phone')}
                className={`flex-1 py-2.5 font-bold rounded-lg transition-all ${method === 'phone' ? 'bg-white shadow-md text-gray-900 scale-100' : 'text-gray-400 hover:text-gray-600 scale-95'}`}
              >
                <Phone className="w-4 h-4 inline mr-2" /> Phone
              </button>
            </div>
          )}

          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-xl mb-6 font-medium text-sm">{error}</div>}

          {/* Email Login Form */}
          {method === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-5">
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
                className="w-full bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-70 flex justify-center items-center group mt-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  <>Sign In <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span></>
                )}
              </button>
            </form>
          )}

          {/* Phone Login Form */}
          {method === 'phone' && (
            !confirmationResult ? (
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-lg"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-70 flex justify-center items-center mt-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Magic Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 text-center">Enter 6-Digit Code</label>
                  <p className="text-center text-xs text-gray-500 mb-4">Sent securely to {phone}</p>
                  <input 
                    type="text" 
                    required
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:border-orange-500 focus:bg-white text-center text-3xl tracking-[0.5em] transition-all font-black text-gray-900"
                    placeholder="000000"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-70 flex justify-center items-center shadow-lg shadow-orange-500/25 mt-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Enter'}
                </button>
              </form>
            )
          )}

          {!confirmationResult && (
            <div className="mt-8">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-wider text-xs">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-3.5 border-2 border-gray-100 rounded-xl bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98]"
              >
                <img className="h-5 w-5 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
                Sign in with Google
              </button>
              
              {method === 'email' && (
                <p className="text-center mt-8 text-gray-500 font-medium text-sm">
                  New to Culina? <Link href="/register" className="text-orange-500 font-bold hover:text-orange-600 transition-colors">Create an account</Link>
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// Add global declaration for reCAPTCHA
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
