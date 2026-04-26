import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  BotStatus,
  type Bot,
  type PaginatedResponse,
  type Worker,
} from '../../../api';
import { BotWorkersContainer } from '../BotWorkersContainer';

vi.mock('../../../hooks/useQueries', () => ({
  useBotById: vi.fn(),
  useBotWorkers: vi.fn(),
}));

vi.mock('../../../hooks/usePagination', () => ({
  usePagination: () => ({ page: 1, pageSize: 10, onPageChange: vi.fn() }),
}));

import { useBotById, useBotWorkers } from '../../../hooks/useQueries';

const mockedUseBotById = vi.mocked(useBotById);
const mockedUseBotWorkers = vi.mocked(useBotWorkers);

function setUseBotById(data: Bot | undefined, isLoading = false) {
  mockedUseBotById.mockReturnValue({
    data,
    isLoading,
  } as unknown as ReturnType<typeof useBotById>);
}

function setUseBotWorkers(value: {
  data?: PaginatedResponse<Worker>;
  isLoading: boolean;
  isError: boolean;
}) {
  mockedUseBotWorkers.mockReturnValue(
    value as unknown as ReturnType<typeof useBotWorkers>,
  );
}

function renderContainer() {
  return render(
    <MemoryRouter initialEntries={['/bots/b1/workers']}>
      <Routes>
        <Route path="/bots/:botId/workers" element={<BotWorkersContainer />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('BotWorkersContainer', () => {
  it('shows the spinner while the workers query is loading', () => {
    setUseBotById({
      id: 'b1',
      name: 'Bot One',
      description: null,
      status: BotStatus.ENABLED,
      createdAt: '2024-04-22T12:00:00.000Z',
    });
    setUseBotWorkers({ data: undefined, isLoading: true, isError: false });

    const { container } = renderContainer();
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('shows an error empty state when the workers query fails', () => {
    setUseBotById({
      id: 'b1',
      name: 'Bot One',
      description: null,
      status: BotStatus.ENABLED,
      createdAt: '2024-04-22T12:00:00.000Z',
    });
    setUseBotWorkers({ data: undefined, isLoading: false, isError: true });

    renderContainer();
    expect(screen.getByText('Unable to load workers')).toBeInTheDocument();
  });

  it('renders the workers table and breadcrumb with the bot name when loaded', () => {
    setUseBotById({
      id: 'b1',
      name: 'Bot One',
      description: null,
      status: BotStatus.ENABLED,
      createdAt: '2024-04-22T12:00:00.000Z',
    });
    setUseBotWorkers({
      data: {
        items: [
          {
            id: 'w1',
            name: 'Worker One',
            description: 'First Worker',
            botId: 'b1',
            createdAt: '2024-04-22T12:00:00.000Z',
          },
        ],
        total: 1,
      },
      isLoading: false,
      isError: false,
    });

    renderContainer();
    expect(screen.getByText('Workers for Bot One')).toBeInTheDocument();
    expect(screen.getByText('Worker One')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Logs' })).toHaveAttribute(
      'href',
      '/bots/b1/workers/w1/logs',
    );
  });
});
