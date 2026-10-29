import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { axe } from '../test/axe';
import { HeroSection } from './HeroSection';

const NAME = 'Kevin Feuerschvenger';
// 20 characters at 80 ms, then 200 ms delay and 18 characters at 60 ms, with margin
const NAME_DURATION = NAME.length * 80 + 100;
const SUBTITLE_DURATION = 200 + 'Software Developer'.length * 60 + 100;

// The typing effects chain through state (start, then interval), so time has to move in small
// steps with a React flush between them. One big jump would skip the effects that need a render.
const advance = (ms: number) => {
  for (let elapsed = 0; elapsed < ms; elapsed += 10) {
    act(() => {
      vi.advanceTimersByTime(10);
    });
  }
};

describe('HeroSection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('types the name, then the subtitle, then reveals the links', () => {
    render(<HeroSection />);

    expect(screen.getByRole('heading', { level: 1 })).not.toHaveTextContent(NAME);
    expect(screen.queryByRole('link', { name: /github/ })).not.toBeInTheDocument();

    advance(NAME_DURATION);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(NAME);

    advance(SUBTITLE_DURATION);
    expect(screen.getByText(/Software Developer/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/ })).toHaveAttribute(
      'href',
      'https://github.com/kfeuerschvenger',
    );
    expect(screen.getByRole('link', { name: /linkedin/ })).toBeInTheDocument();
  });

  it('does not restart the name when the subtitle appears', () => {
    render(<HeroSection />);

    advance(NAME_DURATION);
    // The subtitle mounts and HeroSection re-renders; the name must stay complete
    advance(SUBTITLE_DURATION);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(NAME);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<HeroSection />);

    advance(NAME_DURATION + SUBTITLE_DURATION);
    // axe schedules its work with real timers
    vi.useRealTimers();

    expect(await axe(container)).toHaveNoViolations();
  });
});
