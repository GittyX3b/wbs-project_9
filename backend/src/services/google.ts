import { GoogleGenAI } from '@google/genai';
import type { PromptBody } from '#types';
import { GEMINI_API_KEY } from '#config';
import { prompt } from '#utils';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateGoogleAiText(stats: PromptBody): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt() }]
      },
      {
        role: 'user',
        parts: [{ text: JSON.stringify(stats, null, 2) }]
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          summary: { type: 'string' }
        },
        required: ['summary']
      }
    }
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No content returned from Google GenAI');

  return JSON.parse(text).summary;
}
