import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePostAgentsComments } from "@/hooks/tokenDetial/usePostAgentsComments";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const PostComment = () => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>("");
  const { mutateAsync: postCommentAsync, isPending } = usePostAgentsComments({
    characterId: "73455860437954560",
    parentId: 0,
    rootId: 0,
    floor: "1",
    content: comment,
  });
  const handleSubmit = async () => {
    await postCommentAsync();
    queryClient.invalidateQueries({ queryKey: ["agentsComments"] });
    setComment("");
  };
  return (
    <div>
      <div className="bottom-0 flex w-full max-w-sm items-center space-x-2 disabled:pointer-events-none">
        <Input
          type="text"
          placeholder="Type your comment"
          className="bg-dayBg3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          disabled={!comment || isPending}
          type="submit"
          variant="yellow"
          className="rounded-sm active:border-none active:outline-none hover:border-[#12122A] border-[1.5px] border-b-4 border-[#12122A] bg-gradient-to-tr from-[#FCD436] to-[#FFE478]"
        >
          Post
        </Button>
      </div>
    </div>
  );
};
export default PostComment;
