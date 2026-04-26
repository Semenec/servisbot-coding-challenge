import { Typography } from 'antd';

interface TitleWithDescriptionProps {
  title: string;
  description: string | null;
}

export const TitleWithDescription: React.FC<TitleWithDescriptionProps> = ({
  title,
  description,
}) => {
  return (
    <div>
      <Typography.Title level={5} style={{ margin: 0 }}>
        {title}
      </Typography.Title>
      {description && (
        <Typography.Text type="secondary">{description}</Typography.Text>
      )}
    </div>
  );
};
