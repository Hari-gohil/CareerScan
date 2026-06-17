import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mammoth from 'mammoth';
import connectToDatabase from '@/app/lib/db';
import Resume from '@/app/models/Resume';

// Next.js API route default is Node.js runtime
export const maxDuration = 30; // 30 seconds max duration

export async function POST(req) {
  try {
    // 1. User ne authenticate karvo (cookie mathi)
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_aise_hi');
    const userId = decoded.userId;

    // 2. Form data (file) receive karvi
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: "File not provided" }, { status: 400 });
    }

    // 3. File mathi text extract karvo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    let parsedText = '';

    if (file.type === 'application/pdf') {
      // PDF file chhe to pdf-parse use karishu
      const pdfParse = require('pdf-parse/lib/pdf-parse.js');
      const data = await pdfParse(buffer);
      parsedText = data.text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
      // Word document chhe to mammoth use karishu
      const data = await mammoth.extractRawText({ buffer });
      parsedText = data.value;
    } else {
      return NextResponse.json({ message: "Unsupported file type. Please upload PDF or DOCX." }, { status: 400 });
    }

    if (!parsedText || parsedText.trim() === '') {
      return NextResponse.json({ message: "Could not extract text from the file." }, { status: 400 });
    }

    // 4. Database ma save karvu
    await connectToDatabase();
    
    const newResume = new Resume({
      userId,
      fileName: file.name,
      parsedText: parsedText.trim(),
    });

    await newResume.save();

    // 5. Success response return karvo
    return NextResponse.json({ 
      message: "Resume uploaded successfully", 
      resumeId: newResume._id 
    }, { status: 201 });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ message: "Upload Error: " + error.message, stack: error.stack }, { status: 500 });
  }
}
