'use client';

import { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

interface GalleryData {
  original: string;
  thumbnail: string;
}

export interface FlowImageGalleryProps {
  images: GalleryData[];
}

function FlowImageGallery({ images }: FlowImageGalleryProps) {
  const [windowWidth, setWindowWidth] = useState<number>(1000);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ImageGallery
      items={images}
      thumbnailPosition={`${windowWidth > 640 ? 'right' : 'bottom'}`}
    />
  );
}

export { FlowImageGallery };
