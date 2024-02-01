import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';

import { TagBadge } from '@/components/common/tag-badge';
import { Button } from '@/components/ui/button';

import '@/styles/slider.css';
import Link from 'next/link';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { useSearchParams } from 'next/navigation';

interface TagSliderProps {
  tags: string[];
  mode?: string;
}

function SliderNextArrow(props: any) {
  const { onClick } = props;
  return (
    <div className='absolute right-0 top-[10px] z-10 flex h-full justify-center'>
      <Button className='size-6 rounded-full' onClick={onClick} size='icon'>
        <ChevronRightIcon className='size-5 text-white' />
      </Button>
    </div>
  );
}

function SliderPrevArrow(props: any) {
  const { onClick } = props;
  return (
    <div className='absolute left-0 top-[10px] z-10 flex h-full  justify-center'>
      <Button className='size-6 rounded-full' onClick={onClick} size='icon'>
        <ChevronLeftIcon className='size-5 text-white' />
      </Button>
    </div>
  );
}

function TagSlider({ tags, mode }: TagSliderProps) {
  const searchParams = useSearchParams();
  const [sliderNeeded, setSliderNeeded] = useState(true);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  const queries: { [key: string]: string } = {};

  for (let [key, value] of searchParams.entries()) {
    queries[key] = value;
  }

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
      {tags.map((tag, index) =>
        mode ? (
          <Link href={`/home?mode=${mode}&hashtag=${tag}`} key={index}>
            <TagBadge>{tag}</TagBadge>
          </Link>
        ) : (
          <Link href={{ query: { ...queries, hashtag: tag } }} key={index}>
            <TagBadge key={tag}>{tag}</TagBadge>
          </Link>
        )
      )}
    </Carousel>
  ) : (
    <div
      ref={tagContainerRef}
      className={sliderNeeded ? '' : 'flex w-full max-w-full flex-row gap-2'}
    >
      {tags.map((tag, index) =>
        mode ? (
          <Link href={`/home?mode=${mode}&hashtag=${tag}`} key={index}>
            <TagBadge>{tag}</TagBadge>
          </Link>
        ) : (
          <Link href={{ query: { ...queries, hashtag: tag } }} key={index}>
            <TagBadge key={tag}>{tag}</TagBadge>
          </Link>
        )
      )}
    </div>
  );
}

export { TagSlider };
