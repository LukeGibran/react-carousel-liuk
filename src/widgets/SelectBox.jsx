import React, { useState } from 'react';

import CarretUp from '../assets/img/carretUp.svg';

const SelectBox = ({ text, options, reCurrentValue }) => {
  const [isShow, setIsShow] = useState(false);
  const [currentValue, setCurrentValue] = useState(options[0]);

  const toggleSelect = () => {
    setIsShow(!isShow);
  };

  const setCurrent = ({ target }) => {
    setCurrentValue(target.innerText);
    reCurrentValue(target.innerText);
  };
  return (
    <div className='selectBox'>
      <p className='selecBox-text'>{text}</p>
      <div className={`select ${isShow && 'show'}`} onClick={toggleSelect}>
        <div className='current-option'>{currentValue}</div>
        <img
          src={CarretUp}
          alt='carret down'
          height='20px'
          width='20px'
          className={`select-image ${isShow && 'show'}`}
        />
        <div className={`options ${isShow && 'show'}`}>
          {options.map((option, i) => {
            return (
              <div key={i} className='option' onClick={setCurrent}>
                {option}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectBox;
