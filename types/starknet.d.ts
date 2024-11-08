declare global {
  interface Window {
    starknet?: {
      account: string | null;
      accounts: string[];
      on: (event: string, handler: (accounts?: string[]) => void) => void;
      off: (event: string, handler: (accounts?: string[]) => void) => void;
      request: (options: { method: string }) => Promise<any>;
    };
  }
}
