import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the missing path and a router link back home', () => {
    renderAt('/does/not/exist');

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('404');
    expect(screen.getByText('/does/not/exist')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '~' })).toHaveAttribute('href', '/');
  });

  it('logs the missing route', () => {
    renderAt('/nowhere');

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('404'), '/nowhere');
  });

  it('has no accessibility violations', async () => {
    const { container } = renderAt('/nowhere');

    expect(await axe(container)).toHaveNoViolations();
  });
});
