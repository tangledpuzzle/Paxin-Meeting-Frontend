'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface ReportModalProps {
  children?: React.ReactNode;
}

export function ReportModal({ children }: ReportModalProps) {
  const t = useTranslations('main');
  const [open, setOpen] = useState(false);
  const defaultValues = {
    type: '',
    name: '',
    descr: ''
  };

  const formSchema = z.object({
    type: z.string().min(1, t('select_type_of_report')),
    name: z.string().min(1, t('require_title')),
    descr: z.string().min(1, t('require_description')),
  });
  type FormValue = z.infer<typeof formSchema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const SendRequest = async (data: FormValue) => {
    const res = await axios.post(`/api/profiles/newReq?mode=ComplaintUser`, data);

    if (res.status === 200) {
      toast.success(t('report_save_success'), {
        position: 'top-right',
      });
      setOpen(false);
    } else {
      toast.error(t('report_fail_success'), {
        position: 'top-right',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('report')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(SendRequest)}
            className='w-full space-y-2'
          >
            <Separator />
            <div className='grid gap-4'>
              <div className=''>
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor='type'>
                        {t('type_of_report')}:
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('select_type_of_report')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value='bullying_or_harassment'>
                                {t('bullying_or_harassment')}
                              </SelectItem>
                              <SelectItem value='hate_speech_or_discrimination'>
                                {t('hate_speech_or_discrimination')}
                              </SelectItem>
                              <SelectItem value='inappropriate_or_offensive_content'>
                                {t('inappropriate_or_offensive_content')}
                              </SelectItem>
                              <SelectItem value='spam_or_unwanted_content'>
                                {t('spam_or_unwanted_content')}
                              </SelectItem>
                              <SelectItem value='privacy_violations'>
                                {t('privacy_violations')}
                              </SelectItem>
                              <SelectItem value='intellectual_property_rights_violation'>
                                {t('intellectual_property_rights_violation')}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=''>
                <Label htmlFor='username' className='text-right'>
                  {t('title_of_report')}:
                </Label>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input id='username' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
              <div className=''>
                <Label htmlFor='descr' className='text-right'>
                  {t('description')}:
                </Label>
                <FormField
                  control={form.control}
                  name='descr'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea id='descr' rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant='outline' type='button'>
                  {t('cancel')}
                </Button>
              </DialogClose>
              <Button type='submit' >{t('submit')}</Button>
            </DialogFooter>
          </form></Form>
      </DialogContent>
    </Dialog>
  );
}
