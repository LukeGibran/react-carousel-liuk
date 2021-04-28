import React, { useState } from 'react';
import './scss/main.scss';

import Navbar from './layouts/Navbar';

import Carousel from './components/Carousel.component';

import Header from './layouts/Header';
import CheckBox from './widgets/CheckBox';

const App = () => {
  const [infinite, setInfinite] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [sliderButtons, setSliderButtons] = useState(true);

  return (
    <div id='app'>
      <Navbar />
      <Header />
      <section className='carousel-options'>
        <div className='options'>
          <CheckBox
            text='Infinite'
            isChecked={() => setInfinite(!infinite)}
            initialValue={infinite}
          />
          <CheckBox
            text='Multiple'
            isChecked={() => setMultiple(!multiple)}
            initialValue={multiple}
          />
          <CheckBox
            text='Go To Buttons'
            isChecked={() => setSliderButtons(!sliderButtons)}
            initialValue={sliderButtons}
          />
        </div>
      </section>
      {/*  MAIN CAROUSEL COMPONENT */}
      <Carousel
        infinite={infinite}
        multiple={multiple}
        sliderButtons={sliderButtons}
      >
        <div className='slide'>
          <img className='image ' src='https://unsplash.it/801/500' />
          <h1 className='title'>Slide One</h1>
          <p className='content'>This is Slide One</p>
        </div>

        {/* Only Text Example*/}
        <div className='slide'>
          <h1 className='title'>Slide Two</h1>
          <p className='content'>This is Slide Two</p>
        </div>
        {/* END */}

        {/* Only Image Example */}
        <div className='slide'>
          <img className='image' src='https://unsplash.it/800/501' />
        </div>
        {/* END */}

        <div className='slide'>
          <img className='image' src='https://unsplash.it/801/501' />
          <h1 className='title'>Slide Four</h1>
          <p className='content'>This is Slide Four</p>
        </div>
        <div className='slide'>
          <img className='image' src='https://unsplash.it/800/500' />
          <h1 className='title'>Slide Five</h1>
          <p className='content'>This is Slide Five</p>
        </div>
      </Carousel>
      {/* END MAIN CAROUSEL COMPONENT */}
    </div>
  );
};

export default App;
