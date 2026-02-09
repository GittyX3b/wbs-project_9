import { OPENAI_API_KEY, OPENAI_MODEL } from '#config';
import { aiSummarySchema } from '#schemas';
import type { PromptBody } from '#types';

import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';

const isDev = process.env.NODE_ENV === 'development';

const client = new OpenAI({
  apiKey: isDev ? process.env.LOCAL_LLM_KEY : OPENAI_API_KEY,
  baseURL: isDev ? process.env.LOCAL_LLM_URL : undefined
});

/**
 * Generates a narrative description of an area using AI.
 */
export async function generateAiText(stats: PromptBody): Promise<string> {
  const model = isDev ? (process.env.LOCAL_LLM_MODEL ?? 'llama3.2:3b') : OPENAI_MODEL;

  const prompt = `
    You are an expert in urban data analysis and tourism guidance.

    TASK:
    Write a factual, visitor-focused description of a zone using ONLY the provided numeric data.

    RULES:
    - Do NOT use scientific notation
    - Do NOT classify the zone (urban/suburban/rural)
    - Do NOT invent landmarks or data
    - Focus on spatial layout, green spaces, water presence, climate, and amenities
    - Keep text factual, clear, and readable


    STRUCTURE:
    - 3 short paragraphs:
      1. Spatial and building info
      2. Green spaces, water, climate
      3. Food options and elevation/terrain
    - Neutral, factual tone appropriate for a visitor guide.

    OUTPUT:
    - JSON only
    - Must match SummarySchema exactly
    - Example:
    {
      "text": "Paragraph 1. Paragraph 2. Paragraph 3."
    }
    `;
  //Create AI response with structured output using zod schema for validation
  const response = await client.responses.create({
    model,
    input: [
      { role: 'system', content: prompt },
      {
        role: 'user',
        content: JSON.stringify(stats, null, 2)
      }
    ],
    text: { format: zodTextFormat(aiSummarySchema, 'SummarySchema') },
    temperature: 0,
    max_output_tokens: 250
  });

  const parsedData = JSON.parse(response.output_text);

  return parsedData.response;
}
