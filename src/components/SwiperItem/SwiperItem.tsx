import { FC } from 'react';

import './SwiperItem.css';
import { SwiperItemType } from 'types';

export type Props = SwiperItemType;

const SwiperItem: FC<Props> = ({ content }: Props) => {
  return (
    <li className="swiper-item-container">
      <span className="swiper-item-content">{content}</span>
    </li>
  );
};

export default SwiperItem;
