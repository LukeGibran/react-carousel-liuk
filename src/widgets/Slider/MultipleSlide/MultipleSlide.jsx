import React from 'react';
import { CONTENT } from '../../../_data/data';

const MultipleSlide = ({ contentValue, data }) => {
  const setBGBlack = {
    position: 'absolute',
    content: '',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    opacity: '0.5',
  };

  const setColor = {
    color: '#fff',
  };

  return (
    <div className='multipleSlide'>
      {/* {data.map(({ title, content, image }, i) => (
        <div
          className='multipleSlideItem'
          key={i}
          style={
            contentValue === CONTENT[0]
              ? null
              : { backgroundImage: `url(${image})` }
          }
        >
          {contentValue === CONTENT[1] ? null : (
            <>
              <h1
                className='title'
                style={contentValue === CONTENT[2] ? setColor : null}
              >
                {title}
              </h1>
              <p
                className='content'
                style={contentValue === CONTENT[2] ? setColor : null}
              >
                {content}
              </p>
            </>
          )}
          <span
            style={
              contentValue === CONTENT[2] ? setBGBlack : { display: 'none' }
            }
          ></span>
        </div>
      ))} */}
      {data}
    </div>
  );
};
export default MultipleSlide;
