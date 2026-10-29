import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as axeMatchers from 'vitest-axe/matchers';
import { installMatchMedia } from './matchMedia';

// Registered globally so any test can assert `expect(await axe(container)).toHaveNoViolations()`.
expect.extend(axeMatchers);

// Every test starts on a viewport where no media query matches. Tests that need another answer
// call installMatchMedia themselves.
beforeEach(() => {
  installMatchMedia(false);
});

// Unmount whatever the previous test rendered so assertions never leak between tests.
afterEach(() => {
  cleanup();
});
