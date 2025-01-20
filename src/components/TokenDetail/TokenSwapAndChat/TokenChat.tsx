import { CommentItem } from "@/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgentsComments } from "@/hooks/tokenDetial/useAgentsComments";
import { usePostAgentsComments } from "@/hooks/tokenDetial/usePostAgentsComments";
import { formatAddressNew } from "@/utils";
import dayjs from "dayjs";
import { ChevronFirst } from "lucide-react";
import { useEffect, useState } from "react";

const ChatCard = ({
  item,
  onReply,
}: {
  item: CommentItem;
  onReply: () => void;
}) => {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <img
          src={item?.userAvatar ?? "/images/icon_doge.svg"}
          alt=""
          width={24}
          height={24}
        />
        <span className="text-xs text-dayT2 p-1 bg-[#FFF7D8] rounded-sm">
          {formatAddressNew(item?.username ?? "0xaa")}
        </span>
        <span className="text-xs text-dayT3">
          {dayjs(item?.createdTime).format("DD/MM/YYYY, hh:mm:ss a")}
        </span>
      </div>
      <div>
        <span
          onClick={onReply}
          className="text-xs text-dayT2 p-1 bg-dayBg3 cursor-pointer border  border-green border-opacity-0 hover:border-opacity-100"
        >
          Reply
        </span>
        &nbsp;
        <span className="text-xs text-dayT3">#{item?.userId}</span>
      </div>
      <p className="text-dayT1">
        {item?.parentId !== 0 ? (
          <span className="text-[#2B6BFF]">@#{item?.parentId}</span>
        ) : (
          ""
        )}
        &nbsp;
        {item.content}
      </p>
    </div>
  );
};
const PostComment = ({
  refetchComments,
  replyTo,
  onCancelReply,
}: {
  refetchComments: any;
  replyTo: CommentItem | null;
  onCancelReply: () => void;
}) => {
  const [comment, setComment] = useState<string>("");
  const { mutateAsync: postCommentAsync } = usePostAgentsComments(
    {
      characterId: "73455860437954560",
      parentId: replyTo ? replyTo.parentId : 0,
      rootId: 0,
      floor: "1",
      content: comment,
    },
    refetchComments
  );
  const handleSubmit = async () => {
    await postCommentAsync();
    setComment("");
    onCancelReply();
  };
  return (
    <div>
      <div className="bottom-0 flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder={replyTo ? "Type your reply..." : "Type your comment"}
          className="bg-dayBg3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          disabled={!comment}
          type="submit"
          variant="outline"
          className="rounded-sm active:border-none active:outline-none hover:border-[#12122A] border-[1.5px] border-b-4 border-[#12122A] bg-gradient-to-tr from-[#FCD436] to-[#FFE478]"
        >
          {replyTo ? "Reply" : "Post"}
        </Button>
      </div>
    </div>
  );
};
const TokenChat = () => {
  const [showChat, setShowChat] = useState<boolean>(true);
  const [replyTo, setReplyTo] = useState<CommentItem | null>(null);
  console.log(replyTo);
  const [, setCursor] = useState("");
  const handleCancelReply = () => {
    setReplyTo(null);
  };
  const { data: commentsData, refetch: refetchComments } = useAgentsComments({
    pageSize: 10,
    characterId: "73455860437954560",
    // ...(cursor ? { cursor } : {}),
  });
  useEffect(() => {
    if (commentsData?.cursor) {
      setCursor(commentsData.cursor);
    }
  }, [commentsData]);
  return (
    <div className="p-6 pb-8 bg-white rounded-[6px] overflow-hidden">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl text-dayT1 font-SwitzerBold">Forum Chat</h1>
        {showChat ? (
          <ChevronFirst
            className="rotate-90"
            onClick={() => setShowChat((show) => !show)}
          />
        ) : (
          <ChevronFirst
            className="-rotate-90"
            onClick={() => setShowChat((show) => !show)}
          />
        )}
      </div>
      <div className={`${showChat ? "block" : "hidden"}`}>
        {commentsData?.rows?.map((item) => {
          return (
            <ChatCard
              item={item}
              key={item.id}
              onReply={() => setReplyTo(item)}
            />
          );
        })}
      </div>
      <PostComment
        refetchComments={refetchComments}
        replyTo={replyTo}
        onCancelReply={handleCancelReply}
      />
    </div>
  );
};

export default TokenChat;
