require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const mongoose = require('mongoose');

// Because aiAnalyzer uses ES syntax, we might need a workaround. 
// Actually Node 20+ can import ES modules if we use dynamic import.

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  // Register models
  const User = require('./app/models/User').default;
  const Resume = require('./app/models/Resume').default;
  const Report = require('./app/models/Report').default;
  
  try {
    const report = await Report.findOne({ _id: '6a323f9d19b1f1726ba21f86' }).populate('resumeId');
    const resumeText = report.resumeId.parsedText;
    
    // dynamically import the ES module
    const { calculateJobMatch } = await import('./app/services/aiAnalyzer.js');
    
    console.log("Calling calculateJobMatch...");
    const result = await calculateJobMatch(resumeText, "Looking for a full stack developer with React, Node, Next.js.");
    console.log("Match Result:", result);

    report.jobDescription = "Looking for a full stack developer with React, Node, Next.js.";
    report.matchPercentage = result.matchPercentage;
    report.matchAnalysis = result.matchAnalysis;
    await report.save();
    console.log("Report saved successfully!");

  } catch (err) {
    console.error("Test Error:", err);
  }
  
  mongoose.disconnect();
}

test();
