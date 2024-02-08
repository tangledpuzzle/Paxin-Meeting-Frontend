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

interface ComplainModalProps {
  children?: React.ReactNode;
}

export function ComplainModal({ children }: ComplainModalProps) {
  const t = useTranslations('main');

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('complaints')}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className='grid gap-4'>
          <div className=''>
            <Label htmlFor='name' className='text-right'>
              {t('type_of_complaint')}:
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('select_type_of_complaint')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='apple'>{t('spam')}</SelectItem>
                  <SelectItem value='banana'>
                    {t('harmful_misinformation_or_glorifying_violence')}
                  </SelectItem>
                  <SelectItem value='blueberry'>
                    {t('exposing_private_identifying_information')}
                  </SelectItem>
                  <SelectItem value='grapes'>{t('something_else')}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className=''>
            <Label htmlFor='username' className='text-right'>
              {t('title_of_complaint')}:
            </Label>
            <Input id='username' />
          </div>
          <div className=''>
            <Label htmlFor='username' className='text-right'>
              {t('description')}:
            </Label>
            <Textarea id='username' rows={4} />
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
      </DialogContent>
    </Dialog>
  );
}
