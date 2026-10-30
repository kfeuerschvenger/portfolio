import { configureAxe } from 'vitest-axe';

// jsdom does no layout or paint, so colour contrast cannot be computed there. Contrast is checked
// by hand against the palette instead. Every other axe rule stays on.
export const axe = configureAxe({
  rules: { 'color-contrast': { enabled: false } },
});
