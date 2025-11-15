const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  role: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  provider: String,
  model: String
});

module.exports = mongoose.model('Message', messageSchema);