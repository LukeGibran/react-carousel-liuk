import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Slide from './Slide';
import SelectBtn from '../SelectBtn';

import {
  SLIDE_DATA,
  NEXT,
  PREV,
  GO_SLIDE,
  LG,
  MD,
  SM,
  XSM,
} from '../../../_data/data';

class index extends Component {
  constructor() {
    super();
    this.slider = React.createRef();
    this.sliderItems = React.createRef();

    this.initialize = this.initialize.bind(this);
    this.cloneNodes = this.cloneNodes.bind(this);
    this.dragMove = this.dragMove.bind(this);
    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.shiftSlide = this.shiftSlide.bind(this);
    this.checkIndex = this.checkIndex.bind(this);
    this.selectSlide = this.selectSlide.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.state = {
      posX1: 0,
      posX2: 0,
      posInitial: 0,
      threshold: 100,
      index: 0,
      allowShift: true,
      buttonClick: '',
      selectedIndex: 0,
      goSlide: '',
      dragging: false,
      newSlideSize: 0,
    };
  }

  initialize() {
    const { slider, sliderItems, dragStart, dragEnd, dragMove } = this;
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

    // Touch Events
    sliderItems.current.addEventListener('touchstart', dragStart);
    sliderItems.current.addEventListener('touchend', dragEnd);
    sliderItems.current.addEventListener('touchmove', dragMove);

    // Set Initial Position
    this.setState({ posInitial: sliderItems.current.offsetLeft });
    // Mouse Events
    sliderItems.current.onmousedown = this.dragStart;

    // Set initial value for newslidesize to be use as comparison value
    this.setState({ newSlideSize: slideSize });

    // Set an event listener to the window object to adjust the width and slidesize depend on the viewport
    window.addEventListener('resize', this.handleResize);
  }

  cloneNodes(firstSlide, lastSlide) {
    const { sliderItems } = this;
    let cloneFirst = firstSlide.cloneNode(true),
      cloneLast = lastSlide.cloneNode(true);

    sliderItems.current.appendChild(cloneFirst);
    sliderItems.current.insertBefore(cloneLast, firstSlide);
  }

  handleResize() {
    const width = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    if (width >= 1024) return this.setState({ newSlideSize: LG });

    if (width >= 768 && width < 1024)
      return this.setState({ newSlideSize: MD });

    if (width >= 424 && width <= 767)
      return this.setState({ newSlideSize: SM });

    if (width >= 320 && width <= 424)
      return this.setState({ newSlideSize: XSM });
  }

  dragStart(e) {
    e = e || window.event;
    e.preventDefault();
    const { sliderItems } = this;

    this.setState({
      posInitial: sliderItems.current.offsetLeft,
      dragging: true,
    });

    sliderItems.current.style.cursor = 'grabbing';
    const { dragEnd, dragMove } = this;
    if (e.type == 'touchstart') {
      this.setState({ posX1: e.touches[0].clientX });
    } else {
      // If event is mousedown
      this.setState({ posX1: e.clientX });
      document.onmouseup = dragEnd;
      document.onmousemove = dragMove;
    }
  }

  dragMove(e) {
    e = e || window.event;

    const {
      sliderItems,
      state: { posX1, posX2, slideSize, slidesLength, dragging },
      props: { infinite },
    } = this;

    if (dragging) {
      if (e.type == 'touchmove') {
        this.setState({
          posX2: posX1 - e.touches[0].clientX,
          posX1: e.touches[0].clientX,
        });
      } else {
        this.setState({ posX2: posX1 - e.clientX, posX1: e.clientX });
      }

      // Check if infinite is false then first and last slide must not be dragged to the left or right
      if (
        parseInt(sliderItems.current.style.left) > -(slideSize - 1) &&
        !infinite
      ) {
        sliderItems.current.style.left = -slideSize + 'px';
        return;
      }
      if (
        parseInt(sliderItems.current.style.left) <
          -(slideSize * slidesLength + 1) &&
        !infinite
      ) {
        sliderItems.current.style.left = -(slidesLength * slideSize) + 'px';
        return;
      }

      sliderItems.current.style.left =
        sliderItems.current.offsetLeft - posX2 + 'px';
    }
  }

  dragEnd() {
    const {
      sliderItems,
      shiftSlide,
      state: { posInitial, threshold },
    } = this;

    let posFinal = sliderItems.current.offsetLeft;

    sliderItems.current.style.cursor = 'grab';
    if (posFinal - posInitial < -threshold) {
      shiftSlide(NEXT, 'drag');
    } else if (posFinal - posInitial > threshold) {
      shiftSlide(PREV, 'drag');
    } else {
      sliderItems.current.style.left = posInitial + 'px';
    }

    this.setState({ dragging: false });
    document.onmouseup = null;
    document.onmousemove = null;
  }

  shiftSlide(dir, action) {
    const {
      sliderItems,
      state: { index, allowShift },
    } = this;
    let indexNew;

    sliderItems.current.classList.add('shifting');
    if (allowShift) {
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

    // This block of code will be responsible for the smooth infinite slide feature
    if (infinite) {
      if (index == -1) {
        sliderItems.current.style.left = -(slidesLength * slideSize) + 'px';
        this.setState({
          index: slidesLength - 1,
          selectedIndex: slidesLength - 1,
        });
      }

      if (index == slidesLength) {
        sliderItems.current.style.left = -(1 * slideSize) + 'px';
        this.setState({ index: 0, selectedIndex: 0 });
      }
    }
    if (!allowShift) this.setState({ allowShift: true });
  }

  selectSlide(index) {
    const { sliderItems } = this;

    sliderItems.current.classList.add('shifting');
    this.setState({ index, selectedIndex: index, goSlide: GO_SLIDE });
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate() {
    const {
      sliderItems,
      state: {
        slideSize,
        buttonClick,
        allowShift,
        selectedIndex,
        goSlide,
        index,
        newSlideSize,
      },
    } = this;

    // if slide has been drag/clicked the next/prev buttons
    if (!allowShift) {
      if (buttonClick === NEXT) {
        sliderItems.current.style.left = -((index + 1) * slideSize) + 'px';
      } else if (buttonClick === PREV) {
        sliderItems.current.style.left = -((index + 1) * slideSize) + 'px';
      }
    }

    // If Slide has been clicked through the select index buttons
    if (goSlide === GO_SLIDE) {
      sliderItems.current.style.left =
        -((selectedIndex + 1) * slideSize) + 'px';

      this.setState({ goSlide: '' });
    }

    // This will detect if windows has resize and will set the corresponding values
    if (newSlideSize !== slideSize) {
      const newPostInital = -(newSlideSize * (index + 1));

      sliderItems.current.style.left = newPostInital + 'px';
      this.setState({ slideSize: newSlideSize, posInitial: newPostInital });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () =>
      console.log('removed event listener for Single Slide')
    );
  }

  render() {
    const {
      dragStart,
      dragMove,
      dragEnd,
      shiftSlide,
      checkIndex,
      selectSlide,
      state: { index, slidesLength },
      props: { infinite, sliderButtons, contentValue },
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
                  onMouseDown={dragStart}
                  onMouseUp={dragEnd}
                  onMouseMove={dragMove}
                  key={i}
                  contentValue={contentValue}
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

          {sliderButtons && (
            <SelectBtn
              slidesLength={slidesLength}
              selectSlide={selectSlide}
              index={index}
            />
          )}
        </div>
      </div>
    );
  }
}

index.propTypes = {
  contentValue: PropTypes.string.isRequired,
  infinite: PropTypes.bool.isRequired,
  sliderButtons: PropTypes.bool.isRequired,
};

export default index;
