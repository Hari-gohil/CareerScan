require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const jwt = require('jsonwebtoken');

async function test() {
  const token = jwt.sign(
    { userId: '6a323f9d19b1f1726ba21f86', email: 'test@example.com' }, // using report id as user id temporarily to bypass auth check? Wait, the report's userId must match the token's userId.
    process.env.JWT_SECRET || 'secret_key_aise_hi', 
    { expiresIn: '7d' }
  );

  // We actually need the correct userId for the report.
  // I will just read it from the database first.
  const mongoose = require('mongoose');
  await mongoose.connect(process.env.MONGODB_URI);
  const Report = require('./app/models/Report').default;
  const report = await Report.findOne({ _id: '6a323f9d19b1f1726ba21f86' });
  mongoose.disconnect();

  if (!report) {
    console.log("Report not found in DB.");
    return;
  }

  const realToken = jwt.sign(
    { userId: report.userId.toString(), email: 'test@example.com' },
    process.env.JWT_SECRET || 'secret_key_aise_hi', 
    { expiresIn: '7d' }
  );

  try {
    const res = await fetch('http://localhost:3000/api/reports/6a323f9d19b1f1726ba21f86/match', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': `auth_token=${realToken}`
      },
      body: JSON.stringify({ jobDescription: 'Test full stack Next.js react node' })
    });

    const data = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

test();
