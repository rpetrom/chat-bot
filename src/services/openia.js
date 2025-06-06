import axios from "axios";
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
});
export function sendMessageToOpenAI(messages) {
  return openai.post('/chat/completions', {
    model: 'gpt-4o-mini',
    messages: messages,
    temperature: 0.5,
    max_tokens:800,
  });
}