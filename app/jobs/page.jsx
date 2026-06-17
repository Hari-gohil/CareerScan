"use client";
import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';

export default function JobsPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState('');
  
  // New state for live jobs
  const [jobs, setJobs] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [location, setLocation] = useState('India');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/analytics');
        const result = await res.json();
        if (res.ok && result.data) {
          const sortedData = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setHistory(sortedData);
          if (sortedData.length > 0) {
            setSelectedResume(sortedData[0]._id);
            if (sortedData[0].skills) {
              setCustomQuery(sortedData[0].skills.slice(0, 3).join(" ") + " jobs");
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch resume history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleSearchLiveJobs = async () => {
    if (!customQuery.trim()) {
      setSearchError("Please enter a search query.");
      return;
    }
    
    setIsSearching(true);
    setSearchError('');
    setJobs([]);

    try {
      const fullQuery = location.trim() ? `${customQuery} in ${location}` : customQuery;
      const res = await fetch(`/api/jobs/search?query=${encodeURIComponent(fullQuery)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch jobs");
      }

      if (data.data && data.data.length > 0) {
        setJobs(data.data);
      } else {
        setSearchError("No jobs found for these skills at the moment.");
      }
    } catch (err) {
      setSearchError(err.message || "An error occurred while fetching jobs.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchIndeed = () => {
    const report = history.find(r => r._id === selectedResume);
    if (!report || !report.skills || report.skills.length === 0) return;
    const topSkills = report.skills.slice(0, 4).join(" ");
    const indeedUrl = `https://in.indeed.com/jobs?q=${encodeURIComponent(topSkills)}`;
    window.open(indeedUrl, '_blank');
  };

  return (
    <DashboardLayout>
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <h1 className="text-3xl font-bold text-white mb-2">Live Job Board</h1>
              <p className="text-gray-400 mb-6">
                We extract your top skills and automatically find live, matching jobs for you using JSearch (Google Jobs).
              </p>

              {loading ? (
                <div className="flex justify-center py-6">
                  <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : history.length === 0 ? (
                <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700">
                  <p className="text-gray-400">Please upload and analyze a resume first to find matching jobs.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Select a Resume:</label>
                      <select 
                        value={selectedResume}
                        onChange={(e) => {
                          setSelectedResume(e.target.value);
                          const r = history.find(rep => rep._id === e.target.value);
                          if (r && r.skills) {
                            setCustomQuery(r.skills.slice(0, 3).join(" ") + " jobs");
                          }
                        }}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                      >
                        {history.map((report) => (
                          <option key={report._id} value={report._id}>
                            {report.resumeId?.fileName || 'Unknown Resume'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Search Role:</label>
                      <input 
                        type="text"
                        value={customQuery}
                        onChange={(e) => setCustomQuery(e.target.value)}
                        placeholder="e.g. React Developer"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Location:</label>
                      <input 
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. India, Remote, USA"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button 
                      onClick={handleSearchLiveJobs}
                      disabled={isSearching || !customQuery.trim()}
                      className={`flex-1 py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${isSearching || !customQuery.trim() ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-900/50 transform hover:scale-[1.02]'}`}
                    >
                      {isSearching ? 'Searching Google Jobs...' : 'Search Live Jobs Now'}
                    </button>
                    <button 
                      onClick={handleSearchIndeed}
                      className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      Fallback: View on Indeed
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {searchError && (
              <div className="bg-red-900/20 border border-red-800/50 text-red-400 p-4 rounded-xl text-center">
                {searchError}
              </div>
            )}

            {/* Live Jobs List */}
            {jobs.length > 0 && (
              <div className="space-y-4 mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Recommended Jobs ({jobs.length})</h2>
                {jobs.map((job, index) => (
                  <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-blue-400 mb-1">{job.job_title}</h3>
                      <div className="text-gray-300 font-medium mb-3 flex items-center gap-2">
                        <span className="bg-gray-700 px-2 py-0.5 rounded text-sm">{job.employer_name}</span>
                        {job.job_is_remote && <span className="text-green-400 text-xs bg-green-900/20 px-2 py-0.5 rounded border border-green-800/50">Remote</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">📍 {job.job_city || job.job_country || 'Location N/A'}</span>
                        <span className="flex items-center gap-1">💼 {job.job_employment_type || 'Full-time'}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-3 line-clamp-2">
                        {job.job_description ? job.job_description.substring(0, 200) + '...' : 'No description available.'}
                      </p>
                    </div>
                    <div>
                      <a 
                        href={job.job_apply_link || job.job_google_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition shadow-md whitespace-nowrap"
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </DashboardLayout>
    );
}
