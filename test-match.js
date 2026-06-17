require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const mongoose = require('mongoose');

// We have to dynamically import aiAnalyzer because it's ES module? 
// No, it's inside Next.js, so we can't easily require it in Node.
// Let's just make the OpenAI call directly here to see if it fails.
const { OpenAI } = require('openai');

async function test() {
  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  try {
    const prompt = "You are an ATS. Give me { \"matchPercentage\": 85, \"matchAnalysis\": \"test\" }";
    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const jsonString = response.choices[0].message.content;
    console.log("Response:", jsonString);
  } catch (err) {
    console.error("Groq API Error:", err);
  }
}

test();
