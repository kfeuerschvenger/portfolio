import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from '../test/axe';
import { AboutSection } from './AboutSection';

describe('AboutSection', () => {
  it('renders the about section with its bio', () => {
    const { container } = render(<AboutSection />);

    expect(container.querySelector('section#about')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
    expect(screen.getByText('about.txt - vim')).toBeInTheDocument();
  });

  it('keeps the whitespace between inline elements and text', () => {
    const { container } = render(<AboutSection />);
    const text = container.textContent ?? '';

    expect(text).toContain('Java (Spring Boot), PHP (Laravel)');
    expect(text).toContain('Sur Software with ETL pipelines');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<AboutSection />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
