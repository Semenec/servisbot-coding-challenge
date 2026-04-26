import { render } from '@testing-library/react';
import { PageLoadingState } from '../PageLoadingState';

describe('PageLoadingState', () => {
  it('renders a spinner', () => {
    const { container } = render(<PageLoadingState />);
    expect(container.querySelector('.ant-spin')).toBeInTheDocument();
  });
});
