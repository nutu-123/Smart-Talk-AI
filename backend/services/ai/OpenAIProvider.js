class OpenAIProvider {
  constructor() {
    this.name = 'OpenAI';
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1';
    this.defaultModel = 'gpt-4o-mini'; // UPDATED MODEL (cheaper and faster)
  }

  async generateContent(prompt, model) {
    if (!this.apiKey) throw new Error('OpenAI API key not configured');
    
    const useModel = model || this.defaultModel;
    
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: useModel,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    
    if (!text) throw new Error('No content in OpenAI response');
    return text;
  }
}

module.exports = OpenAIProvider;