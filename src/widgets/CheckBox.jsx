import React from 'react';
import PropTypes from 'prop-types';

const CheckBox = ({ isChecked, text, initialValue }) => {
  return (
    <div className='checkbox'>
      <p className='checkbox-text'>{text}</p>
      <label className='switch'>
        <input
          type='checkbox'
          checked={initialValue}
          onChange={() => isChecked()}
        />
        <span className='slider round'></span>
      </label>
    </div>
  );
};

CheckBox.propTypes = {
  isChecked: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  initialValue: PropTypes.bool.isRequired,
};

export default CheckBox;
