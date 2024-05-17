import { Search } from 'lucide-react';
import React, { useState, useDeferredValue } from 'react';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { ProductCard } from './product';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import ShareWebcamModal from '../header/smallMeet/footer/modals/webcam/shareWebcam';

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
  const router=useRouter()
  const [keyword, setKeyword] = useState<string>('');
  const [isOpen, setisOpen] =useState<boolean>(false)

  const filter = useDeferredValue(keyword);
  const filteredProducts = products.filter((el: IProduct) =>
    el.title.includes(filter)
  );

  const webcam = () => {
    setisOpen(true);
  }

  const goback = () =>{
    router.push('/stream');
  }
  const end = () =>{
    const storeRoomId: string | null = localStorage.getItem('latest-stream-id');
    if(storeRoomId !== null){
      const tokenKey = Object.keys(localStorage).find(key => key.startsWith(storeRoomId));
      if(tokenKey) localStorage.removeItem(tokenKey)
    }
    router.push('/stream');
  }
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
      <div className='grid grid-cols-2 gap-2'>
        {/* <Button
          variant='outline'
          className='pr-2 flex border-primary text-primary grid-cols-1'
          onClick={webcam}
        >
          {t('webcam')}
        </Button> */}
        <Button
          variant='outline'
          className='pr-2 flex border-primary text-primary grid-cols-1'
          onClick={goback}
        >
          {t('step_out')}
        </Button>
        <Button
          variant='outline'
          className='pl-2 flex border-primary text-primary grid-cols-1'
          onClick={end}
        >
          {t('end')}
        </Button>
      </div>
      {/* {isOpen ? (
        <ShareWebcamModal onSelectedDevice={null} />
      ) : null} */}
    </>
  );
}
