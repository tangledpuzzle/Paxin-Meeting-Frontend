import { Search } from 'lucide-react';
import React, { useState, useDeferredValue } from 'react';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { ProductCard } from './product';
import { ScrollArea } from '../ui/scroll-area';

export interface IProduct {
  id: string;
  title: string;
  subtitle: string;
  gallery: string[];
  price: number;
  link: string;
}
interface ProductPanelProps {
  products: IProduct[];
}
export default function ProductPanel({ products }: ProductPanelProps) {
  const t = useTranslations('stream');
  const [keyword, setKeyword] = useState<string>('');
  const filter = useDeferredValue(keyword);
  const filteredProducts = products.filter((el: IProduct) =>
    el.title.includes(filter)
  );
  return (
    <>
      <div className='relative w-full'>
        <Search className='absolute inset-y-0 left-3 my-auto size-4 text-gray-500' />
        <Input
          type='text'
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={t('search_product')}
          className='rounded-full pl-12 pr-4'
        />
      </div>
      <span className='ml-4 text-2xl md:ml-8'>
        {filteredProducts.length} {t('products')}
      </span>
      <ScrollArea className='flex-1 rounded-lg bg-background p-4 md:ml-4'>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </ScrollArea>
    </>
  );
}
