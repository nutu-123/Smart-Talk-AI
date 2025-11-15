const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smarttalk-ai';
    
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`);
    
    // Verify connection
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to DB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected');
    });
    
    // Test by listing collections
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`📂 Collections: ${collections.map(c => c.name).join(', ') || 'none yet'}`);
    } catch (error) {
      console.error('❌ Cannot list collections:', error.message);
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('💡 Check your MONGODB_URI in .env file');
    process.exit(1);
  }
};

module.exports = connectDB;