declare global {
  interface Window {
    starknet?: {
      account: string[];
      on(event: string, handler: (accounts: string[]) => void): void;
      off(event: string, handler: (accounts: string[]) => void): void;
      request(params: { method: string }): Promise<string[]>;
    };
  }
}
