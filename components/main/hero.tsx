import { useTranslations } from 'next-intl';
import { SectionDescription } from '../common/section-description';
import { SectionHeroImage } from '../common/section-heroimage';
import { SectionTitle } from '../common/section-title';

const HeroSection = () => {
  const t = useTranslations('main');

  return (
    <div className='flex flex-col items-start justify-center overflow-hidden pb-[90px] pt-[50px] md:items-center md:pt-[40px]'>
      <SectionTitle className='px-7 text-left leading-[30px] md:text-center'>
        {t('empowering_connections_metaverse')}
      </SectionTitle>
      <SectionDescription className='px-7 text-left md:text-center'>
        {t('empowering_connections_metaverse_description')}
      </SectionDescription>
      <SectionHeroImage />
    </div>
  );
};

export default HeroSection;
