import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  BotStatus,
  type Bot,
  type LogEntry,
  type PaginatedResponse,
  type Worker,
} from '../../../api';
import { WorkerLogsContainer } from '../WorkerLogsContainer';

vi.mock('../../../hooks/useQueries', () => ({
  useBotById: vi.fn(),
  useWorkerById: vi.fn(),
  useWorkerLogs: vi.fn(),
}));

vi.mock('../../../hooks/usePagination', () => ({
  usePagination: () => ({ page: 1, pageSize: 10, onPageChange: vi.fn() }),
}));

import {
  useBotById,
  useWorkerById,
  useWorkerLogs,
} from '../../../hooks/useQueries';

const mockedUseBotById = vi.mocked(useBotById);
const mockedUseWorkerById = vi.mocked(useWorkerById);
const mockedUseWorkerLogs = vi.mocked(useWorkerLogs);

function setBot(data: Bot | undefined, isLoading = false) {
  mockedUseBotById.mockReturnValue({
    data,
    isLoading,
  } as unknown as ReturnType<typeof useBotById>);
}

function setWorker(data: Worker | undefined, isLoading = false) {
  mockedUseWorkerById.mockReturnValue({
    data,
    isLoading,
  } as unknown as ReturnType<typeof useWorkerById>);
}

function setLogs(value: {
  data?: PaginatedResponse<LogEntry>;
  isLoading: boolean;
  isError: boolean;
}) {
  mockedUseWorkerLogs.mockReturnValue(
    value as unknown as ReturnType<typeof useWorkerLogs>,
  );
}

const bot: Bot = {
  id: 'b1',
  name: 'Bot One',
  description: null,
  status: BotStatus.ENABLED,
  createdAt: '2024-04-22T12:00:00.000Z',
};

const worker: Worker = {
  id: 'w1',
  name: 'Worker One',
  description: null,
  botId: 'b1',
  createdAt: '2024-04-22T12:00:00.000Z',
};

function renderContainer() {
  return render(
    <MemoryRouter initialEntries={['/bots/b1/workers/w1/logs']}>
      <Routes>
        <Route
          path="/bots/:botId/workers/:workerId/logs"
          element={<WorkerLogsContainer />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('WorkerLogsContainer', () => {
  it('shows the spinner if worker metadata is still loading', () => {
    setBot(bot);
    setWorker(undefined, true);
    setLogs({ data: undefined, isLoading: false, isError: false });

    const { container } = renderContainer();
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('shows an error empty state when the logs query fails', () => {
    setBot(bot);
    setWorker(worker);
    setLogs({ data: undefined, isLoading: false, isError: true });

    renderContainer();
    expect(screen.getByText('Unable to load worker logs')).toBeInTheDocument();
  });

  it('renders the worker name in the heading and the logs in the table', () => {
    setBot(bot);
    setWorker(worker);
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
    expect(screen.getByText('Logs for Worker One')).toBeInTheDocument();
    expect(screen.getByText('first log')).toBeInTheDocument();
  });
});
