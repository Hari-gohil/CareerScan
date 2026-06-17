import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/app/lib/db';
import User from '@/app/models/User';

export async function POST(req) {
  try {
    // 1. Login details receive karva
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
    }

    // 2. Database connect karvu
    await connectToDatabase();

    // 3. Check karvu ke user exist kare chhe ke nahi, ane password sathe fetch karvu
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // 4. Password match karvo (User e aapeyl password VS database ma hash karelo password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // 5. JWT token banavvo (Aama user ni ID ane email save thashe)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret_key_aise_hi', 
      { expiresIn: '7d' } // Token 7 divas mate valid rehashe
    );

    // 6. Response mokalvo ane cookie ma token set karvo
    const response = NextResponse.json({ message: "Login successful." }, { status: 200 });
    
    // Cookie ma token set kari rahya chhiye security mate
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true, // Javascript thi access nahi thay, secure chhe
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 divas seconds ma
      path: '/',
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "An unexpected error occurred during login." }, { status: 500 });
  }
}
