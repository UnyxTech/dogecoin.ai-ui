import { Address, Chain } from "viem";
import { baseSepolia } from "viem/chains";

// CONTRACT_AI
export const CONTRACT_AI_ADDRESS =
  "0x92037e3f4f1cdBe5626eA01f6A3b2B9869366316" as Address;
export const TOKEN_DECIMALS = 18;
export const BASE_TOKEN = {
  address: "0x650b89f5e67927fc9081F211B2a2fAd9487D1A69" as Address,
  symbol: "DOGEAI",
  decimals: 18,
  logo: "",
};
// uniswap
export const WETH_ADDRESS =
  "0x1d61C8e2Ff2c987E9D6443e9b9F521aB901A4631" as Address;
export const EXACT_INPUT_FEE = 10000;
export const Swap_Router02_Address =
  "0xBABcefF63c07e8B452c2990b8e9D784191765dDd";
//
export const TOTAL_AMOUNT = 1000000000;
export const defaultChain: Chain = {
  ...baseSepolia,
};
//
export const BLOCK_GENERATE_TIME = 3 * 1000;
