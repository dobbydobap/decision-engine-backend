import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Brain, Sparkles, Target, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(email, password);
      await login(email, password);
      toast.success('Welcome to DecisionIQ!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* ─── Left: Illustration ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="hidden lg:flex bg-mint-bg items-center justify-center p-10 relative overflow-hidden"
      >
        <div className="absolute top-[-50px] left-[-50px] w-[180px] h-[180px] rounded-full bg-mint/10" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[220px] h-[220px] rounded-full bg-teal/5" />

        <div className="relative z-10 w-full max-w-[300px] space-y-4">
          {[
            { icon: <Sparkles size={18} />, title: 'Weighted Evaluation', desc: 'Math-driven rankings for every choice' },
            { icon: <Target size={18} />, title: 'Custom Criteria', desc: 'Define exactly what matters to you' },
            { icon: <Layers size={18} />, title: 'Compare Options', desc: 'Side-by-side analysis with heatmaps' },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.12 }}
              className="bg-white rounded-xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-border/50 flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-lg bg-mint-bg flex items-center justify-center text-teal shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-[13px] font-bold text-forest">{item.title}</p>
                <p className="text-[11px] text-surface-400 mt-0.5">{item.desc}</p>
              </div>
            </motion.div>
          ))}

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="text-center text-[15px] font-bold text-forest leading-snug pt-6"
          >
            Start making smarter choices<br />with <span className="text-teal">DecisionIQ</span>
          </motion.p>
        </div>
      </motion.div>

      {/* ─── Right: Form ─── */}
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

          <h1 className="text-[30px] font-bold text-forest leading-tight mb-2">Create Account</h1>
          <p className="text-surface-500 text-sm mb-10 leading-relaxed">
            Get started for free. No credit card required.
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
              <label className="text-[13px] font-medium text-surface-600 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" required className="input input-icon" />
              </div>
            </div>
            <div>
              <label className="text-[13px] font-medium text-surface-600 mb-1.5 block">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-300" />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password" required className="input input-icon" />
              </div>
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: 1.005 }} whileTap={{ scale: 0.995 }}
              className="btn-primary w-full py-3.5 text-[14px] mt-1">
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>Create Account <ArrowRight size={15} /></>}
            </motion.button>
          </form>

          <p className="text-center text-surface-400 text-[13px] mt-10">
            Already have an account?{' '}
            <Link to="/login" className="text-teal font-semibold no-underline hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
