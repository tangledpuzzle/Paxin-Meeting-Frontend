'use client';

import { Button } from '@/components/ui/button';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function BackButton({
  callback,
}: {
  callback: string | undefined | null;
}) {
  const router = useRouter();
  const t = useTranslations('main');

  return (
    <div>
      {callback ? (
        <Button variant='link' className='!p-0' asChild>
          <Link href={callback}>
            <MoveLeft className='mr-2 size-4' />
            {t('back_flow')}
          </Link>
        </Button>
      ) : (
        <Button variant='link' className='!p-0' onClick={() => router.back()}>
          <MoveLeft className='mr-2 size-4' />
          {t('back_flow')}
        </Button>
      )}
    </div>
  );
}
