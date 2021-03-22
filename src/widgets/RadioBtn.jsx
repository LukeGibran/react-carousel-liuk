import React from 'react';
import PropTypes from 'prop-types';

const RadioBtn = ({ isChecked, text, initialValue }) => {
  return (
    <div className='radio'>
      <p className='radio-text'>{text}</p>
      <label className='switch'>
        <input
          type='checkbox'
          value={initialValue}
          onClick={({ target: { checked } }) => isChecked(checked)}
        />
        <span className='slider round'></span>
      </label>
    </div>
  );
};

RadioBtn.propTypes = {
  isChecked: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  initialValue: PropTypes.bool.isRequired,
};

export default RadioBtn;
