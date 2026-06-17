import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/db';
import Report from '@/app/models/Report';
import Resume from '@/app/models/Resume';
import { generateCoverLetter } from '@/app/services/aiAnalyzer';

export const maxDuration = 60;

export async function POST(req) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_aise_hi');

    const { reportId, jobDescription } = await req.json();
    if (!reportId || !jobDescription) {
      return NextResponse.json({ message: "Report ID and Job Description are required" }, { status: 400 });
    }

    await connectToDatabase();
    
    // Resume text laava mate Report find karvo
    const report = await Report.findOne({ _id: reportId, userId: decoded.userId }).populate('resumeId');
    if (!report || !report.resumeId || !report.resumeId.parsedText) {
      return NextResponse.json({ message: "Report or resume text not found" }, { status: 404 });
    }

    // AI thi cover letter generate karavvo
    const coverLetter = await generateCoverLetter(report.resumeId.parsedText, jobDescription);

    return NextResponse.json({ 
      message: "Cover letter generated successfully", 
      data: coverLetter
    }, { status: 200 });

  } catch (error) {
    console.error("Cover letter route error:", error);
    return NextResponse.json({ message: "Error generating cover letter." }, { status: 500 });
  }
}
