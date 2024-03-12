'use server';

export default async function getAssistantData(
  type: 'title' | 'subtitle' | 'content',
  data: Object
) {
  const API_URL = `${process.env.AI_BLOG_ASSISTANT_API_URL}/api/assistant/${
    type === 'title'
      ? 'titles'
      : type === 'subtitle'
        ? 'subtitles'
        : type === 'content'
          ? 'content'
          : ''
  }`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.log(error);
    return null;
  }
}
