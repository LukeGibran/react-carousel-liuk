import React, { Component } from 'react';

import Slide from './Slide';

import { SLIDE_DATA, NEXT, PREV } from '../../_data/data';

class index extends Component {
  constructor() {
    super();
    this.slider = React.createRef();
    this.sliderItems = React.createRef();

    this.initialize = this.initialize.bind(this);
    this.cloneNodes = this.cloneNodes.bind(this);
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
      buttonClick: '',
    };
  }

  initialize() {
    const { slider, sliderItems } = this;
    let slides = sliderItems.current.children,
      slidesLength = slides.length,
      slideSize = sliderItems.current.children[0].offsetWidth,
      firstSlide = slides[0],
      lastSlide = slides[slidesLength - 1];

    this.setState({ slidesLength, slideSize });

    // Clone the first slide and last and attached them in the opposite direction
    this.cloneNodes(firstSlide, lastSlide);

    // Add the loaded class to determine if the slides have been rendered
    slider.current.classList.add('loaded');

    // Set Initial Position
    this.setState({ posInitial: sliderItems.current.offsetLeft });
    // Mouse Events
    // sliderItems.current.onmousedown = this.dragStart;
  }

  cloneNodes(firstSlide, lastSlide) {
    const { sliderItems } = this;
    let cloneFirst = firstSlide.cloneNode(true),
      cloneLast = lastSlide.cloneNode(true);

    sliderItems.current.appendChild(cloneFirst);
    sliderItems.current.insertBefore(cloneLast, firstSlide);
  }

  dragStart(e) {
    e = e || window.event;
    e.preventDefault();

    const { dragEnd, dragAction, sliderItems } = this;

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
      state: { index },
    } = this;
    let indexNew;

    sliderItems.current.classList.add('shifting');

    if (!action) {
      this.setState({ posInitial: sliderItems.current.offsetLeft });
    }

    switch (dir) {
      case NEXT:
        indexNew = index + 1;
        this.setState({ index: indexNew, buttonClick: NEXT });
        break;
      case PREV:
        indexNew = index - 1;
        this.setState({ index: indexNew, buttonClick: PREV });
        break;
      default:
        return;
    }

    this.setState({ allowShift: false });
  }

  checkIndex() {
    const {
      sliderItems,
      state: { slidesLength, slideSize, index, allowShift },
      props: { infinite },
    } = this;
    sliderItems.current.classList.remove('shifting');

    if (infinite) {
      if (index == -1) {
        sliderItems.current.style.left = -(slidesLength * slideSize) + 'px';
        this.setState({ index: slidesLength - 1 });
      }

      if (index == slidesLength) {
        sliderItems.current.style.left = -(1 * slideSize) + 'px';
        this.setState({ index: 0 });
      }

      if (!allowShift) this.setState({ allowShift: true });
    }
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate() {
    const {
      sliderItems,
      state: { posInitial, slideSize, buttonClick, allowShift },
    } = this;

    if (!allowShift) {
      if (buttonClick === NEXT) {
        sliderItems.current.style.left = posInitial - slideSize + 'px';
      } else if (buttonClick === PREV) {
        sliderItems.current.style.left = posInitial + slideSize + 'px';
      }
    }
  }
  render() {
    const {
      dragStart,
      dragAction,
      dragEnd,
      shiftSlide,
      checkIndex,
      state: { index, slidesLength },
      props: { infinite },
    } = this;
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
                  // onTouchStart={dragStart}
                  // onTouchEnd={dragEnd}
                  // onTouchMove={dragAction}
                  key={i}
                  {...data}
                />
              ))}
            </div>
          </div>
          {index === 0 && !infinite ? null : (
            <a
              id='prev'
              className='control prev'
              ref={this.prev}
              onClick={() => shiftSlide(PREV)}
            ></a>
          )}

          {index === slidesLength - 1 && !infinite ? null : (
            <a
              id='next'
              className='control next'
              ref={this.next}
              onClick={() => shiftSlide(NEXT)}
            ></a>
          )}
        </div>
      </div>
    );
  }
}

export default index;
