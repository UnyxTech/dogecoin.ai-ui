import { getAgentInfo } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";

export const useAgentInfo = (characterId: Address) => {
  return useQuery({
    queryKey: ["getAgentInfo", characterId],
    queryFn: () => getAgentInfo({ characterId }),
    retry: 2,
    enabled: Boolean(characterId),
    refetchInterval: 5 * 1000,
  });
};
