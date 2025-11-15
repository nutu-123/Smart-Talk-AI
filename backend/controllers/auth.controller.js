const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/email.service');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, country } = req.body;

    console.log('📝 Signup attempt:', { name, email, phone, country });

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️ User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      phone,
      country,
      verificationToken
    });
    
    console.log('💾 Saving user to database...');
    await user.save();
    console.log('✅ User saved successfully:', user._id);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    await sendVerificationEmail(email, name, verificationToken);

    res.status(201).json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        isVerified: user.isVerified 
      },
      message: 'Signup successful! Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔑 Signin attempt:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('⚠️ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User found:', user._id);

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('⚠️ Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    console.log('✅ Login successful:', email);

    res.json({
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        isVerified: user.isVerified 
      }
    });
  } catch (error) {
    console.error('❌ Signin error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Verification Failed</title>
        </head>
        <body style="font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5;">
          <div style="background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #e74c3c;">❌ Invalid or Expired Token</h2>
            <p style="color: #666;">This verification link is invalid or has expired.</p>
            <p style="color: #666;">Please request a new verification email.</p>
          </div>
        </body>
        </html>
      `);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Email Verified</title>
      </head>
      <body style="font-family: Arial; text-align: center; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; padding: 40px; border-radius: 10px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 20px rgba(0,0,0,0.2);">
          <div style="font-size: 60px; margin-bottom: 20px;">✅</div>
          <h2 style="color: #27ae60; margin-top: 0;">Email Verified Successfully!</h2>
          <p style="color: #333; font-size: 18px;">Your Smart Talk AI account is now active.</p>
          <p style="color: #666;">You can close this window and return to the app.</p>
          <a href="http://localhost:3000" style="display: inline-block; margin-top: 20px; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Go to Smart Talk AI
          </a>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).send('Verification failed');
  }
};