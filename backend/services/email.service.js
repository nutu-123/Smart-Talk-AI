const transporter = require('../config/email');

const sendVerificationEmail = async (email, name, token) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('⚠️  Email not configured - skipping verification email');
    return;
  }

  const verificationUrl = `http://localhost:5000/api/auth/verify-email/${token}`;
  
  try {
    const mailOptions = {
      from: {
        name: 'Smart Talk AI',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: '🚀 Verify Your Smart Talk AI Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🚀 Welcome to Smart Talk AI!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #667eea; margin-top: 0;">Hello ${name}! 👋</h2>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Thank you for joining <strong>Smart Talk AI</strong> - your next-generation AI intelligence platform!
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Please verify your email address by clicking the button below:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  ✅ Verify Email Address
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link in your browser:
              </p>
              <p style="color: #667eea; font-size: 13px; word-break: break-all;">
                ${verificationUrl}
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
                  This link expires in 24 hours for security reasons.
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #999; font-size: 12px;">
                © 2025 Smart Talk AI. All rights reserved.<br>
                Developed with ❤️ by Nutan Phadtare
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', email);
  } catch (emailError) {
    console.error('❌ Email send error:', emailError.message);
    console.error('   Make sure you are using Gmail App Password, not regular password!');
  }
};

module.exports = { sendVerificationEmail };