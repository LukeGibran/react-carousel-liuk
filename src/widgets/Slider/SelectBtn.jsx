import React from 'react';

const SelectBtn = ({ selectSlide, slidesLength, index, isMultiple }) => {
  const items = [];

  const colorIfMultiple = {
    border: '2px solid #f6c43f',
  };

  for (let x = 0; x < slidesLength; x++) {
    items.push(
      <li
        key={x}
        className={`selectItem ${index === x ? 'selected' : ''}`}
        onClick={() => selectSlide(x)}
        style={isMultiple ? colorIfMultiple : null}
      ></li>
    );
  }
  return <ul className='selectItems'>{items}</ul>;
};

export default SelectBtn;
