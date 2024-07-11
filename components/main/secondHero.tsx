// import { SectionDescription } from '../common/section-description';
import { SectionHeroImage } from '../common/section-heroimage';
// import { SectionTitle } from '../common/section-title';

const HeroSectionSecond = () => {

  return (
    <div className='flex flex-col items-start justify-center overflow-hidden pb-[20px] pt-[10px] md:items-center md:pt-[40px]'>
      {/* <SectionTitle className='px-7 text-left  text-[2em] leading-[40px] md:text-center'>
        {t('empowering_connections_metaverse2')}
      </SectionTitle> */}
      {/* <SectionDescription className='px-7 text-left md:text-center'>
        <span className='mb-2'>{t('empowering_connections_metaverse_description2')}</span>
        <br/>
        <span className='mr-2 pb-2'>
          {t('empowering_connections_metaverse_description2')}
        </span>

        <button className='btn p-1 m'>настроить поток</button>
      </SectionDescription> */}
      <SectionHeroImage />
    </div>
  );
};

export default HeroSectionSecond;
