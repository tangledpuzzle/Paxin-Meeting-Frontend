import { useTranslation } from 'next-i18next';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SectionBadge } from '../common/section-badge';
import { SectionDescription } from '../common/section-description';
import { SectionHeroImage } from '../common/section-heroimage';
import { SectionTitle } from '../common/section-title';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col items-center justify-center overflow-hidden pb-[90px] pt-[50px] md:pt-[88px]'>
      <SectionBadge>{t('explore_paxintrade')}</SectionBadge>
      <SectionTitle className='px-7 leading-[30px]'>
        {t('empowering_connections_metaverse')}
      </SectionTitle>
      <SectionDescription className='px-7'>
        {t('empowering_connections_metaverse_description')}
      </SectionDescription>
      <SectionHeroImage />
    </div>
  );
}

// export async function getStaticProps({ locale }: { locale: string }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale || 'en', ['translation'])),
//       // Will be passed to the page component as props
//     },
//   };
// }
