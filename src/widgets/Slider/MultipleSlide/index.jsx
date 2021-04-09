import React, { Component } from 'react';

import MultipleSlide from './MultipleSlide';
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
    this.displaySlides = this.displaySlides.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.removeCloneNodes = this.removeCloneNodes.bind(this);

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
      currentWidthResize: 0,
    };
  }

  initialize() {
    const {
      slider,
      sliderItems,
      dragStart,
      dragEnd,
      dragMove,
      handleResize,
    } = this;
    let slides = sliderItems.current.children,
      slidesLength = slides.length,
      slideSize = sliderItems.current.children[0].offsetWidth;

    this.setState({ slidesLength, slideSize });

    // Clone the first slide and last and attached them in the opposite direction
    this.cloneNodes();
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

    this.setState({ newSlideSize: slideSize });
    window.addEventListener('resize', handleResize);
  }
  handleResize() {
    const width = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );

    if (width >= 1024)
      return this.setState({
        newSlideSize: LG,
        index: 0,
        currentWidthResize: width,
      });

    if (width >= 768 && width < 1024)
      return this.setState({
        newSlideSize: MD,
        index: 0,
        currentWidthResize: width,
      });

    if (width >= 424 && width <= 767) {
      this.removeCloneNodes();
      return this.setState({
        newSlideSize: SM,
        index: 0,
        currentWidthResize: width,
      });
    }

    if (width >= 320 && width <= 424) {
      if (this.state.currentWidthResize > 424) {
        this.removeCloneNodes();
      }
      return this.setState({
        newSlideSize: XSM,
        index: 0,
        currentWidthResize: width,
      });
    }
  }

  cloneNodes() {
    const { sliderItems } = this;
    let slides = sliderItems.current.children,
      slidesLength = slides.length,
      firstSlide = slides[0],
      lastSlide = slides[slidesLength - 1],
      cloneFirst = firstSlide.cloneNode(true),
      cloneLast = lastSlide.cloneNode(true);

    sliderItems.current.appendChild(cloneFirst);
    sliderItems.current.insertBefore(cloneLast, firstSlide);
  }

  removeCloneNodes() {
    const { sliderItems } = this;
    let slides = sliderItems.current,
      first = slides.firstChild,
      last = slides.lastChild;

    slides.removeChild(first);
    slides.removeChild(last);
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

    if (!allowShift) {
      if (buttonClick === NEXT) {
        sliderItems.current.style.left = -((index + 1) * slideSize) + 'px';
      } else if (buttonClick === PREV) {
        sliderItems.current.style.left = -((index + 1) * slideSize) + 'px';
      }
    }
    if (goSlide === GO_SLIDE) {
      sliderItems.current.style.left =
        -((selectedIndex + 1) * slideSize) + 'px';

      this.setState({ goSlide: '' });
    }

    if (newSlideSize !== slideSize) {
      const width = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );

      if (width < 767) {
        this.cloneNodes();
      }
      const newPostInital = -(newSlideSize * (index + 1));
      const slidesLength = sliderItems.current.children.length - 2;

      sliderItems.current.style.left = newPostInital + 'px';
      this.setState({
        slideSize: newSlideSize,
        posInitial: newPostInital,
        slidesLength,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () =>
      console.log('removed event listener for Multiple Slide')
    );
  }

  displaySlides(dragStart, dragEnd, dragMove, contentValue) {
    const width = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    let from,
      to,
      itemSize = width >= 768 ? 3 : width >= 424 ? 2 : 1,
      items = [];
    const numberOfSlides = Math.ceil(SLIDE_DATA.length / itemSize);

    for (let x = 1; x <= numberOfSlides; x++) {
      to = itemSize * x;
      from = to - itemSize;
      items.push(
        <MultipleSlide
          onMouseDown={dragStart}
          onMouseUp={dragEnd}
          onMouseMove={dragMove}
          key={x}
          contentValue={contentValue}
          data={SLIDE_DATA.slice(from, to)}
        />
      );
    }

    return items;
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
      props: { infinite, sliderButtons, contentValue, multiple },
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
              {this.displaySlides(dragStart, dragEnd, dragMove, contentValue)}
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
              isMultiple={multiple}
            />
          )}
        </div>
      </div>
    );
  }
}

export default index;
