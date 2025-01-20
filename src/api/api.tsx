import axios, { AxiosResponse } from "axios";
import {
  AgentItem,
  AllAgentListRes,
  ApiResponse,
  CreateAgentRes,
  GetAgentInfoResponse,
  GetCommentFloor,
  GetCommentsParams,
  GetCommentsResponse,
  KLineItem,
  KLineParams,
  KLineResponse,
  LoginReq,
  LoginRes,
  PostCommentParams,
} from "./types";
import { AgentInfo } from "@/types";

export const BASE_URL = "https://api-dev.dogeos.ai";

export const DEFAULT_PAGE_SIZE = 10;

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("login-token");
  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token).state.token}`;
  }
  config.headers["debug-mode"] = "true";
  config.headers.platform = 0;
  return config;
});

api.interceptors.response.use(
  (response: any) => {
    if (response.data.code !== 0) {
      return Promise.reject(
        new ApiError(response.data?.message, response.data?.code, 200, response)
      );
    }
    return response;
  },
  async (error: any) => {
    const response = error.response;
    return Promise.reject(
      new ApiError(
        response?.data?.message,
        response?.data?.code,
        error.response?.status,
        response
      )
    );
  }
);

class ApiError extends Error {
  public code: number;
  public httpCode: number;
  public response: AxiosResponse;
  constructor(
    message: string,
    code: number,
    httpCode: number,
    response: AxiosResponse
  ) {
    super(message);
    this.code = code;
    this.response = response;
    this.httpCode = httpCode;
  }
}
export const login = async (params: LoginReq): Promise<LoginRes> => {
  const { data } = await api.post("/v1/login/wallet/evm", params);
  return data.data;
};

export const getAllAgentList = async (
  currentPage: number,
  agentType?: string,
  sortBy?: string,
  sort?: string
): Promise<AllAgentListRes> => {
  let str = "";
  if (agentType) {
    str += `?agentType=${agentType}`;
  }
  if (sortBy) {
    str += `${str.length ? "&" : "?"}&sortBy=${sortBy}`;
  }
  if (sort) {
    str += `${str.length ? "&" : "?"}&sort=${sort}`;
  }
  const { data } = await api.get(`/v1/agents/all${str}`, {
    params: { pageSize: DEFAULT_PAGE_SIZE, currentPage },
  });
  return data.data;
};

export const searchAgentList = async (
  searchStr: string
): Promise<AgentItem[]> => {
  const { data } = await api.get(
    `/v1/agents/agent/search?content=${searchStr}`
  );
  return data.data;
};

export const uploadImg = async (file: FormData): Promise<string> => {
  const { data } = await api.post(`v1/upload/agent/image`, file, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const createAgent = async (
  params: AgentInfo
): Promise<CreateAgentRes> => {
  const { data } = await api.post(`v1/agents`, params);
  return data.data;
};
export const getAgentInfo = async (params: { characterId: string }) => {
  const { data } = await api.get<ApiResponse<GetAgentInfoResponse>>(
    `v1/agents/agent/${params.characterId}`
  );
  return data.data;
};
export const getKLineHistory = async (
  params: KLineParams
): Promise<KLineItem[]> => {
  const { data } = await api.get<ApiResponse<KLineResponse>>(
    "v1/wallets/agent/kline/trading-view",
    {
      params,
    }
  );
  return data.data.klineList;
};

export const getKLineLast = async (params: KLineParams): Promise<KLineItem> => {
  const { data } = await api.get<ApiResponse<KLineResponse>>(
    "v1/wallets/agent/kline/trading-view",
    {
      params,
    }
  );
  return data.data.lastValidKLine;
};
export const getCommentsFloor = async (params: GetCommentFloor) => {
  await api.post<ApiResponse<GetCommentsResponse>>("v1/agents/comments/floor", {
    params,
  });
};
export const getAgentsComments = async (params: GetCommentsParams) => {
  const { data } = await api.get<ApiResponse<GetCommentsResponse>>(
    "v1/agents/comments",
    {
      params,
    }
  );
  return data.data;
};
export const postAgentsComment = async (params: PostCommentParams) => {
  await api.post<PostCommentParams>("v1/agents/comments", params);
};
