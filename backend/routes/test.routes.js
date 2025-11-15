const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AIProviderManager = require('../services/ai/AIProviderManager');
const chatController = require('../controllers/chat.controller');

const aiManager = new AIProviderManager();

router.get('/test', (req, res) => {
  res.json({ 
    message: 'Smart Talk AI Backend Running!', 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌',
    providers: {
      gemini: process.env.GEMINI_API_KEY ? 'Configured ✅' : 'Not configured ❌',
      openai: process.env.OPENAI_API_KEY ? 'Configured ✅' : 'Not configured ❌',
      cohere: process.env.COHERE_API_KEY ? 'Configured ✅' : 'Not configured ❌'
    },
    emailService: process.env.EMAIL_USER && process.env.EMAIL_PASSWORD ? 'Configured ✅' : 'Not configured ❌',
    version: '2.0.0'
  });
});

router.get('/test-ai', async (req, res) => {
  try {
    console.log('\n🧪 ===== TESTING AI PROVIDERS =====');
    const result = await aiManager.generateContent('Say hello in 5 words');
    console.log('===== TEST PASSED ✅ =====\n');
    
    res.json({ 
      success: true, 
      response: result.content,
      provider: result.provider,
      model: result.model,
      message: 'AI System is working perfectly! 🎉'
    });
  } catch (error) {
    console.error('❌ Test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/prompts/suggested', chatController.getSuggestedPrompts);

module.exports = router;