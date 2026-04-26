import { Spin } from 'antd';

export const PageLoadingState = () => {
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <Spin size="large" />
    </div>
  );
};
