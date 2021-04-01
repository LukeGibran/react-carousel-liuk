import React, { Component } from 'react';

import Slide from './Slide';

import { SLIDE_DATA } from '../../_data/data';

class index extends Component {
  constructor() {
    super();
    this.slider = React.createRef();
    this.sliderItems = React.createRef();

    this.slide = this.slide.bind(this);
    this.dragAction = this.dragAction.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.shiftSlide = this.shiftSlide.bind(this);
    this.checkIndex = this.checkIndex.bind(this);

    this.state = {
      posX1: 0,
      posX2: 0,
      posInitial: null,
      posFinal: null,
      threshold: 100,
      index: 0,
      allowShift: true,
      buttonClick: 0,
    };
  }

  slide() {
    const { slider, sliderItems, next, prev, state } = this;
    var slides = sliderItems.current.children,
      slidesLength = slides.length,
      slideSize = sliderItems.current.children[0].offsetWidth,
      firstSlide = slides[0],
      lastSlide = slides[slidesLength - 1],
      cloneFirst = firstSlide.cloneNode(true),
      cloneLast = lastSlide.cloneNode(true);

    this.setState({ slidesLength, slideSize });

    // Clone the first slide and last and attached them in the opposite direction
    sliderItems.current.appendChild(cloneFirst);
    sliderItems.current.insertBefore(cloneLast, firstSlide);

    // Add the loaded class to determine if the slides have been rendered
    slider.current.classList.add('loaded');

    // Mouse Events
    sliderItems.current.onmousedown = this.dragStart;

    // Touch Events
    // sliderItems.current.addEventListener('touchstart', dragStart);
    // sliderItems.current.addEventListener('touchend', dragEnd);
    // sliderItems.current.addEventListener('touchmove', dragAction);

    // // Transition Events
    // sliderItems.current.addEventListener('transitionend', checkIndex);
  }
  dragStart(e) {
    e = e || window.event;
    e.preventDefault();

    const { dragEnd, dragAction, sliderItems } = this;

    this.setState({ posInitial: sliderItems.current.offsetLeft });
    // posInitial = sliderItems.current.offsetLeft;

    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  dragAction(e) {
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

  dragEnd() {
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

  shiftSlide(dir, action) {
    const {
      sliderItems,
      state: { index, allowShift },
    } = this;

    sliderItems.current.classList.add('shifting');

    let indexNew;
    if (!action) {
      this.setState({ posInitial: sliderItems.current.offsetLeft });
      // posInitial = sliderItems.current.offsetLeft;
    }

    if (dir == 1) {
      // sliderItems.current.style.left = posInitial - slideSize + 'px';

      indexNew = index + 1;

      this.setState({ index: indexNew, buttonClick: 1 });
      // index++;
    } else if (dir == -1) {
      // sliderItems.current.style.left = posInitial + slideSize + 'px';
      indexNew = index - 1;

      this.setState({ index: indexNew, buttonClick: -1 });
      // index--;
    }

    console.log({ shiftslide: allowShift });
    this.setState({ allowShift: false });
    // allowShift = false;
  }

  checkIndex() {
    const {
      sliderItems,
      state: { slidesLength, slideSize, index },
    } = this;
    sliderItems.current.classList.remove('shifting');

    if (index == -1) {
      sliderItems.current.style.left = -(slidesLength * slideSize) + 'px';
      this.setState({ index: slidesLength - 1 });
    }

    if (index == slidesLength) {
      sliderItems.current.style.left = -(1 * slideSize) + 'px';
      this.setState({ index: 0 });
    }

    this.setState({ allowShift: true });
    // allowShift = true;
  }

  componentDidMount() {
    this.slide();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      sliderItems,
      state: { posInitial, slideSize, buttonClick, allowShift },
    } = this;

    if (!allowShift) {
      if (buttonClick > 0) {
        sliderItems.current.style.left = posInitial - slideSize + 'px';
        console.log('next');
      }
      if (buttonClick < 0) {
        sliderItems.current.style.left = posInitial + slideSize + 'px';
        console.log('prev');
      }
    }

    console.log({ compoenentUpdate: allowShift });
  }
  render() {
    const { dragStart, dragAction, dragEnd, shiftSlide, checkIndex } = this;
    return (
      <div id='slider' className='slider' ref={this.slider}>
        <div className='wrapper'>
          <div className='inner-slides'>
            <div
              id='slides'
              className='slides'
              ref={this.sliderItems}
              onTransitionEnd={checkIndex}
            >
              {SLIDE_DATA.map((data, i) => (
                <Slide
                  onTouchStart={dragStart}
                  onTouchEnd={dragEnd}
                  onTouchMove={dragAction}
                  key={i}
                  {...data}
                />
              ))}
            </div>
          </div>
          <a
            id='prev'
            className='control prev'
            ref={this.prev}
            onClick={() => shiftSlide(-1)}
          ></a>
          <a
            id='next'
            className='control next'
            ref={this.next}
            onClick={() => shiftSlide(1)}
          ></a>
        </div>
      </div>
    );
  }
}

export default index;
