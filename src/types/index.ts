export interface Identity {
  getToken(): Promise<string>;
}
