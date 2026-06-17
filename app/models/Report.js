import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    scoreBreakdown: {
      type: Object, // Stores exact points breakdown e.g. { skills: 20, experience: 30, ... }
      default: {},
    },
    summary: {
      type: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    recommendedSkills: {
      type: [String],
      default: [],
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    jobDescription: {
      type: String,
      required: false,
    },
    matchPercentage: {
      type: Number,
      required: false,
    },
    matchPercentage: {
      type: Number,
      required: false,
    },
    matchAnalysis: {
      type: String,
      required: false,
    },
    interviewQuestions: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
