import * as React from 'react';
import { MdOutlineHouseSiding } from 'react-icons/md';

import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

export interface CityCardProps extends React.HTMLAttributes<HTMLDivElement> {
  cities: string[];
}

function CityCard({ cities }: CityCardProps) {
  const { t } = useTranslation();

  return (
    <div className='border-badge group relative w-full rounded-xl border border-[#ffffff2b] bg-[#9c9c9c1a] p-2 transition-all duration-300 hover:border-primary'>
      <div className='absolute inset-0 size-full bg-gradient-to-b from-transparent to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
      <div className='flex items-center gap-1'>
        <MdOutlineHouseSiding className='size-5 text-gray-500 dark:text-white' />
        <span className='pl-1'>{t('city')}</span>
      </div>
      <div className='mb-0 h-[1.5px] w-2/3 rounded-lg bg-gradient-to-r from-muted-foreground to-transparent'></div>
      <div className='flex w-full flex-wrap gap-1'>
        {cities.map((city, i) => (
          <Badge
            key={i}
            variant='outline'
            className='w-fit rounded-xl border-[#6060602b] p-2'
          >
            {city}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export { CityCard };
