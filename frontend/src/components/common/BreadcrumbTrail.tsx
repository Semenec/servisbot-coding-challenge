import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  title: string;
  path?: string;
}

interface BreadcrumbTrailProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbTrail = ({ items }: BreadcrumbTrailProps) => {
  return (
    <Breadcrumb style={{ marginBottom: 20 }}>
      {items.map((item) => (
        <Breadcrumb.Item key={item.title}>
          {item.path ? <Link to={item.path}>{item.title}</Link> : item.title}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};
