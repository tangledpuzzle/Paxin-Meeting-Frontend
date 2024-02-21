import { unstable_setRequestLocale } from 'next-intl/server';
import AutoJoinConference from '@/components/profiles/conference/public-meet-auto-join';

export default function ConferencePage({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);


  function generateRandomString(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }
  
  function hashTimestamp(timestamp: number): string {
    const hash = require('crypto').createHash('md5');
    hash.update(timestamp.toString());
    return hash.digest('hex');
  }
  
  const randomPart = generateRandomString(4);
  const timestampHash = hashTimestamp(Date.now());
  const userId = `user-${randomPart}-${timestampHash}`;
  const userName = `User ${randomPart}`;
  const userEmail = `${randomPart}-${timestampHash}@test.me`;
  
  return <AutoJoinConference email={userEmail} userId={userId} name={userName} />;
}
