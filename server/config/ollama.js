const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

const queryOllama = async (prompt, model = 'llama3.2') => {
  try {
    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: model,
      prompt: prompt,
      stream: false,
      format: 'json' // Forces Ollama to reply in strict JSON format
    });
    return JSON.parse(response.data.response);
  } catch (error) {
    console.error('Ollama API Error:', error.message);
    throw new Error('Failed to communicate with local AI model');
  }
};

module.exports = { queryOllama };