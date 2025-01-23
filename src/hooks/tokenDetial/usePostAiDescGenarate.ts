import { postAiDescGenerate } from "@/api/api";
import { PostAiDescGenerateParams } from "@/api/types";
import { useMutation } from "@tanstack/react-query";

export function usePosAiDescGenerate(params: PostAiDescGenerateParams) {
  return useMutation({
    mutationFn: () => postAiDescGenerate(params),
  });
}
