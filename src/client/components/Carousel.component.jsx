import React, { Component } from 'react';

import Radio from '../widgets/RadioBtn';
import SelectBox from '../widgets/SelectBox';

export class CarouselComponent extends Component {
  constructor() {
    super();
    this.state = {
      infinite: false,
      multiple: false,
    };
  }

  isInfinite = (value) => {
    this.setState({ ...this.state, infinite: value });
  };

  isMultiple = (value) => {
    this.setState({ ...this.state, multiple: value });
  };

  render() {
    const {
      isInfinite,
      isMultiple,
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
            options={['option 1', 'option 2', 'option 4']}
          />
        </div>
      </section>
    );
  }
}

export default CarouselComponent;
