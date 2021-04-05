import React, { Component } from 'react';

import CheckBox from '../widgets/CheckBox';
import SelectBox from '../widgets/SelectBox';

import Slider from '../widgets/Slider';

import { CONTENT } from '../_data/data';

export class CarouselComponent extends Component {
  constructor() {
    super();
    this.state = {
      infinite: false,
      multiple: false,
      contentCurrenValue: CONTENT[0],
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
    this.setState({ contentCurrenValue: value });
  };

  render() {
    const {
      isInfinite,
      isMultiple,
      isSliderButtons,
      setContentCurrentValue,
      state: { infinite, multiple, sliderButtons },
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
          <Slider infinite={infinite} sliderButtons={sliderButtons} />
        </section>
      </>
    );
  }
}

export default CarouselComponent;
