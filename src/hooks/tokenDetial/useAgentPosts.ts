import { getAgentsPosts } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { GetPostDataDetailParams } from "@/api/types";

export const useAgentsPosts = (params: GetPostDataDetailParams) => {
  return useQuery({
    queryKey: ["agentsPosts", params.characterId, params.cursor],
    queryFn: () => getAgentsPosts(params),
    refetchOnWindowFocus: false,
    enabled: !!params.characterId,
  });
};
