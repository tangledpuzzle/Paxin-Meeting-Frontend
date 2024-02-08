import React, { Dispatch, Fragment, useMemo } from 'react';
import { Listbox, Transition } from '@headlessui/react';

import { useAppSelector } from '@/store';
import { participantsSelector } from '@/store/slices/participantSlice';
import { useTranslations } from 'next-intl';

interface SpeechUsersElmsPros {
  selectedSpeechUsers: Array<string>;
  setSelectedSpeechUsers: Dispatch<Array<string>>;
}

const SpeechUsersElms = ({
  selectedSpeechUsers,
  setSelectedSpeechUsers,
}: SpeechUsersElmsPros) => {
  const t = useTranslations('meet');
  const allParticipants = useAppSelector(participantsSelector.selectAll);

  const render = useMemo(() => {
    const users = allParticipants.filter(
      (p) =>
        p.name !== '' && p.userId !== 'RECORDER_BOT' && p.userId !== 'RTMP_BOT'
    );
    return (
      <div className='mt-2 flex items-center justify-between'>
        <label
          htmlFor='language'
          className='w-auto pr-4 text-sm dark:text-darkText'
        >
          {t('speech-services.speech-users-label')}
        </label>
        <Listbox
          value={selectedSpeechUsers}
          onChange={setSelectedSpeechUsers}
          multiple={true}
        >
          <div className='relative mt-1 w-[150px] sm:w-[250px]'>
            <Listbox.Button className='relative min-h-[36px] w-full cursor-default rounded-md border border-gray-300 bg-transparent py-1 pl-3 pr-7 text-left text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-darkText dark:text-darkText'>
              <span className='block'>
                {selectedSpeechUsers
                  .map((l) => users.filter((u) => u.userId === l)[0]?.name)
                  .join(', ')}
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
                {users.map((u) => (
                  <Listbox.Option
                    key={u.userId}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-7 pr-4 ${
                        active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                      }`
                    }
                    value={u.userId}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {u.name}
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
    );
    //eslint-disable-next-line
  }, [allParticipants, selectedSpeechUsers]);

  return render;
};

export default SpeechUsersElms;
