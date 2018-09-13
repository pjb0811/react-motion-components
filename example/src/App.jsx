import React, { Component } from 'react';
import CarouselSample from './CarouselSample';
import CubeSample from './CubeSample';
import DraggableListSample from './DraggableListSample';
import StaggeredListSample from './StaggeredListSample';

export default class App extends Component {
  render() {
    return (
      <div>
        <CarouselSample />
        <CubeSample />
        <DraggableListSample />
        <StaggeredListSample />
      </div>
    );
  }
}
