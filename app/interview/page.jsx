"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';

export default function InterviewPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState('');
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Array of boolean to track which answer is visible
  const [visibleAnswers, setVisibleAnswers] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/interview');
        const result = await res.json();
        if (res.ok) {
          setReports(result.data);
          if (result.data.length > 0) {
            setSelectedReportId(result.data[0]._id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch reports");
      }
    };
    fetchReports();
  }, []);

  const handleGenerate = async () => {
    if (!selectedReportId) return;
    
    setLoading(true);
    setError('');
    setQuestions([]);
    setVisibleAnswers({});

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: selectedReportId })
      });
      const result = await res.json();
      
      if (res.ok) {
        setQuestions(result.data);
      } else {
        setError(result.message || "Failed to generate questions.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (index) => {
    setVisibleAnswers(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Control Panel - Hidden during print */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md print:hidden">
              <h2 className="text-2xl font-bold text-white mb-4">AI Interview Preparation</h2>
              <p className="text-gray-400 mb-4">Select a previously analyzed resume to generate custom interview questions based on your specific experience.</p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <select 
                  value={selectedReportId} 
                  onChange={(e) => setSelectedReportId(e.target.value)}
                  className="bg-gray-900 border border-gray-700 text-white p-3 rounded-lg flex-1 focus:outline-none focus:border-blue-500"
                >
                  {reports.length === 0 ? (
                    <option value="">No resumes found. Please upload one first.</option>
                  ) : (
                    reports.map(r => (
                      <option key={r._id} value={r._id}>
                        {r.resumeId?.fileName} - {new Date(r.createdAt).toLocaleDateString()}
                      </option>
                    ))
                  )}
                </select>
                
                <button 
                  onClick={handleGenerate}
                  disabled={loading || !selectedReportId}
                  className={`px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                    loading || !selectedReportId ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  {loading && (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Generating...' : 'Generate Questions'}
                </button>
              </div>

              {error && <p className="text-red-400 mt-4">{error}</p>}
            </div>

            {/* Questions List */}
            {questions.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md print:bg-transparent print:border-none print:shadow-none print:p-0">
                <div className="flex justify-between items-center mb-6 print:hidden">
                  <h3 className="text-xl font-bold text-white">Your Custom Interview Questions</h3>
                  <button 
                    onClick={handlePrint}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center gap-2 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    Print Questions
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((q, idx) => (
                    <div key={idx} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden print:bg-transparent print:border-gray-300 print:mb-6">
                      
                      <div className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 print:p-2">
                        <div className="flex gap-3 items-start">
                          <span className="flex-shrink-0 bg-blue-900/50 text-blue-400 w-8 h-8 rounded-full flex items-center justify-center font-bold print:text-black print:bg-gray-100 print:border">
                            {idx + 1}
                          </span>
                          <h4 className="text-lg font-semibold text-gray-200 mt-1 print:text-black">{q.question}</h4>
                        </div>
                        <button 
                          onClick={() => toggleAnswer(idx)}
                          className="self-start sm:self-center px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-300 rounded transition whitespace-nowrap print:hidden"
                        >
                          {visibleAnswers[idx] ? 'Hide Answer' : 'Show Answer'}
                        </button>
                      </div>

                      {/* Answer Section */}
                      <div className={`p-4 bg-gray-800/50 border-t border-gray-700 transition-all duration-300 print:block print:bg-transparent print:border-none print:p-2 ${visibleAnswers[idx] ? 'block' : 'hidden'}`}>
                        <h5 className="text-sm font-bold text-green-400 mb-2 uppercase tracking-wide print:text-gray-700">Ideal Answer:</h5>
                        <p className="text-gray-300 leading-relaxed print:text-black">{q.answer}</p>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </DashboardLayout>
    );
}
