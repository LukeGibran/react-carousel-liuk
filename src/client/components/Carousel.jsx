import React, { Component } from 'react';
import Radio from '../widgets/RadioBtn';

export class Carousel extends Component {
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
        </div>
      </section>
    );
  }
}

export default Carousel;
