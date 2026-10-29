import { afterEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from '../test/axe';
import { installMatchMedia } from '../test/matchMedia';
import { Navigation } from './Navigation';

const LINKS = ['home', 'about', 'projects', 'skills', 'contact'];

type Rect = { top: number; bottom: number };

const addSection = (id: string, rect: Rect) => {
  const section = document.createElement('section');
  section.id = id;
  section.getBoundingClientRect = () => ({ ...rect }) as DOMRect;
  document.body.appendChild(section);
  return section;
};

const desktopLinks = () => within(screen.getByTestId('desktop-links'));
const mobileMenu = () => document.getElementById('mobile-menu') as HTMLElement;
const menuButton = () => screen.getByRole('button', { name: 'menu' });

describe('Navigation', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('links every section from the desktop bar', () => {
    render(<Navigation />);

    for (const label of LINKS) {
      expect(desktopLinks().getByRole('link', { name: label })).toHaveAttribute('href', `#${label}`);
    }
  });

  it('links every section from the mobile menu', () => {
    render(<Navigation />);

    for (const label of LINKS) {
      const link = within(mobileMenu()).getByRole('link', { name: label, hidden: true });
      expect(link).toHaveAttribute('href', `#${label}`);
    }
  });

  it('highlights the section in view on mount, before any scroll', () => {
    addSection('home', { top: -900, bottom: -100 });
    addSection('projects', { top: 0, bottom: 800 });

    render(<Navigation />);

    expect(desktopLinks().getByRole('link', { name: 'projects' })).toHaveClass('text-primary');
    expect(desktopLinks().getByRole('link', { name: 'home' })).not.toHaveClass('text-primary');
  });

  it('moves the highlight when the page scrolls to another section', () => {
    const home: Rect = { top: 0, bottom: 800 };
    const skills: Rect = { top: 800, bottom: 1600 };
    addSection('home', home);
    addSection('skills', skills);

    render(<Navigation />);
    expect(desktopLinks().getByRole('link', { name: 'home' })).toHaveClass('text-primary');
    expect(desktopLinks().getByRole('link', { name: 'skills' })).not.toHaveClass('text-primary');

    Object.assign(home, { top: -800, bottom: 0 });
    Object.assign(skills, { top: 0, bottom: 800 });
    fireEvent.scroll(window);

    expect(desktopLinks().getByRole('link', { name: 'skills' })).toHaveClass('text-primary');
    expect(desktopLinks().getByRole('link', { name: 'home' })).not.toHaveClass('text-primary');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Navigation />);

    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Navigation mobile menu', () => {
  it('starts closed and wires the button to the menu', () => {
    render(<Navigation />);

    const button = menuButton();
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'mobile-menu');
    expect(mobileMenu()).not.toBeVisible();
  });

  it('opens when the button is activated', async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    await user.click(menuButton());

    expect(menuButton()).toHaveAttribute('aria-expanded', 'true');
    expect(mobileMenu()).toBeVisible();
  });

  it('opens from the keyboard', async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    const button = menuButton();
    // A native button is reachable by Tab and opens on Enter without any extra key handler
    button.focus();
    await user.keyboard('{Enter}');

    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes on Escape and returns focus to the button', async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    const button = menuButton();

    await user.click(button);
    await user.keyboard('{Escape}');

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(mobileMenu()).not.toBeVisible();
    expect(button).toHaveFocus();
  });

  it('closes when a menu link is clicked', async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    const button = menuButton();

    await user.click(button);
    const menu = mobileMenu();
    await user.click(within(menu).getByRole('link', { name: 'skills' }));

    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(menu).not.toBeVisible();
  });

  it('closes on a click outside the navigation', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Navigation />
        <main>content</main>
      </>,
    );

    await user.click(menuButton());
    await user.click(screen.getByText('content'));

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
    expect(mobileMenu()).not.toBeVisible();
  });

  it('stays open on a click inside the navigation', async () => {
    const user = userEvent.setup();
    render(<Navigation />);

    await user.click(menuButton());
    await user.click(screen.getByRole('link', { name: '~/kfeuerschvenger' }));

    expect(menuButton()).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes when the viewport reaches the md breakpoint', async () => {
    const viewport = installMatchMedia(false);
    const user = userEvent.setup();
    render(<Navigation />);

    await user.click(menuButton());
    expect(menuButton()).toHaveAttribute('aria-expanded', 'true');

    act(() => viewport.set(true));

    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
    expect(mobileMenu()).not.toBeVisible();
  });

  it('removes the viewport listener on unmount', () => {
    const viewport = installMatchMedia(false);
    const { unmount } = render(<Navigation />);
    expect(viewport.listenerCount()).toBe(1);

    unmount();

    expect(viewport.listenerCount()).toBe(0);
  });

  it('has no accessibility violations while open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Navigation />);

    await user.click(menuButton());

    expect(await axe(container)).toHaveNoViolations();
  });
});
