import React, { useState } from 'react';
import { Send, Loader2, Upload, FileText } from 'lucide-react';

export default function ResumeForm({ onSubmit, isLoading }) {
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'text'
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const resumeInput = uploadMode === 'file' ? resumeFile : resumeText;
    if (!resumeInput || !jobDescription.trim()) return;
    onSubmit({ resumeInput, jobDescription });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Resume Input Column */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-gray-700">Resume Input</label>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-2 py-1 rounded ${uploadMode === 'file' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                PDF Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('text')}
                className={`px-2 py-1 rounded ${uploadMode === 'text' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Paste Text
              </button>
            </div>
          </div>

          {uploadMode === 'file' ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-60 bg-gray-50 hover:bg-gray-100 transition-colors">
              <Upload className="w-8 h-8 text-indigo-500 mb-2" />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-800">
                {resumeFile ? resumeFile.name : 'Click to select PDF resume'}
              </label>
              <p className="text-xs text-gray-500 mt-1">PDF up to 5MB</p>
            </div>
          ) : (
            <textarea
              rows="9"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm text-gray-800"
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
          )}
        </div>

        {/* Job Description Column */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Target Job Description</label>
          <textarea
            rows="9"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-sm text-gray-800"
            placeholder="Paste target job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
        </div>

      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
      >
        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
        Analyze & Match
      </button>
    </form>
  );
}