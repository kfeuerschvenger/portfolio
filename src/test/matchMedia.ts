import { vi } from 'vitest';

type ChangeListener = (event: MediaQueryListEvent) => void;

// jsdom has no matchMedia. This installs a stub that answers every query with `initial` and lets a
// test flip the answer with `set`, notifying the listeners the way a real viewport change would.
export const installMatchMedia = (initial = false) => {
  let matches = initial;
  const listeners = new Set<ChangeListener>();

  window.matchMedia = vi.fn((query: string) => ({
    get matches() {
      return matches;
    },
    media: query,
    onchange: null,
    addEventListener: (_type: string, listener: ChangeListener) => listeners.add(listener),
    removeEventListener: (_type: string, listener: ChangeListener) => listeners.delete(listener),
    addListener: (listener: ChangeListener) => listeners.add(listener),
    removeListener: (listener: ChangeListener) => listeners.delete(listener),
    dispatchEvent: () => true,
  })) as unknown as typeof window.matchMedia;

  return {
    set(next: boolean) {
      matches = next;
      listeners.forEach((listener) => listener({ matches: next } as MediaQueryListEvent));
    },
    listenerCount: () => listeners.size,
  };
};
