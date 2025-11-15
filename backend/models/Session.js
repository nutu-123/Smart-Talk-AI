const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String, required: true, unique: true },
  title: { type: String, default: 'New Chat' },
  provider: { type: String, default: 'gemini' },
  model: { type: String, default: 'gemini-1.5-flash' }, // UPDATED
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  messageCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Session', sessionSchema);