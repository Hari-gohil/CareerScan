"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar({ onToggleSidebar }) {
  const router = useRouter();

  // Logout function
  const handleLogout = async () => {
    // Backend ma logout route call kari rahya chhiye
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-50">
      {/* App nu Logo / Name and Hamburger */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar}
            className="md:hidden text-gray-400 hover:text-white focus:outline-none p-1 rounded-md"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        )}
        <div className="flex items-center gap-2 text-blue-400 font-bold text-lg sm:text-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CareerScan
        </div>
      </div>

      {/* User Actions */}
      <div>
        <button 
          onClick={handleLogout}
          className="text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
