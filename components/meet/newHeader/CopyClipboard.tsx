'use client';

import { copyToClipboard } from '@/helpers/utils';
import React, { ReactNode } from 'react';
import toast from 'react-hot-toast';

interface Props {
  text: string;
  children: ReactNode;
}

export default function CopyClipboard({ text, children }: Props) {
  async function handleCopy() {
    try {
      toast.success('Copied');
      await copyToClipboard(text);
    } catch (e) {
      toast.error(`Clipboard API doesn't work on this device`);
    }
  }

  return (
    <div onClick={handleCopy} className='flex content-center justify-center'>
      {children}
    </div>
  );
}
