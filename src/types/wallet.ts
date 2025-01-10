declare global {
  interface Window {
    okxwallet: any;
    metaMask: any;
    phantom: {
      solana: any;
      ethereum: any;
    };
    solana: any;
    ethereum: any;
  }
}

export interface WalletItem {
  id: string;
  name: string;
  homepage: string;
  order: number;
  app_store: string;
  play_store: string;
  rdns: string;
  chrome_store: string;
  injected: any[];
  img: string;
  wId: string;
}
