import React, { useState } from 'react';
import { Brain, Cpu, ChevronRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { chatService } from '../../services/chat.service';
import ThemeToggle from '../common/ThemeToggle';
import Logo from '../common/Logo';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

export default function AuthLayout() {
  const { darkMode } = useTheme();
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState('signin');
  const [authData, setAuthData] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    phone: '', 
    country: '' 
  });

  const handleAuth = async () => {
    if (!authData.email || !authData.password) {
      alert('Please fill in all required fields');
      return;
    }
    if (authMode === 'signup' && !authData.name) {
      alert('Please enter your name');
      return;
    }
    
    try {
      let data;
      if (authMode === 'signin') {
        data = await authService.signin(authData);
      } else {
        data = await authService.signup(authData);
      }
      
      if (data.token) {
        login(data.token, data.user);
        
        if (authMode === 'signup' && data.message) {
          alert(data.message);
        }
      } else {
        alert(data.message || 'Authentication failed');
      }
    } catch (error) {
      alert('Cannot connect to backend. Please ensure the server is running.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAuth();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'} flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`}>
      <div className="absolute inset-0">
        <div className={`absolute top-20 left-20 w-72 h-72 ${darkMode ? 'bg-purple-500' : 'bg-purple-300'} rounded-full mix-blend-multiply filter blur-xl ${darkMode ? 'opacity-20' : 'opacity-30'} animate-blob`}></div>
        <div className={`absolute top-40 right-20 w-72 h-72 ${darkMode ? 'bg-blue-500' : 'bg-blue-300'} rounded-full mix-blend-multiply filter blur-xl ${darkMode ? 'opacity-20' : 'opacity-30'} animate-blob animation-delay-2000`}></div>
        <div className={`absolute bottom-20 left-1/2 w-72 h-72 ${darkMode ? 'bg-pink-500' : 'bg-pink-300'} rounded-full mix-blend-multiply filter blur-xl ${darkMode ? 'opacity-20' : 'opacity-30'} animate-blob animation-delay-4000`}></div>
      </div>

      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className={`${darkMode ? 'text-white' : 'text-gray-900'} space-y-6`}>
            <div className="mb-8">
              <Logo />
            </div>

            <div className="text-center md:text-left space-y-4">
              <div className="space-y-2">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Smart Talk AI
                </h1>
                <p className={`text-xl ${darkMode ? 'text-purple-300' : 'text-purple-600'} font-semibold`}>
                  Next-Generation Intelligence
                </p>
              </div>

              <div className={`space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed`}>
                <p className="flex items-start gap-3">
                  <Brain className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
                  <span>Experience cutting-edge AI with multi-provider fallback system ensuring 99.9% uptime and intelligent responses.</span>
                </p>
                <p className="flex items-start gap-3">
                  <Cpu className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                  <span>Powered by Gemini, OpenAI, and Cohere - seamlessly switching to ensure you always get the best response.</span>
                </p>
                <p className="flex items-start gap-3">
                  <ChevronRight className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                  <span>Lightning-fast streaming responses, smart context retention, and unlimited conversations - completely free.</span>
                </p>
              </div>

              <div className="pt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${darkMode ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-300'}`}>
                  ✓ Multi-AI Powered
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${darkMode ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-300'}`}>
                  ✓ 99.9% Uptime
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${darkMode ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-300'}`}>
                  ✓ Enterprise Grade
                </span>
              </div>
            </div>
          </div>

          <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'} backdrop-blur-xl rounded-2xl p-8 shadow-2xl border`}>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  authMode === 'signin'
                    ? darkMode 
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'bg-purple-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-white hover:bg-white/10'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  authMode === 'signup'
                    ? darkMode 
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'bg-purple-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-white hover:bg-white/10'
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Sign Up for Free
              </button>
            </div>

            {authMode === 'signin' ? (
              <SignInForm 
                authData={authData}
                setAuthData={setAuthData}
                onSubmit={handleAuth}
                onKeyPress={handleKeyPress}
              />
            ) : (
              <SignUpForm 
                authData={authData}
                setAuthData={setAuthData}
                onSubmit={handleAuth}
                onKeyPress={handleKeyPress}
              />
            )}

            <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-6`}>
              {authMode === 'signin' ? "New here? " : "Already have an account? "}
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className={`${darkMode ? 'text-purple-300 hover:text-white' : 'text-purple-600 hover:text-purple-700'} font-semibold`}
              >
                {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>

            <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <p className={`text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                © 2025 Smart Talk AI. All rights reserved.
              </p>
              <p className={`text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} mt-1`}>
                Developed with ❤️ by <span className="font-semibold text-purple-400">Nutan Phadtare</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}