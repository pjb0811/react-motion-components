import * as React from 'react';
import { Motion, spring } from 'react-motion';
import styles from './carousel.css';

type Props = {
  index: number;
  width: number;
  height: number;
  direction: string;
  effect: string;
  children: React.ReactNode;
  onClick: () => void;
};

type State = {
  index: number;
  index3d: number;
  width: number;
  height: number;
  mouseXY: Array<number>;
  mouseDelta: Array<number>;
  distance: number;
  isMoved: boolean;
  isPressed: boolean;
  isHorizontal: boolean;
  is2dEffect: boolean;
  count: number;
  theta: number;
  radius: number;
  carousel: {
    translate: {
      x: number;
      y: number;
      z: number;
    };
    rotate: {
      x: number;
      y: number;
      z: number;
      deg: number;
    };
  };
  cells: Array<Cell>;
  children: Array<React.ReactNode>;
};

type Cell = {
  translate: { x: number; y: number; z: number };
  rotate: { x: number; y: number; z: number; deg: number };
  opacity: number;
  zIndex: number;
};

const moveCell = (params: { nextIndex: number; prevState: State }) => {
  const { nextIndex, prevState } = params;
  const { cells, isHorizontal, width, height, count } = prevState;
  const range = Math.ceil(count / 2);

  let newCells: Array<Cell> & any = cells.concat();

  newCells = newCells.map(
    (cell: { translate: { x: number; y: number } }, i: number) => {
      let position = i - nextIndex;
      position =
        Math.abs(position) >= range
          ? position > 0
            ? position - count
            : count + position
          : position;
      let x = isHorizontal ? width * position : 0;
      let y = isHorizontal ? 0 : height * position;
      let opacity = position >= -1 && position <= 1 ? 1 : 0;
      let zIndex = position >= -1 && position <= 1 ? 100 : 1;

      return {
        ...cell,
        translate: {
          x,
          y,
          z: 0
        },
        opacity,
        zIndex
      };
    }
  );

  return {
    cells: newCells
  };
};

const moveCellAway = (params: { nextIndex: number; prevState: State }) => {
  const { nextIndex, prevState } = params;
  const {
    cells,
    width,
    height,
    isHorizontal,
    is2dEffect,
    radius,
    theta
  } = prevState;

  const newCells = cells.concat();

  return {
    cells: newCells.map((_, i: number) => {
      const idx = i === nextIndex ? 0 : i - nextIndex;
      const x = isHorizontal ? idx * width : 0;
      const y = isHorizontal ? 0 : idx * height;
      const zIndex = i === nextIndex ? 100 : 1;

      return {
        translate: {
          x: is2dEffect ? x : 0,
          y: is2dEffect ? y : 0,
          z: is2dEffect ? 0 : radius
        },
        rotate: {
          x: is2dEffect ? 0 : isHorizontal ? 0 : 1,
          y: is2dEffect ? 0 : isHorizontal ? 1 : 0,
          z: 0,
          deg: theta * i
        },
        opacity: 1,
        zIndex
      };
    })
  };
};

const moveCarousel = (params: { nextIndex: number; prevState: State }) => {
  const { nextIndex, prevState } = params;
  const { theta, isHorizontal } = prevState;
  const angle = theta * nextIndex * (isHorizontal ? -1 : 1);

  return {
    carousel: {
      ...prevState.carousel,
      rotate: {
        ...prevState.carousel.rotate,
        deg: angle
      }
    }
  };
};

const getDirection = (params: {
  nextIndex: number;
  prevIndex: number;
  count: number;
}) => {
  const { nextIndex, prevIndex, count } = params;
  const distance = Math.abs(nextIndex - prevIndex);

  if (distance > 1 && distance < count - 1) {
    return 'move';
  }

  if (nextIndex === count - 1 && prevIndex === 0) {
    return 'prev';
  }

  if (nextIndex === 0 && prevIndex === count - 1) {
    return 'next';
  }

  if (nextIndex > prevIndex) {
    return 'next';
  }

  return 'prev';
};

const getNextIndex = (params: {
  index: number;
  count: number;
  is2dEffect: boolean;
}) => {
  const { index, count, is2dEffect } = params;
  if (is2dEffect) {
    return index < 0 ? 0 : index === count ? count - 1 : index;
  }
  return index;
};

class Carousel extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { children, index } = nextProps;
    const { is2dEffect } = prevState;
    const newChildren = Array.isArray(children) ? [...children] : [children];
    const count = newChildren.length;
    const nextIndex = getNextIndex({ index, count, is2dEffect });
    const direction = getDirection({
      nextIndex,
      prevIndex: prevState.index,
      count
    });
    const cells = is2dEffect
      ? direction === 'move'
        ? moveCellAway({ nextIndex, prevState })
        : moveCell({ nextIndex, prevState })
      : {};
    const carousel = is2dEffect ? {} : moveCarousel({ nextIndex, prevState });

    if (nextIndex === prevState.index) {
      return null;
    }

    return {
      ...cells,
      ...carousel,
      index: nextIndex,
      index3d: nextIndex,
      count,
      children: newChildren
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      index: 0,
      index3d: 0,
      width: 0,
      height: 0,
      mouseXY: [0, 0],
      mouseDelta: [0, 0],
      distance: 0,
      isMoved: false,
      isPressed: false,
      isHorizontal: false,
      is2dEffect: false,
      count: 0,
      theta: 0,
      radius: 0,
      carousel: {
        translate: {
          x: 0,
          y: 0,
          z: 0
        },
        rotate: {
          x: 0,
          y: 0,
          z: 0,
          deg: 0
        }
      },
      cells: [],
      children: []
    };
  }

  componentDidMount() {
    const {
      index = 0,
      width,
      height,
      direction = 'horizontal',
      effect = '2d',
      children
    } = this.props;

    const isHorizontal = direction === 'horizontal';
    const is2dEffect = effect === '2d';
    const newChildren = Array.isArray(children) ? [...children] : [children];
    const count = newChildren.length;
    const theta = 360 / count;
    const cellSize = isHorizontal ? width : height;
    const radius = Math.round(cellSize / 2 / Math.tan(Math.PI / count));
    const range = Math.ceil(count / 2);

    this.setState({
      index,
      index3d: index,
      width,
      height,
      isHorizontal,
      is2dEffect,
      count,
      theta,
      radius,
      carousel: {
        translate: {
          x: 0,
          y: 0,
          z: is2dEffect ? 0 : -radius
        },
        rotate: {
          x: is2dEffect ? 0 : isHorizontal ? 0 : 1,
          y: is2dEffect ? 0 : isHorizontal ? 1 : 0,
          z: 0,
          deg: theta * index * -1
        }
      },
      cells: newChildren.map((_, i: number) => {
        let position = i - index;
        position =
          Math.abs(position) >= range
            ? position > 0
              ? position - count
              : count + position
            : position;
        let x = isHorizontal ? width * position : 0;
        let y = isHorizontal ? 0 : height * position;
        let opacity = position >= -1 && position <= 1 ? 1 : 0;
        let zIndex = position >= -1 && position <= 1 ? 100 : 1;

        return {
          translate: {
            x: is2dEffect ? x : 0,
            y: is2dEffect ? y : 0,
            z: is2dEffect ? 0 : radius
          },
          rotate: {
            x: is2dEffect ? 0 : isHorizontal ? 0 : 1,
            y: is2dEffect ? 0 : isHorizontal ? 1 : 0,
            z: 0,
            deg: theta * i
          },
          opacity,
          zIndex
        };
      }),
      children: newChildren
    });
  }

  move = (params: { index: number; index3d: number }) => {
    const { index, index3d } = params;
    const {
      cells,
      width,
      height,
      isHorizontal,
      is2dEffect,
      radius,
      theta,
      carousel
    } = this.state;

    const newCells = cells.concat();
    const angle = theta * index3d * (isHorizontal ? -1 : 1);

    this.setState({
      index,
      index3d,
      carousel: {
        ...carousel,
        rotate: {
          ...carousel.rotate,
          deg: angle
        }
      },
      cells: newCells.map((_, i: number) => {
        const idx = i === index ? 0 : i - index;
        const x = isHorizontal ? idx * width : 0;
        const y = isHorizontal ? 0 : idx * height;
        const zIndex = i === index ? 100 : 1;

        return {
          translate: {
            x: is2dEffect ? x : 0,
            y: is2dEffect ? y : 0,
            z: is2dEffect ? 0 : radius
          },
          rotate: {
            x: is2dEffect ? 0 : isHorizontal ? 0 : 1,
            y: is2dEffect ? 0 : isHorizontal ? 1 : 0,
            z: 0,
            deg: theta * i
          },
          opacity: 1,
          zIndex
        };
      })
    });
  };

  getMoveIndex = (params: { target: string }) => {
    const { target } = params;
    const { index, count } = this.state;
    const isPrev = target === 'prev';
    return isPrev
      ? index
        ? index - 1
        : count - 1
      : index === count - 1
        ? 0
        : index + 1;
  };

  dragCell = () => {
    const {
      cells,
      isHorizontal,
      width,
      height,
      count,
      mouseDelta
    } = this.state;

    const [dx, dy] = mouseDelta;

    let newCells: Array<Cell> & any = cells.concat();

    newCells = newCells.map((cell: { translate: { x: number; y: number } }) => {
      let x = isHorizontal ? cell.translate.x + dx : 0;
      let y = isHorizontal ? 0 : cell.translate.y + dy;

      if (Math.abs(x) >= width * (count - 1)) {
        x = (width - (x % width) * (x > 0 ? 1 : -1)) * (x > 0 ? -1 : 1);
      }

      if (Math.abs(y) >= height * (count - 1)) {
        y = (height - (x % height) * (y > 0 ? 1 : -1)) * (y > 0 ? -1 : 1);
      }

      return {
        ...cell,
        translate: {
          x,
          y,
          z: 0
        }
      };
    });

    this.setState(() => {
      return {
        cells: newCells
      };
    });
  };

  changeCell = (params: { target: string }) => {
    const { target } = params;
    const { index, cells, isHorizontal, width, height, count } = this.state;
    const isPrev = target === 'prev';
    const moveIndex = this.getMoveIndex({ target });

    let newCells: Array<Cell> & any = cells.concat();

    newCells = newCells.map(
      (cell: { translate: { x: number; y: number } }, i: number) => {
        let x = isHorizontal ? cell.translate.x + (isPrev ? width : -width) : 0;
        let y = isHorizontal
          ? 0
          : cell.translate.y + (isPrev ? height : -height);
        let opacity = i === index || i === moveIndex ? 1 : 0;
        let zIndex = i === index ? 100 : 1;

        if (Math.abs(x) === width * (count - 1)) {
          x = isPrev ? -width : width;
        }

        if (Math.abs(y) === height * (count - 1)) {
          y = isPrev ? -height : height;
        }

        return {
          ...cell,
          translate: {
            x,
            y,
            z: 0
          },
          opacity,
          zIndex
        };
      }
    );

    this.setState(() => {
      return {
        index: moveIndex,
        cells: newCells
      };
    });
  };

  dragCarousel = () => {
    const { carousel, isHorizontal, mouseDelta } = this.state;
    const [dx, dy] = mouseDelta;

    this.setState({
      carousel: {
        ...carousel,
        rotate: {
          ...carousel.rotate,
          deg: carousel.rotate.deg + (isHorizontal ? dx : dy)
        }
      }
    });
  };

  changeCarousel = (params: { target: string }) => {
    const { target } = params;
    const { index3d, theta, isHorizontal } = this.state;
    const isPrev = target === 'prev';
    const moveIndex = isPrev ? index3d - 1 : index3d + 1;
    const angle = theta * moveIndex * (isHorizontal ? -1 : 1);

    this.setState(prevState => {
      return {
        index: this.getMoveIndex({ target }),
        index3d: moveIndex,
        carousel: {
          ...prevState.carousel,
          rotate: {
            ...prevState.carousel.rotate,
            deg: angle
          }
        }
      };
    });
  };

  handleMouseDown = (e: React.MouseEvent<any>) => {
    const { pageX, pageY } = e;

    this.setState({
      isPressed: true,
      isMoved: false,
      mouseXY: [pageX, pageY]
    });

    e.preventDefault();
  };

  handleClick = (e: React.MouseEvent<any>) => {
    const { onClick = () => {} } = this.props;
    const { distance, count } = this.state;

    if (Math.abs(distance) < 10 || count < 2) {
      onClick();
    } else {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  handleMouseMove = (e: { pageX: number; pageY: number }) => {
    const { pageX, pageY } = e;
    const {
      isPressed,
      mouseXY: [mx, my],
      is2dEffect
    } = this.state;

    if (isPressed) {
      this.setState({
        mouseXY: [pageX, pageY],
        mouseDelta: [pageX - mx, pageY - my],
        isMoved: true
      });

      if (is2dEffect) {
        this.dragCell();
      } else {
        this.dragCarousel();
      }
    }
  };

  handleMouseUp = () => {
    const {
      isPressed,
      index,
      // index3d,
      cells,
      count,
      width,
      height,
      is2dEffect,
      isHorizontal
      // carousel,
      // theta
    } = this.state;

    if (isPressed) {
      const cell = cells[index];
      const distance = isHorizontal
        ? cell.translate.x % width
        : cell.translate.y % height;
      let nextIndex = index + (distance < 0 ? 1 : -1);
      nextIndex =
        nextIndex < 0 ? count - 1 : nextIndex === count ? 0 : nextIndex;

      this.setState({
        isPressed: false,
        mouseXY: [0, 0],
        mouseDelta: [0, 0],
        distance,
        index: nextIndex
      });
      console.log(nextIndex);

      if ((isHorizontal ? width : height) / 2 < Math.abs(distance)) {
        // let nextIndex = index + (distance < 0 ? 1 : -1);
        // nextIndex =
        //   nextIndex < 0 ? count - 1 : nextIndex === count ? 0 : nextIndex;
        const cells = is2dEffect
          ? moveCell({ nextIndex, prevState: this.state })
          : {};

        this.setState({
          ...cells
        });
      }

      /*
      if (is2dEffect) {
        cells.map((cell: { translate: { x: number; y: number } }, i) => {
          if (index === i) {
            const distance = isHorizontal
              ? cell.translate.x % width
              : cell.translate.y % height;

            this.setState({
              distance
            });

            if ((isHorizontal ? width : height) / 2 < Math.abs(distance)) {
              const moveIndex =
                distance > 0
                  ? index - 1 < 0
                    ? count - 1
                    : index - 1
                  : index + 1 === count
                    ? 0
                    : index + 1;
              this.move({ index: moveIndex, index3d });
            } else {
              this.move({ index, index3d });
            }
          }

          return cell;
        });
      } else {
        const { deg } = carousel.rotate;
        const distance =
          index3d === 0
            ? deg % theta
            : Math.abs(deg) > Math.abs(theta * index3d)
              ? deg % theta
              : (theta * index3d) % deg;

        this.setState({
          distance
        });

        if (theta / count < Math.abs(distance)) {
          const target = distance > 0 ? 'prev' : 'next';
          this.changeCarousel({ target });
        } else {
          this.move({ index, index3d });
        }
      } */
    }
  };

  render() {
    const {
      carousel,
      count,
      children,
      is2dEffect,
      width,
      height,
      cells
    } = this.state;

    if (count < 2) {
      return (
        <div
          style={{
            width,
            height
          }}
          onClick={e => {
            this.handleClick(e);
          }}
        >
          {children}
        </div>
      );
    }

    return (
      <div className={styles.carouselWrapper}>
        <Motion
          style={{
            rotateDeg: spring(carousel.rotate.deg)
          }}
        >
          {({ rotateDeg }) => {
            return (
              <div
                className={styles.carousel}
                style={{
                  transform: `translate3d(${carousel.translate.x}px, ${
                    carousel.translate.y
                  }px, ${carousel.translate.z}px) ${
                    is2dEffect
                      ? ''
                      : `rotate3d(${carousel.rotate.x}, ${carousel.rotate.y}, ${
                          carousel.rotate.z
                        }, ${rotateDeg}deg)`
                  }`
                }}
              >
                {children.map((child, key) => {
                  const cell = cells[key];

                  if (!cells.length) {
                    return null;
                  }

                  return (
                    <Motion
                      key={key}
                      style={{
                        translateX: spring(cell.translate.x),
                        translateY: spring(cell.translate.y)
                      }}
                    >
                      {({ translateX, translateY }) => {
                        return (
                          <div
                            className={styles.carouselCell}
                            style={{
                              transform: `${
                                is2dEffect
                                  ? ''
                                  : `rotate3d(${cell.rotate.x}, ${
                                      cell.rotate.y
                                    }, ${cell.rotate.z}, ${cell.rotate.deg}deg)`
                              }${`translate3d(${translateX}px,${translateY}px, ${
                                cell.translate.z
                              }px)`}`,
                              opacity: cell.opacity,
                              width,
                              height,
                              zIndex: cell.zIndex
                            }}
                            onMouseDown={e => {
                              this.handleMouseDown(e);
                            }}
                            onClick={e => {
                              this.handleClick(e);
                            }}
                            onMouseMove={e => {
                              this.handleMouseMove(e);
                            }}
                            onMouseLeave={() => {
                              this.handleMouseUp();
                            }}
                            onMouseUp={() => {
                              this.handleMouseUp();
                            }}
                          >
                            {child}
                          </div>
                        );
                      }}
                    </Motion>
                  );
                })}
              </div>
            );
          }}
        </Motion>
      </div>
    );
  }
}

export default Carousel;
