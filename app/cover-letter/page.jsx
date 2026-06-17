"use client";
import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';

export default function CoverLetterPage() {
  const [reports, setReports] = useState([]);
  const [selectedReportId, setSelectedReportId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    // Dropdown mate reports fetch karva
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/interview'); // Reusing interview API's GET route to fetch reports
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
    if (!selectedReportId) {
      setError("Please select a resume.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste a Job Description.");
      return;
    }
    
    setLoading(true);
    setError('');
    setCoverLetter('');
    setCopySuccess(false);

    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: selectedReportId, jobDescription })
      });
      const result = await res.json();
      
      if (res.ok) {
        setCoverLetter(result.data);
      } else {
        setError(result.message || "Failed to generate cover letter.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Control Panel - Hidden during print */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md print:hidden">
          <h2 className="text-2xl font-bold text-white mb-4">AI Cover Letter Generator</h2>
          <p className="text-gray-400 mb-6">Select your resume and paste the job description. The AI will write a highly tailored cover letter for you instantly.</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Select Base Resume:</label>
              <select 
                value={selectedReportId} 
                onChange={(e) => setSelectedReportId(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-lg focus:outline-none focus:border-green-500"
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Target Job Description:</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-32 bg-gray-900 border border-gray-700 text-white p-4 rounded-lg focus:outline-none focus:border-green-500"
              ></textarea>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={loading || !selectedReportId || !jobDescription.trim()}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                loading || !selectedReportId || !jobDescription.trim() ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-500/20'
              }`}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Writing Cover Letter...' : 'Generate Cover Letter'}
            </button>
          </div>

          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>

        {/* Cover Letter Output */}
        {coverLetter && (
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-md print:bg-transparent print:border-none print:shadow-none print:p-0">
            <div className="flex justify-between items-center mb-6 print:hidden">
              <h3 className="text-xl font-bold text-white">Your Tailored Cover Letter</h3>
              <div className="flex gap-3">
                <button 
                  onClick={handleCopy}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded flex items-center gap-2 transition"
                >
                  {copySuccess ? (
                    <>
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      Copy
                    </>
                  )}
                </button>
                <button 
                  onClick={handlePrint}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center gap-2 transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  Print
                </button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 print:bg-transparent print:border-none print:p-0">
              <pre className="font-sans text-gray-300 leading-relaxed whitespace-pre-wrap print:text-black print:text-sm">
                {coverLetter}
              </pre>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
