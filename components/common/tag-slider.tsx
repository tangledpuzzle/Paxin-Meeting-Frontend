import { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Carousel } from 'react-responsive-carousel';

import { Button } from '@/components/ui/button';
import { TagBadge } from '@/components/common/tag-badge';

import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '@/styles/slider.css';

interface TagSliderProps {
  tags: string[];
}

function SliderNextArrow(props: any) {
  const { onClick } = props;
  return (
    <div className='absolute right-0 top-[10px] z-10 flex h-full items-center justify-center'>
      <Button className='size-6 rounded-full' onClick={onClick} size='icon'>
        <ChevronRightIcon className='size-5 text-white' />
      </Button>
    </div>
  );
}

function SliderPrevArrow(props: any) {
  const { onClick } = props;
  return (
    <div className='absolute left-0 top-[10px] z-10 flex h-full items-center justify-center'>
      <Button className='size-6 rounded-full' onClick={onClick} size='icon'>
        <ChevronLeftIcon className='size-5 text-white' />
      </Button>
    </div>
  );
}

function TagSlider({ tags }: TagSliderProps) {
  const [sliderNeeded, setSliderNeeded] = useState(false);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tagContainerRef.current) {
      let parentWidth = tagContainerRef.current?.offsetWidth;

      let childrenWidth = Array.from(tagContainerRef.current.children).reduce(
        (acc, child) => acc + (child as HTMLDivElement).offsetWidth,
        0
      );

      setSliderNeeded(childrenWidth >= parentWidth);
    }
  }, [tags]);

  return sliderNeeded ? (
    <Carousel
      showIndicators={false}
      showStatus={false}
      renderArrowPrev={(onClick) => <SliderPrevArrow onClick={onClick} />}
      renderArrowNext={(onClick) => <SliderNextArrow onClick={onClick} />}
    >
      {tags.map((tag, index) => (
        <TagBadge key={index}>{tag}</TagBadge>
      ))}
    </Carousel>
  ) : (
    <div
      ref={tagContainerRef}
      className={sliderNeeded ? '' : 'flex w-full max-w-full gap-2'}
    >
      {tags.map((tag, index) => (
        <TagBadge key={index}>{tag}</TagBadge>
      ))}
    </div>
  );
}

export { TagSlider };
