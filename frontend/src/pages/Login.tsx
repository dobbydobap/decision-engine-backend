import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Brain, Trophy, CheckCircle2, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* ─── Left: Form ─── */}
      <div className="flex items-center justify-center px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[380px]"
        >
          <Link to="/" className="inline-flex items-center gap-2.5 no-underline mb-14">
            <div className="w-9 h-9 rounded-xl bg-forest flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold text-forest tracking-tight">DecisionIQ</span>
          </Link>

          <h1 className="text-[30px] font-bold text-forest leading-tight mb-2">Welcome back!</h1>
          <p className="text-surface-500 text-sm mb-10 leading-relaxed">
            Simplify your decisions and boost your productivity with{' '}
            <span className="font-semibold text-surface-700">DecisionIQ</span>.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[13px] font-medium text-surface-600 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com" required className="input input-icon" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[13px] font-medium text-surface-600">Password</label>
                <a href="#" className="text-[12px] text-teal font-medium no-underline hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required className="input input-icon" />
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
              className="btn-primary w-full py-3.5 text-[14px] mt-1">
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : 'Login'}
            </motion.button>
          </form>

          <p className="text-center text-surface-400 text-[13px] mt-10">
            Not a member?{' '}
            <Link to="/register" className="text-teal font-semibold no-underline hover:underline">Register now</Link>
          </p>
        </motion.div>
      </div>

      {/* ─── Right: Illustration ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="hidden lg:flex bg-mint-bg items-center justify-center p-10 relative overflow-hidden"
      >
        <div className="absolute top-[-80px] right-[-80px] w-[240px] h-[240px] rounded-full bg-mint/10" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[180px] h-[180px] rounded-full bg-teal/5" />

        <div className="relative z-10 w-full max-w-[300px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.45 }}
            className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-border/50 mb-8"
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-mint-bg flex items-center justify-center">
                <BarChart3 size={14} className="text-teal" />
              </div>
              <span className="text-[13px] font-bold text-forest">Decision Results</span>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Option A', pct: 84 },
                { name: 'Option B', pct: 67 },
                { name: 'Option C', pct: 52 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[13px] mb-1.5">
                    <span className="text-surface-500 font-medium">{item.name}</span>
                    <span className="font-bold text-forest">{item.pct}%</span>
                  </div>
                  <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ delay: 0.6 + i * 0.2, duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-mint to-teal"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-teal" />
              <span className="text-[11px] font-semibold text-teal">Winner determined</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.35 }}
            className="absolute -top-3 -right-4 bg-white rounded-xl px-3.5 py-2.5 shadow-md border border-border/40 flex items-center gap-1.5"
          >
            <Trophy size={13} className="text-teal" />
            <span className="text-[11px] font-bold text-forest">84%</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-[15px] font-bold text-forest leading-snug"
          >
            Make your decisions easier<br />with <span className="text-teal">DecisionIQ</span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
