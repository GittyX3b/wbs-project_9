import { OPENAI_API_KEY, OPENAI_MODEL } from '#config';
import { aiSummarySchema, promptBodySchema } from '#schemas';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import z from 'zod';

const isDev = process.env.NODE_ENV === 'development';

const client = new OpenAI({
  apiKey: isDev ? process.env.LOCAL_LLM_KEY : OPENAI_API_KEY,
  baseURL: isDev ? process.env.LOCAL_LLM_URL : undefined
});

type PromptBody = z.infer<typeof promptBodySchema>;

/**
 * Generates a narrative description of an area using AI.
 */
export async function generateAiText(data: PromptBody): Promise<string> {
  const input = promptBodySchema.parse(data);

  // Compute numeric features for AI input
  const features = areaFeatures(input);

  const model = isDev ? (process.env.LOCAL_LLM_MODEL ?? 'llama3.2:3b') : OPENAI_MODEL;

  //Create AI response
  const response = await client.responses.create({
    model,
    input: [
      {
        role: 'system',
        content: `
          You are an expert who interprets maps.
          Your mission: Describe the personality of the area using a welcoming and narrative tone.
          Context:
            - If the green/building ratio is high, it describes a rural area.
            - If the number of buildings and streets is predominant, it describes an urban area.
          Provide your output strictly as JSON matching the SummarySchema.
        `
      },
      {
        role: 'user',
        content: JSON.stringify(features, null, 2)
      }
    ],
    text: { format: zodTextFormat(aiSummarySchema, 'SummarySchema') },
    temperature: 0,
    max_output_tokens: 150
  });

  const parsedData = JSON.parse(response.output_text);

  return parsedData.response;
}
/**
 * Computes numeric features of the area for AI input.
 * Includes raw counts and derived ratios.
 */
function areaFeatures(input: PromptBody) {
  const greenAreaToBuildingRatio = input.buildingCount > 0 ? input.greenCount / input.buildingCount : 0;
  const roadToBuildingRatio = input.buildingCount > 0 ? input.roadCount / input.buildingCount : 0;

  return {
    ...input,
    greenAreaToBuildingRatio,
    roadToBuildingRatio
  };
}
