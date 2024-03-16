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
import toast from 'react-hot-toast';
import axios from 'axios';
import { PaxContext } from '@/context/context';
import { useState, useContext } from 'react';
interface ComplainModalProps {
  children?: React.ReactNode;
}

export function ComplainModal({ children }: ComplainModalProps) {
  const t = useTranslations('main');
  const [open, setOpen] = useState(false);
  const { setGlobalLoading } = useContext(PaxContext);
  const defaultValues = {
    type: '',
    name: '',
    descr: '',
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
    setGlobalLoading(true);
    try {
      const res = await axios.post(
        `/api/profiles/newReq?mode=ComplaintPost`,
        data
      );

      if (res.status === 200) {
        toast.success(t('complaint_save_success'), {
          position: 'top-right',
        });
        setOpen(false);
      } else {
        toast.error(t('complaint_fail_success'), {
          position: 'top-right',
        });
      }
    } catch (e) {
      toast.error(t('complaint_fail_success'), {
        position: 'top-right',
      });
    }
    setGlobalLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('complaints')}</DialogTitle>
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
                        {t('type_of_complaint')}:
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t('select_type_of_complaint')}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value='spam'>{t('spam')}</SelectItem>
                              <SelectItem value='harmful_misinformation_or_glorifying_violence'>
                                {t(
                                  'harmful_misinformation_or_glorifying_violence'
                                )}
                              </SelectItem>
                              <SelectItem value='exposing_private_identifying_information'>
                                {t('exposing_private_identifying_information')}
                              </SelectItem>
                              <SelectItem value='something_else'>
                                {t('something_else')}
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
                  {t('title_of_complaint')}:
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
                <Label htmlFor='username' className='text-right'>
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
              <Button type='submit'>{t('submit')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
