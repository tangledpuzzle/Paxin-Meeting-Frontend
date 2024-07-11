'use client';

import React from 'react';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import 'react-horizontal-scrolling-menu/dist/styles.css';

import { LeftArrow, RightArrow } from '@/components/ui/arrow';
import { CardSlide } from '@/components/ui/slidecard';
import { useSwipe } from '@/components/ui/mobileswipe';

import usePreventBodyScroll from '@/components/ui/scrollmouse';

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

interface TagSliderProps {
  tags: string[];
  mode?: string;
}

const elemPrefix = 'test';
const getId = (index: number) => `${elemPrefix}${index}`;

function TagSlider({ tags, mode }: TagSliderProps) {
  const items = tags.map((tag, index) => ({ id: getId(index), tag }));

  const { onTouchEnd, onTouchMove, onTouchStart } = useSwipe();
  const { disableScroll, enableScroll } = usePreventBodyScroll();

  const [selected, setSelected] = React.useState<string>('');
  const handleItemClick = (itemId: string) => () => {
    setSelected(selected !== itemId ? itemId : '');
  };

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  const itemWidth = containerWidth / 2 || 160;
  const itemMargin = `${containerWidth / 4}px` || '50px';

  React.useEffect(() => {
    if (containerRef.current && !containerWidth) {
      // 96 is width of both arrows
      setContainerWidth(containerRef.current.clientWidth - 96);
    }
  }, [containerRef, containerWidth]);

  React.useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 96);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div ref={containerRef}>
        <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
          <ScrollMenu
            LeftArrow={LeftArrow}
            RightArrow={RightArrow}
            onWheel={onWheel}
            onTouchEnd={onTouchEnd}
            onTouchMove={onTouchMove}
            onTouchStart={onTouchStart}
          >
            {items.map(({ id, tag }) => (
              <CardSlide
                title={tag}
                itemId={id} // NOTE: itemId is required for track items
                key={id}
                width={itemWidth + 'px'}
                margin={itemMargin}
                onClick={handleItemClick(id)}
                selected={id === selected}
              />
            ))}
          </ScrollMenu>
        </div>
      </div>
    </>
  );
}

export { TagSlider };

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}
