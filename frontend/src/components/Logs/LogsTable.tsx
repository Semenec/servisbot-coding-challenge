import { Table, Typography } from "antd";
import type { ColumnType } from "antd/es/table";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";
import type { LogEntry } from "../../api";

interface LogsTableProps {
  data: LogEntry[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
  showWorkerColumn?: boolean;
  botId?: string;
}

export const LogsTable: React.FC<LogsTableProps> = ({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  showWorkerColumn = false,
  botId,
}) => {
  const baseColumns: ColumnType<LogEntry>[] = [
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, log) => <Typography.Text ellipsis>{formatDate(log.createdAt)}</Typography.Text>,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (_, log) => (
        <Typography.Paragraph>{log.message}</Typography.Paragraph>
      ),
    },
  ];

  const workerColumn: ColumnType<LogEntry> = {
    title: "Worker",
    dataIndex: ["worker", "name"],
    key: "worker",
    render: (_, record) => {
      const workerName = record.worker?.name;

      return (
        <Typography.Text ellipsis>
          <Link to={`/bots/${botId}/workers/${record.workerId}/logs`}>
            {workerName}
          </Link>
        </Typography.Text>
      );
    },
  };

  const columns = showWorkerColumn
    ? [...baseColumns, workerColumn]
    : baseColumns;

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
