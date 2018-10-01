import { Motion, TransitionMotion, spring } from 'react-motion';
import * as React from 'react';
import Resizable from './Resizable';
import TitleBar from './TitleBar';
import Contents from './Contents';
import styles from './window.css';
const lodash = require('lodash');

type Props = {
  width: number;
  height: number;
  position: string;
  direction: string;
  resize: boolean;
  titlebar: {};
};

type State = {
  width: number;
  height: number;
  wrapper: {
    isFull: boolean;
    show: boolean;
    width: number;
    height: number;
    mouseXY: Array<number>;
    mouseDelta: Array<number>;
    isMoved: boolean;
    isPressed: boolean;
  };
  cell: {
    top: number;
    left: number;
  };
  cells: Array<{ top: number; left: number }>;
  titlebar: {
    use: boolean;
    title: string;
    component: React.ComponentType<any> | null;
    height: number;
  };
  resizable: {
    type: string;
    mouseXY: Array<number>;
    mouseDelta: Array<number>;
    isMoved: boolean;
    isPressed: boolean;
    shiftXY: Array<number>;
    position: { top: number; left: number; right: number; bottom: number };
  };
};

class Window extends React.Component<Props, State> {
  state = {
    width: 0,
    height: 0,
    wrapper: {
      isFull: false,
      show: false,
      width: 0,
      height: 0,
      isMoved: false,
      isPressed: false,
      mouseXY: [0, 0],
      mouseDelta: [0, 0]
    },
    cell: {
      top: 0,
      left: 0,
      prevTop: 0,
      prevLeft: 0
    },
    cells: [],
    titlebar: {
      use: false,
      title: '',
      component: null,
      height: 30
    },
    resizable: {
      type: 'top',
      isMoved: false,
      isPressed: false,
      mouseXY: [0, 0],
      mouseDelta: [0, 0],
      shiftXY: [0, 0],
      position: { top: 0, left: 0, right: 0, bottom: 0 },
      prevMoveX: 0,
      prevMoveY: 0
    }
  };

  wrapperContext: HTMLDivElement | any;

  getPosition = () => {
    const { width, height, position, direction } = this.props;
    const { innerHeight, innerWidth } = window;
    const { offsetLeft, offsetTop } = this.wrapperContext;

    const top =
      direction === 'top'
        ? innerHeight - offsetTop
        : direction === 'bottom'
          ? -offsetTop - height
          : 0;

    const left =
      direction === 'left'
        ? position.includes('left')
          ? innerWidth
          : position.includes('right')
            ? width
            : offsetLeft + width
        : direction === 'right'
          ? position.includes('left')
            ? -width
            : -offsetLeft - width
          : 0;

    return {
      top,
      left
    };
  };

  componentDidMount() {
    const { width, height, titlebar } = this.props;

    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener(
      'resize',
      lodash.debounce(() => {
        this.updateWrapperSize();
      }, 100)
    );

    this.setState(prevState => {
      return {
        width,
        height,
        wrapper: {
          ...prevState.wrapper,
          width,
          height
        },
        titlebar: {
          ...prevState.titlebar,
          ...titlebar
        }
      };
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWrapperSize);
  }

  updateWrapperSize = () => {
    const { wrapper } = this.state;
    const { isFull } = wrapper;
    const { innerWidth, innerHeight } = window;

    if (isFull) {
      this.setState({
        wrapper: {
          ...wrapper,
          width: innerWidth,
          height: innerHeight
        }
      });
    }
  };

  isShowing = () => {
    return this.state.wrapper.show;
  };

  isFulling = () => {
    return this.state.wrapper.isFull;
  };

  addWindow = () => {
    this.setState(prevState => {
      return {
        wrapper: {
          ...prevState.wrapper,
          show: true
        },
        cell: {
          ...prevState.cell,
          ...this.getPosition()
        },
        cells: [
          {
            top: 0,
            left: 0
          }
        ]
      };
    });
  };

  toggleWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    const { width, height, wrapper, cells, cell, resizable } = this.state;
    const [currentCell]: Array<{ top: number; left: number }> = cells;

    this.setState({
      wrapper: {
        ...wrapper,
        isFull: !wrapper.isFull,
        width: wrapper.isFull ? width : innerWidth,
        height: wrapper.isFull ? height : innerHeight
      },
      resizable: {
        ...resizable
      },
      cell: {
        ...cell,
        prevTop: currentCell.top,
        prevLeft: currentCell.left
      },
      cells: cells.map(_ => {
        return {
          top: wrapper.isFull ? cell.prevTop : 0,
          left: wrapper.isFull ? cell.prevLeft : 0
        };
      })
    });
  };

  removeWindow = () => {
    const { width, height, wrapper, resizable } = this.state;

    this.setState({
      wrapper: {
        ...wrapper,
        isFull: false,
        width,
        height
      },
      resizable: {
        ...resizable,
        position: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        prevMoveX: 0,
        prevMoveY: 0
      },
      cells: []
    });
  };

  willEnter = () => {
    return { ...this.state.cell };
  };

  willLeave = () => {
    const { cell } = this.state;

    return {
      top: spring(cell.top),
      left: spring(cell.left)
    };
  };

  didLeave = () => {
    this.setState(prevState => {
      return {
        wrapper: {
          ...prevState.wrapper,
          show: false
        }
      };
    });
  };

  handleMouseDown = (e: React.MouseEvent<any>) => {
    const { pageX, pageY } = e;
    const { wrapper } = this.state;

    this.setState({
      wrapper: {
        ...wrapper,
        isPressed: true,
        isMoved: false,
        mouseDelta: [pageX, pageY],
        mouseXY: [pageX, pageY]
      }
    });

    e.preventDefault();
  };

  handleMouseMove = (e: any) => {
    const { pageX, pageY } = e;
    const { wrapper } = this.state;
    const { scrollWidth, scrollHeight } = document.body;
    const {
      isPressed,
      mouseXY: [mx, my],
      isFull
    } = wrapper;

    if (isFull) {
      return;
    }

    if (pageX < 0 || pageY < 0) {
      return;
    }

    if (pageX > scrollWidth || pageY > scrollHeight) {
      return;
    }

    if (isPressed) {
      this.setState({
        wrapper: {
          ...wrapper,
          mouseXY: [pageX, pageY],
          mouseDelta: [pageX - mx, pageY - my],
          isMoved: true
        }
      });

      this.dragWindow();
    }
  };

  dragWindow = () => {
    const { wrapper, cells } = this.state;
    const [dx, dy] = wrapper.mouseDelta;

    let newCells: Array<{ top: number; left: number }> = cells.concat();

    newCells = newCells.map((cell: { top: number; left: number }) => {
      return {
        top: cell.top + dy,
        left: cell.left + dx
      };
    });

    this.setState({
      cells: newCells
    });
  };

  handleMouseUp = () => {
    const { wrapper } = this.state;
    const { isPressed } = wrapper;

    if (isPressed) {
      this.setState({
        wrapper: {
          ...wrapper,
          isPressed: false
        }
      });
    }
  };

  resizableMouseDown = (params: { e: any; type: string }) => {
    const { e, type } = params;
    const { resizable } = this.state;
    const { pageX, pageY, target } = e;

    this.setState({
      resizable: {
        ...resizable,
        type,
        isPressed: true,
        isMoved: false,
        shiftXY: [
          target.getBoundingClientRect().left - resizable.position.left,
          target.getBoundingClientRect().top - resizable.position.top
        ],
        mouseDelta: [
          pageX - target.getBoundingClientRect().left,
          pageY - target.getBoundingClientRect().top
        ],
        mouseXY: [pageX, pageY]
      }
    });

    e.preventDefault();
  };

  resizableMouseMove = (e: any) => {
    const { pageX, pageY } = e;
    const { wrapper, resizable } = this.state;
    const { isFull } = wrapper;
    const { isPressed } = resizable;
    const { scrollWidth, scrollHeight } = document.body;

    if (isFull) {
      return;
    }

    if (pageX < 0 || pageY < 0) {
      return;
    }

    if (pageX > scrollWidth || pageY > scrollHeight) {
      return;
    }

    if (isPressed) {
      this.setState({
        resizable: {
          ...resizable,
          mouseXY: [pageX, pageY],
          isMoved: true
        }
      });

      this.resizableWindow(e);
    }
  };

  resizableWindow = (_e: any) => {
    const { resizable, wrapper, width, height } = this.state;
    const {
      shiftXY,
      mouseXY,
      mouseDelta,
      type,
      position,
      prevMoveX,
      prevMoveY
    } = resizable;
    const [mx, my] = mouseXY;
    const [sx, sy] = shiftXY;
    const [dx, dy] = mouseDelta;

    let resizeTop = position.top;
    let resizeLeft = position.left;
    let resizeRight = position.right;
    let resizeBottom = position.bottom;

    switch (type) {
      case 'top':
        resizeTop = my - sy - dy;
        break;
      case 'rightTop':
        resizeRight = mx - sx - dx + prevMoveX;
        resizeTop = my - sy - dy;
        break;

      case 'left':
        resizeLeft = mx - sx - dx;
        break;

      case 'right':
        resizeRight = mx - sx - dx + prevMoveX;
        break;

      case 'leftBottom':
        resizeLeft = mx - sx - dx;
        resizeBottom = my - sy - dy + prevMoveY;
        break;

      case 'bottom':
        resizeBottom = my - sy - dy + prevMoveY;
        break;

      case 'rightBottom':
        resizeRight = mx - sx - dx + prevMoveX;
        resizeBottom = my - sy - dy + prevMoveY;
        break;

      default:
        resizeTop = my - sy - dy;
        resizeLeft = mx - sx - dx;
        break;
    }

    if (width > wrapper.width - (resizeLeft - resizeRight)) {
      return;
    }

    if (height > wrapper.height - (resizeTop - resizeBottom)) {
      return;
    }

    this.setState({
      resizable: {
        ...resizable,
        position: {
          top: resizeTop,
          left: resizeLeft,
          right: resizeRight,
          bottom: resizeBottom
        }
      }
    });
  };

  resizableMouseUp = () => {
    const { resizable } = this.state;
    const { isPressed, position } = resizable;

    if (isPressed) {
      this.setState({
        resizable: {
          ...resizable,
          isPressed: false,
          prevMoveX: -position.left + position.right,
          prevMoveY: -position.top + position.bottom
        }
      });
    }
  };

  resizableDoubleClick = (params: { e: any; direction: string }) => {
    const { e, direction } = params;
    this.stickyWindow({ e, direction });
  };

  stickyWindow = (params: { e: any; direction: string }) => {
    const { e, direction } = params;
    const { resizable } = this.state;
    const { position } = resizable;
    const { innerWidth, innerHeight } = window;
    const rectTop = e.target.getBoundingClientRect().top;
    const rectLeft = e.target.getBoundingClientRect().left;

    let stickyTop = position.top;
    let stickyLeft = position.left;
    let stickyRight = position.right;
    let stickyBottom = position.bottom;

    switch (direction) {
      case 'top':
        stickyTop += -rectTop - 5;
        break;
      case 'left':
        stickyLeft += -rectLeft - 5;
        break;
      case 'right':
        stickyRight += innerWidth - rectLeft;
        break;
      case 'bottom':
        stickyBottom += innerHeight - rectTop;
        break;
      default:
        break;
    }

    this.setState({
      resizable: {
        ...resizable,
        position: {
          ...resizable.position,
          top: stickyTop,
          left: stickyLeft,
          right: stickyRight,
          bottom: stickyBottom
        }
      }
    });
  };

  render() {
    const { position, children, resize = false } = this.props;
    const { titlebar, wrapper, resizable } = this.state;
    const resizeCells = this.state.cells.map(
      (cell: { top: number; left: number }) => {
        const { top, left } = cell;
        if (wrapper.isFull) {
          return {
            top: top - resizable.position.top,
            left: left - resizable.position.left
          };
        }
        return { top, left };
      }
    );

    const resizeWidth = wrapper.isFull
      ? wrapper.width + (resizable.position.left - resizable.position.right)
      : wrapper.width;
    const resizeHeight = wrapper.isFull
      ? wrapper.height + (resizable.position.top - resizable.position.bottom)
      : wrapper.height;

    return (
      <Motion
        style={{
          left: spring(wrapper.isFull ? 0 : resizable.position.left),
          top: spring(wrapper.isFull ? 0 : resizable.position.top),
          width: spring(
            wrapper.isFull
              ? wrapper.width
              : wrapper.width + resizable.position.right
          ),
          height: spring(
            wrapper.isFull
              ? wrapper.height
              : wrapper.height + resizable.position.bottom
          ),
          wrapperWidth: spring(wrapper.width),
          wrapperHeight: spring(wrapper.height)
        }}
      >
        {({ top, left, width, height, wrapperWidth, wrapperHeight }) => {
          return (
            <div
              ref={context => (this.wrapperContext = context)}
              className={`${styles.windowWrapper} ${styles[position]}`}
              style={{
                width: wrapperWidth,
                height: wrapperHeight,
                visibility: wrapper.show ? 'visible' : 'hidden'
              }}
            >
              <Resizable
                width={resizeWidth}
                height={resizeHeight}
                cells={resizeCells}
                resize={resize}
                resizable={resizable}
                resizableMouseDown={this.resizableMouseDown}
                resizableMouseMove={this.resizableMouseMove}
                resizableMouseUp={this.resizableMouseUp}
                resizableDoubleClick={this.resizableDoubleClick}
              />
              <TransitionMotion
                willEnter={this.willEnter}
                willLeave={this.willLeave}
                didLeave={this.didLeave}
                styles={this.state.cells.map(
                  (cell: { top: number; left: number }, i) => {
                    const { top, left } = cell;
                    return {
                      key: `${i}`,
                      style: {
                        top: spring(top),
                        left: spring(left)
                      }
                    };
                  }
                )}
              >
                {cells => (
                  <React.Fragment>
                    {cells.map(cell => {
                      return (
                        <div
                          className={styles.window}
                          key={cell.key}
                          style={{
                            // top: cell.style.top + top,
                            // left: cell.style.left + left,
                            transform: `translate3d(${cell.style.left +
                              left}px, ${cell.style.top + top}px, 0)`,
                            width: width - left,
                            height: height - top
                          }}
                        >
                          <TitleBar
                            titlebar={titlebar}
                            width={width - left}
                            isFulling={this.isFulling}
                            toggleWindowSize={this.toggleWindowSize}
                            handleMouseDown={this.handleMouseDown}
                            removeWindow={this.removeWindow}
                          />
                          <Contents
                            titlebar={titlebar}
                            width={width - left}
                            height={height - top}
                            children={children}
                          />
                        </div>
                      );
                    })}
                  </React.Fragment>
                )}
              </TransitionMotion>
            </div>
          );
        }}
      </Motion>
    );
  }
}

export default Window;
