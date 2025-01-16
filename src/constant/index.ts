import { Address, Chain } from "viem";
import { baseSepolia } from "viem/chains";

export const CONTRACT_AI_ADDRESS =
  "0x92037e3f4f1cdBe5626eA01f6A3b2B9869366316" as Address;
export const TOKEN_DECIMALS = 18;
export const BASE_TOKEN = {
  address: "0x650b89f5e67927fc9081F211B2a2fAd9487D1A69" as Address,
  symbol: "DOGEAI",
  decimals: 18,
  logo: "",
};

export const createFee = 3;

export const TOTAL_AMOUNT = 1000000000

export const defaultChain: Chain = {
  ...baseSepolia,
};
