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

interface ReportModalProps {
  children?: React.ReactNode;
}

export function ReportModal({ children }: ReportModalProps) {
  const t = useTranslations('main');

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('report')}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className='grid gap-4'>
          <div className=''>
            <Label htmlFor='name' className='text-right'>
              {t('type_of_report')}:
            </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('select_type_of_report')} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value='apple'>
                    {t('bullying_or_harassment')}
                  </SelectItem>
                  <SelectItem value='banana'>
                    {t('hate_speech_or_discrimination')}
                  </SelectItem>
                  <SelectItem value='blueberry'>
                    {t('inappropriate_or_offensive_content')}
                  </SelectItem>
                  <SelectItem value='grapes'>
                    {t('spam_or_unwanted_content')}
                  </SelectItem>
                  <SelectItem value='grapes'>
                    {t('privacy_violations')}
                  </SelectItem>
                  <SelectItem value='grapes'>
                    {t('intellectual_property_rights_violation')}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className=''>
            <Label htmlFor='username' className='text-right'>
              {t('title_of_report')}:
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
