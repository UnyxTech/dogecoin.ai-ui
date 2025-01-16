import { Address, erc20Abi, getContract } from "viem";
import useWalletService from "@/hooks/useWalletService";
import { defaultChain } from "@/constant";
import { useAuth } from "./useAuth";

export function useErc20() {
  const walletService = useWalletService();
  const { evmAddress } = useAuth();

  return {
    approve: async ({
      tokenAddress,
      contractAddress,
    }: {
      tokenAddress: Address;
      contractAddress: Address;
    }) => {
      const publicClient = walletService.getPublicClient(defaultChain);
      const walletClient = walletService.getWalletClient(defaultChain);
      if (!walletClient) throw new Error("walletClient not found");
      const contract = getContract({
        address: tokenAddress,
        abi: erc20Abi,
        client: publicClient,
      });
      const allowance = await contract.read.allowance([
        evmAddress! as Address,
        contractAddress,
      ]);
      if (allowance === 0n) {
        const { request } = await publicClient.simulateContract({
          account: evmAddress as Address,
          address: tokenAddress,
          abi: erc20Abi,
          functionName: "approve",
          args: [contractAddress, 2n ** 256n - 1n],
        });
        const hash = await walletClient.writeContract(request);
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: hash,
        });
        if (transaction.status !== "success") {
          throw new Error("transaction reverted");
        }
      }
    },
  };
}
