import React, { lazy, Suspense } from "react";
import TokenSwap from "./TokenSwap";
const TokenChat = lazy(() => import("./TokenChat"));

const TokenSwapAndChat = () => {
  return (
    <div className="w-full rounded-[6px] overflow-hidden flex flex-col gap-4">
      <TokenSwap />
      <Suspense fallback={<div>Loading chat...</div>}>
        <TokenChat />
      </Suspense>
    </div>
  );
};

export default TokenSwapAndChat;
