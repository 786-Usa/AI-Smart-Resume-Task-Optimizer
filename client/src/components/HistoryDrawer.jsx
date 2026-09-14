import React, { useEffect, useState } from 'react';
import { History, X, Calendar, ArrowRight } from 'lucide-react';
import { fetchHistory } from '../services/api';

export default function HistoryDrawer({ isOpen, onClose, onSelectRun }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchHistory()
        .then((res) => {
          if (res.success) setHistory(res.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl flex flex-col space-y-4">
        
        <div className="flex justify-between items-center border-b pb-4">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
            <History className="w-5 h-5" />
            <h2>Analysis History</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3">
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-6">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No previous analysis runs found.</p>
          ) : (
            history.map((item) => (
              <div
                key={item._id}
                onClick={() => { onSelectRun(item._id); onClose(); }}
                className="p-4 border rounded-xl hover:border-indigo-400 cursor-pointer transition-all bg-gray-50 hover:bg-indigo-50/50 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                    {item.missingSkills.length} Skill Gaps Found
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-lg font-extrabold text-indigo-600">{item.matchScore}%</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}