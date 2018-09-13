import React, { Component } from 'react';
import { StaggeredList } from 'react-motion-components';

export default class App extends Component {
  render() {
    const defaultStyle = {
      width: 200,
      height: 200
    };

    return (
      <div>
        <h1>StaggeredList</h1>
        <div
          style={{
            ...defaultStyle
          }}
        >
          <StaggeredList>
            <div style={{ ...defaultStyle, background: 'green' }} />
            <div style={{ ...defaultStyle, background: 'red' }} />
            <div style={{ ...defaultStyle, background: 'blue' }} />
          </StaggeredList>
        </div>
      </div>
    );
  }
}
