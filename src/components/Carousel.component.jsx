import React, { Component } from 'react';

import Radio from '../widgets/RadioBtn';
import SelectBox from '../widgets/SelectBox';

import { CONTENT } from '../_data/data';

export class CarouselComponent extends Component {
  constructor() {
    super();
    this.state = {
      infinite: false,
      multiple: false,
      contentCurrenValue: CONTENT[0],
    };
  }

  isInfinite = (value) => {
    this.setState({ ...this.state, infinite: value });
  };

  isMultiple = (value) => {
    this.setState({ ...this.state, multiple: value });
  };

  setContentCurrentValue = (value) => {
    this.setState({ ...this.state, contentCurrenValue: value });
  };

  render() {
    const {
      isInfinite,
      isMultiple,
      setContentCurrentValue,
      state: { infinite, multiple },
    } = this;
    return (
      <section className='carousel'>
        <div className='options'>
          <Radio
            text='Infinite'
            isChecked={isInfinite}
            initialValue={infinite}
          />
          <Radio
            text='Multiple'
            isChecked={isMultiple}
            initialValue={multiple}
          />
          <SelectBox
            text='Content'
            options={CONTENT}
            reCurrentValue={setContentCurrentValue}
          />
        </div>
      </section>
    );
  }
}

export default CarouselComponent;
