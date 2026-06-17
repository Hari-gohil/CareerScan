"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        const result = await res.json();
        if (res.ok) {
          setProfile(result.data);
        } else {
          setError(result.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Network error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
      }
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-white">
              <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading Profile...
            </div>
          </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center p-8">
          <h2 className="text-red-400 font-bold">{error}</h2>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">User Profile</h1>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
              {/* Cover Banner */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>
              
              <div className="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-16">
                {/* Avatar */}
                <div className="w-32 h-32 bg-gray-700 border-4 border-gray-800 rounded-full flex items-center justify-center text-5xl font-bold text-white uppercase shadow-lg">
                  {profile?.name?.charAt(0)}
                </div>
                
                {/* User Info */}
                <div className="flex-1 text-center sm:text-left mb-2">
                  <h2 className="text-3xl font-bold text-white">{profile?.name}</h2>
                  <p className="text-gray-400">{profile?.email}</p>
                </div>

                {/* Logout Button */}
                <div className="mb-2">
                  <button 
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-600/20 text-red-400 border border-red-900/50 hover:bg-red-600 hover:text-white rounded-lg font-bold transition flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                  </button>
                </div>
              </div>

              {/* Stats Section */}
              <div className="px-8 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  
                  {/* Stat Card 1 */}
                  <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Member Since</span>
                    <span className="text-xl font-bold text-white">
                      {new Date(profile?.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                    </span>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Resumes Analyzed</span>
                    <span className="text-4xl font-extrabold text-white">{profile?.stats?.totalResumes}</span>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Average ATS Score</span>
                    <div className="relative flex items-center justify-center w-16 h-16 rounded-full border-4 border-green-500 mt-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                      <span className="text-xl font-bold text-white">{profile?.stats?.avgScore}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </DashboardLayout>
    );
}
