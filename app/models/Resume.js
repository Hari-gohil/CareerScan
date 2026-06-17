import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: [true, 'Please provide the file name'],
    },
    parsedText: {
      type: String,
      required: false, // Raw text from PDF/Word
    },
    // Structured Data (AI thi madshe)
    personalInfo: {
      name: String,
      email: String,
      phone: String,
    },
    summary: String,
    skills: [String],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      }
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      }
    ],
    projects: [
      {
        title: String,
        description: String,
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
