import { Address } from "viem";
import { useReadContract } from "wagmi";

// function getReserves()public view returns (uint256, uint256, uint256){return(_pool.reserve，_pool.reserve1，-pool.k);
const TOKEN_ABI = [
  {
    type: "function",
    name: "getReserves",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "uint256", name: "reserve0" },
      { type: "uint256", name: "reserve1" },
      { type: "uint256", name: "k" },
    ],
  },
] as const;

const GRADUATE_THRESHOLD = BigInt("125000000000000000000000000");
interface BondingCurveInfo {
  maxBuyToken: bigint;
  reserveToken: bigint;
  reserveDoge: bigint;
  k: bigint;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook for calculating bonding curve information
 * @param tokenAddress - The address of the bonding curve contract
 * @returns BondingCurveInfo object containing max buy amounts and reserves
 */
export const useBondingCurveCalcInfo = (
  tokenAddress: string
): BondingCurveInfo => {
  const { data, isLoading, error } = useReadContract({
    abi: TOKEN_ABI,
    args: [],
    address: tokenAddress as Address,
    functionName: "getReserves",
  });
  if (!data) {
    return {
      maxBuyToken: BigInt(0),
      reserveToken: BigInt(0),
      reserveDoge: BigInt(0),
      k: BigInt(0),
      isLoading,
      error: error as Error | null,
    };
  }
  const [reserve0, reserve1, kValue] = data;
  const maxBuyToken = reserve0 - GRADUATE_THRESHOLD;
  return {
    maxBuyToken,
    reserveToken: reserve0,
    reserveDoge: reserve1,
    k: kValue,
    isLoading,
    error: error as Error | null,
  };
};
