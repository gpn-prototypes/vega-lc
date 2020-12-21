const sessionStorageKey = 'currentVersion';

export function getCurrentVersion(increment = false): number {
  const value = sessionStorage.getItem(sessionStorageKey) || '';
  return +value;
}

export function incrementVersion(): void {
  sessionStorage.setItem(sessionStorageKey, `${getCurrentVersion() + 1}`);
}
export function setCurrentVersion(version: number): void {
  sessionStorage.setItem(sessionStorageKey, `${version}`);
}
