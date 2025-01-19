import { Address } from "viem";

export enum AgentType {
  Productivity = "Productivity",
  Meme = "Meme",
  OnChain = "On-chain",
}

export interface AgentInfo {
  name: string;
  symbol: string;
  agentType: string;
  description: string;
  image: string;
  twitter?: string;
  telegram?: string;
  youtube?: string;
  website?: string;
  discord?: string;
  agentId?: string;
}
export interface TokenInfo {
  ticker: string;
  name: string;
  address: Address;
}
