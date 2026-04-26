import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BotStatus, type Bot, type PaginatedResponse } from '../../../api';
import { BotsContainer } from '../BotsContainer';

vi.mock('../../../hooks/useQueries', () => ({
  useBots: vi.fn(),
}));

vi.mock('../../../hooks/usePagination', () => ({
  usePagination: () => ({ page: 1, pageSize: 10, onPageChange: vi.fn() }),
}));

import { useBots } from '../../../hooks/useQueries';

type UseBotsReturn = {
  data?: PaginatedResponse<Bot>;
  isLoading: boolean;
  isError: boolean;
};

const mockedUseBots = vi.mocked(useBots);

function setUseBots(value: UseBotsReturn) {
  mockedUseBots.mockReturnValue(value as unknown as ReturnType<typeof useBots>);
}

function renderContainer() {
  return render(
    <MemoryRouter>
      <BotsContainer />
    </MemoryRouter>,
  );
}

describe('BotsContainer', () => {
  it('shows the loading spinner while the query is loading', () => {
    setUseBots({ data: undefined, isLoading: true, isError: false });
    const { container } = renderContainer();
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('shows an error empty state when the query fails', () => {
    setUseBots({ data: undefined, isLoading: false, isError: true });
    renderContainer();
    expect(screen.getByText('Unable to load bots')).toBeInTheDocument();
  });

  it('shows an empty state when there are no bots', () => {
    setUseBots({
      data: { items: [], total: 0 },
      isLoading: false,
      isError: false,
    });
    renderContainer();
    expect(screen.getByText('No bots available')).toBeInTheDocument();
  });

  it('renders the table when bots are loaded', () => {
    setUseBots({
      data: {
        items: [
          {
            id: 'b1',
            name: 'Bot One',
            description: 'First Bot',
            status: BotStatus.ENABLED,
            createdAt: '2024-04-22T12:00:00.000Z',
          },
        ],
        total: 1,
      },
      isLoading: false,
      isError: false,
    });
    renderContainer();
    expect(screen.getByText('Bot One')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Workers' })).toHaveAttribute(
      'href',
      '/bots/b1/workers',
    );
  });
});
