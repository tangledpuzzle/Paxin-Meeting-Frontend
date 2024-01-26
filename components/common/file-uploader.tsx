import React, { FC, useState } from 'react';
import Image from 'next/image';
import { BsCloudUpload } from 'react-icons/bs';
import { LiaTimesSolid } from 'react-icons/lia';

import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface PreviewImageProps {
  src: string;
  onRemove: () => void;
}

const PreviewImage: FC<PreviewImageProps> = ({ src, onRemove }) => (
  <div className='relative h-24 w-24'>
    <Image src={src} alt='' style={{ objectFit: 'cover' }} fill />
    <Button
      variant='destructive'
      className='absolute right-1 top-1 h-6 w-6 rounded-full'
      onClick={onRemove}
      size='icon'
    >
      <LiaTimesSolid className='h-4 w-4' />
    </Button>
  </div>
);

export const ImageUpload: FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const hiddenFileInputRef = React.useRef<any>();

  const onClick = () => {
    hiddenFileInputRef.current.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const duplicate = newFiles.some((newFile) =>
      images.some(
        (existingFile) =>
          existingFile.name === newFile.name &&
          existingFile.size === newFile.size &&
          existingFile.type === newFile.type
      )
    );

    if (!duplicate) {
      setImages([...images, ...Array.from(e.target.files)]);
    }

    e.target.value = '';
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!e.dataTransfer.files) return;

    setImages((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  return (
    <div className='flex flex-col items-center space-y-4'>
      <div
        className='flex h-36 w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6'
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <div className='flex flex-col items-center space-y-1'>
          <div className='rounded-full bg-primary/10 p-3 text-primary'>
            <BsCloudUpload className='size-8' />
          </div>
          <div className='flex flex-col items-center'>
            <Label htmlFor='file-upload' className='text-lg'>
              <Button variant='link' className='p-0' onClick={onClick}>
                Click to Upload
              </Button>{' '}
              or drag and drop
            </Label>
            <span className='text-sm text-muted-foreground'>
              (You can upload no more than 10 images)
            </span>
          </div>
        </div>
        <input
          className='hidden'
          ref={hiddenFileInputRef}
          type='file'
          id='file-upload'
          name='file-upload'
          multiple
          onChange={onFileChange}
        />
      </div>

      <div className='flex max-w-full flex-wrap items-center justify-center space-x-2 space-y-2'>
        {images.map((file, index) => (
          <PreviewImage
            key={index}
            src={URL.createObjectURL(file)}
            onRemove={() => removeImage(index)}
          />
        ))}
      </div>
    </div>
  );
};
