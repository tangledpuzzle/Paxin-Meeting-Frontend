import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import Image from 'next/image';
import {
  BackgroundConfig,
  backgroundImageUrls,
  defaultBackgroundConfig,
} from '../../../virtual-background/helpers/backgroundHelper';
import useResumableFilesUpload from '@/helpers/hooks/useResumableFilesUpload';
import { useTranslations } from 'next-intl';

interface IBackgroundItemsProps {
  onSelect: (bg: BackgroundConfig) => void;
}

const BackgroundItems = ({ onSelect }: IBackgroundItemsProps) => {
  const allowedFileTypes = ['jpg', 'jpeg', 'png'];
  const t = useTranslations('meet');

  const [selectedBg, setSelectedBg] = useState<BackgroundConfig>(
    defaultBackgroundConfig
  );
  const [bgImgs, setBgImgs] = useState<Array<string>>(backgroundImageUrls);
  const [files, setFiles] = useState<Array<File>>();
  const customFileRef = useRef<HTMLInputElement>(null);

  const { isUploading, result } = useResumableFilesUpload({
    allowedFileTypes,
    maxFileSize: '30',
    files,
  });

  useEffect(() => {
    if (result && result.filePath) {
      const path =
        process.env.NEXT_PUBLIC_PAXMEET_SERVER_URL +
        '/download/uploadedFile/' +
        result.filePath;

      const newBgImgs = [...bgImgs];
      newBgImgs.push(path);
      setBgImgs([...newBgImgs]);

      const el = customFileRef.current;
      if (el) {
        el.value = '';
      }
    }
    //eslint-disable-next-line
  }, [result, customFileRef]);

  const handleOnClick = (type: string, url: string) => {
    const bg: BackgroundConfig = {
      //@ts-expect-error: no sms
      type,
      url,
    };
    setSelectedBg(bg);
    onSelect(bg);
  };

  const customBgImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (isUploading) {
      return;
    }
    const files = e.target.files;
    if (!files) {
      return;
    }
    setFiles([...files]);
  };

  return (
    <div className='flex flex-wrap items-center justify-start bg-slate-100 p-3 shadow-header dark:bg-transparent'>
      <div
        className={`flex size-[62px] scale-90 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-solid border-gray-300 transition ease-in hover:scale-95 dark:border-primaryColor${
          selectedBg.type === 'none'
            ? 'scale-95 border-[#24aef7] dark:border-[#767676]'
            : ''
        }`}
        onClick={() => handleOnClick('none', '')}
      >
        <i className='pnm-ban-solid dark:text-darkSecondary2' />
      </div>
      <div
        className={`flex size-[62px] scale-90 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-solid border-gray-300 transition ease-in hover:scale-95 dark:border-primaryColor${
          selectedBg.type === 'blur'
            ? 'scale-95 border-[#24aef7] dark:border-[#767676]'
            : ''
        }`}
        onClick={() => handleOnClick('blur', '')}
      >
        <i className='pnm-blur dark:text-darkSecondary2' />
      </div>
      {bgImgs.map((imageUrl, i) => {
        return (
          <div
            className={`flex size-[62px] scale-90 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-solid border-transparent transition ease-in hover:scale-95${
              selectedBg.url === imageUrl ? 'scale-95 border-[#24aef7]' : ''
            }`}
            key={imageUrl}
            onClick={() => handleOnClick('image', imageUrl)}
          >
            <Image
              src={imageUrl}
              alt={`bg-${i + 1}`}
              width={62}
              height={62}
              className={`size-full object-cover`}
            />
          </div>
        );
      })}
      <div className='upload-btn-wrap relative inline-block w-full cursor-pointer overflow-hidden pt-2'>
        <button className='btn cursor-pointer rounded border border-dotted border-[#24aef7] bg-transparent px-4 py-2 text-xs text-black'>
          {t('footer.modal.upload-background-image')}
        </button>
        <input
          className='absolute left-0 top-0 size-full cursor-pointer opacity-0 '
          ref={customFileRef}
          type='file'
          onChange={customBgImage}
          accept={allowedFileTypes.map((file) => '.' + file).join(',')}
        />
      </div>
    </div>
  );
};

export default BackgroundItems;
