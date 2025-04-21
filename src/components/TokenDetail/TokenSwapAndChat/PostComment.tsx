import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePostAgentsComments } from "@/hooks/tokenDetial/usePostAgentsComments";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { useAccount } from "wagmi";

const PostComment = ({
  characterId,
  setShowModal,
}: {
  characterId: string;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>("");
  const account = useAccount();
  const { mutateAsync: postCommentAsync, isPending } = usePostAgentsComments({
    characterId: characterId!,
    parentId: 0,
    rootId: 0,
    floor: "1",
    content: comment,
  });
  const handleSubmit = async () => {
    if (!account.address) {
      setShowModal(true);
      return;
    }
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
