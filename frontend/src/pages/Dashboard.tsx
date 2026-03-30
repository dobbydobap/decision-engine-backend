import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, ChevronRight, Layers, Target, Trash2, X,
  Brain, Clock, TrendingUp, Search, Sparkles, BarChart, Trophy,
} from 'lucide-react';
import { decisionsApi } from '../lib/api';
import toast from 'react-hot-toast';

interface Decision {
  id: string;
  title: string;
  createdAt: string;
  options: any[];
  criteria: any[];
}

export default function Dashboard() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchDecisions = async () => {
    try {
      const res = await decisionsApi.getAll(1, 50);
      setDecisions(res.data.data);
    } catch {
      toast.error('Failed to load decisions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecisions();
    if (searchParams.get('new') === 'true') setShowModal(true);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await decisionsApi.create(newTitle.trim());
      setShowModal(false);
      setNewTitle('');
      toast.success('Decision created!');
      navigate(`/decisions/${res.data.data.id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this decision and all its data?')) return;
    try {
      await decisionsApi.delete(id);
      setDecisions((prev) => prev.filter((d) => d.id !== id));
      toast.success('Deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const totalOptions = decisions.reduce((sum, d) => sum + d.options.length, 0);
  const totalCriteria = decisions.reduce((sum, d) => sum + d.criteria.length, 0);
  const latestDecision = decisions.length > 0 ? decisions[0] : null;

  const filtered = decisions.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-forest">Dashboard</h1>
        <p className="text-surface-400 text-sm mt-1">Overview of your decisions</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-3 gap-5">
        <StatCard
          label="Total Decisions"
          value={String(decisions.length)}
          sub={decisions.length > 0 ? `+${Math.min(decisions.length, 3)} this week` : undefined}
          icon={<Brain size={72} />}
          trend={decisions.length > 0}
        />
        <StatCard
          label="Options Evaluated"
          value={String(totalOptions)}
          sub={`${totalCriteria} criteria`}
          icon={<Layers size={72} />}
        />
        <StatCard
          label="Recent Activity"
          value={latestDecision ? `"${latestDecision.title}"` : 'No activity'}
          sub={latestDecision
            ? (latestDecision.criteria.length === 0 ? 'Pending criteria'
              : latestDecision.options.length < 2 ? 'Needs more options'
              : 'Ready to evaluate')
            : undefined}
          icon={<Clock size={72} />}
          isText
        />
      </div>

      {/* ── Main Content Card ── */}
      <div className="card">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-forest whitespace-nowrap">My Decisions</h2>
          <div className="flex items-center gap-3">
            <div className="relative w-56">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search decisions..."
                className="input input-icon py-2 text-xs"
              />
            </div>
            <button onClick={() => setShowModal(true)} className="btn-teal text-xs py-2 px-4 whitespace-nowrap">
              <Plus size={14} /> New Decision
            </button>
          </div>
        </div>

        {/* Content */}
        {filtered.length === 0 && decisions.length === 0 ? (
          <EmptyDashboard onNew={() => setShowModal(true)} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-surface-400 text-sm">
            No decisions match "{searchQuery}"
          </div>
        ) : (
          <div className="divide-y divide-surface-100/60">
            {filtered.map((decision, i) => (
              <motion.div
                key={decision.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  to={`/decisions/${decision.id}`}
                  className="flex items-center px-6 py-4 hover:bg-mint-bg/40 transition-colors no-underline group"
                >
                  <div className="w-10 h-10 rounded-xl bg-mint-bg flex items-center justify-center mr-4 shrink-0">
                    <Brain size={17} className="text-forest" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-forest text-sm truncate">{decision.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-surface-400 flex items-center gap-1">
                        <Layers size={11} /> {decision.options.length} options
                      </span>
                      <span className="text-xs text-surface-400 flex items-center gap-1">
                        <Target size={11} /> {decision.criteria.length} criteria
                      </span>
                      <span className="text-xs text-surface-300">
                        {new Date(decision.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(decision.id, e)}
                    className="p-2 rounded-lg bg-transparent border-none cursor-pointer text-surface-200
                               hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 mr-2"
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={16} className="text-surface-300 group-hover:text-teal transition-colors shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ── Create Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7 border border-border"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-forest">New Decision</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 text-surface-400 hover:text-surface-600 bg-transparent border-none cursor-pointer rounded-lg hover:bg-surface-50">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreate}>
                <input
                  type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="What are you deciding? e.g., Which car to buy?"
                  autoFocus className="input mb-4"
                />
                <button type="submit" disabled={creating || !newTitle.trim()}
                  className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                  {creating
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><Plus size={16} /> Create Decision</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────── Stat Card Component ──────── */
function StatCard({ label, value, sub, icon, trend, isText }: {
  label: string; value: string; sub?: string;
  icon: React.ReactNode; trend?: boolean; isText?: boolean;
}) {
  return (
    <div className="card p-6 relative overflow-hidden">
      <div className="absolute -bottom-3 -right-3 text-forest/[0.04]">{icon}</div>
      <p className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider mb-2">{label}</p>
      {isText ? (
        <p className="text-sm font-semibold text-forest truncate">{value}</p>
      ) : (
        <p className="text-3xl font-bold text-forest leading-none">{value}</p>
      )}
      {sub && (
        <p className={`text-xs mt-1.5 flex items-center gap-1 ${trend ? 'text-teal font-medium' : 'text-surface-400'}`}>
          {trend && <TrendingUp size={12} />}
          {sub}
        </p>
      )}
    </div>
  );
}

/* ──────── Empty State with Demo Content ──────── */
function EmptyDashboard({ onNew }: { onNew: () => void }) {
  const demoRows = [
    { name: 'Tesla Model 3', scores: [6, 9, 10, 8], total: 38.5 },
    { name: 'Toyota Camry', scores: [9, 7, 8, 7], total: 33.2 },
    { name: 'Honda Civic', scores: [8, 7, 7, 6], total: 29.8 },
  ];
  const demoCriteria = ['Price', 'Safety', 'Fuel Eco.', 'Comfort'];

  return (
    <div className="p-6 space-y-8">
      {/* CTA */}
      <div className="text-center pt-2">
        <div className="w-14 h-14 rounded-2xl bg-mint-bg flex items-center justify-center mx-auto mb-3">
          <Sparkles size={24} className="text-teal" />
        </div>
        <h3 className="text-base font-bold text-forest mb-1">No pending decisions!</h3>
        <p className="text-surface-400 text-sm">Create your first decision to get started.</p>
      </div>

      {/* Demo Heatmap + Results side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Heatmap — takes 2 cols */}
        <div className="lg:col-span-2 rounded-xl border border-border p-5 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold text-forest uppercase tracking-wider flex items-center gap-2">
              <BarChart size={14} className="text-teal" />
              Example Score Heatmap
            </h4>
            <span className="text-[10px] text-surface-300 bg-surface-50 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
              Demo
            </span>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-[11px] font-semibold text-surface-400 pb-3 pr-3 uppercase tracking-wider w-[130px]">
                  Option
                </th>
                {demoCriteria.map((c) => (
                  <th key={c} className="text-center text-[11px] font-semibold text-surface-400 pb-3 px-1 uppercase tracking-wider">
                    {c}
                  </th>
                ))}
                <th className="text-center text-[11px] font-semibold text-surface-400 pb-3 pl-3 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {demoRows.map((row, ri) => (
                <tr key={ri} className={ri > 0 ? 'border-t border-surface-100' : ''}>
                  <td className="py-3 pr-3 text-sm font-medium text-surface-700 truncate max-w-[130px]">
                    {ri === 0 && <Trophy size={12} className="text-teal inline mr-1.5 -mt-0.5" />}
                    {row.name}
                  </td>
                  {row.scores.map((s, si) => (
                    <td key={si} className="py-3 px-1 text-center">
                      <span className={`inline-flex items-center justify-center w-10 h-8 rounded-lg text-xs font-bold heat-${s}`}>
                        {s}
                      </span>
                    </td>
                  ))}
                  <td className="py-3 pl-3 text-center">
                    <span className="text-sm font-bold text-forest">{row.total}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Results Preview Card */}
        <div className="rounded-xl border border-border p-5 bg-white flex flex-col">
          <h4 className="text-xs font-semibold text-forest uppercase tracking-wider mb-4 flex items-center gap-2">
            <Trophy size={14} className="text-teal" />
            Demo Results
          </h4>

          <div className="space-y-3 flex-1">
            {demoRows.map((row, i) => {
              const pct = (row.total / demoRows[0].total) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-surface-600 truncate mr-2">{row.name}</span>
                    <span className="font-bold text-forest shrink-0">{row.total}</span>
                  </div>
                  <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${i === 0 ? 'bg-gradient-to-r from-mint to-teal' : 'bg-surface-200'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-surface-100 text-xs text-teal font-semibold flex items-center gap-1.5">
            <Sparkles size={12} />
            Winner: Tesla Model 3
          </div>
        </div>
      </div>

      {/* Quick Start Steps */}
      <div>
        <h4 className="text-xs font-semibold text-forest uppercase tracking-wider mb-4">
          How to get started
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Create a decision', desc: 'Name what you\'re deciding — "Which car?" or "Rent vs Buy?"' },
            { step: '2', title: 'Add options & criteria', desc: 'List choices and weighted factors like cost, safety, comfort.' },
            { step: '3', title: 'Score & evaluate', desc: 'Rate each option 1-10, hit Evaluate, and see the winner.' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl bg-mint-bg/50 p-5 border border-border/30">
              <div className="w-7 h-7 rounded-lg bg-teal text-white flex items-center justify-center text-xs font-bold mb-3">
                {s.step}
              </div>
              <h4 className="text-sm font-semibold text-forest mb-1">{s.title}</h4>
              <p className="text-xs text-surface-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
