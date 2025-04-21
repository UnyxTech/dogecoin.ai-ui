import { postAiImagePost } from "@/api/api";
import { PostPostsParams } from "@/api/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "../use-toast";

export function usePostAiImagePost(params: PostPostsParams) {
  return useMutation({
    mutationFn: () => postAiImagePost(params),
    onSuccess: () =>
      toast({ title: "Post Succeed", variant: "default", duration: 3000 }),
    onError: () =>
      toast({ title: "Post Error", variant: "destructive", duration: 3000 }),
  });
}
