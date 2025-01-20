import { CommentItem } from "@/api/types";
import { useAgentsComments } from "@/hooks/tokenDetial/useAgentsComments";
import { formatAddressNew } from "@/utils";
import dayjs from "dayjs";
import { ChevronFirst } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ReplyComment } from "./ReplyComment";
import PostComment from "./PostComment";
import ChatSkeletons from "@/components/skeletons/tokenDetail/ChatSkeletons";

const ChatCard = ({
  item,
  setIsReply,
  setSelectedItem,
}: {
  item: CommentItem;
  setIsReply: Dispatch<SetStateAction<boolean>>;
  setSelectedItem: Dispatch<SetStateAction<CommentItem | null>>;
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
        <button
          onClick={() => {
            setSelectedItem(item);
            setIsReply(true);
          }}
          className="text-xs rounded-none text-dayT2 p-1 bg-dayBg3 cursor-pointer border  border-green border-opacity-0 hover:border-opacity-100"
        >
          Reply
        </button>
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

const TokenChat = ({ characterId }: { characterId: string }) => {
  const [showChat, setShowChat] = useState<boolean>(true);
  const [isReply, setIsReply] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CommentItem | null>(null);
  const [, setCursor] = useState("");
  const { data: commentsData, isLoading } = useAgentsComments({
    pageSize: 100,
    characterId: characterId,
    // ...(cursor ? { cursor } : {}),
  });
  useEffect(() => {
    if (commentsData?.cursor) {
      setCursor(commentsData.cursor);
    }
  }, [commentsData]);
  if (isLoading) {
    return <ChatSkeletons />;
  }
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
      <div
        className={`${
          showChat ? "block" : "hidden"
        } h-[660px] overflow-y-scroll customScrollbar_two mb-4`}
      >
        {commentsData?.rows?.map((item) => {
          return (
            <ChatCard
              item={item}
              key={item.id}
              setIsReply={setIsReply}
              setSelectedItem={setSelectedItem}
            />
          );
        })}
      </div>
      {isReply ? (
        <div className="flex justify-center items-center">
          <div className="py-2 text-center font-SwitzerMedium rounded-full px-4 bg-gradient-to-tr from-[#FCD436] to-[#FFE478]">
            Post a Reply
          </div>
        </div>
      ) : (
        <PostComment />
      )}
      <ReplyComment
        isReply={isReply}
        setIsReply={setIsReply}
        item={selectedItem!}
      />
    </div>
  );
};

export default TokenChat;
