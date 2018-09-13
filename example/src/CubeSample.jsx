import React, { Component } from 'react';
import { Cube } from 'react-motion-components';

import front from './images/front.png';
import right from './images/right.png';
import back from './images/back.png';
import left from './images/left.png';
import top from './images/top.png';
import bottom from './images/bottom.png';

class App extends Component {
  render() {
    const defaultStyle = {
      width: 300,
      height: 300
    };

    return (
      <div>
        <h1>Cube</h1>
        <div
          style={{
            ...defaultStyle
          }}
        >
          <Cube size={300} index="front" />
        </div>
        <div
          style={{
            ...defaultStyle
          }}
        >
          <Cube size={300} index="front">
            <img src={front} alt="front" />
            <img src={right} alt="right" />
            <img src={back} alt="back" />
            <img src={left} alt="left" />
            <img src={top} alt="top" />
            <img src={bottom} alt="bottom" />
          </Cube>
        </div>
      </div>
    );
  }
}

export default App;
