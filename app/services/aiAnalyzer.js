import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function extractResumeData(rawText) {
  try {
    // 1. AI ne strict instructions aapo ATS scoring ane evaluation mate
    const prompt = `
      You are an expert IT Recruiter and ATS (Applicant Tracking System) software. 
      Analyze the following resume text and evaluate it strictly. 
      
      Resume Text:
      ${rawText}
      
      Perform a deep analysis and return the output strictly as a valid JSON object without any markdown formatting.
      
      Required JSON Format:
      {
        "personalInfo": {
          "name": "Full Name",
          "email": "Email Address",
          "phone": "Phone Number"
        },
        "atsScore": 75, // A strict score out of 100 based on structure, keywords, and clarity
        "summary": "A brief evaluation summary of the candidate's profile.",
        "skills": ["Skill 1", "Skill 2"], // Skills actually present in the resume
        "missingSkills": ["Missing 1", "Missing 2"], // Crucial skills missing for a typical modern tech/software role
        "strengths": ["Strength 1", "Strength 2"], // What the candidate did well
        "weaknesses": ["Weakness 1", "Weakness 2"], // Formatting issues, lack of metrics, gaps
        "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2"], // How to improve the resume and ATS score
        "recommendedSkills": ["Look at the user's current skills. Based on current industry trends, suggest 3-5 specific 'Future Skills' or 'Skill Gaps' they should learn to get better jobs. (e.g., if they know React, suggest Next.js)."],
        "experience": [
          {
            "company": "Company Name",
            "role": "Job Title",
            "duration": "e.g., Jan 2020 - Present",
            "description": "Brief description"
          }
        ],
        "education": [
          {
            "degree": "Degree Name",
            "institution": "University/College",
            "year": "Graduation Year"
          }
        ],
        "projects": [
          {
            "title": "Project Name",
            "description": "Brief project description"
          }
        ]
      }
      
      Ensure the output is valid JSON and nothing else.
    `;

    // 2. OpenAI api ne call karvo
    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2, // Thodu creative but mainly accurate result mate
      response_format: { type: "json_object" },
    });

    // 3. String mathi JSON ma convert karvu
    const jsonString = response.choices[0].message.content;
    const structuredData = JSON.parse(jsonString);

    return structuredData;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to evaluate resume with AI");
  }
}

export async function calculateJobMatch(resumeText, jobDescription) {
  try {
    const prompt = `
      You are an expert ATS (Applicant Tracking System).
      Compare the following Resume Text against the Job Description.
      
      Resume Text:
      ${resumeText}
      
      Job Description:
      ${jobDescription}
      
      Return a JSON object with strictly these two fields:
      {
        "matchPercentage": 85, // An integer between 0 and 100 representing how well the resume matches the job.
        "matchAnalysis": "A brief 2-3 sentence explanation of the match, highlighting missing key requirements or strong alignments."
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const jsonString = response.choices[0].message.content;
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Job Match Error:", error);
    throw new Error("Failed to calculate job match");
  }
}

export async function generateInterviewQuestions(resumeText) {
  try {
    const prompt = `
      You are an expert Technical Interviewer.
      Based on the following Resume Text, generate 5 to 7 highly relevant and challenging interview questions.
      For each question, also provide a strong, ideal answer that the candidate should aim for.
      
      Resume Text:
      ${resumeText}
      
      Return a JSON object with strictly this format:
      {
        "questions": [
          {
            "question": "The interview question here...",
            "answer": "The ideal answer here..."
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const jsonString = response.choices[0].message.content;
    return JSON.parse(jsonString).questions;
  } catch (error) {
    console.error("Interview Gen Error:", error);
    throw new Error("Failed to generate interview questions");
  }
}

export async function generateCoverLetter(resumeText, jobDescription) {
  try {
    const prompt = `
      You are an expert Career Coach and Copywriter.
      Based on the following Resume Text and Job Description, write a professional, confident, and highly tailored cover letter.
      Do not include placeholders for addresses. Start directly with "Dear Hiring Manager," or similar.
      Highlight specific skills and experiences from the resume that directly match the job description.
      Keep it to 3 or 4 paragraphs.
      
      Resume Text:
      ${resumeText}
      
      Job Description:
      ${jobDescription}
      
      Return a JSON object with strictly this format:
      {
        "coverLetter": "The full text of the cover letter..."
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      response_format: { type: "json_object" },
    });

    const jsonString = response.choices[0].message.content;
    return JSON.parse(jsonString).coverLetter;
  } catch (error) {
    console.error("Cover Letter Gen Error:", error);
    throw new Error("Failed to generate cover letter");
  }
}
