import { CommentItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePostAgentsComments } from "@/hooks/tokenDetial/usePostAgentsComments";
import { formatAddressNew } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useState } from "react";
import { useAccount } from "wagmi";

export function ReplyComment({
  isReply,
  setIsReply,
  item,
  characterId,
  setShowModal,
}: {
  isReply: boolean;
  setIsReply: Dispatch<SetStateAction<boolean>>;
  item: CommentItem;
  characterId: string;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const account = useAccount();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>("");
  const { mutateAsync: postCommentAsync } = usePostAgentsComments({
    characterId: characterId,
    parentId: item?.userId,
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
    setIsReply(false);
  };
  return (
    <Dialog open={isReply} onOpenChange={setIsReply}>
      <DialogContent className="max-w-[90%] rounded-lg sm:max-w-[432px]">
        <DialogHeader>
          <DialogTitle className="text-dayT1 font-SwitzerMedium">
            Reply
          </DialogTitle>
        </DialogHeader>
        {/* Original Comment Section */}
        <div className="mt-4 flex items-start gap-3 ">
          <div className="relative">
            <img
              src={item?.userAvatar ?? "/images/icon_doge.svg"}
              alt=""
              width={36}
              height={36}
            />
            <div className="absolute left-1/2 top-full h-[64px] w-[1px] bg-dayL1 transform -translate-x-1/2" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-dayT2 p-1 bg-[#FFF7D8] rounded-sm">
                {formatAddressNew(item?.userAddress ?? "0xaa")}
              </span>
              <span className="text-xs text-dayT3">
                {dayjs(item?.createdTime).format("DD/MM/YYYY, hh:mm:ss a")}
              </span>
            </div>
            <p className="text-dayT1">{item?.content}</p>
          </div>
        </div>
        {/* Reply Input Section */}
        <div className="mt-9 flex items-start gap-3">
          <div>
            <img
              src={item?.userAvatar ?? "/images/icon_doge.svg"}
              alt=""
              width={36}
              height={36}
            />
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`Reply to @ ${item?.userId}`}
            className="bg-dayBg3 w-full h-20  px-3 py-2 border resize-none border-gray-300 rounded-md placeholder:text-dayT3 text-black"
          />
        </div>
        <DialogFooter className="mt-8">
          <Button
            onClick={handleSubmit}
            disabled={!comment}
            type="submit"
            variant="yellow"
            className="px-8 py-5 rounded-sm hover:border-[#12122A] border-[1.5px] border-b-4 border-[#12122A] bg-gradient-to-tr from-[#FCD436] to-[#FFE478]"
          >
            Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
