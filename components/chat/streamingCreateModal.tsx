import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useLocale, useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import { PostCardProps } from '../profiles/posts/post-card';
import axios from 'axios';
import { PostCardSkeleton } from '../profiles/posts/post-card-skeleton';
import { MdOutlinePostAdd, MdOutlineSpeakerNotesOff } from 'react-icons/md';
import Product from '../stream/ui/product';
import { useRouter } from 'next/navigation';
import { generateRandomString } from '@/lib/utils';
import apiHelper from '@/helpers/api/apiRequest';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { NewPostModal } from '../profiles/posts/new-post-modal';
import { Loader2 } from 'lucide-react';

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
  const t1 = useTranslations('main');
  const [blogs, setBlogs] = useState<PostCardProps[]>([]);
  const locale = useLocale();
  const [title, setTitle] = useState<string>('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    data: fetchedData,
    error,
    mutate: blogsMutate,
  } = useSWR(`/api/flows/me?language=${locale}`, fetcher);

  const router = useRouter();
  async function createTradingRoom() {
    setLoading(true);
    const roomId = generateRandomString(8);
    const response = await apiHelper({
      url: process.env.NEXT_PUBLIC_PAXTRADE_API_URL + 'room/create',
      method: 'POST',
      data: {
        roomId,
        title,
        products: selectedProducts.map((el) => el.toString()),
      },
    });
    if (response == null) {
      setLoading(false);
      toast.error('Ошибка');
    } else {
      toast.success('Комната создана');
      const { token } = response.data;
      localStorage.setItem(`${roomId}-streamer-token`, token);
      router.push(`/stream/${roomId}/host`);
    }
  }
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (setOpen) {
          setOpen(isOpen);
        }
        if (isOpen) {
          blogsMutate();
        }
      }}
    >
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
                <div className='flex w-full flex-col gap-3'>
                  <div>
                    <span>{t('input_title')}</span>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <ScrollArea className='h-[calc(100vh-400px)] md:h-[400px]'>
                    {blogs.map((blog) => (
                      <Product
                        id={blog.id}
                        checked={selectedProducts.includes(blog.id)}
                        onToggle={handleToggle}
                        title={blog.title}
                        key={blog.id}
                        price={blog.price}
                      />
                    ))}
                  </ScrollArea>
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
          {blogs?.length > 0 ? (
            <div className='mx-auto'>
              {!loading ? (
                <Button
                  type='submit'
                  onClick={() => {
                    if (selectedProducts.length === 0)
                      toast.error(t('no_product_alert'));
                    else if (title === '') {
                      toast.error(t('no_title'));
                    } else {
                      createTradingRoom();
                    }
                  }}
                >
                  {t('start')}
                </Button>
              ) : (
                <Loader2 className='animate-spin' />
              )}
            </div>
          ) : (
            <div className='mx-auto'>
              <NewPostModal mutate={blogsMutate}>
                <Button className='btn btn--wide !m-0 !rounded-md'>
                  <MdOutlinePostAdd className='mr-2 size-5' />
                  {t1('new_post')}
                </Button>
              </NewPostModal>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
