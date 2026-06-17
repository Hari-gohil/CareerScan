"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';

export default function ReportDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Job Match State
  const [jobDescription, setJobDescription] = useState('');
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [matchError, setMatchError] = useState('');

  useEffect(() => {
    // DB mathi report data fetch karva mate
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/reports/${id}`);
        const result = await res.json();
        
        if (res.ok) {
          setReport(result.data);
          if (result.data.matchPercentage) {
            setMatchResult({
              matchPercentage: result.data.matchPercentage,
              matchAnalysis: result.data.matchAnalysis
            });
            setJobDescription(result.data.jobDescription || '');
          }
        } else {
          setError(result.message || "Failed to fetch report");
        }
      } catch (err) {
        setError("Network error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      setMatchError("Please enter a job description.");
      return;
    }
    setMatchError('');
    setMatchLoading(true);

    try {
      const res = await fetch(`/api/reports/${id}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription })
      });
      const result = await res.json();
      
      if (res.ok) {
        setMatchResult(result.data);
      } else {
        setMatchError(result.message || "Failed to match job");
      }
    } catch (err) {
      setMatchError("Network error occurred during match.");
    } finally {
      setMatchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading your AI Report...
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <DashboardLayout>
        <div className="flex h-full text-center flex-col items-center justify-center">
           <h2 className="text-2xl text-red-400 font-bold mb-4">{error || "Report not found"}</h2>
           <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-blue-600 text-white rounded">Go Back</button>
        </div>
      </DashboardLayout>
    );
  }

  // Score na aadhare color decide karvo
  const scoreColor = report.atsScore >= 80 ? 'text-green-500' : report.atsScore >= 50 ? 'text-yellow-500' : 'text-red-500';

  return (
    <DashboardLayout>
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Header / Score Section */}
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-md flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Resume Analysis Report</h1>
                <p className="text-gray-400 max-w-xl">{report.summary}</p>
              </div>
              <div className="mt-6 md:mt-0 flex flex-col items-center">
                <div className={`relative flex items-center justify-center w-32 h-32 rounded-full border-8 border-gray-700`}>
                  <span className={`text-4xl font-extrabold ${scoreColor}`}>{report.atsScore}</span>
                  <span className="absolute bottom-2 text-xs text-gray-400">/ 100</span>
                </div>
                <span className="mt-3 font-semibold text-gray-300">ATS Score</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Section */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-green-400">✓</span> Skills Found
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.skills?.length > 0 ? report.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium border border-green-800/50">
                      {skill}
                    </span>
                  )) : <p className="text-gray-500">No skills detected.</p>}
                </div>
              </div>

              {/* Missing Skills Section */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-red-400">✗</span> Missing Skills (Consider Adding)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.missingSkills?.length > 0 ? report.missingSkills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-red-900/30 text-red-400 rounded-full text-sm font-medium border border-red-800/50">
                      {skill}
                    </span>
                  )) : <p className="text-gray-500">Looking good! No major missing skills.</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                <h3 className="text-xl font-bold text-white mb-4">💪 Strengths</h3>
                <ul className="space-y-2">
                  {report.strengths?.length > 0 ? report.strengths.map((s, i) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-green-500 mt-1">•</span> {s}
                    </li>
                  )) : <p className="text-gray-500">No specific strengths identified.</p>}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                <h3 className="text-xl font-bold text-white mb-4">⚠️ Weaknesses</h3>
                <ul className="space-y-2">
                  {report.weaknesses?.length > 0 ? report.weaknesses.map((w, i) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span> {w}
                    </li>
                  )) : <p className="text-gray-500">No major weaknesses found.</p>}
                </ul>
              </div>
            </div>

            {/* Suggestions / Action Plan */}
            <div className="bg-gray-800 p-6 rounded-xl border border-blue-900/50 shadow-sm">
              <h3 className="text-xl font-bold text-blue-400 mb-4">🚀 Actionable Suggestions</h3>
              <div className="space-y-4">
                {report.suggestions?.length > 0 ? report.suggestions.map((sug, i) => (
                  <div key={i} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                    <p className="text-gray-200">{sug}</p>
                  </div>
                )) : <p className="text-gray-500">No further suggestions.</p>}
              </div>
            </div>

            {/* Skill Gap / Future Skills Section */}
            <div className="bg-gray-800 p-6 rounded-xl border border-yellow-900/50 shadow-sm">
              <h3 className="text-xl font-bold text-yellow-400 mb-2 flex items-center gap-2">
                <span className="text-2xl">📈</span> Career Growth & Skill Gap
              </h3>
              <p className="text-gray-400 mb-4 text-sm">Based on your current tech stack and industry trends, learning these skills will help you land better jobs:</p>
              <div className="flex flex-wrap gap-3">
                {report.recommendedSkills?.length > 0 ? report.recommendedSkills.map((skill, i) => (
                  <span key={i} className="px-4 py-2 bg-yellow-900/30 text-yellow-400 rounded-lg text-sm font-bold border border-yellow-800/50 flex items-center gap-2 shadow-sm shadow-yellow-900/20">
                    <span className="text-yellow-500">⭐</span> {skill}
                  </span>
                )) : <p className="text-gray-500 italic">Upload a new resume to see your personalized Future Skill recommendations!</p>}
              </div>
            </div>

            {/* Job Matcher Section */}
            <div className="bg-gray-800 p-8 rounded-xl border border-purple-900/50 shadow-md">
              <h3 className="text-2xl font-bold text-purple-400 mb-2 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Job Matcher
              </h3>
              <p className="text-gray-400 mb-6">Paste a Job Description below to see how well your resume matches the role.</p>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the Job Description here..."
                className="w-full h-40 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-200 focus:outline-none focus:border-purple-500 mb-4"
              />

              {matchError && <p className="text-red-400 mb-4">{matchError}</p>}

              <button
                onClick={handleMatch}
                disabled={matchLoading || !jobDescription.trim()}
                className={`px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                  matchLoading || !jobDescription.trim() ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-500 shadow-lg shadow-purple-500/20'
                }`}
              >
                {matchLoading && (
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {matchLoading ? 'Calculating Match...' : 'Calculate Job Match'}
              </button>

              {/* Display Match Results */}
              {matchResult && (
                <div className="mt-8 p-6 bg-purple-900/20 border border-purple-800/50 rounded-xl flex flex-col md:flex-row items-center gap-6">
                  <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center w-28 h-28 rounded-full border-8 border-purple-500">
                      <span className="text-3xl font-extrabold text-white">{matchResult.matchPercentage}%</span>
                    </div>
                    <span className="mt-2 font-bold text-purple-300">Match</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">Match Analysis</h4>
                    <p className="text-gray-300 leading-relaxed">{matchResult.matchAnalysis}</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </DashboardLayout>
    );
}
