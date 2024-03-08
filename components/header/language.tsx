'use client';

import { usePathname } from '@/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearchParams, useRouter } from 'next/navigation';

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  // const { i18n } = useTranslation();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newSearchParams = new URLSearchParams(searchParams).toString();
  const changeLang = (lang: string) => {
    router.push(
      `/${lang}/${pathname}${newSearchParams ? '?' + newSearchParams : ''}`
    );
  };

  return (
    <Select
      defaultValue={locale}
      onValueChange={(value) => {
        changeLang(value);
      }}
    >
      <SelectTrigger
        className={`w-[150px] gap-2 rounded-full bg-transparent bg-card-gradient-menu pl-5 ${className ? className : ''}`}
      >
        <SelectValue placeholder='Select a language' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value='en'>
            <div className='flex items-center'>
              <Image
                src='/images/us.svg'
                alt='en'
                width={24}
                height={24}
                className='mr-2 h-auto w-5'
              />
              English
            </div>
          </SelectItem>
          <SelectItem value='ru'>
            <div className='flex items-center'>
              <Image
                src='/images/ru.svg'
                alt='ru'
                width={24}
                height={24}
                className='mr-2 h-auto w-5'
              />
              Русский
            </div>
          </SelectItem>
          <SelectItem value='ka'>
            <div className='flex items-center'>
              <Image
                src='/images/ge.svg'
                alt='ge'
                width={24}
                height={24}
                className='mr-2 h-auto w-5'
              />
              ქართული
            </div>
          </SelectItem>
          <SelectItem value='es'>
            <div className='flex items-center'>
              <Image
                src='/images/es.svg'
                alt='es'
                width={24}
                height={24}
                className='mr-2 h-auto w-5'
              />
              Española
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
