import React, { Component } from 'react';

import CheckBox from '../widgets/CheckBox';
import SelectBox from '../widgets/SelectBox';

import SingleSlide from '../widgets/Slider/SingleSlide';
import MultipleSlide from '../widgets/Slider/MultipleSlide';

import { CONTENT } from '../_data/data';

export class CarouselComponent extends Component {
  constructor() {
    super();
    this.state = {
      infinite: false,
      multiple: false,
      contentCurrentValue: CONTENT[0],
      sliderButtons: true,
    };
  }

  isInfinite = () => {
    this.setState({ infinite: !this.state.infinite });
  };

  isMultiple = () => {
    this.setState({ multiple: !this.state.multiple });
  };

  isSliderButtons = () => {
    this.setState({ sliderButtons: !this.state.sliderButtons });
  };

  setContentCurrentValue = (value) => {
    this.setState({ contentCurrentValue: value });
  };

  render() {
    const {
      isInfinite,
      isMultiple,
      isSliderButtons,
      setContentCurrentValue,
      state: { infinite, sliderButtons, contentCurrentValue, multiple },
    } = this;
    return (
      <>
        <section className='carousel-options'>
          <div className='options'>
            <CheckBox
              text='Infinite'
              isChecked={isInfinite}
              initialValue={infinite}
            />
            <CheckBox
              text='Multiple'
              isChecked={isMultiple}
              initialValue={multiple}
            />
            <CheckBox
              text='Slider Buttons'
              isChecked={isSliderButtons}
              initialValue={sliderButtons}
            />
            <SelectBox
              text='Content'
              options={CONTENT}
              reCurrentValue={setContentCurrentValue}
            />
          </div>
        </section>
        <section className='main-carousel'>
          {multiple ? (
            <MultipleSlide
              infinite={infinite}
              sliderButtons={sliderButtons}
              contentValue={contentCurrentValue}
              multiple={multiple}
            />
          ) : (
            <SingleSlide
              infinite={infinite}
              sliderButtons={sliderButtons}
              contentValue={contentCurrentValue}
            />
          )}
        </section>
      </>
    );
  }
}

export default CarouselComponent;
