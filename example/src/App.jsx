import React, { Component } from 'react';
import CarouselSample from './CarouselSample';
import CubeSample from './CubeSample';
import DraggableListSample from './DraggableListSample';
import StaggeredListSample from './StaggeredListSample';
import WindowSample from './WindowSample';

export default class App extends Component {
  render() {
    return (
      <div>
        {/* <CarouselSample />
        <CubeSample />
        <DraggableListSample />
        <StaggeredListSample /> */}
        <WindowSample />
      </div>
    );
  }
}
