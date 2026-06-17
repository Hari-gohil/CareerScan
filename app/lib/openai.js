import OpenAI from 'openai';

// 1. OpenAI nu instance banavvu, jethi badha files ma alag thi na banavvu pade
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;
