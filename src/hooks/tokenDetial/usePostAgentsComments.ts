import { postAgentsComment } from "@/api/api";
import { PostCommentParams } from "@/api/types";
import { useMutation } from "@tanstack/react-query";

export function usePostAgentsComments(
  params: PostCommentParams,
  onSuccess?:
    | ((
        data: void,
        variables: void,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined,
  onError?:
    | ((
        error: Error,
        variables: void,
        context: unknown
      ) => Promise<unknown> | unknown)
    | undefined
) {
  return useMutation({
    mutationFn: () => postAgentsComment(params),
    onSuccess,
    onError,
  });
}
