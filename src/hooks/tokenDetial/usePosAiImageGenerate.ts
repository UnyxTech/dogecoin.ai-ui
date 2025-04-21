import { postAiImageGenerate } from "@/api/api";
import { PostAiImageGenerateParams } from "@/api/types";
import { useMutation } from "@tanstack/react-query";

export function usePosAiImageGenerate(params: PostAiImageGenerateParams) {
  return useMutation({
    mutationFn: () => postAiImageGenerate(params),
  });
}
