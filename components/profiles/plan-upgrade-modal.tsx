import { useContext } from 'react';
import { PaxContext } from '@/context/context';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { PiNotepadFill } from 'react-icons/pi';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Icons } from '../icons';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { useTranslations } from 'next-intl';

interface PlanCardProps {
  title: string;
  description: string;
  plan: string;
  icon: React.ComponentType<any>;
  currentPlan: string;
  setCurrentPlan: (plan: string) => void;
}

interface PlanUpgradeModalProps {
  children: React.ReactNode;
}

const PlanCard = ({
  title,
  description,
  icon,
  plan,
  currentPlan,
  setCurrentPlan,
}: PlanCardProps) => {
  const Icon = icon;

  return (
    <div
      className='group flex cursor-pointer items-center gap-2 rounded-xl border p-6 hover:bg-primary/10 data-[state=active]:bg-primary'
      data-state={`${currentPlan === plan ? 'active' : ''}`}
      onClick={() => setCurrentPlan(plan)}
    >
      <div className='w-12 text-primary group-data-[state=active]:text-white'>
        <Icon className='size-6' />
      </div>
      <div className='w-full'>
        <div className='text-lg font-semibold group-data-[state=active]:text-white'>
          {title}
        </div>
        <div className='text-sm text-muted-foreground group-data-[state=active]:text-gray-300'>
          {description}
        </div>
      </div>
      <div className='hidden w-12 text-white group-data-[state=active]:block'>
        <IoIosCheckmarkCircle className='size-6' />
      </div>
    </div>
  );
};

const plans = [
  {
    title: 'basic',
    description: '300MB / 150 ₽',
    icon: Icons.basic,
    plan: 'BASIC',
  },
  {
    title: 'business',
    description: '600MB / 500 ₽',
    icon: Icons.business,
    plan: 'BUSINESS',
  },
  {
    title: 'advanced',
    description: '900MB / 1000 ₽',
    icon: Icons.advanced,
    plan: 'ADVANCED',
  },
];

export function PlanUpgradeModal({ children }: PlanUpgradeModalProps) {
  const t = useTranslations('main');
  const { user, currentPlan, setCurrentPlan } = useContext(PaxContext);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-md sm:max-w-lg'>
        <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
          <div className='flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary'>
            <PiNotepadFill className='size-6' />
          </div>
          <div className='flex items-center gap-4'>
            <DialogTitle>{t('plans')}</DialogTitle>
            <div className='rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary'>
              {t('available_to_you')}:{' '}
              {user?.balance.toLocaleString('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        </DialogHeader>
        <Separator />
        <div className='grid gap-4 py-4'>
          {plans.map((plan) => (
            <PlanCard
              key={plan.title}
              title={t(plan.title as keyof IntlMessages['main'])}
              description={`${plan.description} ${t('per_month_of_use')}`}
              icon={plan.icon}
              plan={plan.plan}
              currentPlan={currentPlan}
              setCurrentPlan={setCurrentPlan}
            />
          ))}
        </div>
        <div className='flex items-center gap-4'>
          <Input placeholder={t('enter_recharge_code')}></Input>
          <Button>{t('recharge_via_code')}</Button>
        </div>
        <DialogFooter>
          <Button type='submit'>{t('pay')}</Button>
          <DialogClose asChild>
            <Button variant='outline'>{t('close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
