import { WETH_ADDRESS } from "@/constant";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Address } from "viem";

interface QuoteParams {
  tokenAddress: Address;
  amount: bigint;
  isBuy: boolean;
  pairAddress?: Address;
}

interface QuoteResponse {
  quote: string;
  quoteDecimals: string;
}

const QUOTE_URL =
  "https://5tvaoqaqbh.execute-api.us-east-2.amazonaws.com/prod/quote";

export function useQuote({
  tokenAddress,
  amount,
  isBuy,
  pairAddress,
}: QuoteParams) {
  return useQuery({
    queryKey: ["quote", tokenAddress, amount.toString(), isBuy, pairAddress],
    queryFn: async (): Promise<QuoteResponse> => {
      const tokenInAddress = isBuy ? WETH_ADDRESS : tokenAddress;
      const tokenOutAddress = isBuy ? tokenAddress : WETH_ADDRESS;
      const { data } = await axios.get(QUOTE_URL, {
        params: {
          tokenInAddress: tokenInAddress.toLowerCase(),
          tokenInChainId: 84532,
          tokenOutAddress: tokenOutAddress.toLowerCase(),
          tokenOutChainId: 84532,
          amount: amount.toString(),
          type: "exactIn",
        },
      });
      return data;
    },
    enabled: Boolean(tokenAddress && !!pairAddress && amount && amount > 0n),
    refetchInterval: 15000,
    retry: 1,
  });
}
