import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from '../test/axe';
import { SkillsSection } from './SkillsSection';

describe('SkillsSection', () => {
  it('renders each skill category with its skills', () => {
    const { container } = render(<SkillsSection />);

    expect(container.querySelector('section#skills')).toBeInTheDocument();
    expect(screen.getByText('frontend/')).toBeInTheDocument();
    expect(screen.getByText('devops/')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SkillsSection />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
