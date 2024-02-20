import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import useResumableFilesUpload from '@/helpers/hooks/useResumableFilesUpload';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import { updateShowExternalMediaPlayerModal } from '@/store/slices/bottomIconsActivitySlice';
import { useAppDispatch } from '@/store';
import {
  CommonResponse,
  ExternalMediaPlayerReq,
  ExternalMediaPlayerTask,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { useTranslations } from 'next-intl';

const Upload = () => {
  const t = useTranslations('meet');
  const dispatch = useAppDispatch();

  const [files, setFiles] = useState<Array<File>>();
  const [tmpFiles, setTmpFiles] = useState<Array<File>>();
  const allowedFileTypes = ['mp4', 'mp3', 'webm'];

  const { isUploading, result } = useResumableFilesUpload({
    allowedFileTypes: allowedFileTypes,
    maxFileSize: undefined,
    files,
  });

  useEffect(() => {
    const sendPlaybackLink = async (playBackUrl: string) => {
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

    if (result && result.filePath) {
      const playback =
        process.env.NEXT_PUBLIC_PAXMEET_SERVER_URL +
        '/download/uploadedFile/' +
        result.filePath;

      sendPlaybackLink(playback);
    }
    //eslint-disable-next-line
  }, [result]);

  const upload = () => {
    if (!isUploading && tmpFiles) {
      setFiles([...tmpFiles]);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) {
      return;
    }
    setTmpFiles([...files]);
  };

  return (
    <>
      <div className='ex-m-p-file-upload relative mb-[50px] mt-[10px] h-[80px]'>
        <div className='absolute -bottom-[30px] dark:text-darkText'>
          {t('footer.modal.external-media-player-upload-supported-files', {
            files: allowedFileTypes.map((type) => '.' + type).join(', '),
          })}
        </div>
        <input
          type='file'
          id='chat-file'
          accept={allowedFileTypes.map((type) => '.' + type).join(',')}
          onChange={(e) => onChange(e)}
          className='absolute left-0 top-0 h-full w-full cursor-pointer rounded border border-dashed border-primaryColor px-5 py-[28px] dark:border-darkText dark:text-darkText'
        />
      </div>
      <div className='mt-4 bg-gray-50 pb-3 pt-4 text-right dark:bg-transparent'>
        <button
          className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondaryColor focus:bg-secondaryColor focus:outline-none focus:ring-2 focus:ring-offset-2'
          disabled={isUploading}
          onClick={() => upload()}
        >
          {t('footer.modal.external-media-player-upload-file-play')}
        </button>
      </div>
    </>
  );
};

export default Upload;
