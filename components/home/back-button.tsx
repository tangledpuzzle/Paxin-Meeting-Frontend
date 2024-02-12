'use client';

import { Button } from '@/components/ui/button';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BackButton({
  callback,
}: {
  callback: string | undefined | null;
}) {
  const router = useRouter();

  return (
    <div>
      {callback ? (
        <Button variant='link' asChild>
          <Link href={callback}>
            <MoveLeft className='mr-2 size-4' />
            Back
          </Link>
        </Button>
      ) : (
        <Button variant='link' onClick={() => router.back()}>
          <MoveLeft className='mr-2 size-4' />
          Back
        </Button>
      )}
    </div>
  );
}
