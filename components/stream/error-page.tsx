'use client';
import { useTranslations } from 'next-intl';
import React from 'react';
export default function ErrorPage() {
  const t = useTranslations('stream');
  return (
    <div className='relative flex h-[calc(100vh-81px)] flex-col justify-center'>
      <div className='text-center'>
        <span className='mx-auto text-2xl'>{t('invalid_room')}</span>
      </div>
    </div>
  );
}
