import React, { Component } from 'react';
import { Header, Segment, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { Window } from 'react-motion-components';

export default class App extends Component {
  state = {
    window1: {
      isOpen: false
    },
    window2: {
      isOpen: false
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
        <div>
          <button
            onClick={() => {
              this.setState({
                window2: {
                  isOpen: true
                }
              });
            }}
          >
            add window2
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              this.setState({
                window2: {
                  isOpen: false
                }
              });
            }}
          >
            remove window2
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
        {/* <Window
          width={500}
          height={500}
          minWidth={500}
          minHeight={500}
          position="right"
          direction="left"
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
                    Test2
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
          open={this.state.window2.isOpen}
          onClose={() => {
            this.setState({
              window2: {
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
            test2
          </Segment>
        </Window> */}
      </div>
    );
  }
}
