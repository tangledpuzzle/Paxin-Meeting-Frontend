import { useTranslations } from 'next-intl';

import Image from 'next/image';

import { SectionBadge } from '../common/section-badge';
import { SectionDescription } from '../common/section-description';
import { SectionTitle } from '../common/section-title';

export default function NavigateSection() {
  const t = useTranslations('main');

  return (
    <div className='flex flex-col items-start justify-center px-0 pb-[40px] md:items-center md:pb-[0px]'>
      <div className='px-7'>
        <SectionBadge>{t('search_and_share')}</SectionBadge>
      </div>
      <SectionTitle className='px-7 text-left leading-[30px] md:text-center'>
        {t('discover_paxintrade')}
      </SectionTitle>
      <SectionDescription className='px-7 text-left md:text-center'>
        {t('navigating_your_digital_universe_description')}
      </SectionDescription>
      <div className='px-0 pb-4 md:px-7 flex flex-col md:flex-row  gap-4  mt-4 '>
        <div className=' h-full  flex-col justify-center bg-card-gradient-menu px-7 pb-4 pt-2 rounded-none md:rounded-md'>
            <div className='text-md  pb-2 font-extrabold text-secondary-foreground transition-all duration-500 group-hover:text-white md:text-xl'>
              {t('s_1')}
            </div>
            <div className='translate-all md:text-md max-w-xl justify-center text-left text-[1rem] font-[1em]  leading-[25.15px] text-muted-foreground duration-500 group-hover:text-white/70'>
              {t('s_1d')}
            </div>
          </div>
          <div className='flex h-full  flex-col justify-center bg-card-gradient-menu px-7 pb-4 pt-2 rounded-none md:rounded-md'>
            <div className='text-md  pb-2 font-extrabold text-secondary-foreground transition-all duration-500 group-hover:text-white md:text-xl'>
              {t('s_2')}
            </div>
            <div className='translate-all md:text-md max-w-xl justify-center text-left text-[1rem] font-[1em]  leading-[25.15px] text-muted-foreground duration-500 group-hover:text-white/70'>
              {t('s_2d')}
            </div>
          </div>
          <div className='flex h-full  flex-col justify-center bg-card-gradient-menu px-7 pb-4 pt-2 rounded-none md:rounded-md'>
            <div className='text-md  pb-2 font-extrabold text-secondary-foreground transition-all duration-500 group-hover:text-white md:text-xl'>
              {t('s_3')}
            </div>
            <div className='translate-all md:text-md max-w-xl justify-center text-left text-[1rem] font-[1em]  leading-[25.15px] text-muted-foreground duration-500 group-hover:text-white/70'>
            {t('s_3d')}
            </div>
          </div>
      </div>
      <div className='relative mt-0 md:mt-5 grid w-full grid-cols-1 gap-4 px-0 md:grid-cols-3 md:px-7'>
        {/* <div
          className="bg-s hover:navigate-hover flex min-h-72 flex-col justify-center group relative overflow-hidden rounded-xl transition-all hover:bg-none bg-cover p-4 sm:p-8 md:col-span-2"
          style={{ backgroundImage: `url("/images/home/bg-nav.png")` }}
        >
           <div
            className="absolute left-0 top-0 z-[-1] size-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(45deg, #00B887 0%, #01B6D3 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.20) 3.76%, rgba(228, 228, 228, 0.00) 30.22%), linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(220, 220, 220, 0.00) 63.35%), #F3F4F6",
            }}
          ></div>
          <div className="font-satoshi text-md md:text-xl font-extrabold text-white">
            Efficient Discovery:
          </div>
          <div className="text-xs md:text-md text-white/70 leading-[25.15px] max-w-md">
            Utilize our advanced search engine for quick and efficient
            information discovery. Highlight your content and create a
            personalized space within our diverse platform.
          </div>
        </div> */}
        <div
          className='hover:navigate-hover bg-with-gradient group relative min-h-72 overflow-hidden  rounded-none bg-cover transition-all hover:bg-none md:col-span-2 md:rounded-xl'
          style={{
            backgroundImage: `url("/images/home/bg-nav.webp")`,
            backgroundSize: `cover`,
          }}
        >
          <div
            className='absolute left-0 top-0 z-[-1] size-full opacity-0 transition-opacity duration-500 group-hover:opacity-100'
            style={{
              background:
                'linear-gradient(45deg, #00B887 0%, #01B6D3 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.20) 3.76%, rgba(228, 228, 228, 0.00) 30.22%), linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(220, 220, 220, 0.00) 63.35%), #F3F4F6',
            }}
          ></div>

          <div
            className='flex size-full flex-col items-start justify-center bg-[#00000008] bg-cover px-7 pt-20 md:pt-0 pb-[160px] md:pb-0'
            style={{ backgroundImage: `url("/images/home/bg-nav-dark.webp")` }}
          >
            <div className='text-md pb-2 text-left font-extrabold text-secondary-foreground transition-all duration-500 group-hover:text-white md:text-xl'>
              {t('efficient_discovery')}
            </div>
            <div className='translate-all max-w-xl text-left text-[1rem] leading-[25.15px] text-muted-foreground duration-500 group-hover:text-white/70'>
              {t('efficient_discovery_description')}
            </div>
          </div>
        </div>
        <div className='hover:navigate-hover bg-with-gradient group relative overflow-hidden rounded-none transition-all hover:bg-none md:rounded-xl'>
          <div
            className='absolute left-0 top-0 z-[-1] size-full opacity-0 transition-opacity duration-500 group-hover:opacity-100'
            style={{
              background:
                'linear-gradient(45deg, #00B887 0%, #01B6D3 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.20) 3.76%, rgba(228, 228, 228, 0.00) 30.22%), linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(220, 220, 220, 0.00) 63.35%), #F3F4F6',
            }}
          ></div>
          {/* <Image
            src='/images/home/telegrami.svg'
            width={450}
            height={450}
            alt='telegram'
            className='mx-auto my-16 size-[154px]'
          />
          <Image
            src='/images/home/ring.png'
            style={{ objectFit: 'contain' }}
            sizes='(max-width: 768px) 100vw, 33vw'
            alt='ring'
            className='absolute mx-auto w-full'
            fill
          /> */}
          <div className='flex h-full flex-col justify-center bg-[#00000008] px-7 pb-4 pt-2'>
            <div className='text-md  pb-2 font-extrabold text-secondary-foreground transition-all duration-500 group-hover:text-white md:text-xl'>
              {t('private_asks')}
            </div>
            <div className='translate-all md:text-md max-w-xl justify-center text-left text-[1rem] font-[1em]  leading-[25.15px] text-muted-foreground duration-500 group-hover:text-white/70'>
              {t('private_asks_description')}
            </div>
          </div>
          
        </div>

        <div className='bg-with-gradient group relative grid grid-cols-1 overflow-hidden rounded-none hover:bg-none sm:grid-cols-2 md:col-span-3 md:rounded-xl'>
          <div
            className='absolute left-0 top-0 z-[-1] size-full opacity-0 transition-opacity duration-500 group-hover:opacity-100'
            style={{
              background:
                'linear-gradient(45deg, #00B887 0%, #01B6D3 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.20) 3.76%, rgba(228, 228, 228, 0.00) 30.22%), linear-gradient(180deg, rgba(255, 255, 255, 0.38) 0%, rgba(220, 220, 220, 0.00) 63.35%), #F3F4F6',
            }}
          ></div>
          <div className='relative order-last mx-auto flex w-full max-w-sm justify-between p-4 sm:order-first'>
            <Image
              src='/images/home/fire1.svg'
              width={15}
              height={22}
              alt='fire 1'
              className='group-hover:hidden'
            />
            <Image
              src='/images/home/fire2.svg'
              width={26}
              height={34}
              alt='fire 2'
              className='group-hover:hidden'
            />
            <Image
              src='/images/home/fire3.svg'
              width={35}
              height={44}
              alt='fire 3'
              className='group-hover:hidden'
            />
            <Image
              src='/images/home/fire4.svg'
              width={26}
              height={34}
              alt='fire 4'
              className='group-hover:hidden'
            />
            <Image
              src='/images/home/fire5.svg'
              width={15}
              height={21}
              alt='fire 5'
              className='group-hover:hidden'
            />
            <Image
              src='/images/home/fire1-hover.svg'
              width={15}
              height={22}
              alt='fire 1'
              className='hidden group-hover:block'
            />
            <Image
              src='/images/home/fire2-hover.svg'
              width={26}
              height={34}
              alt='fire 2'
              className='hidden group-hover:block'
            />
            <Image
              src='/images/home/fire3-hover.svg'
              width={35}
              height={44}
              alt='fire 3'
              className='hidden group-hover:block'
            />
            <Image
              src='/images/home/fire4-hover.svg'
              width={26}
              height={34}
              alt='fire 4'
              className='hidden group-hover:block'
            />
            <Image
              src='/images/home/fire5-hover.svg'
              width={15}
              height={21}
              alt='fire 5'
              className='hidden group-hover:block'
            />
            <Image
              src='/images/home/ring-2.png'
              style={{ objectFit: 'contain' }}
              alt='ring'
              className='absolute'
              fill
            />
          </div>
          <div className='relative p-4 px-7 pt-7'>
            <div className='md:text-md text-md pb-2 font-extrabold text-secondary-foreground transition-all duration-500 group-hover:text-white'>
              {t('smart_filters_for_tailored_content')}
            </div>
            <div className='translate-all max-w-xl text-left text-[1rem]   leading-[25.15px] text-muted-foreground duration-500 group-hover:text-white/70'>
              {t('smart_filters_for_tailored_content_description')}
            </div>
            <Image
              src='/images/home/navigate-side.png'
              width={191}
              height={167}
              alt='navigate side'
              className='absolute right-0 top-0 size-auto'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
