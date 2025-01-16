import { Address, getContract, parseEventLogs } from "viem";
import { dogeCoinAbi } from "@/constant/dogeCoinAbi";
import useWalletService from "@/hooks/useWalletService";
import { useQuery } from "@tanstack/react-query";
import { CONTRACT_AI_ADDRESS, defaultChain } from "@/constant";
import { useAuth } from "./useAuth";

export type CreateAgentParams = {
  name: string;
  symbol: string;
  buyAmount: bigint;
  agentId: string;
};

export function useAIContract() {
  const walletService = useWalletService();
  const { evmAddress } = useAuth();

  const getViemContract = () => {
    const publicClient = walletService.getPublicClient(defaultChain);
    return getContract({
      address: CONTRACT_AI_ADDRESS,
      abi: dogeCoinAbi,
      client: publicClient,
    });
  };

  return {
    createAgent: async ({
      name,
      symbol,
      buyAmount,
      agentId,
    }: CreateAgentParams) => {
      await walletService.switchChain(defaultChain);
      const walletClient = walletService.getWalletClient(defaultChain);
      const publicClient = walletService.getPublicClient(defaultChain);
      if (!walletClient) throw new Error("walletClient not found");

      // await erc20Service.approve({
      //   tokenAddress: BASE_TOKEN.address,
      //   contractAddress: CONTRACT_AI_ADDRESS,
      // });
      const { request } = await publicClient.simulateContract({
        value: buyAmount,
        account: evmAddress! as Address,
        address: CONTRACT_AI_ADDRESS,
        abi: dogeCoinAbi,
        functionName: "launchAIAgent",
        args: [name, symbol, agentId, buyAmount],
      });

      const hash = await walletClient.writeContract(request);
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      if (transaction.status !== "success") {
        throw new Error("transaction reverted");
      }
      const events = parseEventLogs({
        abi: dogeCoinAbi,
        logs: transaction.logs,
      });
      const tokenAddress = (events[0] as any)?.args?.token;
      return {
        tokenAddress: tokenAddress,
        hash: hash,
      };
    },
    getBuyAmountOut: async ({
      token,
      amountIn,
    }: {
      token: Address;
      amountIn: bigint;
    }) => {
      return (await getViemContract().read.getBuyAmountOut([
        token,
        amountIn,
      ])) as bigint;
    },
    getInitLiquidity: async () => {
      return (await getViemContract().read._initialVirtualliquidity()) as bigint;
    },
    getGraduateThreshold: async () => {
      return (await getViemContract().read._graduateThreshold()) as bigint;
    },
    buy: async ({ token, amount }: { token: Address; amount: bigint }) => {
      await walletService.switchChain(defaultChain);
      const walletClient = walletService.getWalletClient(defaultChain);
      const publicClient = walletService.getPublicClient(defaultChain);
      if (!walletClient) throw new Error("walletClient not found");
      // await erc20Service.approve({
      //   tokenAddress: BASE_TOKEN.address,
      //   contractAddress: CONTRACT_AI_ADDRESS,
      // });
      const { request } = await publicClient.simulateContract({
        value: 0n,
        account: evmAddress! as Address,
        address: CONTRACT_AI_ADDRESS,
        abi: dogeCoinAbi,
        functionName: "buy",
        args: [token, amount, 0n],
      });

      console.log("request", request);
      const hash = await walletClient.writeContract(request);
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      if (transaction.status !== "success") {
        throw new Error("transaction reverted");
      }
      return hash;
    },
    sell: async ({ token, amount }: { token: Address; amount: bigint }) => {
      await walletService.switchChain(defaultChain);
      const walletClient = walletService.getWalletClient(defaultChain);
      const publicClient = walletService.getPublicClient(defaultChain);
      if (!walletClient) throw new Error("walletClient not found");
      // await erc20Service.approve({
      //   tokenAddress: token,
      //   contractAddress: CONTRACT_AI_ADDRESS,
      // });
      const { request } = await publicClient.simulateContract({
        value: 0n,
        account: evmAddress! as Address,
        address: CONTRACT_AI_ADDRESS,
        abi: dogeCoinAbi,
        functionName: "sell",
        args: [token, amount, 0n],
      });

      console.log("request", request);
      const hash = await walletClient.writeContract(request);
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      if (transaction.status !== "success") {
        throw new Error("transaction reverted");
      }
      return hash;
    },
    getSellAmountOut: async ({
      token,
      amountIn,
    }: {
      token: Address;
      amountIn: bigint;
    }) => {
      return (await getViemContract().read.getSellAmountOut([
        token,
        amountIn,
      ])) as bigint;
    },
  };
}

export const AI_MAX_SUPPLY = 1_000_000_000n * 10n ** 18n;

export function useGetAmountOutQuery({
  token,
  amountIn,
  isSell,
}: {
  token: Address;
  amountIn: bigint;
  isSell: boolean;
}) {
  const aiContract = useAIContract();
  return useQuery({
    staleTime: 1000 * 20,
    queryKey: ["useHuGetAmountOutQuery", token, amountIn.toString(), isSell],
    queryFn: async () => {
      if (isSell) {
        return await aiContract.getSellAmountOut({ token, amountIn });
      } else {
        return await aiContract.getBuyAmountOut({ token, amountIn });
      }
    },
  });
}

export function useGetGraduateThresholdQuery() {
  const aiContract = useAIContract();
  return useQuery({
    queryKey: ["useGetGraduateThresholdQuery"],
    queryFn: async () => {
      return await aiContract.getGraduateThreshold();
    },
  });
}
