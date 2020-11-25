export interface DebounceFunction<T> {
  (...args: T[]): void;
}

export const debounce = <T>(fn: DebounceFunction<T>, wait: number): DebounceFunction<T> => {
  let timeout: number;

  return function func(...args: T[]): void {
    const debouncedFunction = () => fn.apply(this, args);

    clearTimeout(timeout);
    timeout = window.setTimeout(debouncedFunction, wait);
  };
};
