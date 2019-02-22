import React, { Component } from 'react';
import { Carousel } from 'react-motion-components';

class CarouselSample extends Component {
  state = {
    index: 0,
    size: 5,
    effect: '3d',
    colors: ['green', 'red', 'blue', 'yellow', 'black'],
    direction: 'vertical'
  };

  prev = () => {
    const { index, size, effect } = this.state;
    this.setState({
      index: effect === '2d' ? (index > 0 ? index - 1 : size - 1) : index - 1
    });
  };

  next = () => {
    const { index, size, effect } = this.state;
    this.setState({
      index: effect === '2d' ? (index < size - 1 ? index + 1 : 0) : index + 1
    });
  };

  move = index => {
    this.setState({
      index
    });
  };

  render() {
    const defaultStyle = {
      width: 300,
      height: 300,
      margin: '50px auto'
      // overflow: 'hidden'
    };

    const itemStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      color: 'white',
      margin: '0 auto'
    };

    return (
      <div>
        <h1>Carousel</h1>
        <button onClick={this.prev}>prev</button>
        <button onClick={this.next}>next</button>
        {Array.from({ length: this.state.size }, (x, i) => {
          return (
            <button
              key={i}
              onClick={() => {
                this.move(i);
              }}
            >
              move {i}
            </button>
          );
        })}
        <div
          style={{
            ...defaultStyle
          }}
        >
          <Carousel
            {...defaultStyle}
            direction={this.state.direction}
            effect={this.state.effect}
            index={this.state.index}
            onClick={() => {}}
            onChange={index => {
              this.move(index);
            }}
          >
            {Array.from({ length: this.state.size }, (x, i) => {
              return (
                <div
                  key={i}
                  style={{
                    ...defaultStyle,
                    ...itemStyle,
                    background: this.state.colors[i]
                  }}
                >
                  {i}
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    );
  }
}

export default CarouselSample;
