import React, { useState } from 'react';
import { Sparkles, Loader2, X, Copy, Check } from 'lucide-react';
import { rewriteBulletPoint } from '../services/api';

export default function BulletRewriterModal({ isOpen, onClose, defaultSkill }) {
  const [currentBullet, setCurrentBullet] = useState('');
  const [missingSkill, setMissingSkill] = useState(defaultSkill || '');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!currentBullet || !missingSkill) return;
    setLoading(true);
    try {
      const res = await rewriteBulletPoint(currentBullet, missingSkill);
      if (res.success) setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl relative space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
          <Sparkles className="w-5 h-5" />
          <h3>AI Bullet Point Optimizer</h3>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Target Skill to Add</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              value={missingSkill}
              onChange={(e) => setMissingSkill(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Existing Weak Bullet Point</label>
            <textarea
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
              placeholder="e.g. Developed backend APIs using Node.js for our core web app."
              value={currentBullet}
              onChange={(e) => setCurrentBullet(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Rewrite with AI'}
          </button>
        </form>

        {suggestions.length > 0 && (
          <div className="space-y-2 mt-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase">ATS Optimized Alternatives:</h4>
            {suggestions.map((text, idx) => (
              <div key={idx} className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-950 flex justify-between items-start gap-2">
                <span>{text}</span>
                <button
                  onClick={() => copyToClipboard(text, idx)}
                  className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}