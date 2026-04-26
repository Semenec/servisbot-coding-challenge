import { render, screen } from '@testing-library/react';
import { BotStatus } from '../../../api';
import { BotStatusBadge } from '../BotStatusBadge';

describe('BotStatusBadge', () => {
  it('renders the Enabled label with the success color', () => {
    const { container } = render(<BotStatusBadge status={BotStatus.ENABLED} />);
    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(container.querySelector('.ant-tag-success')).toBeInTheDocument();
  });

  it('renders the Disabled label with the default color', () => {
    const { container } = render(
      <BotStatusBadge status={BotStatus.DISABLED} />,
    );
    expect(screen.getByText('Disabled')).toBeInTheDocument();
    expect(container.querySelector('.ant-tag')).toBeInTheDocument();
  });

  it('renders the Paused label with the warning color', () => {
    const { container } = render(<BotStatusBadge status={BotStatus.PAUSED} />);
    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(container.querySelector('.ant-tag-warning')).toBeInTheDocument();
  });
});
