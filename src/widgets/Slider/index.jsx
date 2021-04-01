import React, { Component } from 'react';

import Slide from './Slide';

import { SLIDE_DATA } from '../../_data/data';

class index extends Component {
  constructor() {
    super();
    this.slider = React.createRef();
    this.sliderItems = React.createRef();
    this.prev = React.createRef();
    this.next = React.createRef();

    this.slide = this.slide.bind(this);
  }

  slide() {
    const { slider, sliderItems, next, prev } = this;
    var posX1 = 0,
      posX2 = 0,
      posInitial,
      posFinal,
      threshold = 100,
      slides = sliderItems.current.children,
      slidesLength = slides.length,
      slideSize = sliderItems.current.children[0].offsetWidth,
      firstSlide = slides[0],
      lastSlide = slides[slidesLength - 1],
      cloneFirst = firstSlide.cloneNode(true),
      cloneLast = lastSlide.cloneNode(true),
      index = 0,
      allowShift = true;

    // Clone the first slide and last and attached them in the opposite direction
    sliderItems.current.appendChild(cloneFirst);
    sliderItems.current.insertBefore(cloneLast, firstSlide);

    // Add the loaded class to determine if the slides have been rendered
    slider.current.classList.add('loaded');

    // Mouse Events
    sliderItems.current.onmousedown = dragStart;

    // Touch Events
    sliderItems.current.addEventListener('touchstart', dragStart);
    sliderItems.current.addEventListener('touchend', dragEnd);
    sliderItems.current.addEventListener('touchmove', dragAction);

    // Click Events
    prev.current.addEventListener('click', function () {
      shiftSlide(-1);
    });

    next.current.addEventListener('click', function () {
      shiftSlide(1);
    });

    // Transition Events
    sliderItems.current.addEventListener('transitionend', checkIndex);

    function dragStart(e) {
      e = e || window.event;

      e.preventDefault();
      posInitial = sliderItems.current.offsetLeft;

      if (e.type == 'touchstart') {
        posX1 = e.touches[0].clientX;
      } else {
        posX1 = e.clientX;
        document.onmouseup = dragEnd;
        document.onmousemove = dragAction;
      }
    }

    function dragAction(e) {
      e = e || window.event;

      if (e.type == 'touchmove') {
        posX2 = posX1 - e.touches[0].clientX;
        posX1 = e.touches[0].clientX;
      } else {
        posX2 = posX1 - e.clientX;
        posX1 = e.clientX;
      }

      sliderItems.current.style.left =
        sliderItems.current.offsetLeft - posX2 + 'px';
    }

    function dragEnd() {
      posFinal = sliderItems.current.offsetLeft;
      if (posFinal - posInitial < -threshold) {
        shiftSlide(1, 'drag');
      } else if (posFinal - posInitial > threshold) {
        shiftSlide(-1, 'drag');
      } else {
        sliderItems.current.style.left = posInitial + 'px';
      }

      document.onmouseup = null;
      document.onmousemove = null;
    }

    function shiftSlide(dir, action) {
      sliderItems.current.classList.add('shifting');

      if (allowShift) {
        if (!action) {
          posInitial = sliderItems.current.offsetLeft;
        }

        if (dir == 1) {
          sliderItems.current.style.left = posInitial - slideSize + 'px';
          index++;
        } else if (dir == -1) {
          sliderItems.current.style.left = posInitial + slideSize + 'px';
          index--;
        }
      }

      allowShift = false;
    }

    function checkIndex() {
      sliderItems.current.classList.remove('shifting');

      if (index == -1) {
        sliderItems.current.style.left = -(slidesLength * slideSize) + 'px';
        index = slidesLength - 1;
      }

      if (index == slidesLength) {
        sliderItems.current.style.left = -(1 * slideSize) + 'px';
        index = 0;
      }

      allowShift = true;
    }
  }

  componentDidMount() {
    this.slide();
  }
  render() {
    return (
      <div id='slider' className='slider' ref={this.slider}>
        <div className='wrapper'>
          <div className='inner-slides'>
            <div id='slides' className='slides' ref={this.sliderItems}>
              {SLIDE_DATA.map((data, i) => (
                <Slide key={i} {...data} />
              ))}
            </div>
          </div>
          <a id='prev' className='control prev' ref={this.prev}></a>
          <a id='next' className='control next' ref={this.next}></a>
        </div>
      </div>
    );
  }
}

export default index;
