"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ResumeHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Database mathi history fetch karisu
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/analytics');
        const result = await res.json();
        if (res.ok && result.data) {
          // Sort descending so newest is first
          const sortedData = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setHistory(sortedData);
        }
      } catch (err) {
        console.error("Failed to fetch resume history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-white mb-4">Resume History</h3>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center py-6">
            <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-700/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <p className="text-gray-400 font-medium text-lg">No resumes uploaded yet.</p>
            <p className="text-gray-500 text-sm mt-1">Upload your first resume to see the analysis here!</p>
          </div>
        ) : (
          <table className="w-full text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Resume Name</th>
                <th className="px-4 py-3">Upload Date</th>
                <th className="px-4 py-3">ATS Score</th>
                <th className="px-4 py-3 rounded-tr-lg text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id} className="border-b border-gray-700 hover:bg-gray-700/20 transition">
                  <td className="px-4 py-4 font-medium text-blue-400">
                    <Link href={`/reports/${item._id}`} className="hover:underline">
                      {item.resumeId?.fileName || 'Unknown Resume'}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.atsScore >= 80 ? 'bg-green-500/20 text-green-400' : 
                      item.atsScore >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {item.atsScore} / 100
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Link href={`/reports/${item._id}`} className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded transition text-white">
                      View Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
