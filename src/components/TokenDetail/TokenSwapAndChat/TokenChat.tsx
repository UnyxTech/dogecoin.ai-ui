import { formatAddressNew, formatTimestamp } from "@/utils";
import { ChevronFirst } from "lucide-react";
import React, { useState } from "react";
import { Address } from "viem";
interface ChatItemProps {
  userAddress: Address;
  time: string;
  reply: string;
  content: string;
  image: string;
}
const ChatCard = ({ item }: { item: ChatItemProps }) => {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <img src={item.image} alt="" width={24} height={24} />
        <span className="text-xs text-dayT2 p-1 bg-[#FFF7D8] rounded-sm">
          {formatAddressNew(item.userAddress)}
        </span>
        <span className="text-xs text-dayT3">
          {formatTimestamp(+item.time)}
        </span>
      </div>
      {item.reply && (
        <div>
          <span className="text-xs text-dayT2 p-1 bg-dayBg3">Reply</span>
          <span className="text-xs text-dayT3">{item.reply}</span>
        </div>
      )}
      <p className="text-dayT1">{item.content}</p>
    </div>
  );
};
const TokenChat = () => {
  const [showChat, setShowChat] = useState<boolean>(true);
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
        {new Array<ChatItemProps>(5)
          .fill({
            userAddress: "0x458499e72e819e11bdea28e446d0482948f87396",
            time: "1736773046",
            reply: "#12135",
            content:
              "Stop asking him, the bot doesn't work, they made him a separate site for holders",
            image: "/public/images/icon_doge.svg",
          })
          .map((item, index) => {
            return <ChatCard item={item} key={index} />;
          })}
      </div>
    </div>
  );
};

export default TokenChat;
