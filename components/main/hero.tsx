import { useTranslations } from 'next-intl';
import { SectionDescription } from '../common/section-description';
import { SectionHeroImageSlider } from '../common/section-slider';
import { SectionTitle } from '../common/section-title';

const HeroSection = () => {
  const t = useTranslations('main');

  return (
    <div className='flex flex-col items-start justify-center overflow-hidden pb-[20px] pt-[10px] md:items-center md:pt-[40px]'>
      <SectionTitle className='px-4 text-left  text-[2em] leading-[40px] md:text-center'>
        {t('empowering_connections_metaverse')}
      </SectionTitle>
      <SectionDescription className='px-4 text-left md:text-center'>
        {/* <span className='mb-2'>{t('empowering_connections_metaverse_description2')}</span> */}
        {/* <br/> */}
        <span className='mr-2 pb-4'>
          {t('empowering_connections_metaverse_description')}
        </span>

        {/* <button className='btn p-1 m'>настроить поток</button> */}
      </SectionDescription>
      <SectionHeroImageSlider />
    </div>
  );
};

export default HeroSection;
