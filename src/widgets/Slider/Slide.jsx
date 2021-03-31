import React from 'react';

const Slide = ({ title, content }) => {
  return (
    <span className='slide'>
      <h1 className='title'>{title}</h1>
      <p className='content'>{content}</p>
    </span>
  );
};

export default Slide;
