import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/db';
import User from '@/app/models/User';

export async function GET(req) {
  try {
    // 1. Cookie mathi token laiaviye chhiye
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    // 2. Token ne verify kariye
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_aise_hi');

    // 3. Database mathi user ne fetch kariye
    await connectToDatabase();
    const user = await User.findById(decoded.userId).select('-password'); // Password vagar no data

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4. User no data send kariye
    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ message: "Authentication failed" }, { status: 401 });
  }
}
