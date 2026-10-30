import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { installMatchMedia } from '../test/matchMedia';
import { TypingText } from './TypingText';

// The start timer, the interval and the state updates chain through renders, so time moves in
// small steps with a React flush between them.
const advance = (ms: number) => {
  for (let elapsed = 0; elapsed < ms; elapsed += 5) {
    act(() => {
      vi.advanceTimersByTime(5);
    });
  }
};

describe('TypingText', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('types the text one character at a time and reports completion once', () => {
    const onComplete = vi.fn();
    const { container } = render(<TypingText text="abc" speed={10} onComplete={onComplete} />);
    const animated = container.querySelector('[aria-hidden="true"]') as HTMLElement;

    expect(animated).toHaveTextContent('');

    advance(25);
    expect(animated).toHaveTextContent('ab');

    advance(100);
    expect(animated).toHaveTextContent('abc');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('does not restart typing when the callback identity changes', () => {
    const { container, rerender } = render(<TypingText text="abcd" speed={10} onComplete={() => {}} />);
    const animated = container.querySelector('[aria-hidden="true"]') as HTMLElement;

    advance(25);
    expect(animated).toHaveTextContent('ab');
    rerender(<TypingText text="abcd" speed={10} onComplete={() => {}} />);
    advance(10);

    expect(animated).toHaveTextContent('abc');
  });

  it('exposes the full text to assistive technology and hides the animation', () => {
    const { container } = render(<TypingText text="hello" speed={10} />);

    expect(screen.getByText('hello')).toHaveClass('sr-only');
    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(2);
  });

  it('shows the full text at once and skips the cursor with reduced motion', () => {
    installMatchMedia(true);
    const onComplete = vi.fn();
    const { container } = render(<TypingText text="hello" speed={10} onComplete={onComplete} />);

    const hidden = container.querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(1);
    expect(hidden[0]).toHaveTextContent('hello');
    expect(container).not.toHaveTextContent('▌');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
