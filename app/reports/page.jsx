"use client";
import React from 'react';
import DashboardLayout from '@/app/components/DashboardLayout';
import ResumeHistory from '@/app/components/ResumeHistory';

export default function ReportsPage() {
  return (
    <DashboardLayout>
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Your Reports</h1>
              <p className="text-gray-400">View and manage all your previously analyzed resumes and their ATS scores.</p>
            </div>
            
            <ResumeHistory />
          </div>
        </DashboardLayout>
    );
}
