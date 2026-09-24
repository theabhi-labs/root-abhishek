import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiUser, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../config/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login(username, password);
      if (res.success && res.token) {
        localStorage.setItem('root_admin_token', res.token);
        localStorage.setItem('root_admin_user', JSON.stringify(res.user));
        navigate('/admin');
      } else {
        setError(res.message || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('Login request failed:', err);
      setError('Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Cyber Accents */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#FF6700]/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#101524]/90 border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-[#FF6700]/10 border border-[#FF6700]/30 text-[#FF6700] text-[10px] font-mono font-bold uppercase tracking-widest">
            Restricted Admin Area
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            <span className="text-[#FF6700]">root</span>@abhishek<span className="text-[#FF6700] animate-pulse">_</span>
          </h1>
          <p className="text-gray-400 text-xs font-mono mt-2 uppercase tracking-wider">
            Enter credentials to access Control Center
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
              Admin Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FiUser size={16} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] focus:ring-1 focus:ring-[#FF6700] outline-none text-sm font-mono transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider block mb-2 font-bold">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                <FiLock size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-[#080b12] border border-white/10 text-white focus:border-[#FF6700] focus:ring-1 focus:ring-[#FF6700] outline-none text-sm font-mono transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#FF6700] text-black font-black uppercase text-xs tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(255,103,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Authenticating..." : (
                <>
                  Access Admin Suite <FiArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <a
            href="/"
            className="text-xs font-mono text-gray-500 hover:text-[#FF6700] transition-colors uppercase tracking-wider"
          >
            &larr; Return to Public Portfolio
          </a>
        </div>
      </motion.div>
    </div>
  );
}
