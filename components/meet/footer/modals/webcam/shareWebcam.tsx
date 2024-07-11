import React, { useEffect, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { Dialog, Transition } from '@headlessui/react';

import { RootState } from '@/store';
import { useAppSelector, useAppDispatch } from '@/store/hook';
import {
  updateIsActiveWebcam,
  updateShowVideoShareModal,
} from '@/store/slices/bottomIconsActivitySlice';
import { getDevices } from '@/helpers/utils';
import PreviewWebcam from './previewWebcam';
import { addVideoDevices } from '@/store/slices/roomSettingsSlice';
import { IMediaDevice } from '@/store/slices/interfaces/roomSettings';
import { useTranslations } from 'next-intl';

interface IShareWebcamModal {
  onSelectedDevice: (deviceId: string) => void;
}

const showVideoShareModalSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.showVideoShareModal
);

const ShareWebcamModal = ({ onSelectedDevice }: IShareWebcamModal) => {
  const showVideoShareModal = useAppSelector(showVideoShareModalSelector);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [selectedWebcam, setSelectWebcam] = useState<string>('');
  const [devices, setDevices] = useState<Array<JSX.Element>>([]);
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  useEffect(() => {
    const getDeviceWebcams = async () => {
      const mics = await getDevices('videoinput');
      const videoDevices: Array<IMediaDevice> = [];

      const options = mics.map((mic) => {
        const device: IMediaDevice = {
          id: mic.deviceId,
          label: mic.label,
        };
        videoDevices.push(device);

        return (
          <option value={mic.deviceId} key={mic.deviceId}>
            {mic.label}
          </option>
        );
      });
      setDevices(options);
      setSelectWebcam(mics[0].deviceId);

      if (videoDevices.length) {
        dispatch(addVideoDevices(videoDevices));
      }
    };
    getDeviceWebcams();
  }, [dispatch]);

  useEffect(() => {
    if (showVideoShareModal) {
      setIsOpen(true);
    }
  }, [showVideoShareModal]);

  const shareWebcam = async () => {
    onClose();
    if (!selectedWebcam) {
      return;
    }
    onSelectedDevice(selectedWebcam);
  };

  const onClose = () => {
    setIsOpen(false);
    dispatch(updateShowVideoShareModal(false));
    dispatch(updateIsActiveWebcam(false));
  };

  const render = () => {
    if (!showVideoShareModal) {
      return null;
    }

    return (
      <Transition
        show={isOpen}
        enter='transition duration-100 ease-out'
        enterFrom='transform scale-95 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-75 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-95 opacity-0'
      >
        <Dialog
          open={isOpen}
          onClose={() => false}
          className='share-webcam-popup-wrap fixed inset-0 z-[99999] overflow-y-auto'
        >
          <div className='flex min-h-screen items-center justify-center'>
            <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />

            <div className='popup-inner relative w-full max-w-md rounded-3xl bg-white px-6 py-14 shadow-header dark:bg-darkPrimary'>
              <button
                className='close-btn absolute right-6 top-8 size-[25px] outline-none'
                type='button'
                onClick={() => onClose()}
              >
                <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] rotate-45 bg-primaryColor dark:bg-darkText' />
                <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] -rotate-45 bg-primaryColor dark:bg-darkText' />
              </button>
              <Dialog.Title className='mb-6 dark:text-darkText'>
                {t('footer.modal.select-webcam')}
              </Dialog.Title>

              <div className='col-span-6 sm:col-span-3'>
                <select
                  value={selectedWebcam}
                  onChange={(e) => setSelectWebcam(e.target.value)}
                  className='mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-darkText dark:text-darkText sm:text-sm'
                >
                  {devices}
                </select>
              </div>

              <div className='col-span-6 sm:col-span-3'>
                <PreviewWebcam deviceId={selectedWebcam} />
              </div>

              <div className='bg-gray-50 py-3 text-right dark:bg-transparent'>
                <button
                  className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondaryColor focus:outline-none'
                  onClick={() => shareWebcam()}
                >
                  {t('share')}
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

export default ShareWebcamModal;
