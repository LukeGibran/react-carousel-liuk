import React from 'react';

const SelectBtn = ({ selectSlide, slidesLength, index }) => {
  const items = [];

  for (let x = 0; x < slidesLength; x++) {
    items.push(
      <li
        key={x}
        className={`selectItem ${index === x ? 'selected' : ''}`}
        onClick={() => selectSlide(x)}
      ></li>
    );
  }
  return <ul className='selectItems'>{items}</ul>;
};

export default SelectBtn;
