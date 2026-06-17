"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/components/DashboardLayout';
import UploadResume from '@/app/components/UploadResume';

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check kariye ke user logged in chhe ke nahi
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
        }
      } catch (err) {
        console.error("Auth check failed");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex h-full items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Upload component call kari rahya chhiye */}
          <UploadResume />
        </div>
      </div>
    </DashboardLayout>
  );
}
