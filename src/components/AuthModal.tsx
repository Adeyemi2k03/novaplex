import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, defaultMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, register, error, clearError } = useAuth();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => { clearError(); }, [mode, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onClose();
    } catch {
      // error shown via context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-[#00a8e1]/30 to-[#0077b6]/10 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <div className="w-8 h-8 rounded bg-[#00a8e1] flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-white font-bold text-xl" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                NOVA<span className="text-[#00a8e1]">PLEX</span>
              </span>
            </div>
            <p className="text-[#8197a4] text-sm">
              {mode === 'login' ? 'Welcome back!' : 'Create your account'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              mode === 'login' ? 'text-[#00a8e1] border-b-2 border-[#00a8e1]' : 'text-[#8197a4] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              mode === 'signup' ? 'text-[#00a8e1] border-b-2 border-[#00a8e1]' : 'text-[#8197a4] hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {mode === 'signup' && (
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8197a4]" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-white/8 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-[#8197a4] outline-none focus:border-[#00a8e1] transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8197a4]" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-white/8 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white text-sm placeholder-[#8197a4] outline-none focus:border-[#00a8e1] transition-colors"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8197a4]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-white/8 border border-white/10 rounded-lg pl-10 pr-10 py-3 text-white text-sm placeholder-[#8197a4] outline-none focus:border-[#00a8e1] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8197a4] hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {mode === 'signup' && (
            <p className="text-[#8197a4] text-xs">Password must be at least 8 characters</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full nova-btn-primary justify-center py-3 rounded-xl mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </>
            )}
          </button>

          <p className="text-center text-[#8197a4] text-xs">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[#00a8e1] hover:underline cursor-pointer"
            >
              {mode === 'login' ? 'Sign up free' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
