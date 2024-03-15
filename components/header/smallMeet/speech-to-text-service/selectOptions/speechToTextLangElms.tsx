import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Switch, Transition } from '@headlessui/react';

import {
  SpeechRecognizer,
  TranslationRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';

import { supportedSpeechToTextLangs } from '../helpers/supportedLangs';
import { SpeechToTextTranslationFeatures } from '@/store/slices/interfaces/session';
import MicElms from './micElms';
import { useTranslations } from 'next-intl';

interface SpeechToTextLangElmsPros {
  speechService: SpeechToTextTranslationFeatures;
  recognizer: SpeechRecognizer | TranslationRecognizer | undefined;
  selectedSpeechLang: string;
  setSelectedSpeechLang: React.Dispatch<string>;
  selectedMicDevice: string;
  setSelectedMicDevice: React.Dispatch<string>;
}

const SpeechToTextLangElms = ({
  speechService,
  recognizer,
  selectedSpeechLang,
  setSelectedSpeechLang,
  selectedMicDevice,
  setSelectedMicDevice,
}: SpeechToTextLangElmsPros) => {
  const t = useTranslations('meet');
  const [enableSpeechToText, setEnableSpeechToText] = useState<boolean>(true);

  useEffect(() => {
    if (!enableSpeechToText) {
      setSelectedMicDevice('');
      setSelectedSpeechLang('');
    }
    //eslint-disable-next-line
  }, [enableSpeechToText]);

  const speechLangElms = () => {
    return (
      <>
        <div className='flex items-center justify-between'>
          <label
            htmlFor='speech-lang'
            className='w-auto pr-4 text-sm dark:text-darkText'
          >
            {t('speech-services.speech-lang-label')}
          </label>
          <Listbox
            value={selectedSpeechLang}
            onChange={setSelectedSpeechLang}
            disabled={recognizer !== undefined}
          >
            <div className='relative mt-1 w-[150px] sm:w-[250px]'>
              <Listbox.Button
                className={`relative h-9 w-full cursor-default rounded-md border border-gray-300 bg-transparent py-1 pl-3 pr-7 text-left text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-darkText dark:text-darkText ${
                  recognizer !== undefined ? 'opacity-70' : ''
                }`}
              >
                <span className='block truncate'>
                  {supportedSpeechToTextLangs
                    .map((l) => (l.code === selectedSpeechLang ? l.name : null))
                    .join('')}
                </span>
                <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 '>
                  <i className='pnm-updown primaryColor text-xl dark:text-darkText' />
                </span>
              </Listbox.Button>

              <Transition
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options className='scrollBar scrollBar4 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
                  {speechService.allowed_speech_langs?.map((l) => (
                    <Listbox.Option
                      key={l}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-7 pr-4 ${
                          active
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-gray-900'
                        }`
                      }
                      value={l}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {
                              supportedSpeechToTextLangs.filter(
                                (lang) => lang.code === l
                              )[0].name
                            }
                          </span>
                          {selected ? (
                            <span className='absolute inset-y-0 left-0 flex items-center pl-1 text-amber-600'>
                              <i className='pnm-check h-4 w-4' />
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

        <MicElms
          disabled={recognizer !== undefined}
          selectedMicDevice={selectedMicDevice}
          setSelectedMicDevice={setSelectedMicDevice}
        />
      </>
    );
  };

  return (
    <>
      <Switch.Group>
        <div className='my-4 flex items-center justify-between'>
          <Switch.Label className='w-full dark:text-darkText ltr:pr-4 rtl:pl-4'>
            {t('speech-services.enable-speech-to-text')}
          </Switch.Label>
          <Switch
            checked={enableSpeechToText}
            onChange={setEnableSpeechToText}
            disabled={recognizer !== undefined}
            className={`${
              enableSpeechToText
                ? 'bg-primaryColor dark:bg-darkSecondary2'
                : 'bg-gray-200 dark:bg-secondaryColor'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            <span
              className={`${
                enableSpeechToText
                  ? 'ltr:translate-x-6 rtl:-translate-x-6'
                  : 'ltr:translate-x-1 rtl:translate-x-0'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </Switch.Group>
      {enableSpeechToText ? speechLangElms() : null}
    </>
  );
};

export default SpeechToTextLangElms;
