const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  getTasks,
  toggleTask,
  getHistory,
} = require("../controllers/taskController");
const {
  analyzeResume,
  improveBullet,
  generateCvTemplate,
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/analyze", protect, upload.single("resumeFile"), analyzeResume);
router.get("/tasks", protect, getTasks);
router.patch("/tasks/:analysisId/:taskId", protect, toggleTask);
router.get("/history", protect, getHistory);
router.post("/improve-bullet", protect, improveBullet);
router.post("/generate-template", protect, generateCvTemplate);

module.exports = router;
