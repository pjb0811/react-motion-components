import * as React from 'react';
import { Motion, spring } from 'react-motion';
import styles from './cube.css';

const emptyFace = <div className={styles.empty}>empty</div>;

type Props = { index: string; size: number };

type State = {
  index: string;
  isMoved: boolean;
  isPressed: boolean;
  mouseXY: Array<number>;
  mouseDelta: Array<number>;
  distance: number;
  cube: {
    width: number;
    height: number;
    translate: {
      x: number;
      y: number;
      z: number;
    };
    rotateX: number;
    rotateY: number;
    rotateZ: number;
  };
  faces: {};
  children: Array<React.ReactNode>;
};

class Cube extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { index = 'front', size = 200 } = this.props;
    const faceSize = size / 2;

    this.state = {
      index,
      isMoved: false,
      isPressed: false,
      mouseXY: [0, 0],
      mouseDelta: [0, 0],
      distance: 0,
      cube: {
        width: size,
        height: size,
        translate: {
          x: 0,
          y: 0,
          z: -faceSize
        },
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0
      },
      faces: {
        front: {
          translate: {
            x: 0,
            y: 0,
            z: faceSize
          },
          rotate: {
            x: 0,
            y: 1,
            z: 0,
            deg: 0
          }
        },
        right: {
          translate: {
            x: faceSize,
            y: 0,
            z: 0
          },
          rotate: {
            x: 0,
            y: 1,
            z: 0,
            deg: 90
          }
        },
        back: {
          translate: {
            x: 0,
            y: 0,
            z: -faceSize
          },
          rotate: {
            x: 0,
            y: 1,
            z: 0,
            deg: 180
          }
        },
        left: {
          translate: {
            x: -faceSize,
            y: 0,
            z: 0
          },
          rotate: {
            x: 0,
            y: 1,
            z: 0,
            deg: -90
          }
        },
        top: {
          translate: {
            x: 0,
            y: -faceSize,
            z: 0
          },
          rotate: {
            x: 1,
            y: 0,
            z: 0,
            deg: 90
          }
        },
        bottom: {
          translate: {
            x: 0,
            y: faceSize,
            z: 0
          },
          rotate: {
            x: 1,
            y: 0,
            z: 0,
            deg: -90
          }
        }
      },
      children: []
    };
  }

  componentDidMount() {
    const { children } = this.props;
    const { index, cube, faces } = this.state;
    const newChildren = children
      ? Array.isArray(children)
        ? [...children].slice(0, 6)
        : [children]
      : [];

    while (newChildren.length < 6) {
      newChildren.push(emptyFace);
    }

    this.setState({
      cube: {
        ...cube,
        rotateX: faces[index].rotate.x ? -faces[index].rotate.deg : 0,
        rotateY: faces[index].rotate.y ? -faces[index].rotate.deg : 0,
        rotateZ: 0
      },
      children: newChildren
    });
  }

  dragCube = () => {
    const { cube, mouseDelta } = this.state;
    const [dx, dy] = mouseDelta;

    const rotateX = cube.rotateX - dy;
    const absX = Math.abs(rotateX % 360);
    const rotateY =
      absX > 90 && absX < 270 ? cube.rotateY - dx : cube.rotateY + dx;

    this.setState({
      cube: {
        ...cube,
        rotateX,
        rotateY
      }
    });
  };

  handleMouseDown = (e: React.MouseEvent) => {
    const { pageX, pageY } = e;

    this.setState({
      isPressed: true,
      isMoved: false,
      mouseXY: [pageX, pageY]
    });

    e.preventDefault();
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

      this.dragCube();
    }
  };

  handleMouseUp = () => {
    const { isPressed } = this.state;

    if (isPressed) {
      this.setState({
        isPressed: false,
        mouseXY: [0, 0],
        mouseDelta: [0, 0]
      });
    }
  };

  render() {
    const { cube, faces, children } = this.state;
    return (
      <div className={styles.cubeWrapper}>
        <Motion
          style={{
            rotateX: spring(cube.rotateX),
            rotateY: spring(cube.rotateY),
            rotateZ: spring(cube.rotateZ)
          }}
        >
          {({ rotateX, rotateY, rotateZ }) => {
            return (
              <div
                className={styles.cube}
                style={{
                  transform: `translate3d(${cube.translate.x}px, ${
                    cube.translate.y
                  }px, ${
                    cube.translate.z
                  }px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
                }}
              >
                {Object.keys(faces).map((face, key) => {
                  const { translate, rotate } = faces[face];

                  return (
                    <div
                      className={`${styles.cubeFace} ${styles[face]}`}
                      key={key}
                      style={{
                        transform: `translate3d(${translate.x}px, ${
                          translate.y
                        }px, ${translate.z}px) rotate3d(${rotate.x}, ${
                          rotate.y
                        }, ${rotate.z}, ${rotate.deg}deg)`,
                        width: cube.width,
                        height: cube.height
                      }}
                      onMouseDown={e => {
                        this.handleMouseDown(e);
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
                      {children[key]}
                    </div>
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

export default Cube;
