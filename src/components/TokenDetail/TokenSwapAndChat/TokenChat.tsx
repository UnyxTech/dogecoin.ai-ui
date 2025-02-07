import { CommentItem } from "@/api/types";
import { useAgentsComments } from "@/hooks/tokenDetial/useAgentsComments";
import { formatAddressNew } from "@/utils";
import dayjs from "dayjs";
import { ChevronFirst } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ReplyComment } from "./ReplyComment";
import PostComment from "./PostComment";
import ChatSkeletons from "@/components/skeletons/tokenDetail/ChatSkeletons";
import RandomAvatar from "@/components/RandomAvatar";
import { useAgentInfo } from "@/hooks/tokenDetial/useAgentInfo";
import { useConnectWalletModalStore } from "@/store/connectWalletModal";

const COLOR = [
  {
    avatar: "rgba(242, 31, 127, 0.8)",
    text: "rgba(242, 31, 127, 0.2)",
  },
  {
    avatar: "rgba(252, 212, 54, 0.8)",
    text: "rgba(252, 212, 54, 0.2)",
  },
  {
    avatar: "rgba(38, 187, 217, 0.8)",
    text: "rgba(38, 187, 217,0.2)",
  },
  {
    avatar: "rgba(255, 145, 66, 0.8)",
    text: "rgba(255, 145, 66, 0.2)",
  },
  {
    avatar: "rgba(168, 92, 215, 0.8)",
    text: "rgba(168, 92, 215, 0.2)",
  },
  {
    avatar: "rgba(76, 195, 114, 0.8)",
    text: "rgba(76, 195, 114, 0.2)",
  },
  {
    avatar: "rgba(147, 163, 161, 0.8)",
    text: "rgba(147, 163, 161, 0.2)",
  },
];
const getColorByLastTwoChars = (addr: string) => {
  const lastTwoChars = addr.slice(-2);
  const decimal = parseInt(lastTwoChars, 16);
  const index = decimal % COLOR.length;
  return COLOR[index];
};
const ChatCard = ({
  item,
  setIsReply,
  setSelectedItem,
}: {
  item: CommentItem;
  setIsReply: Dispatch<SetStateAction<boolean>>;
  setSelectedItem: Dispatch<SetStateAction<CommentItem | null>>;
}) => {
  const bgColor = getColorByLastTwoChars(item?.userAddress);
  return (
    <div className="mb-8 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* <img
          src={item?.userAvatar ?? "/images/icon_doge.svg"}
          alt=""
          width={24}
          height={24}
        /> */}
        <RandomAvatar address={item?.userAddress} bgColor={bgColor.avatar} />
        <span
          className="text-xs text-dayT2 p-1 rounded-sm bg-opacity-20"
          style={{ backgroundColor: bgColor.text }}
        >
          {formatAddressNew(item?.userAddress ?? "0xaa", 6, 6)}
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
  const { data: tokenInfo } = useAgentInfo(characterId!);
  const { open: openConnectWallet } = useConnectWalletModalStore();
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
  if (isLoading || !tokenInfo?.tokenAddress) {
    return <ChatSkeletons />;
  }
  return (
    <div className="p-6 pb-28 demo_test:pb-8 bg-white rounded-[6px] overflow-hidden ">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl text-dayT1 font-SwitzerBold">Forum Chat</h1>
        {showChat ? (
          <ChevronFirst
            className="rotate-90 hover:cursor-pointer"
            onClick={() => setShowChat((show) => !show)}
          />
        ) : (
          <ChevronFirst
            className="-rotate-90 hover:cursor-pointer"
            onClick={() => setShowChat((show) => !show)}
          />
        )}
      </div>
      <div
        className={`${
          showChat ? "block" : "hidden"
        } max-h-[660px] overflow-y-scroll scrollbar-hide`}
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
        <PostComment
          characterId={characterId}
          setShowModal={openConnectWallet}
        />
      )}
      <ReplyComment
        isReply={isReply}
        setIsReply={setIsReply}
        item={selectedItem!}
        characterId={characterId}
        setShowModal={openConnectWallet}
      />
    </div>
  );
};

export default TokenChat;
