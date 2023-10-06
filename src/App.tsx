import React from 'react';
import './App.css';
import Swiper from './components/Swiper';
import { SwiperData } from './constants/slides';

function App() {
  return (
    <div className="container">
      <Swiper items={SwiperData} />
    </div>
  );
}

export default App;
