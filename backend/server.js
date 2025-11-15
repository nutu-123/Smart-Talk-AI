const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./config/database');
const limiter = require('./middleware/rateLimiter');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const testRoutes = require('./routes/test.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api', testRoutes);

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║     🚀 SMART TALK AI SERVER READY 🚀    ║`);
    console.log(`╚════════════════════════════════════════╝`);
    console.log(`\n📡 Port: ${PORT}`);
    console.log(`🤖 Multi-Provider AI: ACTIVE (Gemini First)`);
    console.log(`📧 Email Service: ${process.env.EMAIL_USER && process.env.EMAIL_PASSWORD ? 'CONFIGURED ✅' : 'NOT SET ❌'}`);
    console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'CONFIGURED ✅' : 'NOT SET ❌'}`);
    console.log(`\n🔑 AI Providers (Priority Order):`);
    console.log(`   1️⃣ Gemini: ${process.env.GEMINI_API_KEY ? '✅ (DEFAULT)' : '❌'}`);
    console.log(`   2️⃣ OpenAI: ${process.env.OPENAI_API_KEY ? '✅ (FALLBACK)' : '❌'}`);
    console.log(`   3️⃣ Cohere: ${process.env.COHERE_API_KEY ? '✅ FREE (BACKUP)' : '❌'}`);
    console.log(`\n📝 Test Endpoints:`);
    console.log(`   • http://localhost:${PORT}/api/test`);
    console.log(`   • http://localhost:${PORT}/api/test-ai`);
    console.log(`\n════════════════════════════════════════\n`);
  });
});