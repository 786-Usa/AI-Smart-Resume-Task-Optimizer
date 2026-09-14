import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Target, Sparkles, FileText } from 'lucide-react';
import { toggleTaskStatus } from '../services/api';
import BulletRewriterModal from './BulletRewriterModal';
import CvTemplateModal from './CvTemplateModal';

export default function AnalysisDashboard({ data, onTaskUpdate }) {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [isRewriterOpen, setIsRewriterOpen] = useState(false);
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);

  if (!data) return null;

  const { _id, matchScore, missingSkills = [], improvements = [], actionTasks = [], resumeText = '' } = data;

  const handleToggle = async (taskId) => {
    try {
      const updated = await toggleTaskStatus(_id, taskId);
      if (updated.success && onTaskUpdate) {
        onTaskUpdate(updated.data);
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setIsRewriterOpen(true);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 border-emerald-500 bg-emerald-50';
    if (score >= 60) return 'text-amber-600 border-amber-500 bg-amber-50';
    return 'text-rose-600 border-rose-500 bg-rose-50';
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Banner: Generate Tailored CV */}
      <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-300" />
            Ready to apply with a target-tailored resume?
          </h3>
          <p className="text-xs text-indigo-200 mt-1">
            Generate an ATS-ready CV template incorporating your missing skill badges instantly.
          </p>
        </div>
        <button
          onClick={() => setIsCvModalOpen(true)}
          className="px-4 py-2.5 bg-white text-indigo-900 font-bold text-xs rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer shadow-sm whitespace-nowrap"
        >
          Generate Tailored CV Template
        </button>
      </div>

      {/* Score Header */}
      <div className={`p-6 rounded-xl border-2 flex items-center justify-between ${getScoreColor(matchScore)}`}>
        <div>
          <h3 className="text-xl font-bold">ATS Match Score</h3>
          <p className="text-sm opacity-80">Evaluated locally via Ollama</p>
        </div>
        <div className="text-4xl font-extrabold">{matchScore}%</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Missing Skills */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-amber-600 font-semibold">
            <AlertTriangle className="w-5 h-5" />
            <h3>Identified Skill Gaps</h3>
          </div>
          <p className="text-xs text-gray-500 mb-3">Click any skill to rewrite your resume bullets with AI:</p>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <button
                key={index}
                onClick={() => handleSkillClick(skill)}
                className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-medium rounded-full cursor-pointer transition-colors flex items-center gap-1.5 border border-amber-300"
              >
                <span>{skill}</span>
                <Sparkles className="w-3 h-3 text-amber-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Improvements */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold">
            <Target className="w-5 h-5" />
            <h3>Resume Improvements</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            {improvements.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Preparation Tasks */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center gap-2 mb-4 text-emerald-600 font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          <h3>Interactive Preparation Tasks</h3>
        </div>
        <div className="space-y-3">
          {actionTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => handleToggle(task._id)}
              className={`p-3 border rounded-lg text-sm flex items-center gap-3 cursor-pointer transition-colors ${
                task.completed ? 'bg-emerald-50 border-emerald-200 text-emerald-800 line-through' : 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                readOnly
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <span>{task.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Bullet Rewriter Modal */}
      <BulletRewriterModal
        isOpen={isRewriterOpen}
        onClose={() => setIsRewriterOpen(false)}
        defaultSkill={selectedSkill}
      />

      {/* CV Template Generator Modal */}
      <CvTemplateModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
        resumeText={resumeText}
        missingSkills={missingSkills}
        improvements={improvements}
      />
    </div>
  );
}