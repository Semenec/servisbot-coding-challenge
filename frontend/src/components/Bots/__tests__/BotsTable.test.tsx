import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { BotStatus, type Bot } from '../../../api';
import { BotsTable } from '../BotsTable';

const bots: Bot[] = [
  {
    id: 'b1',
    name: 'Bot One',
    description: 'First Bot',
    status: BotStatus.ENABLED,
    createdAt: '2024-04-22T12:00:00.000Z',
  },
  {
    id: 'b2',
    name: 'Bot Two',
    description: null,
    status: BotStatus.PAUSED,
    createdAt: '2024-04-21T12:00:00.000Z',
  },
];

function renderTable(
  overrides: Partial<React.ComponentProps<typeof BotsTable>> = {},
) {
  const onPageChange = vi.fn();
  const utils = render(
    <MemoryRouter>
      <BotsTable
        data={bots}
        total={bots.length}
        page={1}
        pageSize={10}
        onPageChange={onPageChange}
        {...overrides}
      />
    </MemoryRouter>,
  );
  return { ...utils, onPageChange };
}

describe('BotsTable', () => {
  it('renders one row per bot with the expected actions', () => {
    renderTable();

    expect(screen.getByText('Bot One')).toBeInTheDocument();
    expect(screen.getByText('Bot Two')).toBeInTheDocument();

    const workerLinks = screen.getAllByRole('link', { name: 'View Workers' });
    expect(workerLinks[0]).toHaveAttribute('href', '/bots/b1/workers');
    expect(workerLinks[1]).toHaveAttribute('href', '/bots/b2/workers');

    const logsLinks = screen.getAllByRole('link', { name: 'View Logs' });
    expect(logsLinks[0]).toHaveAttribute('href', '/bots/b1/logs');
    expect(logsLinks[1]).toHaveAttribute('href', '/bots/b2/logs');
  });

  it('invokes onPageChange when the user picks a different page', async () => {
    const user = userEvent.setup();
    const { onPageChange } = renderTable({
      total: 25,
      page: 1,
      pageSize: 10,
    });

    await user.click(screen.getByRole('listitem', { name: '2' }));
    expect(onPageChange).toHaveBeenCalledWith(2, 10);
  });
});
