import { Tag } from 'antd';
import { BotStatus } from '../../api';

const statusColor = {
  [BotStatus.ENABLED]: 'success',
  [BotStatus.DISABLED]: 'default',
  [BotStatus.PAUSED]: 'warning',
};

interface BotStatusProps {
  status: BotStatus;
}

export const BotStatusBadge: React.FC<BotStatusProps> = ({ status }) => {
  const getStatusLabel = (status: BotStatus) => {
    switch (status) {
      case BotStatus.ENABLED:
        return 'Enabled';
      case BotStatus.DISABLED:
        return 'Disabled';
      case BotStatus.PAUSED:
        return 'Paused';
      default:
        return 'Unknown';
    }
  };
  return (
    <Tag color={statusColor[status] || 'default'}>{getStatusLabel(status)}</Tag>
  );
};
