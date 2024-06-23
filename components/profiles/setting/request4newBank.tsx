'use client';

import { useState, useEffect, useContext } from 'react';
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
import { CiBank } from 'react-icons/ci';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { PaxContext } from '@/context/context';

interface NewInvoiceProps {
    openBankModal: boolean;
    setOpenBankModal: (open: boolean) => void;
    requestType: string;
}

export function NewInvoice({ openBankModal, setOpenBankModal, requestType }: NewInvoiceProps) {
  const t = useTranslations('main');
  const { lastCommand } = useContext(PaxContext);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    if (lastCommand === 'BalanceAdded') {
      setOpenBankModal(false);
    }
  }, [lastCommand, setOpenBankModal]);

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
    setLoading(true); // Start loading
    let conversion = data.amount * 100;

    try {
      const res = await axios.post(
        `/api/profiles/balance/creditcard`,
        { amount: conversion }
      );

      if (res.status === 200) {
        setPaymentURL(res.data.data.PaymentURL);
        toast.success(t('request_save_success', { type: requestType }), {
          position: 'top-right',
        });
      } else {
        toast.error(t('request_save_error', { type: requestType }), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('request_save_error', { type: requestType }), {
        position: 'top-right',
      });
    } finally {
      setLoading(false); // Stop loading
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
            <CiBank className='size-5' />
          </div>
          <div>
            <DialogTitle>{t('send_request_payment')}</DialogTitle>
            <DialogDescription>
              {t('send_request_payment_description')}
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
                      <FormControl>
                        <Input type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className='mt-4 flex flex-row justify-end'>
                <Button type='submit' disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : t('send')}
                </Button>
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
