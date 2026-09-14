const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  matchScore: { type: Number, required: true },
  missingSkills: [String],
  improvements: [String],
  actionTasks: [
    {
      title: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);