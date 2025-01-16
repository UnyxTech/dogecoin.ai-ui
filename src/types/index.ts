export enum AgentType {
  Productivity = "Productivity",
  Meme = "Meme",
  OnChain = "On-chain",
}

export interface AgentInfo {
  agentName: string,
  symbol: string,
  agentId?: string,
  agentType?: AgentType,
  logo?: string,
  description?: string
}
