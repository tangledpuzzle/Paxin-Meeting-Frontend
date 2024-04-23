import { Search } from 'lucide-react';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { ProductCard } from './product';
import { ScrollArea } from '../ui/scroll-area';

const _DUMMIE_PRODUCTS = [
  {
    id: 1656,
    title: 'Wanna build a snowman?',
    subtitle: 'Snowman',
    gallery: {
      ID: 1638,
      BlogID: 1656,
      files: [
        {
          path: '1708179015_PlFSIcuF/4d2577e0dcf0596ac6f157489898f05f153f537b47ac573234186b4880ab40ca_128.jpg.jpg',
        },
      ],
    },
    price: 10,
    link: '/flows/CDGou209Zgs/wanna-build-a-snowman',
  },
  {
    id: 1657,
    title: 'Wanna build a snowman?',
    subtitle: 'Snowman',
    gallery: {
      ID: 1638,
      BlogID: 1656,
      files: [
        {
          path: '1708179015_PlFSIcuF/4d2577e0dcf0596ac6f157489898f05f153f537b47ac573234186b4880ab40ca_128.jpg.jpg',
        },
      ],
    },
    price: 10,
    link: '/flows/CDGou209Zgs/wanna-build-a-snowman',
  },
  {
    id: 1658,
    title: 'Wanna build a snowman?',
    subtitle: 'Snowman',
    gallery: {
      ID: 1638,
      BlogID: 1656,
      files: [
        {
          path: '1708179015_PlFSIcuF/4d2577e0dcf0596ac6f157489898f05f153f537b47ac573234186b4880ab40ca_128.jpg.jpg',
        },
      ],
    },
    price: 10,
    link: '/flows/CDGou209Zgs/wanna-build-a-snowman',
  },
  {
    id: 1659,
    title: 'Wanna build a snowman?',
    subtitle: 'Snowman',
    gallery: {
      ID: 1638,
      BlogID: 1656,
      files: [
        {
          path: '1708179015_PlFSIcuF/4d2577e0dcf0596ac6f157489898f05f153f537b47ac573234186b4880ab40ca_128.jpg.jpg',
        },
      ],
    },
    price: 10,
    link: '/flows/CDGou209Zgs/wanna-build-a-snowman',
  },
  {
    id: 1660,
    title: 'Wanna build a snowman?',
    subtitle: 'Snowman',
    gallery: {
      ID: 1638,
      BlogID: 1656,
      files: [
        {
          path: '1708179015_PlFSIcuF/4d2577e0dcf0596ac6f157489898f05f153f537b47ac573234186b4880ab40ca_128.jpg.jpg',
        },
      ],
    },
    price: 10,
    link: '/flows/CDGou209Zgs/wanna-build-a-snowman',
  },
];
export default function ProductPanel() {
  const t = useTranslations('stream');
  const [products, setProducts] = useState(_DUMMIE_PRODUCTS);
  return (
    <>
      <div className='relative w-full'>
        <Search className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
        <Input
          type='text'
          placeholder={t('search_product')}
          className='rounded-full pl-12 pr-4'
        />
      </div>
      <span className='ml-4 text-2xl md:ml-8'>
        {products.length} {t('products')}
      </span>
      <ScrollArea className='flex-1 rounded-lg bg-background p-4 md:ml-4'>
        {products.map((product) => (
          <ProductCard {...product} />
        ))}
      </ScrollArea>
    </>
  );
}
