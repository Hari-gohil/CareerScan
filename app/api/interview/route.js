import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/db';
import Report from '@/app/models/Report';
import { generateInterviewQuestions } from '@/app/services/aiAnalyzer';

export const maxDuration = 60;

export async function POST(req) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_aise_hi');

    const { reportId } = await req.json();
    if (!reportId) {
      return NextResponse.json({ message: "Report ID is required" }, { status: 400 });
    }

    await connectToDatabase();
    
    const report = await Report.findOne({ _id: reportId, userId: decoded.userId }).populate('resumeId');
    if (!report) {
      return NextResponse.json({ message: "Report not found" }, { status: 404 });
    }

    // Jo pehla thi questions generate karela hoy to te j aapi do
    if (report.interviewQuestions && report.interviewQuestions.length > 0) {
      return NextResponse.json({ data: report.interviewQuestions }, { status: 200 });
    }

    // Naya questions AI thi generate karavo
    const questions = await generateInterviewQuestions(report.resumeId.parsedText);

    // Database ma save kari lo jethi fari API call na karvo pade
    report.interviewQuestions = questions;
    await report.save();

    return NextResponse.json({ 
      message: "Questions generated successfully", 
      data: questions
    }, { status: 200 });

  } catch (error) {
    console.error("Interview route error:", error);
    return NextResponse.json({ message: "Error generating questions." }, { status: 500 });
  }
}

// GET route for fetching all reports of the user for the dropdown
export async function GET(req) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_aise_hi');

    await connectToDatabase();
    const reports = await Report.find({ userId: decoded.userId }).populate('resumeId', 'fileName createdAt').sort({ createdAt: -1 });

    return NextResponse.json({ data: reports }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching reports." }, { status: 500 });
  }
}
