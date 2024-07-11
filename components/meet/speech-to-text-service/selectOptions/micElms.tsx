import React, { Fragment, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Listbox, Transition } from '@headlessui/react';

import { getDevices } from '@/helpers/utils';
import { useTranslations } from 'next-intl';

interface MicElmsProps {
  disabled: boolean;
  selectedMicDevice: string;
  setSelectedMicDevice: React.Dispatch<string>;
}

const MicElms = ({
  disabled,
  selectedMicDevice,
  setSelectedMicDevice,
}: MicElmsProps) => {
  const t = useTranslations('meet');
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDeviceMics = async () => {
      const mics = await getDevices('audioinput');
      if (mics.length) {
        setDevices(mics);
        if (isEmpty(selectedMicDevice)) {
          setSelectedMicDevice(mics[0].deviceId);
        }
      }
    };
    getDeviceMics();
    //eslint-disable-next-line
  }, []);

  const render = () => {
    if (!devices.length) {
      return null;
    }
    return (
      <div className='selectMicroPhone mt-2 flex items-center justify-between'>
        <label
          htmlFor='microphone'
          className='w-min pr-4 text-sm dark:text-darkText'
        >
          {t('footer.modal.select-microphone')}
        </label>
        <div className='relative mt-1 w-[150px] sm:w-[250px]'>
          <Listbox
            value={selectedMicDevice}
            onChange={setSelectedMicDevice}
            disabled={disabled}
          >
            <div className='relative'>
              <Listbox.Button
                className={`relative min-h-[36px] w-full cursor-default rounded-md border border-gray-300 bg-transparent py-1 pl-3 pr-7 text-left text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-darkText dark:text-darkText`}
              >
                <span className='block text-xs'>
                  {
                    devices.filter((d) => d.deviceId === selectedMicDevice)?.[0]
                      .label
                  }
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
                  {devices.map((d) => {
                    return (
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-7 pr-4 ${
                            active
                              ? 'bg-amber-100 text-amber-900'
                              : 'text-gray-900'
                          }`
                        }
                        key={d.deviceId}
                        value={d.deviceId}
                        disabled={disabled}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block text-xs ${
                                selected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {d.label}
                            </span>
                            {selected ? (
                              <span className='absolute inset-y-0 left-0 flex items-center pl-1 text-amber-600'>
                                <i className='pnm-check size-4' />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    );
                  })}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
    );
  };

  return render();
};

export default MicElms;
