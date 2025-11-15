class GeminiProvider {
  constructor() {
    this.name = 'Gemini';
    this.apiKey = process.env.GEMINI_API_KEY;
    this.baseURL = 'https://generativelanguage.googleapis.com/v1';
    this.defaultModel = 'gemini-1.5-flash'; // FREE MODEL
  }

  async generateContent(prompt, model) {
    if (!this.apiKey) throw new Error('Gemini API key not configured');
    
    const useModel = model || this.defaultModel;
    
    const url = `${this.baseURL}/models/${useModel}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) throw new Error('No content in Gemini response');
    return text;
  }
}

module.exports = GeminiProvider;
