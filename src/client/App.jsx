import React from 'react';
import './scss/main.scss';

import Navbar from './layouts/Navbar';

import Carousel from './components/Carousel';

const App = () => {
  return (
    <div id='app'>
      <Navbar />
      <Carousel />
    </div>
  );
};

export default App;
