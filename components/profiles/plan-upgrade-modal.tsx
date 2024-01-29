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
    title: 'Basic',
    description: '300MB / 150 ₽ per month of use',
    icon: Icons.basic,
    plan: 'BASIC',
  },
  {
    title: 'Business',
    description: '600MB / 500 ₽ per month of use',
    icon: Icons.business,
    plan: 'BUSINESS',
  },
  {
    title: 'Advanced',
    description: '900MB / 1000 ₽ per month of use',
    icon: Icons.advanced,
    plan: 'ADVANCED',
  },
];

export function PlanUpgradeModal({ children }: PlanUpgradeModalProps) {
  const { currentPlan, setCurrentPlan } = useContext(PaxContext);
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-md sm:max-w-lg'>
        <DialogHeader className='flex flex-row items-center gap-3 space-y-0'>
          <div className='flex items-center justify-center rounded-full bg-primary/10 p-2 text-primary'>
            <PiNotepadFill className='size-6' />
          </div>
          <div className='flex items-center gap-4'>
            <DialogTitle>Plans</DialogTitle>
            <div className='rounded-lg bg-primary/10 px-2 py-1 text-xs text-primary'>
              Available to you: 100₽
            </div>
          </div>
        </DialogHeader>
        <Separator />
        <div className='grid gap-4 py-4'>
          {plans.map((plan) => (
            <PlanCard
              key={plan.title}
              title={plan.title}
              description={plan.description}
              icon={plan.icon}
              plan={plan.plan}
              currentPlan={currentPlan}
              setCurrentPlan={setCurrentPlan}
            />
          ))}
        </div>
        <div className='flex items-center gap-4'>
          <Input placeholder='Enter Recharge Code'></Input>
          <Button>Recharge via code</Button>
        </div>
        <DialogFooter>
          <Button type='submit'>Pay</Button>
          <DialogClose asChild>
            <Button variant='outline'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
