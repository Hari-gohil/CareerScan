import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/db';
import Report from '@/app/models/Report';
import Resume from '@/app/models/Resume';

export async function GET(req) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_aise_hi');

    await connectToDatabase();
    
    // Sort ascending so oldest is first for the timeline charts
    const reports = await Report.find({ userId: decoded.userId }).populate('resumeId', 'fileName').sort({ createdAt: 1 });

    if (!reports || reports.length === 0) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    return NextResponse.json({ data: reports }, { status: 200 });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json({ message: "Error fetching analytics data." }, { status: 500 });
  }
}
