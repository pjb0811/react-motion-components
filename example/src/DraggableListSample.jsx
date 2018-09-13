import React, { Component } from 'react';
import { DraggableList } from 'react-motion-components';

export default class App extends Component {
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
        <h1>DraggableList</h1>
        <DraggableList {...defaultStyle} rowSize={2}>
          <div style={{ ...defaultStyle, ...itemStyle, background: 'green' }}>
            1
          </div>
          <div style={{ ...defaultStyle, ...itemStyle, background: 'blue' }}>
            2
          </div>
          <div style={{ ...defaultStyle, ...itemStyle, background: 'red' }}>
            3
          </div>
          <div style={{ ...defaultStyle, ...itemStyle, background: 'yellow' }}>
            4
          </div>
        </DraggableList>
      </div>
    );
  }
}
