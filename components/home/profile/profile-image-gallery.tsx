'use client';

import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

interface GalleryData {
  original: string;
  thumbnail: string;
}

export interface ProfileImageGalleryProps {
  images: GalleryData[];
}

function ProfileImageGallery({ images }: ProfileImageGalleryProps) {
  return <ImageGallery items={images} thumbnailPosition='bottom' />;
}

export { ProfileImageGallery };
