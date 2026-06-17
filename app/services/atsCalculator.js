export function calculateATSScore(resumeData) {
  let score = 0;
  const breakdown = {
    skills: 0,
    experience: 0,
    projects: 0,
    education: 0,
    summary: 0,
  };

  // 1. Skills Scoring (Max 30 points)
  // Har ek skill mate 2 point, max 15 skills
  if (resumeData.skills && Array.isArray(resumeData.skills)) {
    const skillPoints = Math.min(resumeData.skills.length * 2, 30);
    score += skillPoints;
    breakdown.skills = skillPoints;
  }

  // 2. Experience Scoring (Max 30 points)
  // Har ek job role mate 10 point
  if (resumeData.experience && Array.isArray(resumeData.experience)) {
    const expPoints = Math.min(resumeData.experience.length * 10, 30);
    score += expPoints;
    breakdown.experience = expPoints;
  }

  // 3. Projects Scoring (Max 20 points)
  // Har ek project mate 10 point
  if (resumeData.projects && Array.isArray(resumeData.projects)) {
    const projPoints = Math.min(resumeData.projects.length * 10, 20);
    score += projPoints;
    breakdown.projects = projPoints;
  }

  // 4. Education Scoring (Max 10 points)
  // Jo education hoy to 10 point madi jase
  if (resumeData.education && Array.isArray(resumeData.education) && resumeData.education.length > 0) {
    score += 10;
    breakdown.education = 10;
  }

  // 5. Summary / Keywords Scoring (Max 10 points)
  // Jo professional summary lakhi hoy to 10 point
  if (resumeData.summary && resumeData.summary.length > 20) {
    score += 10;
    breakdown.summary = 10;
  }

  return {
    totalScore: score,
    breakdown: breakdown
  };
}
