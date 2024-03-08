import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

const encoder = new TextEncoder();

async function* makeIterator() {
  yield encoder.encode('<p>One</p>');
  await sleep(200);
  yield encoder.encode('<p>Two</p>');
  await sleep(200);
  yield encoder.encode('<p>Three</p>');
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const res = await fetch(
      `https://ai-chat-assistant.paxintrade.com/api/assistant/chatStream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const reader = res.body?.getReader();
    const decoder = new TextDecoder('utf-8');

    if (!reader) {
      throw new Error('Failed to get reader');
    }

    let streamText = '';
    let lastStreamText = '';

    const stream = new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            controller.close();
          } else {
            controller.enqueue(value);
          }
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
