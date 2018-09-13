# react-motion-components

> components using react &amp; react-motion

[![NPM](https://img.shields.io/npm/v/react-motion-components.svg)](https://www.npmjs.com/package/react-motion-components) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-motion-components
```

## Usage

### Carousel

[demo](https://codesandbox.io/s/x7jv6oj8lo)

```tsx
import React, { Component } from 'react';
import { Carousel } from 'react-motion-components';

export default class CarouselSample extends Component {
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
```

### Cube

[demo](https://codesandbox.io/s/x3l8xzv0w4)

```tsx
import React, { Component } from 'react';
import { Cube } from 'react-motion-components';

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
      </div>
    );
  }
}
```

### DraggableList

[demo](https://codesandbox.io/s/4z4vlorp87)

```tsx
import React, { Component } from 'react';
import { DraggableList } from 'react-motion-components';

class App extends Component {
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
```

### StaggeredList

[demo](https://codesandbox.io/s/myzz5qx1jj)

```tsx
import React, { Component } from 'react';
import { StaggeredList } from 'react-motion-components';

class App extends Component {
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
```

## License

MIT © [pjb0811](https://github.com/pjb0811)
