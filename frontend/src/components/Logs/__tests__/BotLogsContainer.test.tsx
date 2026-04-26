import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { BotStatus, type Bot, type LogEntry, type PaginatedResponse } from '../../../api';
import { BotLogsContainer } from '../BotLogsContainer';

vi.mock('../../../hooks/useQueries', () => ({
  useBotById: vi.fn(),
  useBotLogs: vi.fn(),
}));

vi.mock('../../../hooks/usePagination', () => ({
  usePagination: () => ({ page: 1, pageSize: 10, onPageChange: vi.fn() }),
}));

import { useBotById, useBotLogs } from '../../../hooks/useQueries';

const mockedUseBotById = vi.mocked(useBotById);
const mockedUseBotLogs = vi.mocked(useBotLogs);

function setBot(data: Bot | undefined, isLoading = false) {
  mockedUseBotById.mockReturnValue({
    data,
    isLoading,
  } as unknown as ReturnType<typeof useBotById>);
}

function setLogs(value: {
  data?: PaginatedResponse<LogEntry>;
  isLoading: boolean;
  isError: boolean;
}) {
  mockedUseBotLogs.mockReturnValue(
    value as unknown as ReturnType<typeof useBotLogs>,
  );
}

const bot: Bot = {
  id: 'b1',
  name: 'Bot One',
  description: null,
  status: BotStatus.ENABLED,
  createdAt: '2024-04-22T12:00:00.000Z',
};

function renderContainer() {
  return render(
    <MemoryRouter initialEntries={['/bots/b1/logs']}>
      <Routes>
        <Route path="/bots/:botId/logs" element={<BotLogsContainer />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('BotLogsContainer', () => {
  it('shows the spinner while either bot or logs is loading', () => {
    setBot(undefined, true);
    setLogs({ data: undefined, isLoading: false, isError: false });

    const { container } = renderContainer();
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('shows an error empty state when the logs query fails', () => {
    setBot(bot);
    setLogs({ data: undefined, isLoading: false, isError: true });

    renderContainer();
    expect(screen.getByText('Unable to load bot logs')).toBeInTheDocument();
  });

  it('renders logs and the worker column with a link to per-worker logs', () => {
    setBot(bot);
    setLogs({
      data: {
        items: [
          {
            id: 'l1',
            createdAt: '2024-04-22T12:00:00.000Z',
            message: 'first log',
            botId: 'b1',
            workerId: 'w1',
            worker: { id: 'w1', name: 'Worker One' },
          },
        ],
        total: 1,
      },
      isLoading: false,
      isError: false,
    });

    renderContainer();
    expect(screen.getByText('first log')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Worker One' })).toHaveAttribute(
      'href',
      '/bots/b1/workers/w1/logs',
    );
  });
});
