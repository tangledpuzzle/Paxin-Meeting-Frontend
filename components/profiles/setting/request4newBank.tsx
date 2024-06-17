'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import '@/styles/editor.css';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { TfiWrite } from 'react-icons/tfi';
import toast from 'react-hot-toast';
import { PaxContext } from '@/context/context';
import { useContext } from 'react';

export function NewInvoice({ openBankModal,  setOpenBankModal, requestType }: any) {
  const t = useTranslations('main');
  const { socket } = useContext(PaxContext);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        // const message = event.data;
        const message = JSON.parse(event.data);
        console.log(message)
        if (message.command === 'BalanceAdded') {
            setOpenBankModal(false)
            alert('Balance has been added!');
        }
      };
    }
  }, [socket]);

  const formSchema = z.object({
    amount: z.preprocess((val) => Number(val), z.number().min(1, 'Amount must be at least 1')),
});

  type FormData = z.infer<typeof formSchema>;

  

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100,
    },
  });

  const [paymentURL, setPaymentURL] = useState<string | null>(null);


  const submitPayment = async (data: FormData) => {
    // setOpenModal(false);

    let convertion = data.amount * 100

    const res = await axios.post(
      `/api/profiles/balance/creditcard`,
      { amount: convertion }
    );

    if (res.status === 200) {
      setPaymentURL(res.data.data.PaymentURL);
      toast.success(t('request_save_success', { type: requestType }), {
        position: 'top-right',
      });
    } else {
      toast.error(t('request_save_success', { type: requestType }), {
        position: 'top-right',
      });
    }
  };

  useEffect(() => {
    if (!openBankModal) {
      setPaymentURL(null); 
    }
  }, [openBankModal]);

  return (
    <Dialog open={openBankModal} onOpenChange={setOpenBankModal}>
      <DialogContent className='w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
        <DialogHeader className='flex flex-row items-center gap-3'>
          <div className='rounded-full bg-primary/10 p-3 text-primary'>
            <TfiWrite className='size-5' />
          </div>
          <div>
            <DialogTitle>{t('send_request')}</DialogTitle>
            <DialogDescription>
              {t(`send_request_category_description`)}
            </DialogDescription>
          </div>
        </DialogHeader>
        {!paymentURL ? (
         
      
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitPayment)}
            className={cn('flex w-full flex-col px-2')}
          >
            <div className='grid gap-2'>
              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor='amount'>
                      тест
                    </FormLabel>
                    <FormControl>
                      <Input type='number' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='mt-4 flex flex-row justify-end'>
              <Button type='submit'>{t('send')}</Button>
            </DialogFooter>
          </form>
        </Form>
        ) : (
          <div className="mt-4">
            <iframe
              src={paymentURL}
              width="100%"
              height="500"
              title="Payment Page"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
