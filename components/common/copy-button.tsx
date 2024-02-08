'use client';

import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { Button, ButtonProps } from '../ui/button';

export interface CopyButtonProps extends ButtonProps {
  children: React.ReactNode;
  text: string;
}

function CopyButton({ children, text, ...props }: CopyButtonProps) {
  const t = useTranslations('main');
  const handleLinkCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    toast.success(t('link_copied_to_clipboard'), {
      position: 'top-right',
    });
  };

  return (
    <Button {...props} onClick={() => handleLinkCopy(text)}>
      {children}
    </Button>
  );
}

export { CopyButton };
