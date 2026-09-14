const PDFParser = require('pdf2json');
const { getCvTemplatePrompt } = require('../utils/promptTemplates');
const Analysis = require('../models/Analysis');
const { queryOllama } = require('../config/ollama');
const { getBulletRewritePrompt } = require('../utils/promptTemplates');
const { getResumeAnalysisPrompt } = require('../utils/promptTemplates');

const parsePdfBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);
    pdfParser.on('pdfParser_dataError', (errData) => reject(errData.parserError));
    pdfParser.on('pdfParser_dataReady', () => resolve(pdfParser.getRawTextContent()));
    pdfParser.parseBuffer(buffer);
  });
};

const analyzeResume = async (req, res) => {
  try {
    let resumeText = req.body.resumeText;
    const { jobDescription } = req.body;

    if (req.file) {
      resumeText = await parsePdfBuffer(req.file.buffer);
    }

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Missing resume file/text or job description' });
    }

    const prompt = getResumeAnalysisPrompt(resumeText, jobDescription);
    const aiResponse = await queryOllama(prompt, 'llama3.2');

    const formattedTasks = (aiResponse.actionTasks || []).map((taskTitle) => ({
      title: taskTitle,
      completed: false
    }));

    // Save resumeText along with the analysis metrics
    const newAnalysis = await Analysis.create({
      resumeText: resumeText, // Added field
      matchScore: aiResponse.matchScore,
      missingSkills: aiResponse.missingSkills,
      improvements: aiResponse.improvements,
      actionTasks: formattedTasks
    });

    res.status(200).json({ success: true, data: newAnalysis });
  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const improveBullet = async (req, res) => {
  try {
    const { currentBullet, missingSkill } = req.body;

    if (!currentBullet || !missingSkill) {
      return res.status(400).json({ error: 'Missing bullet text or target skill' });
    }

    const prompt = getBulletRewritePrompt(currentBullet, missingSkill);
    const aiResponse = await queryOllama(prompt, 'llama3.2');

    res.status(200).json({ success: true, data: aiResponse.suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const generateCvTemplate = async (req, res) => {
  try {
    const { resumeText, missingSkills = [], improvements = [] } = req.body;

    if (!resumeText) {
      return res.status(400).json({ error: 'Missing resume content' });
    }

    const prompt = getCvTemplatePrompt(resumeText, missingSkills, improvements);
    const aiResponse = await queryOllama(prompt, 'llama3.2');

    res.status(200).json({ success: true, data: aiResponse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { analyzeResume, improveBullet, generateCvTemplate };