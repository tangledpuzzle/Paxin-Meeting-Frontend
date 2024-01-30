import { FaHardDrive, FaSackDollar, FaUserClock } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';

import { PlanUpgradeModal } from './plan-upgrade-modal';
import { useContext } from 'react';
import { PaxContext } from '@/context/context';
import { useTranslation } from 'next-i18next';

interface CTAProps {
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
}

export default function CTASection({ title, description, icon }: CTAProps) {
  const { t } = useTranslation();
  const { user } = useContext(PaxContext);
  const Icon = icon;

  return (
    <div className='flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center'>
      <div className='flex items-center gap-2'>
        <div className='rounded-full bg-primary/10 p-3 text-primary'>
          <Icon className='size-5' />
        </div>
        <div>
          <div className='text-lg font-semibold'>{t(title)}</div>
          <div className='hidden text-sm text-muted-foreground lg:block'>
            {t(description || '')}
          </div>
        </div>
        <PlanUpgradeModal>
          <Button variant='outline' className='ml-auto sm:hidden'>
            <FaHardDrive className='mr-2 size-4' />
            {user?.storage || 0} / {user?.limitStorage || 0} MB
          </Button>
        </PlanUpgradeModal>
      </div>
      <div className='flex gap-2'>
        <PlanUpgradeModal>
          <Button variant='outline' className='hidden w-full sm:flex'>
            <FaHardDrive className='mr-2 size-4' />
            {user?.storage || 0} / {user?.limitStorage || 0} MB
          </Button>
        </PlanUpgradeModal>
        <Button variant='outline' className='w-full'>
          <FaSackDollar className='mr-2 size-4' />
          {user?.balance || 0}
        </Button>
        <Button variant='outline' className='w-full'>
          <FaUserClock className='mr-2 size-4 text-primary' />
          {user?.onlinehours?.hour || 0}h : {user?.onlinehours?.minutes || 0}m :{' '}
          {user?.onlinehours?.seconds || 0}s
        </Button>
      </div>
    </div>
  );
}
