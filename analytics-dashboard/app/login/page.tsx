'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState(
    process.env.NEXT_PUBLIC_FAKE_EMAIL || 'admin@company.com'
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-400 text-sm">Log in to Your Dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    disabled={loading}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-12 pr-12 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <p className="text-center text-slate-400 text-xs mb-3">Demo Access</p>
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3">
                <p className="text-slate-400 text-xs">
                  <span className="font-semibold text-slate-300">Email:</span>{' '}
                  <span className="text-slate-300 font-mono">
                    {process.env.NEXT_PUBLIC_FAKE_EMAIL}
                  </span>
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  <span className="font-semibold text-slate-300">Pass:</span>{' '}
                  <span className="text-slate-300 font-mono">
                    {process.env.NEXT_PUBLIC_FAKE_PASSWORD}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-400 text-sm mt-6">
          Don`t have an account?{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
