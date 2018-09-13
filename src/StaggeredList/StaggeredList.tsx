import * as React from 'react';
import { StaggeredMotion, spring } from 'react-motion';

type Props = {};

type State = {
  mouseStart: Array<number>;
  mouseXY: Array<number>;
  mouseDelta: Array<number>;
  isMoved: boolean;
  isPressed: boolean;
  style: {
    transformX: number;
    transformY: number;
  };
  items: Array<{
    transformX: number;
    transformY: number;
  }>;
  children: Array<React.ReactNode>;
};

class StaggeredList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { children } = this.props;

    const newChildren = Array.isArray(children) ? [...children] : [children];
    this.state = {
      mouseStart: [0, 0],
      mouseXY: [0, 0],
      mouseDelta: [0, 0],
      isMoved: false,
      isPressed: false,
      style: {
        transformX: 0,
        transformY: 0
      },
      items: newChildren.map(_ => {
        return {
          transformX: 0,
          transformY: 0
        };
      }),
      children: newChildren
    };
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  getStyles = (
    prevStyles: Array<{ transformX: number; transformY: number }>
  ) => {
    const { style } = this.state;
    return prevStyles.map((_, i) => {
      return {
        transformX: spring(
          i === 0 ? style.transformX : prevStyles[i - 1].transformX
        ),
        transformY: spring(
          i === 0 ? style.transformY : prevStyles[i - 1].transformY
        )
      };
    });
  };

  dragItem = () => {
    const { style, mouseDelta } = this.state;
    const [dx, dy] = mouseDelta;

    this.setState({
      style: {
        transformX: style.transformX + dx,
        transformY: style.transformY + dy
      }
    });
  };

  handleMouseDown = (e: React.MouseEvent<any>) => {
    const { pageX, pageY } = e;

    this.setState({
      isPressed: true,
      isMoved: false,
      mouseStart: [pageX, pageY],
      mouseXY: [pageX, pageY]
    });

    e.preventDefault();
  };

  handleClick = (e: React.MouseEvent<any>) => {
    const { mouseStart, mouseXY } = this.state;
    const [sx, sy] = mouseStart;
    const [mx, my] = mouseXY;
    const distanceX = Math.abs(sx - mx);
    const distanceY = Math.abs(sy - my);

    if (distanceX || distanceY) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  handleMouseMove = (e: { pageX: number; pageY: number }) => {
    const { pageX, pageY } = e;
    const {
      isPressed,
      mouseXY: [mx, my]
    } = this.state;

    if (isPressed) {
      this.setState({
        mouseXY: [pageX, pageY],
        mouseDelta: [pageX - mx, pageY - my],
        isMoved: true
      });

      this.dragItem();
    }
  };

  handleMouseUp = () => {
    const { isPressed } = this.state;

    if (isPressed) {
      this.setState({
        isPressed: false
      });
    }
  };

  render() {
    const { items, children } = this.state;

    if (items.length < 2) {
      return children;
    }

    return (
      <StaggeredMotion defaultStyles={items} styles={this.getStyles}>
        {(items: Array<{ transformX: number; transformY: number }>) => {
          return (
            <React.Fragment>
              {items.map(({ transformX, transformY }, i) => (
                <div
                  key={i}
                  style={{
                    transform: `translate3d(${transformX}px, ${transformY}px, 0)`
                  }}
                  onMouseDown={e => {
                    i === 0 && this.handleMouseDown(e);
                  }}
                  onClickCapture={e => {
                    i === 0 && this.handleClick(e);
                  }}
                >
                  {children[i]}
                </div>
              ))}
            </React.Fragment>
          );
        }}
      </StaggeredMotion>
    );
  }
}

export default StaggeredList;
