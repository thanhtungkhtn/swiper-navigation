import React, { useState, useRef, FC } from 'react';

import './Swiper.css';
import { SwiperItemType } from 'types';
import { getRefValue, useStateRef } from 'hooks/useStateRef';
import { getTouchEventData } from 'helpers/getTouchEventData';
import SwiperItem from 'components/SwiperItem';

export type Props = {
  items: Array<SwiperItemType>;
};

const SWIPE_LIMIT = 0.6;

const Swiper: FC<Props> = ({ items }: Props) => {
  const containerRef = useRef<HTMLUListElement>(null);
  const containerWidthRef = useRef(0);
  const minOffsetXRef = useRef(0);
  const currentOffsetXRef = useRef(0);
  const startXRef = useRef(0);
  const [offsetX, setOffsetX, offsetXRef] = useStateRef(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const onTouchMove = (e: TouchEvent | MouseEvent) => {
    const currentX = getTouchEventData(e).clientX;
    const diff = getRefValue(startXRef) - currentX;
    let newOffsetX = getRefValue(currentOffsetXRef) - diff;
    const containerWidth = getRefValue(containerWidthRef);

    const maxOffsetX = 0;
    const minOffsetX = getRefValue(minOffsetXRef);

    if (newOffsetX > maxOffsetX) {
      newOffsetX = Math.min(containerWidth * SWIPE_LIMIT, newOffsetX);
    }

    if (newOffsetX < minOffsetX) {
      newOffsetX = Math.min(
        minOffsetX,
        Math.max(newOffsetX, minOffsetX - containerWidth * SWIPE_LIMIT),
      );
    }

    setOffsetX(newOffsetX);
  };

  const getNewOffsetX = (): number => {
    const containerWidth = getRefValue(containerWidthRef);
    const currentOffsetX = getRefValue(currentOffsetXRef);
    let newOffsetX = getRefValue(offsetXRef);
    const diff = currentOffsetX - newOffsetX;

    if (newOffsetX > 0) {
      return 0;
    }

    if (
      Math.floor(Math.abs(diff)) >= Math.floor(containerWidth * SWIPE_LIMIT)
    ) {
      if (diff < 0) {
        // swipe to the left if diff is negative
        return Math.ceil(newOffsetX / containerWidth) * containerWidth;
      }

      if (newOffsetX >= getRefValue(minOffsetXRef)) {
        // swipe to the right if diff is positive
        return Math.floor(newOffsetX / containerWidth) * containerWidth;
      }
      return getRefValue(minOffsetXRef);
    }

    return Math.round(newOffsetX / containerWidth) * containerWidth;
  };

  const onTouchEnd = () => {
    const containerWidth = getRefValue(containerWidthRef);
    const newOffsetX = getNewOffsetX();

    setIsSwiping(false);
    setOffsetX(newOffsetX);
    setCurrentIdx(Math.abs(newOffsetX / containerWidth));

    window.removeEventListener('touchend', onTouchEnd);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('mouseup', onTouchEnd);
    window.removeEventListener('mousemove', onTouchMove);
  };

  const onTouchStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>,
  ) => {
    setIsSwiping(true);

    currentOffsetXRef.current = getRefValue(offsetXRef);
    startXRef.current = getTouchEventData(e).clientX;

    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;

    containerWidthRef.current = containerWidth;
    minOffsetXRef.current = containerWidth - containerEl.scrollWidth;

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('mousemove', onTouchMove);
    window.addEventListener('mouseup', onTouchEnd);
  };

  const indicatorOnClick = (idx: number) => {
    const containerEl = getRefValue(containerRef);
    const containerWidth = containerEl.offsetWidth;
    const numItems = items.length;

    // Calculate the new offset
    let newOffsetX = -(containerWidth * idx);

    // Ensure the index is within the valid range
    if (idx < 0) {
      setCurrentIdx(0);
      newOffsetX = 0;
    } else if (idx >= numItems) {
      // If the index is greater than or equal to the number of items, set it to the last item
      setCurrentIdx(numItems - 1);
      newOffsetX = -(containerWidth * (numItems - 1));
    } else {
      // Index is within the valid range
      setCurrentIdx(idx);
    }
    setOffsetX(newOffsetX);
  };

  return (
    <div
      className="swiper-container"
      onTouchStart={onTouchStart}
      onMouseDown={onTouchStart}
    >
      <ul
        ref={containerRef}
        className={`swiper-list ${isSwiping ? 'is-swiping' : ''}`}
        style={{ transform: `translate3d(${offsetX}px, 0, 0)` }}
      >
        {items.map((item, idx) => (
          <SwiperItem key={idx} {...item} />
        ))}
      </ul>

      <div
        className={`swiper-button-prev ${currentIdx === 0 ? 'disabled' : ''}`}
        onClick={() => indicatorOnClick(currentIdx - 1)}
      />
      <div
        className={`swiper-button-next ${
          currentIdx === items.length - 1 ? 'disabled' : ''
        }`}
        onClick={() => indicatorOnClick(currentIdx + 1)}
      />
    </div>
  );
};

export default Swiper;
