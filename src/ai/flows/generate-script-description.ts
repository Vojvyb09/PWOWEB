// The directive tells the Next.js runtime that it should only be executed on the server.
'use server';

/**
 * @fileOverview AI-powered script description generator.
 *
 * - generateScriptDescription - A function that generates a script description using AI.
 * - GenerateScriptDescriptionInput - The input type for the generateScriptDescription function.
 * - GenerateScriptDescriptionOutput - The return type for the generateScriptDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScriptDescriptionInputSchema = z.object({
  codebase: z
    .string()
    .describe('The codebase of the script for which to generate a description.'),
  instructions: z
    .string()
    .describe(
      'Any additional instructions or context from the manager to guide the description generation.'
    ),
});
export type GenerateScriptDescriptionInput = z.infer<
  typeof GenerateScriptDescriptionInputSchema
>;

const GenerateScriptDescriptionOutputSchema = z.object({
  description: z
    .string()
    .describe('The AI-generated description of the script.'),
});
export type GenerateScriptDescriptionOutput = z.infer<
  typeof GenerateScriptDescriptionOutputSchema
>;

export async function generateScriptDescription(
  input: GenerateScriptDescriptionInput
): Promise<GenerateScriptDescriptionOutput> {
  return generateScriptDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScriptDescriptionPrompt',
  input: {schema: GenerateScriptDescriptionInputSchema},
  output: {schema: GenerateScriptDescriptionOutputSchema},
  prompt: `You are an AI assistant designed to generate script descriptions.

Based on the provided codebase and manager instructions, create a concise and informative description of the script's functionality.

Codebase:
\`\`\`
{{{codebase}}}
\`\`\`

Instructions:
{{instructions}}

Description:`,
});

const generateScriptDescriptionFlow = ai.defineFlow(
  {
    name: 'generateScriptDescriptionFlow',
    inputSchema: GenerateScriptDescriptionInputSchema,
    outputSchema: GenerateScriptDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
