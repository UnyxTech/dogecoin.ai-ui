import TokenSwap from "./TokenSwap";
import { useParams } from "react-router-dom";
import { useAgentInfo } from "@/hooks/tokenDetial/useAgentInfo";
import TokenChat from "./TokenChat";
import SwapSkeletons from "@/components/skeletons/tokenDetail/SwapSkeletons";

const TokenSwapAndChat = () => {
  const { characterId } = useParams();
  const { data: tokenInfo, isLoading } = useAgentInfo(characterId!);
  return (
    <div className="w-full rounded-[6px] overflow-hidden flex flex-col gap-4">
      {isLoading ? <SwapSkeletons /> : <TokenSwap tokenInfo={tokenInfo!} />}

      <TokenChat characterId={characterId!} />
    </div>
  );
};

export default TokenSwapAndChat;
