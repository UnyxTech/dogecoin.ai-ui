import { Address } from "viem";
export interface ApiResponse<T> {
  code: number;
  message: string;
  timestamp: number;
  data: T;
}
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

//////////////////////////////////
////////////Kline/////////////////
//////////////////////////////////
export type KlineTime =
  | "one_minute"
  | "five_minute"
  | "fifteen_minute"
  | "thirty_minute"
  | "one_hour"
  | "two_hour"
  | "four_hour"
  | "eight_hour"
  | "twelve_hour"
  | "one_day"
  | "three_day"
  | "one_week"
  | "one_month";
export interface KLineParams {
  tokenAddress: Address;
  type: KlineTime;
  startTimestamp: number;
  endTimestamp: number;
}
export interface KLineItem {
  o: string;
  h: string;
  l: string;
  c: string;
  v: string;
  timestamp: string;
}
export interface KLineResponse {
  lastValidKLine: KLineItem;
  klineList: KLineItem[];
}
//////////////////////////////////
////////////Comments//////////////
//////////////////////////////////
export interface PostCommentParams {
  characterId: string;
  parentId: number;
  rootId: number;
  floor: string;
  content: string;
}
export interface GetCommentsParams {
  cursor: string;
  pageSize: number;
  characterId: number;
}
export interface GetCommentsResponse {
  pageSize: number;
  cursor: string;
  rows: [
    {
      id: number;
      characterId: string;
      parentId: number;
      userId: number;
      username: string;
      userAvatar: string;
      rootId: number;
      floor: string;
      content: string;
      commentCount: number;
      likedCount: number;
      liked: true;
      createdTime: string;
    }
  ];
}
export interface GetCommentFloor {
  cursor: string;
  pageSize: number;
  roodId: number;
}
//////////////////////////////////
////////////Post//////////////////
//////////////////////////////////
export interface PostLikeOrUnLikeParams {
  characterId: string;
  postId: number;
}
export interface GetPostsParams {
  pageSize: number;
}
export interface PostItem {
  postId: number;
  characterId: string;
  posterId: number;
  posterAddress: string;
  posterAvatar: string;
  coverImage: string;
  ipLocation: string;
  likedCount: number;
  mediaType: number;
  updatedTime: string;
  liked: boolean;
  content: string;
  characterName: string;
  characterOccupation: string;
  characterAge: number;
}
export interface GetPostsResponse {
  pageSize: number;
  cursor: string;
  rows: PostItem[];
}
export interface PostPostsParams {
  characterId: string;
  image: number;
}
export interface GetPostDataDetailParams {
  pageSize: number;
  cursor: string;
  characterId: string;
}
export interface GetPostDataDetailResponse {
  pageSize: number;
  cursor: string;
  characterId: string;
}
//////////////////////////////////
////////////agent/////////////////
//////////////////////////////////
export interface GetAgentInfoResponse {
  characterId: string;
  creator: string;
  txHash: string;
  graduated: boolean;
  agentCreatedTime: string;
  agentGraduatedTime: string;
  tokenAddress: string;
  pairAddress: string;
  name: string;
  price: number;
  priceUsd: string;
  price24Change: number;
  price24ChangeUsd: number;
  marketCap: number;
  holder: number;
  symbol: string;
  description: string;
  image: string;
  twitter: string;
  telegram: string;
  youtube: string;
  website: string;
  discord: string;
  agentType: string;
  volume24h: number;
  totalLocked: number;
  graduatedPercent: number;
  graduatedNeedAmount: number;
}
