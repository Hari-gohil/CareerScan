"use client";
import { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function AnalyticsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics');
        const result = await res.json();
        if (res.ok) {
          setReports(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-white">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading Analytics Dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Data processing for charts
  const atsScoreData = reports.map((r, i) => ({
    name: `R-${i + 1}`,
    score: r.atsScore,
    date: new Date(r.createdAt).toLocaleDateString()
  }));

  const jobMatchData = reports.filter(r => r.matchPercentage).map((r, i) => ({
    name: `M-${i + 1}`,
    match: r.matchPercentage,
    job: r.jobDescription ? r.jobDescription.substring(0, 15) + "..." : "Unknown Job"
  }));

  // Latest resume breakdown for Radar chart
  const latestReport = reports.length > 0 ? reports[reports.length - 1] : null;
  let radarData = [];
  if (latestReport && latestReport.scoreBreakdown) {
    radarData = Object.keys(latestReport.scoreBreakdown).map(key => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      A: latestReport.scoreBreakdown[key],
      fullMark: 30 // Approx max for categories
    }));
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resume Analytics</h1>
          <p className="text-gray-400">Track your ATS score progress and performance over time.</p>
        </div>

        {reports.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-xl text-center border border-gray-700">
            <p className="text-gray-400">No data available yet. Please upload and analyze a resume first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            
            {/* ATS Score Trend Chart */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
              <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                ATS Score Trend
              </h3>
              <div className="h-72 w-full min-h-[288px]">
                <ResponsiveContainer width="100%" height={288}>
                  <LineChart data={atsScoreData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis domain={[0, 100]} stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 8 }} name="ATS Score" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>   

            {/* Radar Chart for Latest Resume Breakdown */}
            {radarData.length > 0 && (
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md lg:col-span-2 flex flex-col items-center">
                <h3 className="text-xl font-bold text-green-400 mb-2 w-full flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                  Score Breakdown (Latest Resume)
                </h3>
                <p className="text-gray-400 text-sm mb-6 w-full">Visualizing where your points are coming from.</p>
                <div className="h-96 w-full max-w-2xl min-h-[384px]">
                  <ResponsiveContainer width="100%" height={384}>
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="subject" stroke="#D1D5DB" tick={{ fill: '#D1D5DB', fontSize: 14 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 30]} stroke="#4B5563" />
                      <Radar name="Points" dataKey="A" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
