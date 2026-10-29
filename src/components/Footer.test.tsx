import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from '../test/axe';
import { Footer } from './Footer';

describe('Footer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the current year and the stack credit', () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2030-06-15T12:00:00Z'));

    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toHaveTextContent('2030 Kevin Feuerschvenger');
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Footer />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
