/**
 * @fileOverview AI-powered script description generator.
 *
 * - generateScriptDescription - A function that generates a script description using AI.
 * - GenerateScriptDescriptionInput - The input type for the generateScriptDescription function.
 * - GenerateScriptDescriptionOutput - The return type for the generateScriptDescription function.
 */

import {z} from 'zod';

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

export function generateScriptDescription(
  input: GenerateScriptDescriptionInput
): GenerateScriptDescriptionOutput {
  // Mock AI response for static export
  const keywords = input.codebase.toLowerCase();
  let description = "This script handles ";
  
  if (keywords.includes('automation')) {
    description += "automation tasks and workflow management";
  } else if (keywords.includes('data')) {
    description += "data processing and analysis";
  } else if (keywords.includes('report')) {
    description += "report generation and formatting";
  } else if (keywords.includes('email')) {
    description += "email communication and notifications";
  } else {
    description += "general operational tasks";
  }
  
  if (input.instructions) {
    description += `. ${input.instructions}`;
  }
  
  return { description };
}
