import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { getDevices } from '@/helpers/utils';
import { IMediaDevice } from '@/store/slices/interfaces/roomSettings';
import { addAudioDevices } from '@/store/slices/roomSettingsSlice';
import { useAppDispatch } from '@/store/hook';
import { useTranslations } from 'next-intl';

interface MicrophoneModalProps {
  show: boolean;
  onCloseMicrophoneModal: (deviceId?: string) => void;
}
const MicrophoneModal = ({
  show,
  onCloseMicrophoneModal,
}: MicrophoneModalProps) => {
  const t = useTranslations('meet');
  const [selectedMic, setSelectMic] = useState<string>('');
  const [devices, setDevices] = useState<Array<JSX.Element>>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getDeviceMics = async () => {
      const mics = await getDevices('audioinput');
      const audioDevices: Array<IMediaDevice> = [];

      const options = mics.map((mic) => {
        const device: IMediaDevice = {
          id: mic.deviceId,
          label: mic.label,
        };
        audioDevices.push(device);

        return (
          <option value={mic.deviceId} key={mic.deviceId}>
            {mic.label}
          </option>
        );
      });

      setDevices(options);
      setSelectMic(mics[0].deviceId);

      if (audioDevices.length) {
        dispatch(addAudioDevices(audioDevices));
      }
    };
    getDeviceMics();
  }, [dispatch]);

  const selectOrClose = (onlyClose = false) => {
    onCloseMicrophoneModal(onlyClose ? undefined : selectedMic);
  };

  const render = () => {
    return (
      <Transition
        show={show}
        enter='transition duration-100 ease-out'
        enterFrom='transform scale-95 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-75 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-95 opacity-0'
      >
        <Dialog
          open={show}
          onClose={() => false}
          className='share-microphone-popup-wrap fixed inset-0 z-[99999] overflow-y-auto'
        >
          <div className='flex min-h-screen items-center justify-center'>
            <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />

            <div className='popup-inner relative w-full max-w-sm rounded-3xl bg-white px-6 py-14 shadow-header dark:bg-darkPrimary'>
              <button
                className='close-btn absolute right-6 top-8 size-[25px] outline-none'
                type='button'
                onClick={() => selectOrClose(true)}
              >
                <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] rotate-45 bg-primaryColor dark:bg-darkText' />
                <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] -rotate-45 bg-primaryColor dark:bg-darkText' />
              </button>
              <Dialog.Title className='mb-6 dark:text-darkText'>
                {t('footer.modal.select-microphone')}
              </Dialog.Title>

              <div className='col-span-6 sm:col-span-3'>
                <select
                  value={selectedMic}
                  onChange={(e) => setSelectMic(e.target.value)}
                  className='mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-darkText dark:text-darkText sm:text-sm'
                >
                  {devices}
                </select>
              </div>

              <div className='py-3 text-right'>
                <button
                  className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondaryColor focus:outline-none'
                  onClick={() => selectOrClose()}
                >
                  {t('join')}
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  };
  return <>{render()}</>;
};

export default MicrophoneModal;
