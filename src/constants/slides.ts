import { SwiperItemType } from 'types';

export const SwiperData: Array<SwiperItemType> = [...Array(10).keys()].map(
  (_, index) => ({ content: `Slide ${index + 1}` }),
);
