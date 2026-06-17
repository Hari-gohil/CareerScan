import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/db';
import Report from '@/app/models/Report';

export async function GET(req, { params }) {
  try {
    // 1. User authentication
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_aise_hi');

    // 2. Report ID params mathi get karvi
    const { id } = await params;

    await connectToDatabase();
    
    // 3. User na id sathe verify kari ne report fetch karvo (Security mate)
    const report = await Report.findOne({ _id: id, userId: decoded.userId }).populate('resumeId', 'fileName personalInfo');

    if (!report) {
      return NextResponse.json({ message: "Report not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ data: report }, { status: 200 });
  } catch (error) {
    console.error("Report fetch error:", error);
    return NextResponse.json({ message: "Error fetching report details." }, { status: 500 });
  }
}
