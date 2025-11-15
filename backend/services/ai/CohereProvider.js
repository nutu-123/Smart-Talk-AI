// backend/providers/CohereProvider.js

class CohereProvider {
  constructor() {
    this.name = 'Cohere';
    this.apiKey = process.env.COHERE_API_KEY;
    this.baseURL = 'https://api.cohere.ai/v1';
    this.defaultModel = 'command-a-03-2025'; // ✅ Latest model (Nov 2025)
  }

  async generateContent(prompt, model) {
    // 🧩 Check for API key
    if (!this.apiKey) {
      throw new Error('Cohere API key not configured');
    }

    // 🧩 Validate the prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('Invalid prompt: must be a non-empty string');
    }

    const useModel = model || this.defaultModel;

    try {
      // ✅ Correct Cohere request format for "command-a" models
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: useModel,
          message: prompt.trim(),   // ✅ Cohere expects single "message"
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cohere API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // ✅ Handle all possible Cohere response formats
      const text =
        data?.text ||
        data?.message ||
        data?.generations?.[0]?.text ||
        data?.output?.text;

      if (!text) {
        throw new Error('No content in Cohere response');
      }

      return text;
    } catch (err) {
      console.error('⚠️ Cohere Provider Error:', err.message);
      throw err;
    }
  }
}

module.exports = CohereProvider;
 