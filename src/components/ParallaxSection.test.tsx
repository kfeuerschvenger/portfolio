import { afterEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { installMatchMedia } from '../test/matchMedia';
import { Navigation } from './Navigation';
import { ParallaxSection } from './ParallaxSection';
import { TypingText } from './TypingText';

// A section on screen whose position makes the parallax offset non-zero when motion is allowed
const mockOnScreen = (element: HTMLElement) => {
  element.getBoundingClientRect = () => ({ top: 100, bottom: 500 }) as DOMRect;
};

const sectionOf = (container: HTMLElement) => container.querySelector('section') as HTMLElement;

describe('ParallaxSection', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('moves the section on scroll when motion is allowed', () => {
    installMatchMedia(false);
    const { container } = render(<ParallaxSection>content</ParallaxSection>);
    const section = sectionOf(container);
    mockOnScreen(section);

    act(() => {
      fireEvent.scroll(window);
    });

    expect(section.style.transform).not.toBe('translateY(0px)');
  });

  it('keeps the offset at 0 after a scroll with reduced motion', () => {
    installMatchMedia(true);
    const { container } = render(<ParallaxSection>content</ParallaxSection>);
    const section = sectionOf(container);
    mockOnScreen(section);

    act(() => {
      fireEvent.scroll(window);
    });

    expect(section.style.transform).toBe('translateY(0px)');
    expect(screen.getByText('content')).toBeVisible();
  });

  it('renders ParallaxSection, TypingText and Navigation without matchMedia', () => {
    // @ts-expect-error simulate an environment with no matchMedia at all
    delete window.matchMedia;
    expect(window.matchMedia).toBeUndefined();

    expect(() => {
      render(
        <>
          <Navigation />
          <ParallaxSection>parallax content</ParallaxSection>
          <TypingText text="typed text" />
        </>,
      );
    }).not.toThrow();

    expect(screen.getByText('parallax content')).toBeInTheDocument();
    expect(screen.getByText('typed text')).toBeInTheDocument();
  });
});
