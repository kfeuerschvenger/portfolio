import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { axe } from '../test/axe';
import NotFound from './NotFound';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <NotFound />
    </MemoryRouter>,
  );

describe('NotFound', () => {
  it('shows the missing path and a router link back home', () => {
    renderAt('/does/not/exist');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByText('/does/not/exist')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to home page' })).toHaveAttribute('href', '/');
  });

  it('sets the document title while mounted and restores it afterwards', () => {
    document.title = 'Home';
    const { unmount } = renderAt('/nowhere');

    expect(document.title).toBe('Page not found | Kevin Feuerschvenger');

    unmount();

    expect(document.title).toBe('Home');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderAt('/nowhere');

    expect(await axe(container)).toHaveNoViolations();
  });
});
