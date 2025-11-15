import React, { useEffect, useState } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { chatService } from '../../services/chat.service';
import { SUGGESTED_PROMPTS } from '../../utils/constants';

export default function SuggestedPrompts({ onSelectPrompt }) {
  const { darkMode } = useTheme();
  const [prompts, setPrompts] = useState(SUGGESTED_PROMPTS);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const data = await chatService.getSuggestedPrompts();
      if (data.prompts) {
        setPrompts(data.prompts);
      }
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-6 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className={`text-4xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            How can I help you today?
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Powered by multiple AI providers for maximum reliability
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {prompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => onSelectPrompt(prompt.text)}
              className={`group p-5 rounded-xl text-left transition-all hover:scale-105 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'
              } border shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl">{prompt.icon}</span>
                <div className="flex-1">
                  <p className={`text-xs font-bold mb-1 uppercase tracking-wide ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {prompt.category}
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {prompt.text}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}