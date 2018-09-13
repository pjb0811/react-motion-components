import * as React from 'react';
import { Motion, spring } from 'react-motion';

type Props = {
  rowSize: number;
  width: number;
  height: number;
  children: React.ReactNode;
};

type State = {
  rowSize: number;
  width: number;
  height: number;
  count: number;
  mouseXY: Array<number>;
  mouseDelta: Array<number>;
  lastPress: number;
  isMoved: boolean;
  isPressed: boolean;
  orders: Array<number>;
  children: Array<React.ReactNode>;
};

function reinsert(params: { arr: Array<number>; from: number; to: number }) {
  const { arr, from, to } = params;
  const newArr = arr.slice(0);
  const val = newArr[from];
  newArr.splice(from, 1);
  newArr.splice(to, 0, val);
  return newArr;
}

function clamp(params: { n: number; min: number; max: number }) {
  const { n, min, max } = params;
  return Math.max(Math.min(n, max), min);
}

class DraggableList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { rowSize = 3, width, height, children } = this.props;
    const newChildren = Array.isArray(children) ? [...children] : [children];
    const count = newChildren.length;

    this.state = {
      rowSize,
      width,
      height,
      count,
      mouseXY: [0, 0],
      mouseDelta: [0, 0],
      lastPress: 0,
      isMoved: false,
      isPressed: false,
      orders: Array.from({ length: count }, (_, i) => {
        return i;
      }),
      children: newChildren
    };
  }

  handleMouseDown = (params: {
    key: number;
    pressLocation: [number, number];
    e: React.MouseEvent<any>;
  }) => {
    const { key, pressLocation, e } = params;
    const [pressX, pressY] = pressLocation;
    const { pageX, pageY } = e;

    this.setState({
      lastPress: key,
      isPressed: true,
      isMoved: false,
      mouseDelta: [pageX - pressX, pageY - pressY],
      mouseXY: [pressX, pressY]
    });

    e.preventDefault();
  };

  handleClick = (e: React.MouseEvent<any>) => {
    const { isMoved } = this.state;

    if (isMoved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  handleMouseMove = (e: { pageX: number; pageY: number }) => {
    const { pageX, pageY } = e;
    const {
      width,
      height,
      count,
      orders,
      rowSize,
      lastPress,
      isPressed,
      mouseDelta: [dx, dy]
    } = this.state;

    if (isPressed) {
      const mouseXY = [pageX - dx, pageY - dy];
      const col = clamp({
        n: Math.floor(mouseXY[0] / width),
        min: 0,
        max: rowSize - 1
      });
      const row = clamp({
        n: Math.floor(mouseXY[1] / height),
        min: 0,
        max: Math.floor(count / rowSize)
      });
      const index = row * rowSize + col;
      const newOrders = reinsert({
        arr: orders,
        from: orders.indexOf(lastPress),
        to: index
      });

      this.setState({
        mouseXY,
        isMoved: Math.abs(mouseXY[0]) > 10 || Math.abs(mouseXY[1]) > 10,
        orders: newOrders
      });
    }
  };

  handleMouseUp = () => {
    this.setState({
      isPressed: false,
      mouseDelta: [0, 0]
    });
  };

  getLayout = () => {
    const { count, width, height, rowSize } = this.state;

    return Array.from({ length: count }, (_, n) => {
      const row = Math.floor(n / rowSize);
      const col = n % rowSize;
      return [width * col, height * row];
    });
  };

  render() {
    const {
      width,
      height,
      count,
      rowSize,
      orders,
      lastPress,
      isPressed,
      mouseXY,
      children
    } = this.state;
    return (
      <div
        style={{
          height: height * Math.ceil(count / rowSize)
        }}
      >
        {orders.map((_, key) => {
          let style;
          let x: number;
          let y: number;
          const visualPosition = orders.indexOf(key);
          if (key === lastPress && isPressed) {
            [x, y] = mouseXY;
            style = {
              translateX: x,
              translateY: y,
              scale: spring(1.2)
            };
          } else {
            [x, y] = this.getLayout()[visualPosition];
            style = {
              translateX: spring(x),
              translateY: spring(y),
              scale: spring(1)
            };
          }
          return (
            <Motion key={key} style={style}>
              {({ translateX, translateY, scale }) => (
                <div
                  onMouseDown={e => {
                    this.handleMouseDown({ key, pressLocation: [x, y], e });
                  }}
                  onClickCapture={e => {
                    this.handleClick(e);
                  }}
                  onMouseMove={e => {
                    this.handleMouseMove(e);
                  }}
                  onMouseUp={() => {
                    this.handleMouseUp();
                  }}
                  style={{
                    position: 'absolute',
                    width,
                    height,
                    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`,
                    zIndex: key === lastPress ? 99 : visualPosition
                  }}
                >
                  {children[key]}
                </div>
              )}
            </Motion>
          );
        })}
      </div>
    );
  }
}

export default DraggableList;
