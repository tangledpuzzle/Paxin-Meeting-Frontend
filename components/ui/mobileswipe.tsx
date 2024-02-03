import React from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;


interface SwipeProps {
    containerRef: React.RefObject<HTMLDivElement>;
    containerWidth: number;
    onSwipePrev: () => void;
    onSwipeNext: () => void;
  }

  
export const useSwipe = () => {
  
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
    
  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 50;

  const onTouchStart = () => (ev: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(ev.targetTouches[0].clientX);
  };

  const onTouchMove = () => (ev: React.TouchEvent) => {
    setTouchEnd(ev.targetTouches[0].clientX);
  };

  const onTouchEnd = (apiObj: scrollVisibilityApiType) => () => {
    if (!touchStart || !touchEnd) return false;
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > minSwipeDistance;
    const isLeftSwipe = distance < minSwipeDistance;
    if (isSwipe) {
      if (isLeftSwipe) {
        apiObj.scrollPrev();
      } else {
        apiObj.scrollNext();
      }
    }
  };

  return { onTouchStart, onTouchEnd, onTouchMove };
};
