// `toHaveNoViolations` is registered at runtime by expect.extend in src/test/setup.ts, but its
// type has to be declared here or `tsc -b` fails on a matcher it cannot see. vitest-axe augments
// the legacy `Vi` namespace, which recent Vitest versions no longer read, so the augmentation is
// written against the `Matchers` interface of the installed Vitest.
declare module 'vitest' {
  interface Matchers<T = unknown> {
    toHaveNoViolations(): T;
  }
}

export {};
