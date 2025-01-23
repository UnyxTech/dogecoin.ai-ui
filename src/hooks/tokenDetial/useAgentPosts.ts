import { getAgentsPosts } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { GetPostsParams } from "@/api/types";

export const useAgentsPosts = (params: GetPostsParams) => {
  return useQuery({
    queryKey: ["agentsPost", params],
    queryFn: () => getAgentsPosts(params),
    refetchOnWindowFocus: false,
  });
};
