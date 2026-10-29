import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from '../test/axe';
import { ContactSection } from './ContactSection';

describe('ContactSection', () => {
  it('renders the contact links', () => {
    const { container } = render(<ContactSection />);

    expect(container.querySelector('section#contact')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /github/ })).toHaveAttribute(
      'href',
      'https://github.com/kfeuerschvenger',
    );
    expect(screen.getByRole('link', { name: /linkedin/ })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/kevin-feuerschvenger',
    );
    expect(screen.getByRole('link', { name: /email/ })).toHaveAttribute(
      'href',
      'mailto:kfeuerschvenger@gmail.com',
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<ContactSection />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
