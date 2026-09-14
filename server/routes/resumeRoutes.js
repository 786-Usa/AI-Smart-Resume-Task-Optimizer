const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getTasks, toggleTask, getHistory } = require('../controllers/taskController');
const { analyzeResume, improveBullet, generateCvTemplate } = require('../controllers/resumeController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// POST /api/resume/generate-template
router.post('/generate-template', generateCvTemplate);
// GET /api/resume/history
router.get('/history', getHistory);
// POST /api/resume/improve-bullet
router.post('/improve-bullet', improveBullet);
router.post('/analyze', upload.single('resumeFile'), analyzeResume);
router.get('/tasks', getTasks);
router.patch('/tasks/:analysisId/:taskId', toggleTask);

module.exports = router;