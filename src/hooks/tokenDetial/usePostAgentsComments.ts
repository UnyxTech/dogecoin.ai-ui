import { postAgentsComment } from "@/api/api";
import { PostCommentParams } from "@/api/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "../use-toast";

export function usePostAgentsComments(params: PostCommentParams) {
  return useMutation({
    mutationFn: () => postAgentsComment(params),
    onSuccess: () => toast({ title: "Post Succeed", variant: "default" }),
    onError: () => toast({ title: "Post Error", variant: "destructive" }),
  });
}
