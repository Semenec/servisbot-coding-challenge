import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No bots available" />);
    expect(screen.getByText('No bots available')).toBeInTheDocument();
  });
});
