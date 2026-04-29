'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid username or password.',
        confirmButtonColor: '#1a1a54',
        customClass: { popup: 'rounded-[2rem]' }
      });
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full -mr-64 -mt-64 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full -ml-64 -mb-64 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl overflow-hidden"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-secondary rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-secondary/20">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-primary mb-2 tracking-tight">Admin Login</h1>
          <p className="text-gray-400 font-bold">Secure access to NS Reunion 2022</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                required 
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="password" 
                required 
                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/10 outline-none font-bold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-opacity-95 transition-all shadow-xl shadow-primary/20 mt-8 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="w-5 h-5 text-secondary" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-gray-50 text-center">
          <p className="text-xs font-bold text-gray-400 italic">Unauthorized access is strictly prohibited.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
