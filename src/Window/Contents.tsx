import * as React from 'react';

type Props = {
  titlebar: {
    use: boolean;
    height: number;
  };
  width: number;
  height: number;
  children: React.ReactNode;
};

class Contents extends React.Component<Props> {
  render() {
    const { titlebar, width, height, children } = this.props;
    return (
      <div
        style={{
          width,
          height: titlebar.use ? height - titlebar.height : height
        }}
      >
        {children}
      </div>
    );
  }
}

export default Contents;
