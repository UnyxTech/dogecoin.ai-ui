import { getAgentsComments } from "@/api/api";
import { GetCommentsParams } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

export const useAgentsComments = (params: GetCommentsParams) => {
  return useQuery({
    queryKey: ["comments", params],
    queryFn: () => getAgentsComments(params),
    refetchOnWindowFocus: false,
  });
};
