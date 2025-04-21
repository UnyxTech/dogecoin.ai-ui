import { baseSepolia } from "wagmi/chains";
import { useEffect, useState } from "react";
import { useChainId, useSwitchChain } from "wagmi";

export function useIsSupportChain() {
  const chainId = useChainId();
  const { switchChainAsync, isPending, isError, error } = useSwitchChain();
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    if (!chainId) return;
    setIsSupported(chainId === baseSepolia.id);
  }, [chainId]);

  const switchToBaseSepolia = async () => {
    if (!switchChainAsync) return;
    switchChainAsync({ chainId: baseSepolia.id });
  };

  return {
    chainId,
    isSupported,
    switchToBaseSepolia,
    isPending,
    isError,
    error,
  };
}
