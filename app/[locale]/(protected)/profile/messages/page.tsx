"use client"

import dynamic from 'next/dynamic';

const ChatSSRSkeleton = dynamic(
  () => import('@/components/dialogs/skeleton'),
  { ssr: true }
);

export default function messages() {

  return (
    <div>
      <ChatSSRSkeleton />
    </div>
  );
}
