import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/db';
import User from '@/app/models/User';
import Report from '@/app/models/Report';

export async function GET(req) {
  try {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_aise_hi');

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Usage statistics calculate karva
    const reports = await Report.find({ userId: decoded.userId });
    const totalResumes = reports.length;
    
    let avgScore = 0;
    if (totalResumes > 0) {
      const totalScore = reports.reduce((acc, curr) => acc + curr.atsScore, 0);
      avgScore = Math.round(totalScore / totalResumes);
    }

    const userData = {
      name: user.name,
      email: user.email,
      joinedAt: user.createdAt,
      stats: {
        totalResumes,
        avgScore
      }
    };

    return NextResponse.json({ data: userData }, { status: 200 });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ message: "Error fetching profile." }, { status: 500 });
  }
}
