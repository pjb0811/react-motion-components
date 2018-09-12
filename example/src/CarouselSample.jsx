import React, { Component } from 'react';
import { Carousel } from 'react-motion-components';

class CarouselSample extends Component {
  render() {
    const defaultStyle = {
      width: 300,
      height: 300
    };

    const itemStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      color: 'white'
    };

    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>1. Carousel</h1>
        <div
          style={{
            ...defaultStyle,
            margin: '0 auto'
          }}
        >
          <Carousel
            {...defaultStyle}
            ref={carousel => (this.carousel = carousel)}
            direction={'horizontal'}
            effect={'3d'}
            index={0}
          >
            <div style={{ ...defaultStyle, ...itemStyle, background: 'green' }}>
              1
            </div>
            <div style={{ ...defaultStyle, ...itemStyle, background: 'red' }}>
              2
            </div>
            <div style={{ ...defaultStyle, ...itemStyle, background: 'blue' }}>
              3
            </div>
            <div
              style={{ ...defaultStyle, ...itemStyle, background: 'yellow' }}
            >
              4
            </div>
          </Carousel>
        </div>
      </div>
    );
  }
}

export default CarouselSample;
