import { Address } from "viem";
export interface ApiResponse<T> {
  code: number;
  message: string;
  timestamp: number;
  data: T;
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
  endTimestamp?: number;
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
  cursor?: string;
  pageSize: number;
  characterId: string;
}
export interface CommentItem {
  id: number;
  characterId: string;
  parentId: number;
  userId: number;
  userAddress: string;
  userAvatar: string;
  rootId: number;
  floor: string;
  content: string;
  commentCount: number;
  likedCount: number;
  liked: true;
  createdTime: string;
}
export interface GetCommentsResponse {
  pageSize: number;
  cursor: string;
  rows: CommentItem[];
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
}
export interface GetPostsResponse {
  pageSize: number;
  cursor: string;
  rows: PostItem[];
}
export interface PostPostsParams {
  characterId: string;
  image: string;
}
export interface GetPostDataDetailParams {
  characterId: string;
  pageSize: number;
  cursor?: string;
}
export interface GetPostDataDetailResponse {
  pageSize: number;
  cursor: string;
  characterId: string;
}
export interface PostAiImageGenerateParams {
  prompt: string;
  agent_desc: string;
}
export interface PostAiImageGenerateResponse {
  status: string;
  image_url: string;
  img_prompt: string;
}
export interface PostAiDescGenerateParams {
  ticker: string;
  user_id: string;
  agent_id: string;
  agent_name: string;
  agent_type: string;
  agent_desc: string;
}
export interface PostAiDescGenerateResponse {
  status: string;
  message: string;
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
  price: string;
  priceUsd: string;
  price24Change: string;
  price24ChangeUsd: string;
  marketCap: string;
  holder: string;
  symbol: string;
  description: string;
  image: string;
  twitter: string;
  telegram: string;
  youtube: string;
  website: string;
  discord: string;
  agentType: string;
  volume24h: string;
  totalLocked: string;
  graduatedPercent: number;
  graduatedNeedAmount: string;
}
export interface GetAgentHoldersParams {
  characterId: string;
  pageSize: number;
  currentPage: number;
}
export interface GetAgentHoldersResponse {
  current: number;
  pageSize: number;
  currentRowSize: number;
  rows: [
    {
      holderAddress: string;
      holdingAmount: string;
      holdingPercent: string;
    }
  ];
}
//////////////////////////////////
////////////......////////////////
//////////////////////////////////

export interface LoginReq {
  referralCode?: string;
  walletAddress: string;
  timestamp: number;
  signature: string;
}

export interface LoginRes {
  id: number;
  avatar: string;
  platform: number;
  token: string;
  refreshToken: string;
  tokenExpireTimeAt: number;
  refreshTokenExpireTimeAt: number;
  status: string;
  actualBalance: string;
}

export interface CreateAgentRes {
  id: number;
  createdTime: string;
  updatedTime: string;
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
}

export interface AgentItem {
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
  volume24h: string;
  totalLocked: string;
  graduatedPercent: string;
  graduatedNeedAmount: string;
  holdingAmount?: string;
  holdingAmountUsd?: string;
  createdTime?: string;
}

export interface AllAgentListRes {
  current: number;
  pageSize: number;
  currentRowSize: number;
  rows: AgentItem[];
}
