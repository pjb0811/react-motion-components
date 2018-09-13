import * as React from 'react';
import styles from './window.css';

type Props = {
  titlebar: {
    use: boolean;
    title: string;
    component: React.ComponentType<any> | null;
    height: number;
  };
  width: number;
  isFulling: () => boolean;
  toggleWindowSize: () => void;
  handleMouseDown: (e: React.MouseEvent<any>) => void;
  removeWindow: () => void;
};

class TitleBar extends React.Component<Props> {
  render() {
    const {
      titlebar,
      width,
      toggleWindowSize,
      handleMouseDown,
      removeWindow,
      isFulling
    } = this.props;

    if (!titlebar.use) {
      return null;
    }

    if (titlebar.component) {
      return (
        <titlebar.component
          width={width}
          height={titlebar.height}
          title={titlebar.title}
          toggleWindowSize={toggleWindowSize}
          handleMouseDown={handleMouseDown}
          removeWindow={removeWindow}
          isFulling={isFulling()}
        />
      );
    }

    return (
      <div
        className={styles.titlebar}
        style={{
          width,
          height: titlebar.height
        }}
      >
        <h4 onDoubleClick={toggleWindowSize} onMouseDown={handleMouseDown}>
          {titlebar.title}
        </h4>
        <button className={styles.resize} onClick={toggleWindowSize} />
        <button className={styles.close} onClick={removeWindow} />
      </div>
    );
  }
}

export default TitleBar;
