import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import ReactPlayer from 'react-player/lazy';
import { toast } from 'react-toastify';

import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import { updateShowExternalMediaPlayerModal } from '@/store/slices/bottomIconsActivitySlice';
import { useAppDispatch } from '@/store';
import {
  CommonResponse,
  ExternalMediaPlayerReq,
  ExternalMediaPlayerTask,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { useTranslations } from 'next-intl';

const DirectLink = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  const [playBackUrl, setPlayBackUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>();

  const onChangeUrl = (e: {
    currentTarget: { value: React.SetStateAction<string> };
  }) => {
    if (errorMsg) {
      setErrorMsg(undefined);
    }
    setPlayBackUrl(e.currentTarget.value);
  };

  const startPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEmpty(playBackUrl)) {
      setErrorMsg(
        t('footer.notice.external-media-player-url-required').toString()
      );
      return;
    }

    if (!ReactPlayer.canPlay(playBackUrl)) {
      setErrorMsg(
        t('footer.notice.external-media-player-url-invalid').toString()
      );
      return;
    }

    setErrorMsg(undefined);
    dispatch(updateShowExternalMediaPlayerModal(false));

    const id = toast.loading(
      t('footer.notice.external-media-player-starting'),
      {
        type: 'info',
      }
    );

    const body = new ExternalMediaPlayerReq({
      task: ExternalMediaPlayerTask.START_PLAYBACK,
      url: playBackUrl,
    });
    const r = await sendAPIRequest(
      'externalMediaPlayer',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (!res.status) {
      toast.update(id, {
        // @ts-ignore
        render: t(res.msg),
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
    }

    toast.dismiss(id);
    dispatch(updateShowExternalMediaPlayerModal(false));
  };

  return (
    <form method='POST' onSubmit={(e) => startPlayer(e)}>
      <div className='s'>
        <div className=''>
          <div className=''>
            <label
              htmlFor='stream-key'
              className='block text-sm font-medium text-gray-700 dark:text-darkText'
            >
              {t('footer.modal.external-media-player-url')}
            </label>
            <input
              type='text'
              name='stream-key'
              id='stream-key'
              value={playBackUrl}
              onChange={onChangeUrl}
              className='mt-1 block h-10 w-full rounded-md border border-solid border-black/50 bg-transparent px-2 shadow-sm autofill:bg-transparent focus:border-indigo-500 focus:ring-indigo-500 dark:border-darkText dark:text-darkText sm:text-sm'
            />
            {errorMsg ? (
              <div className='error-msg absolute py-2 text-xs text-red-600'>
                {errorMsg}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className='mt-4 bg-gray-50 pb-3 pt-4 text-right dark:bg-transparent'>
        <button
          type='submit'
          className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondaryColor focus:bg-secondaryColor focus:outline-none focus:ring-2 focus:ring-offset-2'
        >
          {t('footer.modal.external-media-player-play')}
        </button>
      </div>
    </form>
  );
};

export default DirectLink;
