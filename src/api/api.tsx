import axios, { AxiosResponse } from "axios";

export const BASE = "";
export const BASE_URL = `${BASE}api/`;

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config: any) => {
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

export const getAgentList = async (): Promise<any> => {
  const { data } = await api.get(``);
  return data;
};
