import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/db';
import Report from '@/app/models/Report';
import Resume from '@/app/models/Resume';
import { calculateJobMatch } from '@/app/services/aiAnalyzer';

export const maxDuration = 60; 

export async function POST(req, { params }) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_aise_hi');

    const { id } = await params;
    const { jobDescription } = await req.json();

    if (!jobDescription) {
      return NextResponse.json({ message: "Job description is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Fetch Report and populate Resume
    const report = await Report.findOne({ _id: id, userId: decoded.userId }).populate('resumeId');
    if (!report || !report.resumeId || !report.resumeId.parsedText) {
      return NextResponse.json({ message: "Report or resume text not found" }, { status: 404 });
    }

    // Call AI to get match percentage
    const matchResult = await calculateJobMatch(report.resumeId.parsedText, jobDescription);

    // Save to DB
    report.jobDescription = jobDescription;
    report.matchPercentage = matchResult.matchPercentage;
    report.matchAnalysis = matchResult.matchAnalysis;
    await report.save();

    return NextResponse.json({ 
      message: "Job match calculated successfully", 
      data: {
        matchPercentage: report.matchPercentage,
        matchAnalysis: report.matchAnalysis
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Match route error:", error);
    return NextResponse.json({ message: "Error calculating job match." }, { status: 500 });
  }
}
