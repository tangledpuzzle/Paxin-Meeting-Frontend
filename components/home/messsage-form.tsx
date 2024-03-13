'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import createRoom from '@/lib/server/chat/createRoom';
import getRoomDetails from '@/lib/server/chat/getRoomDetails';
import sendMessage from '@/lib/server/chat/sendMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IoMdSend } from 'react-icons/io';
import { z } from 'zod';

export default function MessageForm({
  children,
  user,
  roomId,
}: {
  children: React.ReactNode;
  user: {
    username: string;
    userId: string;
    bot?: boolean;
  };
  roomId: string;
}) {
  const t = useTranslations('chatting');
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const formSchema = z.object({
    message: z.string().min(1, { message: t('message_required') }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: '' },
  });

  const submit = async (data: FormData) => {
    setIsLoading(true);

    try {
      if (roomId === '') {
        const _roomId = await createRoom({
          acceptorId: user.userId,
          initialMessage: data.message,
        });

        if (!_roomId) {
          toast.error(t('failed_to_send_message'), {
            position: 'top-right',
          });

          return;
        }

        router.push(`/profile/chat/${_roomId}?mode=false`);
      } else {
        const roomDataRes = await getRoomDetails({ roomId });
        if (!roomDataRes || !roomDataRes.data.Members) {
          toast.error('Failed to send message', {
            position: 'top-right',
          });

          return;
        }

        for (const member of roomDataRes.data.Members) {
          if (member.UserID === user.userId && !member.IsSubscribed) {
            toast.error(t('not_subscribed_yet'), {
              position: 'top-right',
            });

            return;
          }
        }

        const res = await sendMessage({ roomId, message: data.message });

        if (!res) {
          toast.error(t('failed_to_send_message'), {
            position: 'top-right',
          });

          return;
        }

        router.push(`/profile/chat/${roomId}?mode=false`);
      }
    } catch (error) {
      toast.error(t('failed_to_send_message'), {
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitForBot = async () => {
    try {
      if (roomId === '') {
        const _roomId = await createRoom({
          acceptorId: user.userId,
          initialMessage: 'Hi',
        });

        if (!_roomId) {
          toast.error(t('failed_to_send_message'), {
            position: 'top-right',
          });

          return;
        }

        router.push(`/profile/chat/${_roomId}?mode=false`);
      } else {
        router.push(`/profile/chat/${roomId}?mode=false`);
      }
    } catch (error) {
      toast.error(t('failed_to_send_message'), {
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={user?.bot ? false : undefined}>
      <DialogTrigger
        asChild
        onClick={() => {
          if (user?.bot) {
            submitForBot();
          } else return;
        }}
      >
        {children}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {t.rich('message_to_username', { username: `@${user.username}` })}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea className='w-full' {...field} />
                    {/* <div className='mt-4 flex items-center'>
                      <Input className='rounded-r-none' {...field} />
                      <Button
                        type='submit'
                        size='icon'
                        className='h-9 rounded-l-none'
                      >
                        {isLoading && (
                          <Loader2 className='size-5 animate-spin' />
                        )}
                        {!isLoading && <IoMdSend className='size-5' />}
                      </Button>
                    </div> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='mt-2 flex w-full justify-end'>
              <Button type='submit'>
                {isLoading && <Loader2 className='mr-2 size-5 animate-spin' />}
                {!isLoading && <IoMdSend className='mr-2 size-5' />}
                {t('send')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
