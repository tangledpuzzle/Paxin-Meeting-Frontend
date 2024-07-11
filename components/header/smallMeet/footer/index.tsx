import React from 'react';
import { Room } from 'livekit-client';
import { createSelector } from '@reduxjs/toolkit';
import { Transition } from '@headlessui/react';

import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';

import WebcamIcon from './icons/webcam';
import MicrophoneIcon from './icons/microphone';

import { toggleFooterVisibility } from '@/store/slices/roomSettingsSlice';
import { useTranslations } from 'next-intl';
// import {
//   CommonResponse,
//   RoomEndAPIReq,
// } from '@/helpers/proto/plugnmeet_common_api_pb';
// import { toast } from 'react-toastify';
// import sendAPIRequest from '@/helpers/api/paxMeetAPI';
// import { useRouter } from 'next/navigation';
// import { RTCContext } from '@/provider/webRTCProvider';
interface IFooterProps {
  currentRoom: Room;
  isRecorder: boolean;
  isMobile: boolean;
}

const footerVisibilitySelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.visibleFooter
);

const Footer = ({ currentRoom, isRecorder, isMobile }: IFooterProps) => {
  // const store = useAppStore();
  // const { clearSession } = useContext(RTCContext);
  const footerVisible = useAppSelector(footerVisibilitySelector);
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  // const [, setShowModal] = useState<boolean>(false);
  // const [alertText, setAlertText] = useState('');
  // const [task] = useState('');
  // const router = useRouter();
  // function goBack() {
  //   router.push('/profile/conference');
  // }
  // const onCloseAlertModal = async (shouldDo = false) => {
  //   setShowModal(false);
  //   if (!shouldDo) {
  //     return;
  //   }

  //   if (task === 'logout') {
  //     // await currentRoom.disconnect();
  //     await clearSession();
  //     goBack();
  //   } else if (task === 'end Room') {
  //     const session = store.getState().session;

  //     const body = new RoomEndAPIReq({
  //       roomId: session.currentRoom.room_id,
  //     });

  //     const r = await sendAPIRequest(
  //       'endRoom',
  //       body.toBinary(),
  //       false,
  //       'application/protobuf',
  //       'arraybuffer'
  //     );
  //     const res = CommonResponse.fromBinary(new Uint8Array(r));
  //     if (!res.status) {
  //       toast(res.msg, {
  //         type: 'error',
  //       });
  //     }
  //     await clearSession();
  //     goBack();
  //   } else if (task == 'stepOut') {
  //     goBack();
  //   }
  // };
  // const alertModal = () => {
  //   return (
  //     <>
  //       <Transition appear show={showModal} as={Fragment}>
  //         <Dialog
  //           as='div'
  //           className='AlertModal fixed inset-0 z-[9999] overflow-y-auto'
  //           onClose={() => false}
  //         >
  //           <div className='min-h-screen px-4 text-center'>
  //             <Transition.Child
  //               as={Fragment}
  //               enter='ease-out duration-300'
  //               enterFrom='opacity-0'
  //               enterTo='opacity-100'
  //               leave='ease-in duration-200'
  //               leaveFrom='opacity-100'
  //               leaveTo='opacity-0'
  //             >
  //               <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
  //             </Transition.Child>

  //             <span
  //               className='inline-block h-screen align-middle'
  //               aria-hidden='true'
  //             >
  //               &#8203;
  //             </span>
  //             <Transition.Child
  //               as={Fragment}
  //               enter='ease-out duration-300'
  //               enterFrom='opacity-0 scale-95'
  //               enterTo='opacity-100 scale-100'
  //               leave='ease-in duration-200'
  //               leaveFrom='opacity-100 scale-100'
  //               leaveTo='opacity-0 scale-95'
  //             >
  //               <div className='my-8 inline-block w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-darkPrimary'>
  //                 <button
  //                   className='close-btn absolute right-6 top-8 size-[25px] outline-none'
  //                   type='button'
  //                   onClick={() => onCloseAlertModal()}
  //                 >
  //                   <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] rotate-45 bg-primaryColor dark:bg-darkText' />
  //                   <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] -rotate-45 bg-primaryColor dark:bg-darkText' />
  //                 </button>

  //                 <Dialog.Title
  //                   as='h3'
  //                   className='text-lg font-medium leading-6 text-gray-900 dark:text-white'
  //                 >
  //                   {t('header.menus.alert.confirm')}
  //                 </Dialog.Title>
  //                 <div className='mt-2'>
  //                   <p className='text-sm text-gray-500 dark:text-darkText'>
  //                     {alertText}
  //                   </p>
  //                 </div>

  //                 <div className='mt-4'>
  //                   <button
  //                     className='inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ltr:mr-4 rtl:ml-4'
  //                     onClick={() => onCloseAlertModal(true)}
  //                   >
  //                     {t('ok')}
  //                   </button>
  //                   <button
  //                     type='button'
  //                     className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:bg-secondaryColor focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
  //                     onClick={() => onCloseAlertModal(false)}
  //                   >
  //                     {t('close')}
  //                   </button>
  //                 </div>
  //               </div>
  //             </Transition.Child>
  //           </div>
  //         </Dialog>
  //       </Transition>
  //     </>
  //   );
  // };
  // const onOpenAlert = (e: string) => {
  //   setTask(e);
  //   if (e === 'logout') {
  //     setAlertText(t('header.menus.alert.logout').toString());
  //   } else if (e === 'end Room') {
  //     setAlertText(t('header.menus.alert.end').toString());
  //   }
  //   setShowModal(true);
  // };

  return (
    <>
      <Transition
        show={footerVisible}
        unmount={false}
        enter='transform duration-200 transition ease-in'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transform duration-200 transition ease-in'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <footer
          className={`light:bg-primary h-[ relative z-[9999] flex${isMobile ? 32 : 55}px] items-center justify-between px-2 shadow-footer dark:bg-darkPrimary md:px-4`}
          style={{ display: isRecorder ? 'none' : '' }}
        >
          <div className='footer-inner flex w-full items-center justify-center rtl:flex-row-reverse'>
            <div className='footer-left relative z-50 flex w-52 items-center justify-center'>
              <WebcamIcon isMobile={isMobile} currentRoom={currentRoom} />
              <MicrophoneIcon isMobile={isMobile} currentRoom={currentRoom} />
            </div>
          </div>
        </footer>
      </Transition>
      {isRecorder ? null : (
        <div
          className={`footer-collapse-arrow group fixed right-0 z-[1] flex h-5 w-[50px] cursor-pointer items-end justify-center rounded-tl-lg bg-white dark:bg-darkPrimary ${
            footerVisible ? 'bottom-[60px] pb-[3px]' : 'bottom-0 pb-[6px]'
          }`}
          onClick={() => dispatch(toggleFooterVisibility())}
        >
          <i
            className={` pnm-arrow-below text-[10px] dark:text-secondaryColor sm:text-[12px] ${
              footerVisible ? '' : 'rotate-180'
            }`}
          ></i>
          <span className='invisible absolute bottom-7 right-0 w-max rounded bg-white px-[10px] py-1 text-[12px] text-darkPrimary opacity-0 transition-all group-hover:visible group-hover:opacity-100 dark:bg-darkPrimary dark:text-white'>
            {footerVisible ? t('footer.hide-footer') : t('footer.show-footer')}
          </span>
        </div>
      )}
    </>
  );
  //eslint-disable-next-line
};

export default Footer;
