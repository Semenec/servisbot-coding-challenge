import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BreadcrumbTrail } from '../BreadcrumbTrail';

function renderInRouter(items: { title: string; path?: string }[]) {
  return render(
    <MemoryRouter>
      <BreadcrumbTrail items={items} />
    </MemoryRouter>,
  );
}

describe('BreadcrumbTrail', () => {
  it('renders an item with a path as a Link', () => {
    renderInRouter([{ title: 'Bots', path: '/' }, { title: 'Bot One' }]);

    const link = screen.getByRole('link', { name: 'Bots' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders an item without a path as plain text', () => {
    renderInRouter([{ title: 'Bot One' }]);

    expect(screen.getByText('Bot One')).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Bot One' }),
    ).not.toBeInTheDocument();
  });
});
