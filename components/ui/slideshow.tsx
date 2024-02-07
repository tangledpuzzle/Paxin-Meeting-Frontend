import React, { useState, useEffect } from 'react';
import { RiArrowRightSLine } from "react-icons/ri";
import { RiArrowLeftSLine } from "react-icons/ri";

interface SlideshowProps {
  images: string[];
  interval: number;
}

const Slideshow: React.FC<SlideshowProps> = ({ images, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    let progressInterval: any;

    if (currentIndex < images.length) {
      let progress = 0;
      const step = 1; 

      progressInterval = setInterval(() => {
        progress += step;
        setProgressWidth(progress);

        if (progress >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setCurrentIndex((prevIndex) =>
              prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
            setProgressWidth(0); 
          }, 400); 
        }
      }, interval / 100); 
    }

    return () => clearInterval(progressInterval);
  }, [currentIndex, images, interval]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setProgressWidth(0); 
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setProgressWidth(0); 
  };

  return (
    <div className="slideshow-container relative h-[340px] md:h-[680px] top-4">
      {images.map((image, index) => (
        <div
          key={index}
          className={`fade ${index === currentIndex ? 'active' : ''}`}
          style={{ animationDelay: `${index * interval}ms` }}
        >
          <img src={image} alt={`Slide ${index + 1}`} className='rounded-md' />
        </div>
      ))}
      <div className='absolute flex justify-between w-full px-4 items-center h-full'>
        <div className='text-[24px] bg-cyan-500 rounded-md cursor-pointer' onClick={prevSlide}>
          <RiArrowLeftSLine />
        </div>
        <div className='text-[24px] bg-cyan-500 rounded-md cursor-pointer' onClick={nextSlide}>
          <RiArrowRightSLine />
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progressWidth}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Slideshow;
