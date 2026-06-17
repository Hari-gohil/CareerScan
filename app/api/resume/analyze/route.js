import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/db';
import Resume from '@/app/models/Resume';
import Report from '@/app/models/Report';
import { extractResumeData } from '@/app/services/aiAnalyzer';
import { calculateATSScore } from '@/app/services/atsCalculator';

export const maxDuration = 60; // AI API call lamba samay lay shake chhe

export async function POST(req) {
  try {
    // 1. User check karvu
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_aise_hi');

    const { resumeId } = await req.json();
    if (!resumeId) {
      return NextResponse.json({ message: "Resume ID is required" }, { status: 400 });
    }

    // 2. Database mathi raw text fetch karvo
    await connectToDatabase();
    const resume = await Resume.findOne({ _id: resumeId, userId: decoded.userId });

    if (!resume || !resume.parsedText) {
      return NextResponse.json({ message: "Resume not found or text empty" }, { status: 404 });
    }

    // 3. AI Analyzer ne text mokalvo ane ATS evaluation get karvu
    const aiResult = await extractResumeData(resume.parsedText);

    // 4. Custom algorithm thi exact ATS Score calculate karvo
    const atsCalculation = calculateATSScore(aiResult);

    // 5. Resume model ma basic info save karvi
    resume.personalInfo = aiResult.personalInfo;
    resume.summary = aiResult.summary;
    resume.skills = aiResult.skills;
    resume.experience = aiResult.experience;
    resume.education = aiResult.education;
    resume.projects = aiResult.projects;
    await resume.save();

    // 6. Nayo Report create karvo jema proper ATS score ane breakdown save thashe
    const newReport = new Report({
      resumeId: resume._id,
      userId: decoded.userId,
      atsScore: atsCalculation.totalScore,
      scoreBreakdown: atsCalculation.breakdown,
      summary: aiResult.summary,
      skills: aiResult.skills,
      missingSkills: aiResult.missingSkills,
      strengths: aiResult.strengths,
      weaknesses: aiResult.weaknesses,
      suggestions: aiResult.suggestions,
      recommendedSkills: aiResult.recommendedSkills || [],
    });
    await newReport.save();

    // 7. Success message sathe report data return karvo
    return NextResponse.json({ 
      message: "Resume analyzed and mathematically scored successfully!",
      reportId: newReport._id,
      data: {
        ...aiResult,
        atsScore: atsCalculation.totalScore,
        scoreBreakdown: atsCalculation.breakdown
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Analysis route error:", error);
    return NextResponse.json({ message: "AI Analysis Error: " + error.message, stack: error.stack }, { status: 500 });
  }
}
