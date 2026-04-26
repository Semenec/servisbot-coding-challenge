import { render, screen } from '@testing-library/react';
import { TitleWithDescription } from '../TitleWithDescription';

describe('TitleWithDescription', () => {
  it('renders both title and description', () => {
    render(<TitleWithDescription title="Bot One" description="First Bot" />);
    expect(screen.getByText('Bot One')).toBeInTheDocument();
    expect(screen.getByText('First Bot')).toBeInTheDocument();
  });

  it('omits the description block when description is null', () => {
    render(<TitleWithDescription title="Bot One" description={null} />);
    expect(screen.getByText('Bot One')).toBeInTheDocument();
    expect(screen.queryByText('First Bot')).not.toBeInTheDocument();
  });
});
