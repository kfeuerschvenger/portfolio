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

  it('renders the testing, version control and ai groups', () => {
    render(<SkillsSection />);

    expect(screen.getByText('testing/')).toBeInTheDocument();
    expect(screen.getByText('version-control/')).toBeInTheDocument();
    expect(screen.getByText('ai/')).toBeInTheDocument();
    expect(screen.getByText('OpenShift')).toBeInTheDocument();
    expect(screen.getByText('Bitbucket')).toBeInTheDocument();
    expect(screen.getByText('MCP')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SkillsSection />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
