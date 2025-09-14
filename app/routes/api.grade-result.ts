import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

const ScreenshotComparisonSchema = z.object({
  similarity: z.number().min(1).max(100).describe('Similarity percentage from 1-100 where 100 is exactly the same'),
  reasoning: z.string().describe('Detailed reasoning explaining the comparison analysis'),
});

export async function action({ context, request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();

    const targetScreenshot = formData.get('targetScreenshot') as File;
    const resultScreenshot = formData.get('resultScreenshot') as File;

    // Validate that both files are provided
    if (!targetScreenshot || !resultScreenshot) {
      return new Response(JSON.stringify({
        error: 'Both targetScreenshot and resultScreenshot files are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate file types
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(targetScreenshot.type) || !allowedTypes.includes(resultScreenshot.type)) {
      return new Response(JSON.stringify({
        error: 'Only PNG and JPEG image files are supported'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Convert files to base64
    const targetBuffer = await targetScreenshot.arrayBuffer();
    const resultBuffer = await resultScreenshot.arrayBuffer();

    const targetBase64 = Buffer.from(targetBuffer).toString('base64');
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');

    // System prompt for screenshot comparison
    const systemPrompt = `
You are an expert UI/UX evaluator specializing in visual design comparison. Your task is to compare two screenshots: a target design and a result implementation.

For the result YOU WILL ONLY compare the small window on the right side since a screenshot of the useres whole screen is sent. Ignore everything except that viretual environment on the right.

Analyze these key aspects:
1. **Layout & Structure**: Overall positioning, grid alignment, spacing between elements
2. **Visual Design**: Colors, fonts, sizes, shadows, borders, gradients
3. **Content Accuracy**: Text content, images, icons, buttons
4. **Responsive Design**: How elements are positioned relative to each other
5. **Visual Hierarchy**: Emphasis, contrast, visual flow
6. **Pixel Perfection**: Exact positioning, margins, padding
8. **Overall Polish**: Professional appearance, attention to detail

Provide a similarity score from 1-100 where:
- 90-100: Nearly identical, minor differences
- 80-89: Very similar, some noticeable differences
- 70-79: Similar overall design, several differences
- 60-69: Recognizable as same design, significant differences
- 50-59: Some similarities but major differences
- 40-49: Different design with some shared elements
- 30-39: Very different, few similarities
- 20-29: Completely different design
- 1-19: No resemblance

In your reasoning, be specific about what matches well and what differs. Mention colors, spacing, typography, layout elements, and any missing or extra components.
    `.trim();

    // Call Gemini Vision API
    const result = await generateObject({
      model: google('gemini-2.5-pro'),
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please compare these two screenshots. The first image is the target design that should be achieved, and the second image is the result that was implemented. Analyze how closely the result matches the target and provide a similarity score with detailed reasoning.'
            },
            {
              type: 'image',
              image: targetBase64,
            },
            {
              type: 'image',
              image: resultBase64,
            }
          ]
        }
      ],
      schema: ScreenshotComparisonSchema,
    });

    return new Response(JSON.stringify(result.object), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error grading screenshots:', error);

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: 'Unable to grade screenshot comparison',
      similarity: 50,
      reasoning: 'An error occurred while processing the images. Please try again.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}