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
  state = {
    index: 0,
    size: 5,
    effect: '3d',
    colors: ['green', 'red', 'blue', 'yellow', 'black']
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
      margin: '0 auto',
      overflow: 'hidden'
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
            direction={'horizontal'}
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

### Window

[demo](https://codesandbox.io/s/jv3nyzl8nw)

```tsx
import React, { Component } from 'react';
import { Header, Segment, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Window } from 'react-motion-components';

class App extends Component {
  state = {
    window1: {
      isOpen: true
    }
  };

  render() {
    return (
      <div
        style={{
          textAlign: 'center'
        }}
      >
        <div>
          <button
            onClick={() => {
              this.setState({
                window1: {
                  isOpen: true
                }
              });
            }}
          >
            add window1
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              this.setState({
                window1: {
                  isOpen: false
                }
              });
            }}
          >
            remove window1
          </button>
        </div>
        <Window
          width={300}
          height={300}
          minWidth={300}
          minHeight={300}
          position="top"
          direction="top"
          titlebar={{
            use: true,
            height: 50,
            component: props => {
              const {
                width,
                height,
                toggleWindowSize,
                handleMouseDown,
                removeWindow,
                isFulling
              } = props;

              return (
                <Segment
                  clearing
                  attached="top"
                  style={{
                    width,
                    height,
                    boxSizing: 'border-box'
                  }}
                  onDoubleClick={toggleWindowSize}
                  onMouseDown={handleMouseDown}
                >
                  <Header as="h4" floated="left">
                    Test
                  </Header>
                  <Header as="h4" floated="right">
                    <Icon
                      link
                      color={`${isFulling ? 'green' : 'yellow'}`}
                      name={`toggle ${isFulling ? 'on' : 'off'}`}
                      onClick={toggleWindowSize}
                    />
                    <Icon
                      link
                      name="close"
                      color="red"
                      onClick={removeWindow}
                    />
                  </Header>
                </Segment>
              );
            }
          }}
          resize={true}
          open={this.state.window1.isOpen}
          onClose={() => {
            this.setState({
              window1: {
                isOpen: false
              }
            });
          }}
        >
          <Segment
            attached
            style={{
              width: '100%',
              height: '100%',
              boxSizing: 'border-box'
            }}
          >
            test1
          </Segment>
        </Window>
      </div>
    );
  }
}
```

## License

MIT © [pjb0811](https://github.com/pjb0811)
