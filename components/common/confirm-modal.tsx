'use client';

import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  description: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description,
}) => {
  const t = useTranslations('main');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='flex w-full items-center justify-end space-x-2 pt-6'>
        <Button disabled={loading} variant='outline' onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button disabled={loading} variant='destructive' onClick={onConfirm}>
          {loading && <Loader2 className='sze-4 mr-2 animate-spin' />}
          {t('continue')}
        </Button>
      </div>
    </Modal>
  );
};
