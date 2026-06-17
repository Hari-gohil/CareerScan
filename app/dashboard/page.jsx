"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/app/components/DashboardLayout';
import ResumeHistory from '@/app/components/ResumeHistory';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // User ni details fetch karva mate
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Jo user logged in na hoy to login page par mokli do
          router.push('/login');
        }
      } catch (error) {
        console.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-white">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading dashboard...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header section jema welcome message ane button chhe */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Welcome back, <span className="text-blue-400">{user?.name || 'User'}</span>! 👋
            </h1>
            <p className="text-gray-400 text-lg">
              Ready to optimize your resume and land your dream job?
            </p>
          </div>
          
          <Link 
            href="/upload"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] flex items-center gap-3 shrink-0 text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload New Resume
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/analytics" className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition shadow-sm group">
            <div className="bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
              <svg className="w-6 h-6 text-blue-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">View Analytics</h3>
            <p className="text-sm text-gray-400">Track your ATS score progress and performance over time.</p>
          </Link>

          <Link href="/interview" className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition shadow-sm group">
            <div className="bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition">
              <svg className="w-6 h-6 text-purple-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Practice Interview</h3>
            <p className="text-sm text-gray-400">Generate custom interview questions based on your resume.</p>
          </Link>

          <Link href="/cover-letter" className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition shadow-sm group">
            <div className="bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition">
              <svg className="w-6 h-6 text-green-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Write Cover Letter</h3>
            <p className="text-sm text-gray-400">Instantly generate a tailored cover letter for any job.</p>
          </Link>
        </div>

        {/* Resume History Table Component */}
        <ResumeHistory />

      </div>
    </DashboardLayout>
  );
}
