import { getAgentInfo } from "@/api/api";
import { BLOCK_GENERATE_TIME } from "@/constant";
import { useQuery } from "@tanstack/react-query";

export const useAgentInfo = (characterId: string) => {
  return useQuery({
    queryKey: ["getAgentInfo", characterId],
    queryFn: () => getAgentInfo({ characterId }),
    retry: 2,
    enabled: Boolean(characterId),
    refetchInterval: BLOCK_GENERATE_TIME,
  });
};
