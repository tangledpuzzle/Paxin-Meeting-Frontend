import React, { FC, useState } from 'react';
import Image from 'next/image';
import { BsCloudUpload } from 'react-icons/bs';
import { LiaTimesSolid } from 'react-icons/lia';

import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface PreviewImageProps {
  src: string;
  name: string;
  size: number;
  onRemove: () => void;
}

const PreviewImage: FC<PreviewImageProps> = ({ src, name, size, onRemove }) => (
  <div className='relative size-24'>
    <Image src={src} alt='' style={{ objectFit: 'cover' }} fill />
    <Button
      variant='destructive'
      className='absolute right-1 top-1 z-30 size-6 rounded-full'
      onClick={onRemove}
      size='icon'
    >
      <LiaTimesSolid className='size-4' />
    </Button>
    <div className='absolute left-1 top-1 flex w-16 flex-col'>
      <span className='line-clamp-1 text-sm text-secondary-foreground'>
        {name} a sd fa sdfasdfasdf
      </span>
      <span className='line-clamp-1 text-xs text-muted-foreground'>
        {(size / 1024).toFixed(2)}KB
      </span>
    </div>
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

    console.log(images);

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
            name={file.name}
            size={file.size}
            onRemove={() => removeImage(index)}
          />
        ))}
      </div>
    </div>
  );
};
