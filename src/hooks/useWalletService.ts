import { useAuth } from "./useAuth";
import {
  Chain,
  createPublicClient,
  createWalletClient,
  custom,
  http,
} from "viem";
import { useConnect, useSwitchChain } from "wagmi";

export default function useWalletService() {
  const { currentEvmWallet } = useAuth();
  const { connectors } = useConnect();
  const { switchChain } = useSwitchChain();

  const getWalletClient = async (chain: Chain) => {
    if (!currentEvmWallet || !connectors) return null;
    const currentProvider: any = await connectors
      .find((item: any) => item.id === currentEvmWallet)
      ?.getProvider();
    const client = createWalletClient({
      transport: custom(currentProvider),
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
  const switchChainFun = async (chain: any) => {
    await switchChain({ chainId: chain.id });
  };
  return {
    getWalletClient,
    getPublicClient,
    switchChainFun,
  };
}
