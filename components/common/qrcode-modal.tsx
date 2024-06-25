'use client';

import { IoQrCodeOutline } from 'react-icons/io5';
import { LuScanLine } from 'react-icons/lu';
import { RxCopy } from 'react-icons/rx';
import QRCode from 'react-qr-code';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

interface QRCodeModalProps {
  children?: React.ReactNode;
  qrcode: string;
}

export function QRCodeModal({ qrcode, children }: QRCodeModalProps) {
  const t = useTranslations('main');

  const handleLinkCopy = async () => {
    await navigator.clipboard.writeText(qrcode);

    toast.success(t('link_copied_to_clipboard'), {
      position: 'top-right',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant='outline' size='icon' className='rounded-full'>
            <IoQrCodeOutline className='size-5' />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='max-w-lg rounded-lg sm:mx-auto'>
        <div className='flex flex-col items-center'>
          <Badge
            variant='outline'
            className='mb-4 flex size-12 items-center justify-center rounded-full'
          >
            <LuScanLine className='size-6' />
          </Badge>
          <div className='text-xl font-semibold'>{t('scan_code')}</div>
          <div className='text-center text-sm'>
            P{t('scan_code_description')}
          </div>
          <QRCode value={qrcode} className='mt-4' />
        </div>
        <div className='relative my-2 flex w-full justify-center'>
          <div className='absolute top-[50%] z-[-1] h-[2px] w-full rounded-full bg-muted'></div>
          <div className='bg-background px-4'>{t('or')}</div>
        </div>
        <div className='flex items-center justify-between gap-3'>
          <Input
            type='text'
            placeholder='Enter the code'
            value={qrcode}
            readOnly
          />
          <Button variant='outline' size='icon' onClick={handleLinkCopy}>
            <RxCopy className='size-4' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
