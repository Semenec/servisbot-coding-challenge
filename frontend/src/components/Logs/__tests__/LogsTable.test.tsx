import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { LogEntry } from '../../../api';
import { LogsTable } from '../LogsTable';

const logs: LogEntry[] = [
  {
    id: 'l1',
    createdAt: '2024-04-22T12:00:00.000Z',
    message: 'first log message',
    botId: 'b1',
    workerId: 'w1',
    worker: { id: 'w1', name: 'Worker One' },
  },
];

function renderTable(overrides: Partial<React.ComponentProps<typeof LogsTable>> = {}) {
  return render(
    <MemoryRouter>
      <LogsTable
        data={logs}
        total={1}
        page={1}
        pageSize={10}
        onPageChange={vi.fn()}
        {...overrides}
      />
    </MemoryRouter>,
  );
}

describe('LogsTable', () => {
  it('renders the message column always', () => {
    renderTable();
    expect(screen.getByText('first log message')).toBeInTheDocument();
  });

  it('omits the worker column by default', () => {
    renderTable();
    expect(screen.queryByText('Worker')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Worker One' })).not.toBeInTheDocument();
  });

  it('renders the worker column with a link to the worker logs page when showWorkerColumn is set', () => {
    renderTable({ showWorkerColumn: true, botId: 'b1' });

    const link = screen.getByRole('link', { name: 'Worker One' });
    expect(link).toHaveAttribute('href', '/bots/b1/workers/w1/logs');
  });
});
