const Session = require('../models/Session');
const Message = require('../models/Message');
const User = require('../models/User');
const AIProviderManager = require('../services/ai/AIProviderManager');
const { generateTitle } = require('../utils/helpers');

const aiManager = new AIProviderManager();

exports.createSession = async (req, res) => {
  try {
    const sessionId = `session-${req.user._id}-${Date.now()}`;
    console.log('🆕 Creating session for user:', req.user._id);

    const session = new Session({
      userId: req.user._id,
      sessionId,
      title: 'New Chat',
      provider: 'gemini',
      model: 'gemini-1.5-flash' // UPDATED
    });

    await session.save();

    res.json({ 
      sessionId, 
      title: session.title,
      createdAt: session.createdAt
    });
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('sessionId title createdAt updatedAt messageCount provider')
      .limit(50)
      .lean();

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await Session.findOne({ 
      sessionId, 
      userId: req.user._id 
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const messages = await Message.find({ sessionId })
      .sort({ timestamp: 1 })
      .lean();

    res.json({ messages, session });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

exports.streamChat = async (req, res) => {
  console.log('\n🚀 ===== NEW CHAT REQUEST =====');
  
  try {
    const { message, sessionId, model } = req.body;

    console.log('📨 User:', req.user.name);
    console.log('📨 Message:', message);
    console.log('📨 Session:', sessionId);

    let session = await Session.findOne({ 
      sessionId, 
      userId: req.user._id 
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Save user message
    const userMessage = new Message({
      sessionId,
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    await userMessage.save();

    // Update session title if first message
    if (session.messageCount === 0) {
      session.title = generateTitle(message);
    }

    session.updatedAt = new Date();
    session.messageCount += 1;
    await session.save();

    // Setup SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = '';

    try {
      console.log('🤖 Calling AI providers with fallback (starting with Gemini)...');
      const aiResponse = await aiManager.generateContent(message, model);
      
      if (!aiResponse.content || aiResponse.content.trim() === '') {
        throw new Error('Empty response from AI');
      }

      fullResponse = aiResponse.content;
      console.log('✅ Got response, length:', fullResponse.length);
      console.log('✅ Provider used:', aiResponse.provider);

      // Stream the response
      for await (const chunk of aiManager.streamResponse(aiResponse.content)) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }

      // Save assistant message
      const assistantMessage = new Message({
        sessionId,
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
        provider: aiResponse.provider,
        model: aiResponse.model
      });
      await assistantMessage.save();

      // Update session
      session.messageCount += 1;
      session.provider = aiResponse.provider;
      session.model = aiResponse.model;
      session.updatedAt = new Date();
      await session.save();

      await User.findByIdAndUpdate(req.user._id, {
        $inc: { requestCount: 1 }
      });

      res.write('data: [DONE]\n\n');
      res.end();
      
      console.log('🎉 SUCCESS!');

    } catch (aiError) {
      console.error('❌ AI Error:', aiError.message);
      const errorMsg = `⚠️ AI Error: ${aiError.message}. Please try again.`;
      res.write(`data: ${JSON.stringify({ content: errorMsg })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    }

  } catch (error) {
    console.error('❌ Chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Chat failed: ' + error.message });
    }
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    await Session.deleteOne({ 
      sessionId, 
      userId: req.user._id 
    });
    
    await Message.deleteMany({ sessionId });

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Failed to delete session' });
  }
};

exports.updateSessionTitle = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;

    const session = await Session.findOneAndUpdate(
      { sessionId, userId: req.user._id },
      { title, updatedAt: new Date() },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ session });
  } catch (error) {
    console.error('Update title error:', error);
    res.status(500).json({ message: 'Failed to update title' });
  }
};

exports.clearChat = async (req, res) => {
  try {
    const { sessionId } = req.body;
    await Message.deleteMany({ sessionId });
    
    await Session.findOneAndUpdate(
      { sessionId, userId: req.user._id },
      { messageCount: 0, updatedAt: new Date() }
    );

    res.json({ message: 'Chat cleared successfully' });
  } catch (error) {
    console.error('Clear error:', error);
    res.status(500).json({ message: 'Failed to clear chat' });
  }
};

exports.getSuggestedPrompts = (req, res) => {
  const allPrompts = [
    { icon: "💡", text: "Explain quantum computing", category: "Learn" },
    { icon: "✍️", text: "Write a creative story", category: "Create" },
    { icon: "🔍", text: "Help debug my code", category: "Code" },
    { icon: "🌍", text: "Latest AI trends", category: "Explore" },
    { icon: "🎨", text: "Design a landing page", category: "Design" },
    { icon: "📊", text: "Analyze market trends", category: "Business" },
    { icon: "🧪", text: "Chemistry experiment ideas", category: "Science"},
    { icon: "🤖", text: "Build a chatbot using Python", category: "Code" },
    { icon: "🧠", text: "Learn neural networks in simple terms", category: "Learn" },
    { icon: "📱", text: "Design a mobile app UI", category: "Design" },
    { icon: "🗣️", text: "Practice English speaking skills", category: "Learn" },
    { icon: "🚀", text: "Generate startup ideas", category: "Business" },
    { icon: "🎬", text: "Write a short film script", category: "Create" },
    { icon: "📚", text: "Summarize this research paper", category: "Learn" },
    { icon: "💼", text: "Prepare for a job interview", category: "Career" },
    { icon: "🧮", text: "Solve a statistics problem", category: "Science" },
    { icon: "🖥️", text: "Explain cloud computing basics", category: "Learn" },
    { icon: "🎧", text: "Recommend productivity playlists", category: "Explore" },
    { icon: "💬", text: "Write LinkedIn post ideas", category: "Create" },
    { icon: "📈", text: "Predict stock market trends", category: "Business" },
    { icon: "⚙️", text: "Optimize my backend API", category: "Code" },
    { icon: "🌐", text: "Explain web development roadmap", category: "Learn" },
    { icon: "🧩", text: "Brainstorm app feature ideas", category: "Design" },
    { icon: "🕹️", text: "Design a simple game concept", category: "Create" },
    { icon: "💻", text: "Fix performance issues in React", category: "Code" },
    { icon: "🪐", text: "Discover space exploration facts", category: "Explore" },
    { icon: "🧭", text: "Plan my learning roadmap", category: "Career" }
  ];
   const now = new Date();
  const seed = now.getHours() * 60 + Math.floor(now.getMinutes() / 15);
  const startIndex = (seed % (allPrompts.length - 3));
  const selectedPrompts = allPrompts.slice(startIndex, startIndex + 4);

  res.json({ prompts: selectedPrompts });
};