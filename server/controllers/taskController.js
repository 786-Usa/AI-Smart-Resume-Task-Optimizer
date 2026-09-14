const Analysis = require('../models/Analysis');

// GET /api/resume/tasks - Fetch latest analysis for logged-in user
const getTasks = async (req, res) => {
  try {
    const latestAnalysis = await Analysis.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: latestAnalysis || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/resume/history - Fetch past runs for logged-in user
const getHistory = async (req, res) => {
  try {
    const history = await Analysis.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('matchScore missingSkills createdAt');
      
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/resume/tasks/:analysisId/:taskId - Toggle completed status
const toggleTask = async (req, res) => {
  try {
    const { analysisId, taskId } = req.params;

    const analysis = await Analysis.findById(analysisId);
    if (!analysis) return res.status(404).json({ error: 'Analysis record not found' });

    const task = analysis.actionTasks.id(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.completed = !task.completed;
    await analysis.save();

    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { getTasks, toggleTask, getHistory };