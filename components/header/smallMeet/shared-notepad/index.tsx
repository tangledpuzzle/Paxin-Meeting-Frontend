import React, { useEffect, useState, useRef } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import Draggable, {
  ControlPosition,
  DraggableData,
  DraggableEvent,
} from 'react-draggable';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { updateIsActiveSharedNotePad } from '@/store/slices/bottomIconsActivitySlice';
import { useLocale } from 'next-intl';

const sharedNotepadFeaturesSelector = createSelector(
  (state: RootState) => state.session.currentRoom.metadata?.room_features,
  (room_features) => room_features?.shared_note_pad_features
);
const lockSharedNotepadSelector = createSelector(
  (state: RootState) => state.session.currentUser?.metadata?.lock_settings,
  (lock_settings) => lock_settings?.lock_shared_notepad
);
const themeSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.theme
);
const isActiveSharedNotePadSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.isActiveSharedNotePad
);

const SharedNotepadElement = () => {
  const sharedNotepadFeatures = useAppSelector(sharedNotepadFeaturesSelector);
  const lockSharedNotepad = useAppSelector(lockSharedNotepadSelector);
  const theme = useAppSelector(themeSelector);
  const isActiveSharedNotePad = useAppSelector(isActiveSharedNotePadSelector);
  const lang = useLocale();
  const dispatch = useAppDispatch();
  const nodeRef = useRef(null);

  const currentUser = store.getState().session.currentUser;
  const [loaded, setLoaded] = useState<boolean>();
  const [url, setUrl] = useState<string | null>();
  const [currentPosition, setCurrentPosition] = useState<
    ControlPosition | undefined
  >(undefined);

  const getUserColor = () => {
    let userColor = sessionStorage.getItem('shared-notepad-user-color');
    if (!userColor) {
      userColor = ((Math.random() * 0xffffff) << 0)
        .toString(16)
        .padStart(6, '0');
      sessionStorage.setItem('shared-notepad-user-color', userColor);
    }

    return userColor;
  };

  useEffect(() => {
    if (sharedNotepadFeatures?.is_active && sharedNotepadFeatures.host) {
      let url = sharedNotepadFeatures.host;
      if (sharedNotepadFeatures.host.match('host.docker.internal')) {
        url = 'http://localhost:9001';
      }

      if (currentUser?.isRecorder) {
        setUrl(
          `${url}/p/${sharedNotepadFeatures.read_only_pad_id}?userName=${currentUser?.name}`
        );
        return;
      }

      if (!lockSharedNotepad) {
        url = `${url}/p/${sharedNotepadFeatures.note_pad_id}?userName=${currentUser?.name}`;
      } else {
        url = `${url}/p/${sharedNotepadFeatures.read_only_pad_id}?userName=${currentUser?.name}`;
      }

      url += '&userColor=%23' + getUserColor() + '&lang=' + lang;

      if (theme === 'dark') {
        url += '&theme=monokai';
      } else {
        url += '&theme=normal';
      }

      setUrl(url);
    } else {
      setUrl(null);
    }
    //eslint-disable-next-line
  }, [sharedNotepadFeatures, lockSharedNotepad, theme, lang]);

  const onLoad = () => {
    setLoaded(true);
  };

  const minimizePad = () => {
    dispatch(updateIsActiveSharedNotePad(false));
  };

  const onStopDrag = (_e: DraggableEvent, data: DraggableData) => {
    setCurrentPosition({ x: data.lastX, y: data.lastY });
  };

  return (
    <>
      {url ? (
        <div
          className={
            isActiveSharedNotePad
              ? 'notepadMainParent pointer-events-none absolute left-0 top-0 z-10 size-full'
              : 'hidden'
          }
        >
          <div className='mt-9 flex h-[calc(100%-50px)] items-end justify-end'>
            <Draggable
              handle='#draggable-h1'
              nodeRef={nodeRef}
              onStop={onStopDrag}
              position={
                isActiveSharedNotePad ? currentPosition : { x: 0, y: 0 }
              }
            >
              <div
                className='notepad-wrapper pointer-events-auto relative h-[calc(100%-80px)] max-h-[500px] w-full max-w-[400px] cursor-move'
                ref={nodeRef}
              >
                <div
                  id='draggable-h1'
                  className='absolute left-0 top-2 flex h-7 w-full items-center justify-center text-sm text-white md:top-0'
                ></div>
                <div
                  className='hide-icon absolute flex h-7 w-16 cursor-pointer items-center pl-2'
                  onClick={minimizePad}
                >
                  <div className='line h-0.5 w-6 bg-white'></div>
                </div>
                <div className='inner size-full border-t-[28px] border-solid border-primaryColor'>
                  {!loaded ? (
                    <div className='loading absolute left-[50%] top-[40%] flex justify-center'>
                      <div className='lds-ripple'>
                        <div className='border-secondaryColor'></div>
                        <div className='border-secondaryColor'></div>
                      </div>
                    </div>
                  ) : null}
                  <iframe
                    height='100%'
                    width='100%'
                    src={url}
                    onLoad={onLoad}
                  />
                </div>
              </div>
            </Draggable>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SharedNotepadElement;
