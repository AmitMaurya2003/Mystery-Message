import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Take ONLY the last user message
  const lastUserMessage = messages
    .filter(m => m.role === 'user')
    .slice(-1);

  const result = streamText({
    model: openai('gpt-4.1-mini'),
    messages: [
      {
        role: 'system',
        content: 'Reply briefly. Max 1-2 short sentences.',
      },
      ...(await convertToModelMessages(lastUserMessage)),
    ],
    maxOutputTokens: 50
  });

  return result.toUIMessageStreamResponse();
}