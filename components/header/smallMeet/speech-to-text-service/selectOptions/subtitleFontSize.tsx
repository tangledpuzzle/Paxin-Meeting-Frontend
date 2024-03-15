import React, { useEffect, useState } from 'react';

import useStorePreviousInt from '@/helpers/hooks/useStorePreviousInt';
import { useAppDispatch } from '@/store/hook';
import { updateSubtitleFontSize } from '@/store/slices/speechServicesSlice';
import { useTranslations } from 'next-intl';

const SubtitleFontSize = () => {
  const t = useTranslations('meet');
  const dispatch = useAppDispatch();

  const [fontSize, setFontSize] = useState<number>(14);
  const previousFontSize = useStorePreviousInt(fontSize);

  useEffect(() => {
    if (previousFontSize && fontSize !== previousFontSize) {
      dispatch(updateSubtitleFontSize(fontSize));
    }
  }, [dispatch, fontSize, previousFontSize]);

  return (
    <div className='mt-2 flex items-center justify-between'>
      <p className='text-sm dark:text-darkText'>
        {t('speech-services.subtitle-font-size')}
      </p>
      <section className='flex w-[150px] items-center sm:w-[250px]'>
        <input
          type='range'
          min={0}
          max={30}
          step={1}
          value={fontSize}
          onChange={(event) => {
            setFontSize(event.target.valueAsNumber);
          }}
          className='range flex-1'
        />
        <p className='w-10 text-center text-sm dark:text-white'>{fontSize}</p>
      </section>
    </div>
  );
};

export default SubtitleFontSize;
