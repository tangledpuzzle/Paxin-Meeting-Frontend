import React, { Fragment, useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';

import { getSubtitleLangs, SupportedLangs } from '../helpers/supportedLangs';
import { SpeechToTextTranslationFeatures } from '@/store/slices/interfaces/session';
import { useTranslations } from 'next-intl';

interface SubtitleLangElmsPros {
  speechService: SpeechToTextTranslationFeatures;
  selectedSubtitleLang: string;
  setSelectedSubtitleLang: React.Dispatch<string>;
}

const SubtitleLangElms = ({
  speechService,
  selectedSubtitleLang,
  setSelectedSubtitleLang,
}: SubtitleLangElmsPros) => {
  const t = useTranslations('meet');
  const [displayLangs, setDisplayLangs] = useState<Array<SupportedLangs>>([]);

  useMemo(() => {
    const langs = getSubtitleLangs(
      t,
      speechService.allowed_speech_langs,
      speechService.allowed_trans_langs
    );
    setDisplayLangs(langs);
  }, [speechService, t]);

  return (
    <div className='mt-2 flex items-center justify-between'>
      <label
        htmlFor='language'
        className='w-auto pr-4 text-sm dark:text-darkText'
      >
        {t('speech-services.subtitle-lang-label')}
      </label>
      <Listbox value={selectedSubtitleLang} onChange={setSelectedSubtitleLang}>
        <div className='relative mt-1 w-[150px] sm:w-[250px]'>
          <Listbox.Button className='relative h-9 w-full cursor-default rounded-md border border-gray-300 bg-transparent py-1 pl-3 pr-7 text-left text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-darkText dark:text-darkText'>
            <span className='block truncate'>
              {displayLangs
                .map((l) => (l.code === selectedSubtitleLang ? l.name : null))
                .join('')}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              <i className='pnm-updown primaryColor text-xl dark:text-darkText' />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Listbox.Options className='scrollBar scrollBar4 ring-opacity/5 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black focus:outline-none sm:text-sm'>
              {displayLangs.map((l) => (
                <Listbox.Option
                  key={l.code}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-7 pr-4 ${
                      active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                    }`
                  }
                  value={l.code}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {l.name}
                      </span>
                      {selected ? (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-1 text-amber-600'>
                          <i className='pnm-check size-4' />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default SubtitleLangElms;
