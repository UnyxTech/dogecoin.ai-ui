import { AgentInfo } from "@/types";
import axios, { AxiosResponse } from "axios";
import { KLineItem, KLineParams, KLineResponse } from "./types";
export const BASE = import.meta.env.VITE_BASE_API_URL;

export const BASE_URL = "https://api-dev.dogeos.ai/";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config: any) => {
  config.headers["debug-mode"] = "true";
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

export const uploadImg = async (file: FormData) => {
  const { data } = await api.post(`v1/upload/agent/image`, file, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const createAgent = async (params: AgentInfo) => {
  const { data } = await api.post(`v1/agents`, params);
  return data;
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
