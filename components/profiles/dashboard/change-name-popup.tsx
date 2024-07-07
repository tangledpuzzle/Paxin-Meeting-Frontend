import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { PaxContext } from '@/context/context';
import changeName from '@/lib/server/changeName';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

export function ChangeNamePopup({ children }: { children: React.ReactNode }) {
  const t = useTranslations('main');
  const { user, userMutate } = useContext(PaxContext);
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, { message: t('name_required') }),
  });

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const submit = async (data: FormData) => {
    setLoading(true);

    const res = await changeName(data.name);

    console.log(res);

    if (res.success) {
      userMutate();

      toast.success(t('name_changed_successfully'), {
        position: 'top-right',
      });
    } else {
      toast.error(t('fail_change_name'), {
        position: 'top-right',
      });
    }

    setLoading(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className=''>
        <div className='grid gap-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>{t('change_name')}</h4>
            {/* <p className="text-muted-foreground !text-sm">
              You can change the name of your profile here
            </p> */}
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='Enter name'
                          defaultValue={user?.username}
                          className='w-full'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type='submit' className='ml-auto' disabled={loading}>
                  {loading && <Loader2 className='mr-2 size-4 animate-spin' />}
                  {t('save')}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
