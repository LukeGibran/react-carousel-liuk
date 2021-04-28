import React from 'react';

import SingleSlide from '../widgets/Slider/SingleSlide';
import MultipleSlide from '../widgets/Slider/MultipleSlide';

const Carousel = ({ infinite, sliderButtons, multiple, children }) => {
  return (
    <>
      <section className='main-carousel'>
        {multiple ? (
          <MultipleSlide
            infinite={infinite}
            sliderButtons={sliderButtons}
            multiple={multiple}
            content={children}
          />
        ) : (
          <SingleSlide
            infinite={infinite}
            sliderButtons={sliderButtons}
            content={children}
          />
        )}
      </section>
    </>
  );
};

export default Carousel;
