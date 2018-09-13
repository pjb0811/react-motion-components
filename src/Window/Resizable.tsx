import * as React from 'react';
import styles from './window.css';

type Props = {
  width: number;
  height: number;
  cells: Array<{ top: number; left: number }>;
  resizable: {
    type: string;
    mouseXY: Array<number>;
    mouseDelta: Array<number>;
    isMoved: boolean;
    isPressed: boolean;
    shiftXY: Array<number>;
    position: { top: number; left: number; right: number; bottom: number };
  };
  resizableMouseDown: (
    params: { e: React.MouseEvent<any>; type: string }
  ) => void;
  resizableMouseMove: (e: any) => void;
  resizableMouseUp: () => void;
};

class Resizable extends React.Component<Props> {
  state = {
    size: 10
  };

  componentDidMount() {
    const { resizableMouseMove, resizableMouseUp } = this.props;
    window.addEventListener('mousemove', resizableMouseMove);
    window.addEventListener('mouseup', resizableMouseUp);
  }

  render() {
    const { width, height, cells, resizable, resizableMouseDown } = this.props;
    const { position } = resizable;
    const [cell = { top: 0, left: 0 }] = cells;
    const { top, left } = cell;
    const { size } = this.state;

    return (
      <ul
        className={styles.resizable}
        style={{
          width: width + size - position.left + position.right,
          height: height + size - position.top + position.bottom,
          top: top + position.top + -size / 2,
          left: left + position.left + -size / 2
        }}
      >
        <li
          className={styles.nwse}
          style={{
            width: size / 2,
            height: size / 2
          }}
          onMouseDown={e => {
            resizableMouseDown({ e, type: 'leftTop' });
          }}
        />
        <li
          className={styles.ns}
          style={{
            width: width - position.left + position.right,
            height: size / 2
          }}
          onMouseDown={e => {
            resizableMouseDown({ e, type: 'top' });
          }}
        />
        <li
          className={styles.nesw}
          style={{
            width: size / 2,
            height: size / 2
          }}
          onMouseDown={e => {
            resizableMouseDown({ e, type: 'rightTop' });
          }}
        />
        <li
          className={styles.ew}
          style={{
            width: size / 2,
            height: height - position.top + position.bottom
          }}
          onMouseDown={e => {
            resizableMouseDown({ e, type: 'left' });
          }}
        />
        <li
          style={{
            width: width - position.left + position.right,
            height: height - position.top + position.bottom
          }}
        />
        <li
          className={styles.ew}
          style={{
            width: size / 2,
            height: height - position.top + position.bottom
          }}
          onMouseDown={e => {
            resizableMouseDown({ e, type: 'right' });
          }}
        />
        <li
          className={styles.nesw}
          style={{
            width: size / 2,
            height: size / 2
          }}
          onMouseDown={e => {
            resizableMouseDown({ e, type: 'leftBottom' });
          }}
        />
        <li
          className={styles.ns}
          style={{
            width: width - position.left + position.right,
            height: size / 2
          }}
          onMouseDown={e => {
            resizableMouseDown({ e, type: 'bottom' });
          }}
        />
        <li
          className={styles.nwse}
          style={{
            width: size / 2,
            height: size / 2
          }}
          onMouseDown={e => {
            resizableMouseDown({ e, type: 'rightBottom' });
          }}
        />
      </ul>
    );
  }
}

export default Resizable;
