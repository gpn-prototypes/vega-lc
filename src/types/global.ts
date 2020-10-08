import ResizeObserver from 'resize-observer-polyfill';

declare global {
  interface Window {
    ResizeObserver: typeof ResizeObserver;
  }
}
