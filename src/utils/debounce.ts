const debounce = (fn: Function, wait: number): Function => {
  let timeout: number;

  return function func<T>(...args: T[]): void {
    const debouncedFunction = (): Function => fn.apply(this, args);

    clearTimeout(timeout);
    timeout = window.setTimeout(debouncedFunction, wait);
  };
};

export default debounce;
