import { Address } from "viem";
import useWalletService from "@/hooks/useWalletService";
import { useMutation } from "@tanstack/react-query";
import {
  defaultChain,
  EXACT_INPUT_FEE,
  Swap_Router02_Address,
  WETH_ADDRESS,
} from "@/constant";

import { useAuth } from "./useAuth";
import { useWalletClient } from "wagmi";
import { useErc20 } from "./useErc20";
import { swapRouterABi } from "@/constant/swapRouterABi";

export interface ExactSingleParams {
  tokenIn: Address;
  tokenOut: Address;
  amountIn: bigint;
  amountOutMinimum: bigint;
  sqrtPriceLimitX96: bigint;
}
export function useUniswapSingleSwap() {
  const walletService = useWalletService();
  const { evmAddress } = useAuth();
  const { data: walletClient } = useWalletClient({ chainId: defaultChain.id });
  const erc20Service = useErc20();

  return {
    buy: async (exactInputSingleParams: ExactSingleParams) => {
      await walletService.switchChainFun(defaultChain);
      const publicClient = walletService.getPublicClient(defaultChain);
      if (!walletClient) throw new Error("walletClient not found");
      const { request } = await publicClient.simulateContract({
        value: exactInputSingleParams.amountIn,
        account: evmAddress! as Address,
        address: Swap_Router02_Address,
        abi: swapRouterABi,
        functionName: "exactInputSingle",
        args: [
          {
            ...exactInputSingleParams,
            recipient: evmAddress! as Address,
            fee: EXACT_INPUT_FEE,
          },
        ],
      });
      const hash = await walletClient.writeContract(request);
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      if (transaction.status !== "success") {
        throw new Error("transaction reverted");
      }
      return hash;
    },
    sell: async (exactInputSingleParams: ExactSingleParams) => {
      await walletService.switchChainFun(defaultChain);
      const publicClient = walletService.getPublicClient(defaultChain);
      if (!walletClient) throw new Error("walletClient not found");
      await erc20Service.approve({
        tokenAddress: exactInputSingleParams.tokenIn,
        contractAddress: Swap_Router02_Address,
      });
      const { request } = await publicClient.simulateContract({
        value: 0n,
        account: evmAddress! as Address,
        address: Swap_Router02_Address,
        abi: swapRouterABi,
        functionName: "exactInputSingle",
        args: [
          {
            ...exactInputSingleParams,
            recipient: evmAddress! as Address,
            fee: EXACT_INPUT_FEE,
          },
        ],
      });
      const hash = await walletClient.writeContract(request);
      const transaction = await publicClient.waitForTransactionReceipt({
        hash: hash,
      });
      if (transaction.status !== "success") {
        throw new Error("transaction reverted");
      }
      return hash;
    },
  };
}
interface TradeParams {
  isBuy: boolean;
  token: Address;
  amountIn: bigint;
  amountOutMinimum: bigint;
  sqrtPriceLimitX96: bigint;
}
export function useUniswapTrade({
  onSuccess,
  onError,
}: {
  onSuccess?:
    | ((
        data: `0x${string}`,
        variables: TradeParams,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
  onError?:
    | ((
        error: Error,
        variables: TradeParams,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined;
} = {}) {
  const uniswapRouter = useUniswapSingleSwap();
  return useMutation({
    mutationFn: async ({
      isBuy,
      token,
      amountIn,
      amountOutMinimum,
      sqrtPriceLimitX96,
    }: TradeParams) => {
      if (isBuy) {
        const tokenIn = WETH_ADDRESS;
        const tokenOut = token;
        const params: ExactSingleParams = {
          tokenIn,
          tokenOut,
          amountIn,
          amountOutMinimum: amountOutMinimum,
          sqrtPriceLimitX96: 0n,
        };
        console.log("params", params);
        return await uniswapRouter.buy(params);
      } else {
        const tokenIn = token;
        const tokenOut = WETH_ADDRESS;
        const params: ExactSingleParams = {
          tokenIn,
          tokenOut,
          amountIn,
          amountOutMinimum,
          sqrtPriceLimitX96,
        };
        return await uniswapRouter.sell(params);
      }
    },
    onSuccess: onSuccess,
    onError: onError,
  });
}
