import React, { useState } from "react";
import ResumeForm from "./components/ResumeForm";
import AnalysisDashboard from "./components/AnalysisDashboard";
import HistoryDrawer from "./components/HistoryDrawer";
import { analyzeResume } from "./services/api";
import { Sparkles, History } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleFormSubmit = async ({ resumeInput, jobDescription }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeResume(resumeInput, jobDescription);
      if (response.success) {
        setAnalysisResult(response.data);
      } else {
        setError(response.message || "Analysis failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to analyze resume"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold shadow-sm transition-colors ml-auto cursor-pointer"
          >
            <History className="w-4 h-4 text-indigo-600" />
            Past Runs
          </button>
        </div>

        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-4 h-4" /> Powered by Local Ollama Models
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            AI Smart Resume & Task Optimizer
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Compare your resume against job openings and generate instant
            preparation tasks locally.
          </p>
        </header>

        {/* Form Input */}
        <ResumeForm onSubmit={handleFormSubmit} isLoading={loading} />

        {/* Error Notification */}
        {error && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Dashboard Output */}
        <AnalysisDashboard
          data={analysisResult}
          onTaskUpdate={(updatedData) => setAnalysisResult(updatedData)}
        />

        {/* History Drawer Modal */}
        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectRun={async (id) => {
            try {
              const res = await fetch(`${API_BASE_URL}/resume/tasks`);
              const data = await res.json();
              if (data.success) setAnalysisResult(data.data);
            } catch (err) {
              console.error("Failed to load historical run:", err);
            }
          }}
        />

      </div>
    </div>
  );
}