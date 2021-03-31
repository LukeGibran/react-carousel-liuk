import React from 'react';
import './scss/main.scss';

import Navbar from './layouts/Navbar';

import CarouselComponent from './components/Carousel.component';

import Header from './layouts/Header';

const App = () => {
  return (
    <div id='app'>
      <Navbar />
      <Header />
      <CarouselComponent />
    </div>
  );
};

export default App;
