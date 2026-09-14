import React, { useState, useEffect } from "react";
import ResumeForm from "./components/ResumeForm";
import AnalysisDashboard from "./components/AnalysisDashboard";
import HistoryDrawer from "./components/HistoryDrawer";
import AuthModal from "./components/AuthModal";
import { analyzeResume, logoutUser } from "./services/api";
import { Sparkles, History, LogIn, LogOut, User } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Check saved session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setAnalysisResult(null);
  };

  const handleFormSubmit = async ({ resumeInput, jobDescription }) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

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
        
        {/* Top Navigation Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-white border px-3 py-1.5 rounded-lg shadow-sm">
                <User className="w-4 h-4 text-indigo-600" />
                <span>{user.name}</span>
                <button onClick={handleLogout} className="ml-2 text-rose-500 hover:text-rose-700">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In / Register
              </button>
            )}
          </div>

          <button
            onClick={() => {
              if (!user) setIsAuthOpen(true);
              else setIsHistoryOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
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
            Compare your resume against job openings and generate instant preparation tasks locally.
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
              const res = await fetch(`${API_BASE_URL}/resume/tasks`, {
                headers: { Authorization: `Bearer ${user?.token}` }
              });
              const data = await res.json();
              if (data.success) setAnalysisResult(data.data);
            } catch (err) {
              console.error("Failed to load historical run:", err);
            }
          }}
        />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(userData) => setUser(userData)}
        />

      </div>
    </div>
  );
}