import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from '../test/axe';
import { ProjectsSection } from './ProjectsSection';

describe('ProjectsSection', () => {
  it('lists every project as an external link', () => {
    const { container } = render(<ProjectsSection />);

    expect(container.querySelector('section#projects')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /BreezyBoard/ });
    expect(link).toHaveAttribute('href', 'https://github.com/kfeuerschvenger/BreezyBoard');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('lists walkthrough-studio', () => {
    render(<ProjectsSection />);

    expect(screen.getByRole('link', { name: /walkthrough-studio/ })).toHaveAttribute(
      'href',
      'https://github.com/kfeuerschvenger/walkthrough-studio',
    );
  });

  it('links to the full repository list', () => {
    render(<ProjectsSection />);

    expect(screen.getByRole('link', { name: /view all repositories/ })).toHaveAttribute(
      'href',
      'https://github.com/kfeuerschvenger?tab=repositories',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ProjectsSection />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
