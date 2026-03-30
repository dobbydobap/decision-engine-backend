import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, ArrowLeft, Zap, Layers, Target, X,
  Pencil, Check, Sliders, Trophy, ChevronDown, ChevronUp,
} from 'lucide-react';
import { decisionsApi, optionsApi, criteriaApi, scoresApi } from '../lib/api';
import toast from 'react-hot-toast';

interface Score { id: string; value: number; optionId: string; criterionId: string; }
interface Option { id: string; name: string; scores: Score[]; }
interface Criterion { id: string; name: string; weight: number; }
interface Decision { id: string; title: string; options: Option[]; criteria: Criterion[]; }

function getHeatClass(value: number): string {
  return `heat-${value}`;
}

export default function DecisionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);

  const [newOption, setNewOption] = useState('');
  const [newCriterion, setNewCriterion] = useState('');
  const [newWeight, setNewWeight] = useState(3);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');

  const fetchDecision = useCallback(async () => {
    if (!id) return;
    try {
      const res = await decisionsApi.getOne(id);
      setDecision(res.data.data);
    } catch {
      toast.error('Decision not found');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchDecision(); }, [fetchDecision]);

  const addOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.trim() || !id) return;
    try {
      await optionsApi.create(id, newOption.trim());
      setNewOption('');
      fetchDecision();
      toast.success('Option added');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const deleteOption = async (optionId: string) => {
    if (!id) return;
    try { await optionsApi.delete(id, optionId); fetchDecision(); toast.success('Removed'); }
    catch { toast.error('Failed'); }
  };

  const addCriterion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriterion.trim() || !id) return;
    try {
      await criteriaApi.create(id, newCriterion.trim(), newWeight);
      setNewCriterion('');
      setNewWeight(3);
      fetchDecision();
      toast.success('Criterion added');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed');
    }
  };

  const deleteCriterion = async (criterionId: string) => {
    if (!id) return;
    try { await criteriaApi.delete(id, criterionId); fetchDecision(); toast.success('Removed'); }
    catch { toast.error('Failed'); }
  };

  const handleScore = async (optionId: string, criterionId: string, value: number) => {
    if (!id || !decision) return;
    const option = decision.options.find((o) => o.id === optionId);
    const existing = option?.scores.find((s) => s.criterionId === criterionId);
    try {
      if (existing) await scoresApi.update(id, existing.id, value);
      else await scoresApi.create(id, optionId, criterionId, value);
      fetchDecision();
    } catch { toast.error('Failed to set score'); }
  };

  const handleEvaluate = async () => {
    if (!id) return;
    setEvaluating(true);
    try {
      const res = await decisionsApi.evaluate(id);
      setResults(res.data.data);
      setShowResults(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  const handleUpdateTitle = async () => {
    if (!id || !titleDraft.trim()) return;
    try {
      await decisionsApi.update(id, titleDraft.trim());
      setEditingTitle(false);
      fetchDecision();
    } catch { toast.error('Failed to update'); }
  };

  const getScore = (optionId: string, criterionId: string): number | null => {
    const option = decision?.options.find((o) => o.id === optionId);
    const score = option?.scores.find((s) => s.criterionId === criterionId);
    return score ? score.value : null;
  };

  if (loading || !decision) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const canEvaluate = decision.options.length >= 2 && decision.criteria.length >= 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl bg-surface-50 hover:bg-surface-100 text-surface-500 border-none cursor-pointer transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <input
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                autoFocus
                className="text-2xl font-bold text-forest bg-transparent border-b-2 border-teal outline-none flex-1 pb-0.5"
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
              />
              <button onClick={handleUpdateTitle} className="p-1.5 text-teal bg-transparent border-none cursor-pointer"><Check size={18} /></button>
              <button onClick={() => setEditingTitle(false)} className="p-1.5 text-surface-400 bg-transparent border-none cursor-pointer"><X size={18} /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-forest">{decision.title}</h1>
              <button
                onClick={() => { setEditingTitle(true); setTitleDraft(decision.title); }}
                className="p-1.5 text-surface-300 hover:text-surface-600 bg-transparent border-none cursor-pointer"
              >
                <Pencil size={14} />
              </button>
            </div>
          )}
          <p className="text-surface-400 text-sm mt-0.5">
            {decision.options.length} options &middot; {decision.criteria.length} criteria
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Options */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={16} className="text-teal" />
            <h2 className="font-semibold text-forest text-sm">Options</h2>
          </div>

          <form onSubmit={addOption} className="flex gap-2 mb-4">
            <input
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              placeholder="e.g., Tesla Model 3"
              className="input text-sm py-2.5 flex-1"
            />
            <button type="submit" className="p-2 bg-teal text-white rounded-lg border-none cursor-pointer hover:bg-teal-light transition-colors">
              <Plus size={16} />
            </button>
          </form>

          <div className="space-y-1.5">
            <AnimatePresence mode="popLayout">
              {decision.options.map((option) => (
                <motion.div
                  key={option.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface-50 group"
                >
                  <span className="text-surface-800 text-sm font-medium">{option.name}</span>
                  <button
                    onClick={() => deleteOption(option.id)}
                    className="p-1 text-surface-300 hover:text-red-500 bg-transparent border-none cursor-pointer
                               opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {decision.options.length === 0 && (
              <p className="text-surface-300 text-sm text-center py-4">Add at least 2 options to compare</p>
            )}
          </div>
        </div>

        {/* Criteria */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={16} className="text-teal" />
            <h2 className="font-semibold text-forest text-sm">Criteria</h2>
          </div>

          <form onSubmit={addCriterion} className="space-y-3 mb-4">
            <div className="flex gap-2">
              <input
                value={newCriterion}
                onChange={(e) => setNewCriterion(e.target.value)}
                placeholder="e.g., Safety Rating"
                className="flex-1 px-3 py-2 rounded-lg text-forest placeholder-surface-300 outline-none
                           border border-surface-200 focus:border-teal text-sm bg-white"
              />
              <button type="submit" className="p-2 bg-teal text-white rounded-lg border-none cursor-pointer hover:bg-teal-light transition-colors">
                <Plus size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Sliders size={13} className="text-surface-400" />
              <span className="text-surface-500 text-xs min-w-[70px]">Weight: {newWeight}/5</span>
              <input
                type="range" min="1" max="5" value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                className="flex-1 accent-teal h-1.5"
              />
            </div>
          </form>

          <div className="space-y-1.5">
            <AnimatePresence mode="popLayout">
              {decision.criteria.map((criterion) => (
                <motion.div
                  key={criterion.id}
                  layout
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface-50 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-surface-800 text-sm font-medium">{criterion.name}</span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-mint-bg text-forest font-medium">
                      w:{criterion.weight}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteCriterion(criterion.id)}
                    className="p-1 text-surface-300 hover:text-red-500 bg-transparent border-none cursor-pointer
                               opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {decision.criteria.length === 0 && (
              <p className="text-surface-300 text-sm text-center py-4">Add criteria to evaluate options against</p>
            )}
          </div>
        </div>
      </div>

      {/* Heatmap Score Matrix */}
      {decision.options.length > 0 && decision.criteria.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5 overflow-x-auto"
        >
          <h2 className="font-semibold text-forest text-sm mb-4 flex items-center gap-2">
            <Sliders size={16} className="text-teal" />
            Score Heatmap
            <span className="text-xs text-surface-400 font-normal ml-2">Click cells to score (1-10)</span>
          </h2>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-surface-500 text-xs font-semibold pb-3 pr-4 uppercase tracking-wide">Option</th>
                {decision.criteria.map((c) => (
                  <th key={c.id} className="text-center text-xs font-semibold pb-3 px-2 text-surface-500 uppercase tracking-wide">
                    <div>{c.name}</div>
                    <div className="text-[10px] text-surface-300 font-normal mt-0.5 normal-case">weight: {c.weight}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decision.options.map((option) => (
                <tr key={option.id} className="border-t border-surface-50">
                  <td className="text-surface-800 text-sm font-medium py-3 pr-4">{option.name}</td>
                  {decision.criteria.map((criterion) => {
                    const score = getScore(option.id, criterion.id);
                    return (
                      <td key={criterion.id} className="text-center py-3 px-2">
                        <ScoreCell
                          value={score}
                          onChange={(v) => handleScore(option.id, criterion.id, v)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Evaluate */}
      <div className="flex flex-col items-center">
        <motion.button
          onClick={handleEvaluate}
          disabled={!canEvaluate || evaluating}
          whileHover={canEvaluate ? { scale: 1.03 } : undefined}
          whileTap={canEvaluate ? { scale: 0.97 } : undefined}
          className="px-10 py-4 bg-teal hover:bg-teal-light text-white font-bold text-base rounded-2xl
                     border-none cursor-pointer flex items-center gap-3 shadow-lg shadow-teal/10 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {evaluating ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Zap size={20} />
              Evaluate Decision
            </>
          )}
        </motion.button>
        {!canEvaluate && (
          <p className="text-surface-400 text-xs mt-3">Need at least 2 options and 1 criterion</p>
        )}
      </div>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && results && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowResults(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto border border-surface-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-forest">Evaluation Results</h2>
                <button
                  onClick={() => setShowResults(false)}
                  className="p-1.5 text-surface-400 hover:text-surface-600 bg-transparent border-none cursor-pointer rounded-lg hover:bg-surface-50"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Winner */}
              {results.winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="mb-6 p-5 rounded-2xl bg-mint-bg border border-border text-center"
                >
                  <Trophy size={28} className="text-teal mx-auto mb-2" />
                  <div className="text-xs font-semibold text-teal uppercase tracking-wide mb-1">Winner</div>
                  <div className="text-2xl font-bold text-forest mb-1">{results.winner.name}</div>
                  <div className="text-3xl font-black text-teal">{results.winner.totalScore.toFixed(1)} pts</div>
                </motion.div>
              )}

              {/* Rankings */}
              <div className="space-y-3">
                {results.rankings.map((r: any, i: number) => {
                  const maxScore = results.rankings[0]?.totalScore || 1;
                  const pct = maxScore > 0 ? (r.totalScore / maxScore) * 100 : 0;

                  return (
                    <RankingItem key={r.id} rank={i + 1} name={r.name} score={r.totalScore}
                      percentage={pct} isWinner={i === 0} breakdown={r.breakdown} delay={i * 0.1} />
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RankingItem({ rank, name, score, percentage, isWinner, breakdown, delay }: {
  rank: number; name: string; score: number; percentage: number;
  isWinner: boolean; breakdown: any[]; delay: number;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + delay }}
      className="rounded-xl border border-surface-100 overflow-hidden"
    >
      <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-surface-50 transition-colors" onClick={() => setExpanded(!expanded)}>
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
          ${isWinner ? 'bg-mint-bg text-forest' : 'bg-surface-100 text-surface-500'}`}>
          #{rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-surface-800 font-medium text-sm">{name}</span>
            <span className={`font-bold text-sm ${isWinner ? 'text-teal' : 'text-surface-600'}`}>{score.toFixed(1)}</span>
          </div>
          <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ delay: 0.4 + delay, duration: 0.6 }}
              className={`h-full rounded-full ${isWinner ? 'bg-gradient-to-r from-mint to-teal' : 'bg-surface-300'}`}
            />
          </div>
        </div>
        <div className="text-surface-300">{expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-1 border-t border-surface-50">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {breakdown.map((b: any, j: number) => (
                  <div key={j} className="bg-surface-50 rounded-lg p-2.5 text-xs">
                    <div className="text-surface-400 mb-1">{b.criterionName}</div>
                    <div className="text-surface-700 font-medium">
                      {b.originalValue} &times; {b.weightApplied} = <span className="text-teal font-bold">{b.calculatedPoints.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ScoreCell({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value?.toString() || '');

  const handleSubmit = () => {
    const num = parseInt(tempValue);
    if (num >= 1 && num <= 10) onChange(num);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        type="number" min="1" max="10"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        autoFocus
        className="w-14 h-10 text-center text-sm text-forest bg-white border-2 border-teal rounded-lg outline-none font-semibold"
      />
    );
  }

  return (
    <button
      onClick={() => { setTempValue(value?.toString() || ''); setEditing(true); }}
      className={`w-14 h-10 rounded-lg border text-sm font-semibold cursor-pointer transition-all
        ${value
          ? `${getHeatClass(value)} border-transparent`
          : 'bg-surface-50 border-surface-200 text-surface-300 hover:border-teal hover:text-surface-500'
        }`}
    >
      {value || '—'}
    </button>
  );
}
