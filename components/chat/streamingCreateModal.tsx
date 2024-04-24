import Image from 'next/image';
import { Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useLocale, useTranslations } from 'next-intl';
import { FaRandom } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { PostCard, PostCardProps } from '../profiles/posts/post-card';
import axios from 'axios';
import { PostCardSkeleton } from '../profiles/posts/post-card-skeleton';
import { MdOutlineSpeakerNotesOff } from 'react-icons/md';
import Product from '../stream/ui/product';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { generateRandomString } from '@/lib/utils';

interface StreamingCreateModalProps {
  children: React.ReactNode;
  isLoading: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onCreate: (e: number[]) => void;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function StreamingCreateModal({
  open,
  setOpen,
  isLoading,
  onCreate,
  children,
}: StreamingCreateModalProps) {
  const t = useTranslations('stream');
  const [blogs, setBlogs] = useState<PostCardProps[]>([]);
  const locale = useLocale();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const {
    data: fetchedData,
    error,
    mutate: blogsMutate,
  } = useSWR('/api/flows/me', fetcher);

  const router = useRouter();
  useEffect(() => {
    if (!error && fetchedData) {
      setBlogs(fetchedData.data);
    }
  }, [fetchedData, error]);
  function handleToggle(id: number) {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter((el) => el !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <div className='flex w-full items-center justify-center space-x-2'>
            <Image
              src='/logo-black.svg'
              alt='logo'
              width={50}
              height={50}
              className='size-12 dark:hidden'
            />
            <Image
              src='/logo-white.svg'
              alt='logo'
              width={50}
              height={50}
              className='hidden size-12 dark:block'
            />
            <span className='inline-block font-satoshi text-2xl font-bold text-primary sm:hidden lg:inline-block'>
              {t('title')}
            </span>
          </div>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {!error &&
            (fetchedData && blogs ? (
              blogs?.length > 0 ? (
                <div className='w-full'>
                  {blogs.map((blog) => (
                    <Product
                      id={blog.id}
                      checked={selectedProducts.includes(blog.id)}
                      onToggle={handleToggle}
                      title={blog.title}
                      key={blog.id}
                    />
                  ))}
                </div>
              ) : (
                <div className='flex h-60 w-full items-center justify-center rounded-md bg-background/30 p-8'>
                  <div className='flex flex-col items-center text-gray-400'>
                    <MdOutlineSpeakerNotesOff className='size-20' />
                    {t('no_product')}
                  </div>
                </div>
              )
            ) : (
              <PostCardSkeleton />
            ))}
        </div>
        <DialogFooter>
          <div className='mx-auto'>
            {!isLoading ? (
              <Button
                type='submit'
                onClick={() => {
                  if (selectedProducts.length === 0)
                    toast.error(t('no_product_alert'));
                  else {
                    router.push(`/stream/${generateRandomString(8)}/host`);
                  }
                }}
              >
                {t('start')}
              </Button>
            ) : (
              <div
                className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'
                role='status'
              >
                <span className='!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]'></span>
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
