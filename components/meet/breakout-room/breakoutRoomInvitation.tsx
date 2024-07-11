import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { Room, Track } from 'livekit-client';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import copy from 'copy-text-to-clipboard';

import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { updateReceivedInvitationFor } from '@/store/slices/breakoutRoomSlice';
import { useJoinRoomMutation } from '@/store/services/breakoutRoomApi';
import {
  updateIsActiveWebcam,
  updateIsMicMuted,
  updateVirtualBackground,
} from '@/store/slices/bottomIconsActivitySlice';
import { updateSelectedVideoDevice } from '@/store/slices/roomSettingsSlice';
import { JoinBreakoutRoomReq } from '@/helpers/proto/plugnmeet_breakout_room_pb';
import { useTranslations } from 'next-intl';

interface IBreakoutRoomInvitationProps {
  currentRoom: Room;
}

const receivedInvitationForSelector = createSelector(
  (state: RootState) => state.breakoutRoom,
  (breakoutRoom) => breakoutRoom.receivedInvitationFor
);

const BreakoutRoomInvitation = ({
  currentRoom,
}: IBreakoutRoomInvitationProps) => {
  const t = useTranslations('meet');
  const dispatch = useAppDispatch();
  const receivedInvitationFor = useAppSelector(receivedInvitationForSelector);
  const [joinRoom, { isLoading, data }] = useJoinRoomMutation();
  const [joinLink, setJoinLink] = useState<string>('');
  const [copyText, setCopyText] = useState<string>(
    t('breakout-room.copy').toString()
  );
  const [token, setToken] = useState<string>('');

  const closeLocalTracks = useCallback(() => {
    currentRoom.localParticipant.trackPublications.forEach(
      async (publication) => {
        if (!publication.track) {
          return;
        }
        if (publication.track.source === Track.Source.Camera) {
          currentRoom.localParticipant.unpublishTrack(publication.track, true);
          dispatch(updateIsActiveWebcam(false));
          dispatch(updateSelectedVideoDevice(''));
          dispatch(
            updateVirtualBackground({
              type: 'none',
            })
          );
        } else if (publication.track.source === Track.Source.Microphone) {
          if (!publication.isMuted) {
            await publication.track.unmute();
            dispatch(updateIsMicMuted(true));
          }
        }
      }
    );
  }, [currentRoom.localParticipant, dispatch]);

  useEffect(() => {
    if (!isLoading && data) {
      if (!data.status) {
        //@ts-expect-error: no sms
        toast(t(data.msg), {
          type: 'error',
        });
        return;
      }
      setToken(data.token ?? '');
    }
    //eslint-disable-next-line
  }, [isLoading, data]);

  useEffect(() => {
    if (token !== '') {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('access_token', token);
      const url =
        location.protocol +
        '//' +
        location.host +
        window.location.pathname +
        '?' +
        searchParams.toString();

      const opened = window.open(url, '_blank');
      setJoinLink(url);

      if (!opened) {
        setJoinLink(url);
        return;
      }

      dispatch(updateReceivedInvitationFor(''));
      // we should disable running tracks
      closeLocalTracks();
    }
    //eslint-disable-next-line
  }, [token]);

  const closeModal = () => {
    dispatch(updateReceivedInvitationFor(''));
    // we should disable running tracks
    closeLocalTracks();
  };

  const join = () => {
    joinRoom(
      new JoinBreakoutRoomReq({
        breakoutRoomId: receivedInvitationFor,
        userId: currentRoom.localParticipant.identity,
      })
    );
  };

  const copyUrl = () => {
    copy(joinLink);
    setCopyText(t('breakout-room.copied').toString());
  };

  const renderModal = () => {
    return (
      <>
        <Transition appear show={receivedInvitationFor !== ''} as={Fragment}>
          <Dialog
            as='div'
            className='fixed inset-0 z-[9999] overflow-y-auto'
            onClose={() => false}
            static={false}
          >
            <div className='flex min-h-screen items-end justify-end px-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
              </Transition.Child>

              <span
                className='inline-block h-screen align-middle'
                aria-hidden='true'
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <div className='my-4 inline-block h-full w-max transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-darkPrimary'>
                  <button
                    className='close-btn absolute right-6 top-8 h-[25px] w-[25px] outline-none'
                    type='button'
                    onClick={() => closeModal()}
                  >
                    <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] rotate-45 bg-primaryColor dark:bg-darkText' />
                    <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] -rotate-45 bg-primaryColor dark:bg-darkText' />
                  </button>

                  <Dialog.Title
                    as='h3'
                    className='mb-2 text-left text-base font-medium leading-6 text-gray-900 dark:text-darkText'
                  >
                    {t('breakout-room.invitation-title')}
                  </Dialog.Title>
                  <hr />
                  <div className='mt-2'>
                    <span className='text-sm text-black dark:text-darkText'>
                      {t('breakout-room.invitation-msg')}
                    </span>

                    {joinLink !== '' ? (
                      <div className='invite-link'>
                        <label className='text-sm text-black dark:text-darkText'>
                          {t('breakout-room.join-text-label')}
                        </label>
                        <input
                          type='text'
                          readOnly={true}
                          value={joinLink}
                          className='mx-1 inline-block h-7 rounded border border-solid bg-transparent p-1 text-sm outline-none dark:border-darkText dark:text-darkText'
                        />
                        <button
                          onClick={copyUrl}
                          className='rounded-lg bg-primaryColor px-3 py-1 text-center text-xs font-semibold text-white transition ease-in hover:bg-secondaryColor'
                        >
                          {copyText}
                        </button>
                      </div>
                    ) : null}

                    <div className='button-section flex items-center justify-start'>
                      <button
                        className='mt-1 rounded-lg bg-primaryColor px-3 py-1 text-center text-xs font-semibold text-white transition ease-in hover:bg-secondaryColor'
                        onClick={join}
                      >
                        {t('breakout-room.join')}
                      </button>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  };

  return receivedInvitationFor !== '' ? renderModal() : null;
};

export default React.memo(BreakoutRoomInvitation);
