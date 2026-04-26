import { Empty } from 'antd';

interface EmptyStateProps {
  title: string;
}

export const EmptyState = ({ title }: EmptyStateProps) => {
  return (
    <Empty
      description={
        <span>
          <strong>{title}</strong>
        </span>
      }
    ></Empty>
  );
};
