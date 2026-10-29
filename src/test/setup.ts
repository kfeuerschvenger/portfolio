import '@testing-library/jest-dom/vitest';
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as axeMatchers from 'vitest-axe/matchers';

// Registered globally so any test can assert `expect(await axe(container)).toHaveNoViolations()`.
expect.extend(axeMatchers);

// Unmount whatever the previous test rendered so assertions never leak between tests.
afterEach(() => {
  cleanup();
});
