import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { Button } from '../common/Button';
import { Lock, ShieldCheck, Key, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export const AdminLoginCard: React.FC = () => {
  const { adminLogin } = useAuth();
  const { isPremium } = useStore();

  const [email, setEmail] = useState('admin@stylezone.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await adminLogin(email, password);
      if (!res.success) {
        setError(res.error || 'Invalid administrator credentials. Please retry.');
      }
    } catch {
      setError('An unexpected error occurred during administrative login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@stylezone.com');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div
        className={`p-8 rounded-3xl border shadow-2xl space-y-6 ${
          isPremium
            ? 'bg-[#15151F] border-[#D4AF37]/40 shadow-black'
            : 'bg-white border-zinc-200 shadow-xl'
        }`}
      >
        <div className="text-center space-y-2">
          <div
            className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center shadow-md ${
              isPremium
                ? 'bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-zinc-950'
                : 'bg-zinc-900 text-white'
            }`}
          >
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500 font-mono">
            RESTRICTED ACCESS
          </span>
          <h2
            className={`text-2xl font-black tracking-tight ${
              isPremium ? 'font-luxury text-white' : 'text-zinc-900'
            }`}
          >
            Operations Console Login
          </h2>
          <p className="text-xs text-zinc-400">
            Sign in with administrator credentials to manage inventory, catalog, and sales analysis.
          </p>
        </div>

        {/* Demo Credentials Quick Fill Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Operations Credentials</span>
            </span>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="text-[11px] font-extrabold underline text-amber-600 dark:text-amber-400 hover:opacity-80 cursor-pointer"
            >
              Auto-fill
            </button>
          </div>
          <div className="font-mono text-[11px] text-zinc-600 dark:text-zinc-300 space-y-0.5">
            <div>Email: <span className="font-bold text-zinc-900 dark:text-zinc-100">admin@stylezone.com</span></div>
            <div>Password: <span className="font-bold text-zinc-900 dark:text-zinc-100">admin123</span></div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            variant={isPremium ? 'luxury' : 'primary'}
            isLoading={isLoading}
            className="w-full font-bold cursor-pointer shadow-md"
          >
            <span>Sign In to Console</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-center">
          <span className="text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secured 256-Bit Role-Based Authentication</span>
          </span>
        </div>
      </div>
    </div>
  );
};
