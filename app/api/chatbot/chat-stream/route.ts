import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import cookie from 'cookie';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  let accessToken = session?.accessToken;
  if (!accessToken) {
    const cookies = headers().get('cookie') || '';
    const parsedCookies = cookie.parse(cookies);
    accessToken = parsedCookies.access_token;
  }
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const mode = req.nextUrl.searchParams.get('mode') || 'text';

  try {
    const res = await fetch(
      `${process.env.AI_CHAT_ASSISTANT_API_URL}/api/assistant/${mode === 'image' ? 'visionChatStream' : 'chatStream'}`,
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

    if (!reader) {
      throw new Error('Failed to get reader');
    }

    const stream = new ReadableStream({
      async start(controller) {
        let isReading = true;

        while (isReading) {
          const { done, value } = await reader.read();
        
          if (done) {
            controller.close();
            isReading = false;  // Exit the loop
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
