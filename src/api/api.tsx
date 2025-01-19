import { AgentInfo } from "@/types";
import axios, { AxiosResponse } from "axios";
import { AllAgentListRes, CreateAgentRes, KLineItem, KLineParams, KLineResponse, LoginReq, LoginRes } from "./types";
export const BASE = import.meta.env.VITE_BASE_API_URL;

export const BASE_URL = "https://api-dev.dogeos.ai/";

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

export const getAllAgentList = async (currentPage: number): Promise<AllAgentListRes> => {
  const { data } = await api.get(`/v1/agents/all`, {
    params: { pageSize: DEFAULT_PAGE_SIZE, currentPage },
  });
  return data.data;
};

export const uploadImg = async (file: FormData): Promise<string> => {
  const { data } = await api.post(`v1/upload/agent/image`, file, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

export const createAgent = async (params: AgentInfo): Promise<CreateAgentRes> => {
  const { data } = await api.post(`v1/agents`, params);
  return data.data;
};

export const getKLineHistory = async (
  params: KLineParams
): Promise<KLineItem[]> => {
  const { data } = await api.get<KLineResponse>(
    "/wallets/agent/kline/trading-view",
    {
      params,
    }
  );
  return data.data.klineList;
};

export const getKLineLast = async (params: KLineParams): Promise<KLineItem> => {
  const { data } = await api.get<KLineResponse>(
    "/wallets/agent/kline/trading-view",
    {
      params,
    }
  );
  return data.data.lastValidKLine;
};
export const postAgentsComment = async (
  params: KLineParams
): Promise<KLineItem> => {
  const { data } = await api.get<KLineResponse>(
    "/wallets/agent/kline/trading-view",
    {
      params,
    }
  );
  return data.data.lastValidKLine;
};
