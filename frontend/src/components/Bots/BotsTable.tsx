import { Space, Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import type { Bot } from '../../api';
import { formatDate } from '../../utils';
import { BotStatusBadge } from './BotStatusBadge';
import { TitleWithDescription } from '../common/TitleWithDescription';

interface BotsTableProps {
  data: Bot[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
}

export const BotsTable: React.FC<BotsTableProps> = ({
  data,
  total,
  page,
  pageSize,
  onPageChange,
}) => {
  const columns: ColumnType<Bot>[] = [
    {
      title: 'Bot',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <TitleWithDescription
          title={record.name}
          description={record.description}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => <BotStatusBadge status={record.status} />,
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record) => formatDate(record.createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Link to={`/bots/${record.id}/workers`}>View Workers</Link>
          <Link to={`/bots/${record.id}/logs`}>View Logs</Link>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data}
      pagination={{
        current: page,
        pageSize,
        total: total,
        onChange: onPageChange,
        showSizeChanger: true,
      }}
    />
  );
};
