import { afterEach, describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../test/axe';
import { Navigation } from './Navigation';

const LINKS = ['home', 'about', 'projects', 'skills', 'contact'];

const addSection = (id: string, top: number, bottom: number) => {
  const section = document.createElement('section');
  section.id = id;
  section.getBoundingClientRect = () => ({ top, bottom }) as DOMRect;
  document.body.appendChild(section);
  return section;
};

describe('Navigation', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('links every section from the desktop bar', () => {
    render(<Navigation />);

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    for (const label of LINKS) {
      const links = within(nav).getAllByRole('link', { name: `./${label}` });
      expect(links[0]).toHaveAttribute('href', `#${label}`);
    }
  });

  it('highlights the section in view on mount, before any scroll', () => {
    addSection('home', -900, -100);
    addSection('projects', 0, 800);

    render(<Navigation />);

    const [desktopLink] = screen.getAllByRole('link', { name: './projects' });
    expect(desktopLink).toHaveClass('text-primary');
    const [homeLink] = screen.getAllByRole('link', { name: './home' });
    expect(homeLink).not.toHaveClass('text-primary');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Navigation />);

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Navigation mobile menu', () => {
  it('starts closed and wires the button to the menu', () => {
    render(<Navigation />);

    const button = screen.getByRole('button', { name: /menu/ });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'mobile-menu');
    expect(document.getElementById('mobile-menu')).not.toBeVisible();
  });

  it('opens when the button is activated', async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    await user.click(screen.getByRole('button', { name: /menu/ }));

    expect(screen.getByRole('button', { name: /menu/ })).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('mobile-menu')).toBeVisible();
  });

  it('opens from the keyboard', async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    const button = screen.getByRole('button', { name: /menu/ });
    // A native button is reachable by Tab and opens on Enter without any extra key handler
    button.focus();
    await user.keyboard('{Enter}');

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes on Escape and returns focus to the button', async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    const button = screen.getByRole('button', { name: /menu/ });

    await user.click(button);
    await user.keyboard('{Escape}');

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById('mobile-menu')).not.toBeVisible();
    expect(button).toHaveFocus();
  });

  it('closes when a menu link is clicked', async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    const button = screen.getByRole('button', { name: /menu/ });

    await user.click(button);
    const menu = document.getElementById('mobile-menu') as HTMLElement;
    await user.click(within(menu).getByRole('link', { name: './skills' }));

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(menu).not.toBeVisible();
  });

  it('has no accessibility violations while open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Navigation />);

    await user.click(screen.getByRole('button', { name: /menu/ }));

    expect(await axe(container)).toHaveNoViolations();
  });
});
