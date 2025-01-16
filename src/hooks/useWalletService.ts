import { useEffect } from "react";
import { useAuth } from "./useAuth";
import {
  Chain,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from "viem";
import { defaultChain } from "@/constant";

export default function useWalletService() {
  const { currentEvmWallet, installWallets } = useAuth();

  useEffect(() => {
    if (currentEvmWallet) {
      switchChain(defaultChain);
    }
  }, [currentEvmWallet]);
  const getWalletClient = (chain: Chain) => {
    if (!currentEvmWallet || !installWallets) return null;
    const currentWallet = installWallets?.find(
      (item: any) => item.info.rdns === currentEvmWallet
    );
    const client = createWalletClient({
      transport: custom(currentWallet?.provider),
      chain: chain,
    });
    if (!client) {
      throw new Error("walletClient not found");
    }
    return client;
  };
  const getPublicClient = (chain: Chain) => {
    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    });
    if (!publicClient) {
      throw new Error("publicClient not found");
    }
    return publicClient;
  };
  const switchChain = async (chain: any) => {
    const walletClient = getWalletClient(defaultChain);
    const chainId = await walletClient?.getChainId();
    if (chainId !== chain.id) {
      try {
        await walletClient?.switchChain({ id: chain.id });
      } catch (e: any) {
        if (e?.code === 4902) {
          await walletClient?.addChain({ chain: chain });
          await walletClient?.switchChain({ id: chain.id });
        }
      }
    }
  };
  return {
    getWalletClient,
    getPublicClient,
    switchChain,
  };
}
