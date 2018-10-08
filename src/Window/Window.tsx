import { Motion, TransitionMotion, spring } from 'react-motion';
import * as React from 'react';
import Resizable from './Resizable';
import TitleBar from './TitleBar';
import Contents from './Contents';
import styles from './window.css';
const lodash = require('lodash');

type Props = {
  open: boolean;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  position: string;
  direction: string;
  resize: boolean;
  titlebar: {};
  onClose: () => void;
};

type State = {
  open: boolean;
  width: number;
  height: number;
  wrapper: {
    top: number;
    left: number;
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
    prevTop: number;
    prevLeft: number;
  };
  cells: Array<{ top: number; left: number }>;
  titlebar: {
    use: boolean;
    title: string;
    component: React.ComponentType<any> | null;
    height: number;
  };
  resizable: {
    show: boolean;
    type: string;
    mouseXY: Array<number>;
    mouseDelta: Array<number>;
    isMoved: boolean;
    isPressed: boolean;
    shiftXY: Array<number>;
    position: { top: number; left: number; right: number; bottom: number };
    prevMoveX: number;
    prevMoveY: number;
  };
};

const getDirection = (nextProps: Props) => {
  const { width, height, position, direction } = nextProps;
  const { innerHeight, innerWidth } = window;
  let top = 0;
  let left = 0;

  switch (direction) {
    case 'top':
      if (position.includes('top')) {
        top = innerHeight;
      }
      if (position.includes('left') || position.includes('right')) {
        top = innerHeight / 2 + height / 2;
      }
      if (position.includes('bottom')) {
        top = height;
      }
      break;
    case 'left':
      if (position.includes('top') || position.includes('bottom')) {
        left = innerWidth / 2 + width / 2;
      }
      if (position.includes('left')) {
        left = innerWidth;
      }
      if (position.includes('right')) {
        left = width;
      }
      break;
    case 'right':
      if (position.includes('top') || position.includes('bottom')) {
        left = -(innerWidth / 2 + width / 2);
      }
      if (position.includes('left')) {
        left = -width;
      }
      if (position.includes('right')) {
        left = -innerWidth;
      }
      break;
    case 'bottom':
      if (position.includes('top')) {
        top = -height;
      }
      if (position.includes('left') || position.includes('right')) {
        top = -(innerHeight / 2 + height / 2);
      }
      if (position.includes('bottom')) {
        top = -innerHeight;
      }
      break;
    default:
      break;
  }

  return {
    top,
    left
  };
};

const addWindow = (nextProps: Props, prevState: State) => {
  return {
    wrapper: {
      ...prevState.wrapper,
      show: true
    },
    cell: {
      ...prevState.cell,
      ...getDirection(nextProps)
    },
    resizable: {
      ...prevState.resizable,
      show: true
    },
    cells: [
      {
        top: 0,
        left: 0
      }
    ]
  };
};

const removeWindow = (prevState: State) => {
  const { width, height, wrapper, resizable } = prevState;

  return {
    wrapper: {
      ...wrapper,
      isFull: false,
      width,
      height
    },
    resizable: {
      ...resizable,
      show: false,
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
  };
};

class Window extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.open !== prevState.open) {
      const state = nextProps.open
        ? addWindow(nextProps, prevState)
        : removeWindow(prevState);
      return {
        ...prevState,
        ...state,
        open: nextProps.open
      };
    }
    return null;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      open: false,
      width: 0,
      height: 0,
      wrapper: {
        top: 0,
        left: 0,
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
        show: false,
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
  }

  componentDidMount() {
    const { open, width, height, titlebar } = this.props;

    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('resize', this.debounceWrapperSize);

    this.setState(prevState => {
      return {
        open,
        width,
        height,
        wrapper: {
          ...prevState.wrapper,
          ...this.getPosition({ isFull: false }),
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
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('resize', this.debounceWrapperSize);
  }

  debounceWrapperSize = lodash.debounce(() => {
    this.updateWrapperSize();
  }, 100);

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

  getPosition = (params: { isFull: boolean }) => {
    const { isFull } = params;
    const { width, height, position } = this.props;
    const { innerHeight, innerWidth } = window;
    let top = 0;
    let left = 0;

    if (isFull) {
      return {
        top,
        left
      };
    }

    switch (position) {
      case 'top':
        left = innerWidth / 2 - width / 2;
        break;

      case 'left':
        top = innerHeight / 2 - height / 2;
        break;

      case 'right':
        top = innerHeight / 2 - height / 2;
        left = innerWidth - width;
        break;

      case 'bottom':
        top = innerHeight - height;
        left = innerWidth / 2 - width / 2;
        break;

      default:
        break;
    }

    return {
      top,
      left
    };
  };

  isShowing = () => {
    return this.state.wrapper.show;
  };

  isFulling = () => {
    return this.state.wrapper.isFull;
  };

  removeWindow = () => {
    this.setState(removeWindow(this.state));
  };

  toggleWindowSize = () => {
    const { innerWidth, innerHeight } = window;
    const { width, height, wrapper, cells, cell, resizable } = this.state;
    const [currentCell]: Array<{ top: number; left: number }> = cells;

    this.setState({
      wrapper: {
        ...wrapper,
        ...this.getPosition({ isFull: !wrapper.isFull }),
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
    const { onClose = () => {} } = this.props;
    this.setState(
      prevState => {
        return {
          wrapper: {
            ...prevState.wrapper,
            show: false
          }
        };
      },
      () => {
        onClose();
      }
    );
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
    const { minWidth, minHeight } = this.props;
    const { resizable, wrapper } = this.state;
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

        if (minHeight > wrapper.height - (resizeTop - resizeBottom)) {
          resizeTop = resizeBottom;
        }

        break;

      case 'leftTop':
        resizeTop = my - sy - dy;
        resizeLeft = mx - sx - dx;

        if (minWidth > wrapper.width - (resizeLeft - resizeRight)) {
          resizeLeft = resizeRight;
        }

        if (minHeight > wrapper.height - (resizeTop - resizeBottom)) {
          resizeTop = resizeBottom;
        }

        break;

      case 'rightTop':
        resizeRight = mx - sx - dx + prevMoveX;
        resizeTop = my - sy - dy;

        if (minWidth > wrapper.width - (resizeLeft - resizeRight)) {
          resizeRight = resizeLeft;
        }

        if (minHeight > wrapper.height - (resizeTop - resizeBottom)) {
          resizeTop = resizeBottom;
        }

        break;

      case 'left':
        resizeLeft = mx - sx - dx;

        if (minWidth > wrapper.width - (resizeLeft - resizeRight)) {
          resizeLeft = resizeRight;
        }

        break;

      case 'right':
        resizeRight = mx - sx - dx + prevMoveX;

        if (minWidth > wrapper.width - (resizeLeft - resizeRight)) {
          resizeRight = resizeLeft;
        }

        break;

      case 'leftBottom':
        resizeLeft = mx - sx - dx;
        resizeBottom = my - sy - dy + prevMoveY;

        if (minWidth > wrapper.width - (resizeLeft - resizeRight)) {
          resizeLeft = resizeRight;
        }

        if (minHeight > wrapper.height - (resizeTop - resizeBottom)) {
          resizeBottom = resizeTop;
        }

        break;

      case 'bottom':
        resizeBottom = my - sy - dy + prevMoveY;

        if (minHeight > wrapper.height - (resizeTop - resizeBottom)) {
          resizeBottom = resizeTop;
        }

        break;

      case 'rightBottom':
        resizeRight = mx - sx - dx + prevMoveX;
        resizeBottom = my - sy - dy + prevMoveY;

        if (minWidth > wrapper.width - (resizeLeft - resizeRight)) {
          resizeRight = resizeLeft;
        }

        if (minHeight > wrapper.height - (resizeTop - resizeBottom)) {
          resizeBottom = resizeTop;
        }

        break;

      default:
        break;
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
    const { children, resize = false } = this.props;
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
          wrapperTop: spring(wrapper.top),
          wrapperLeft: spring(wrapper.left)
        }}
      >
        {({ top, left, width, height, wrapperTop, wrapperLeft }) => {
          return (
            <div
              className={`${styles.windowWrapper}`}
              style={{
                top: wrapperTop,
                left: wrapperLeft,
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
                          key={cell.key}
                          className={styles.window}
                          style={{
                            top: cell.style.top + top,
                            left: cell.style.left + left,
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
