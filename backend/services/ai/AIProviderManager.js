const GeminiProvider = require('./GeminiProvider');
const OpenAIProvider = require('./OpenAIProvider');
const CohereProvider = require('./CohereProvider');
const { cleanMarkdownFormatting } = require('../../utils/formatters');

class AIProviderManager {
  constructor() {
    this.providers = [
      new GeminiProvider(),
      new OpenAIProvider(),
      new CohereProvider()
    ];
    this.currentProviderIndex = 0;
  }

  async generateContent(prompt, requestedModel = null) {
    let lastError = null;
    const attemptedProviders = [];
    
    this.currentProviderIndex = 0;
    
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[this.currentProviderIndex];
      attemptedProviders.push(provider.name);
      
      try {
        console.log(`🔵 Attempting provider: ${provider.name} (${i + 1}/${this.providers.length})`);
        
        const modelToUse = requestedModel && requestedModel !== 'auto' 
          ? requestedModel 
          : provider.defaultModel;
        
        console.log(`   Using model: ${modelToUse}`);
        
        const result = await provider.generateContent(prompt, modelToUse);
        console.log(`✅ Success with ${provider.name}`);
        
        const cleanedResult = cleanMarkdownFormatting(result);
        
        return { 
          content: cleanedResult, 
          provider: provider.name, 
          model: modelToUse 
        };
      } catch (error) {
        console.error(`❌ ${provider.name} failed:`, error.message);
        lastError = error;
        
        this.currentProviderIndex = (this.currentProviderIndex + 1) % this.providers.length;
        
        if (i < this.providers.length - 1) {
          console.log(`🔄 Falling back to next provider...`);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }
    
    throw new Error(`All AI providers failed (${attemptedProviders.join(', ')}). Last error: ${lastError?.message}`);
  }

  async *streamResponse(text) {
    const chunkSize = 5;
    for (let i = 0; i < text.length; i += chunkSize) {
      yield text.slice(i, i + chunkSize);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  }
}

module.exports = AIProviderManager;