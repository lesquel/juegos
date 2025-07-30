import { useState, TouchEvent } from 'react';

interface SwipeInput {
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
  onSwipedUp: () => void;
  onSwipedDown: () => void;
}

export const useSwipe = (input: SwipeInput) => {
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd({ x: 0, y: 0 });
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEnd = () => {
    if (!touchStart.x || !touchEnd.x) return;

    const xDistance = touchStart.x - touchEnd.x;
    const yDistance = touchStart.y - touchEnd.y;

    if (Math.abs(xDistance) > Math.abs(yDistance)) { // Horizontal swipe
      const isLeftSwipe = xDistance > minSwipeDistance;
      const isRightSwipe = xDistance < -minSwipeDistance;
      if (isLeftSwipe) input.onSwipedLeft();
      if (isRightSwipe) input.onSwipedRight();
    } else { // Vertical swipe
      const isUpSwipe = yDistance > minSwipeDistance;
      const isDownSwipe = yDistance < -minSwipeDistance;
      if (isUpSwipe) input.onSwipedUp();
      if (isDownSwipe) input.onSwipedDown();
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
};
