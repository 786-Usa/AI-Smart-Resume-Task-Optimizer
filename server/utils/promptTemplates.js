const getResumeAnalysisPrompt = (resumeText, jobDescription) => `
You are an expert AI Career Coach. Analyze this resume against the job description.

Resume: ${resumeText}
Job Description: ${jobDescription}

Respond strictly in JSON format matching this schema:
{
  "matchScore": <number between 0 and 100>,
  "missingSkills": [<array of strings>],
  "improvements": [<array of specific resume edit suggestions>],
  "actionTasks": [<array of actionable self-study, learning, or project setup tasks for the APPLICANT to bridge skill gaps>]
}
`;
const getBulletRewritePrompt = (currentBullet, missingSkill) => `
You are an ATS Resume Specialist. Rewrite the following resume bullet point to highlight the target missing skill.
Use Google's X-Y-Z formula: "Accomplished [X], as measured by [Y], by doing [Z]".

Original Bullet: "${currentBullet}"
Target Skill to Highlight: "${missingSkill}"

Respond strictly in JSON format matching this schema:
{
  "suggestions": [
    "<Rewritten bullet point option 1>",
    "<Rewritten bullet point option 2>",
    "<Rewritten bullet point option 3>"
  ]
}
`;
const getCvTemplatePrompt = (resumeText, missingSkills, improvements) => `
You are an expert Resume Designer and ATS Architect. 
Reformat the provided resume into a polished, high-impact CV structure. 
Specifically integrate ATS-optimized phrasing for these target missing skills: ${missingSkills.join(', ')}.
Incorporate these improvement suggestions: ${improvements.join('; ')}.

Resume Text: ${resumeText}

Respond strictly in JSON format matching this schema:
{
  "personalInfo": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "github": "" },
  "summary": "<2-3 sentence impact summary tailored for target role>",
  "skills": {
    "technical": [<array of technical skills>],
    "frameworks": [<array of frameworks>],
    "tools": [<array of tools/platforms>]
  },
  "experience": [
    {
      "role": "",
      "company": "",
      "duration": "",
      "bullets": [<array of 3-4 achievement bullets utilizing X-Y-Z formula and incorporating target skills>]
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [<array of tech stack items>]
    }
  ]
}
`;

module.exports = { getResumeAnalysisPrompt, getBulletRewritePrompt, getCvTemplatePrompt };