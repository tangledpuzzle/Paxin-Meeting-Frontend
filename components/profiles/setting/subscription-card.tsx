import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { MdCheck } from 'react-icons/md';

function generateBGColor(id: number) {
  switch (id) {
    case 0:
      return 'bg-[#29e8a3]';
    case 1:
      return 'bg-[#ee6ce8]';
    case 2:
      return 'bg-[#ff0075]';
  }
}

export function SubscriptionCard({
  id,
  title,
  price,
  description,
  features,
  onUpgrade,
}: {
  id: number;
  title: string;
  price: {
    monthly: number;
    annually: number;
  };
  description: string;
  features: string[];
  onUpgrade: () => void;
}) {
  const t = useTranslations('main');
  const searchParams = useSearchParams();
  const mode =
    !searchParams.get('mode') || searchParams.get('mode') === 'monthly'
      ? 'monthly'
      : 'annually';

  const bgClass = generateBGColor(id);

  return (
    <Card className='w-full p-0'>
      <CardContent className='flex w-full flex-col gap-2 p-4 xl:flex-row'>
        <div className='w-full overflow-hidden'>
          <p className='text-2xl font-semibold'>{title}</p>
          <small className='w-full !text-xs text-muted-foreground'>
            {description}
          </small>
          <div className='my-4 flex items-center gap-2 whitespace-nowrap'>
            <p className='text-primary'>{t('what_included')}</p>
            <Separator />
          </div>
          <div>
            <ul className='flex flex-col text-sm font-normal'>
              {features.map((feature) => (
                <li className='flex items-center gap-2'>
                  <MdCheck className='size-3' />
                  <p>{feature}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-lg p-4 xl:w-[300px]',
            bgClass
          )}
        >
          <small className='text-xs text-gray-100'>
            {mode === 'monthly' ? t('monthly') : t('annually')}
          </small>
          <p className='my-4 flex flex-col items-center justify-center text-4xl font-bold text-white'>
            <span>${price[mode as keyof typeof price]}</span>
            {mode === 'annually' && (
              <span className='text-xl text-gray-100 line-through'>
                ${price['monthly'] * 12}
              </span>
            )}
          </p>
          <Button onClick={onUpgrade}>{t('upgrade')}</Button>
        </div>
      </CardContent>
    </Card>
  );
}
