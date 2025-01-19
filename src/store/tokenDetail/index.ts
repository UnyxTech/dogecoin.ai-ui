import { GetAgentInfoResponse } from "@/types";
import { create } from "zustand";

interface AgentInfoState {
  agent: GetAgentInfoResponse | null;
  setAgent: (agent: GetAgentInfoResponse) => void;
}

const initialState = {
  agent: null,
  loading: false,
  error: null,
};

export const useAgentInfoStore = create<AgentInfoState>()((set) => ({
  ...initialState,
  setAgent: (agent) => set({ agent }),
}));
