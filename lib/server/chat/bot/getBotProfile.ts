'use server';

export default async function getBotProfile(username: string, locale: string) {
  try {
    const res = await fetch(
      `${process.env.API_URL}/api/profiles/get/${username}?language=${locale}`
    );

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await res.json();

    const profile = {
      id: data.data.ID,
      // username: data.data.Name,
      bio: data.data.Profile[0].MultilangDescr[
        locale.charAt(0).toUpperCase() + locale.slice(1)
      ],
      // hashtags: data.data.Profile[0].Hashtags.map((tag: any) => tag.Hashtag),
      // cities: data.data.Profile[0].City.map(
      //   (city: any) => city.Translations[0].Name
      // ),
      categories: data.data.Profile[0].Guilds.map(
        (guild: any) => guild.Translations[0].Name
      ),
    };

    return {
      profile: profile,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}
