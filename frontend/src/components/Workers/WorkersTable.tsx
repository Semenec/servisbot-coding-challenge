import { Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { TitleWithDescription } from '../common/TitleWithDescription';
import { formatDate } from '../../utils';
import type { Worker } from '../../api';

interface WorkersTableProps {
  data: Worker[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
  botId: string;
}

export const WorkersTable: React.FC<WorkersTableProps> = ({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  botId,
}) => {
  const columns: ColumnType<Worker>[] = [
    {
      title: 'Worker',
      dataIndex: 'name',
      key: 'name',
      render: (name: Worker['name'], record: Worker) => (
        <TitleWithDescription title={name} description={record.description} />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: Worker['createdAt']) => formatDate(createdAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Link to={`/bots/${botId}/workers/${record.id}/logs`}>View Logs</Link>
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
        showSizeChanger: false,
      }}
    />
  );
};
