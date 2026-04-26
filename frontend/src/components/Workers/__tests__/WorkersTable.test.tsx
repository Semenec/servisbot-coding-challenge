import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { Worker } from '../../../api';
import { WorkersTable } from '../WorkersTable';

const workers: Worker[] = [
  {
    id: 'w1',
    name: 'Worker One',
    description: 'First Worker',
    botId: 'b1',
    createdAt: '2024-04-22T12:00:00.000Z',
  },
];

describe('WorkersTable', () => {
  it('renders one row per worker with a logs link scoped to the parent bot', () => {
    render(
      <MemoryRouter>
        <WorkersTable
          data={workers}
          total={1}
          page={1}
          pageSize={10}
          onPageChange={vi.fn()}
          botId="b1"
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Worker One')).toBeInTheDocument();
    expect(screen.getByText('First Worker')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Logs' })).toHaveAttribute(
      'href',
      '/bots/b1/workers/w1/logs',
    );
  });
});
