import { Address } from "viem";

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
  data: {
    lastValidKLine: KLineItem;
    klineList: KLineItem[];
  };
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
export interface GetCommentParams {
  cursor: string;
  pageSize: number;
  characterId: number;
}
export interface GetCommentFloor {
  cursor: string;
  pageSize: number;
  roodId: number;
}
//////////////////////////////////
////////////Post//////
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
////////////......////////////////
//////////////////////////////////
