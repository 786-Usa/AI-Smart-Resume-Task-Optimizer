import React, { useState } from 'react';
import { FileText, Loader2, X, Download, Copy, Check } from 'lucide-react';
import { generateCvTemplate } from '../services/api';

export default function CvTemplateModal({ isOpen, onClose, resumeText, missingSkills, improvements }) {
  const [templateData, setTemplateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateCvTemplate(resumeText, missingSkills, improvements);
      if (res.success) setTemplateData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyMarkdown = () => {
    if (!templateData) return;
    const md = `# ${templateData.personalInfo.name || 'CV'}
${templateData.personalInfo.email} | ${templateData.personalInfo.location}

## Professional Summary
${templateData.summary}

## Technical Skills
- **Skills:** ${templateData.skills.technical.join(', ')}
- **Frameworks:** ${templateData.skills.frameworks.join(', ')}

## Work Experience
${templateData.experience.map(exp => `### ${exp.role} - ${exp.company} (${exp.duration})\n` + exp.bullets.map(b => `- ${b}`).join('\n')).join('\n\n')}
    `;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg">
            <FileText className="w-5 h-5" />
            <h2>AI ATS Resume Template Generator</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!templateData && !loading && (
            <div className="text-center py-12 space-y-4">
              <FileText className="w-12 h-12 text-indigo-500 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">Generate Tailored CV Structure</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Transform your resume into a clean, modern template pre-populated with achievement bullets addressing your identified skill gaps.
              </p>
              <button
                onClick={handleGenerate}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md"
              >
                Generate Optimized CV Template
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-16 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto" />
              <p className="text-sm text-gray-600 font-medium">Formulating ATS-optimized CV structure via Ollama...</p>
            </div>
          )}

          {templateData && (
            <div className="space-y-6 border p-6 rounded-xl bg-gray-50/50 font-sans text-gray-800">
              {/* CV Preview */}
              <div className="border-b pb-4 text-center">
                <h1 className="text-2xl font-extrabold text-gray-900">{templateData.personalInfo.name || 'Your Name'}</h1>
                <p className="text-xs text-gray-600 mt-1">
                  {templateData.personalInfo.email} | {templateData.personalInfo.location}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Professional Summary</h4>
                <p className="text-xs text-gray-700 leading-relaxed">{templateData.summary}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {templateData.skills?.technical?.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Tailored Work Experience</h4>
                {templateData.experience?.map((exp, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="flex justify-between text-xs font-bold text-gray-800">
                      <span>{exp.role} - {exp.company}</span>
                      <span className="text-gray-500 font-normal">{exp.duration}</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-1">
                      {exp.bullets?.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {templateData && (
          <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
            <button
              onClick={copyMarkdown}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
              {copied ? 'Copied Markdown!' : 'Copy Markdown'}
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Print / Save as PDF
            </button>
          </div>
        )}

      </div>
    </div>
  );
}