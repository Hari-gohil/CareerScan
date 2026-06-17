import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/app/lib/db';
import User from '@/app/models/User';

export async function POST(req) {
  try {
    // 1. Frontend mathi data receive kari rahya chhiye
    const { name, email, password } = await req.json();

    // 2. Check karvu ke data puro aavyo chhe ke nahi
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Please provide all required fields." }, { status: 400 });
    }

    // 3. Database connection setup
    await connectToDatabase();

    // 4. Check karvu ke aa user pehla thi exist kare chhe ke nahi
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered." }, { status: 400 });
    }

    // 5. Password ne secure (hash) karvu jethi koi read na kari shake
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6. Naya user ne database ma save karvo
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // 7. Success message return karvo
    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "An unexpected error occurred during registration." }, { status: 500 });
  }
}
