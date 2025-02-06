import { TokenMarketInfo, TokenSwapAndChat } from "@/components/TokenDetail";
import { cn } from "@/lib/utils";
import { useState } from "react";

const TokenDetailPage = () => {
  const [topic, setTopic] = useState<"INFO" | "TRADE">("TRADE");
  const isInfo = topic === "INFO";
  return (
    <main className="min-h-screen bg-dayBg3 font-Switzer leading-[140%] ">
      <div className="w-full demo_test:pt-8">
        <div className="max-w-[1200px] mx-auto relative">
          <div className="flex gap-8">
            <section className="w-full demo_test:w-[680px] rounded-lg gap-6 flex-shrink-0">
              <TokenMarketInfo topic={topic} />
            </section>
            <section className="hidden demo_test:block demo_test:w-[390px] gap-6 flex-shrink-0">
              <TokenSwapAndChat />
            </section>
          </div>
          <footer className="fixed demo_test:hidden bottom-0 left-0 right-0 bg-[#FAFAFD]">
            <div className="w-full flex justify-between text-dayT2 text-xl">
              <button
                className={cn(
                  "w-full focus:outline-none hover:outline-none border-none rounded-none py-4 font-SwitzerBold",
                  isInfo ? "bg-yellow text-dayT1" : ""
                )}
                onClick={() => setTopic("INFO")}
              >
                Info
              </button>
              <button
                className={cn(
                  "w-full focus:outline-none hover:outline-none border-none rounded-none py-4 font-SwitzerBold",
                  !isInfo ? "bg-yellow text-dayT1" : ""
                )}
                onClick={() => setTopic("TRADE")}
              >
                Buy/Sell
              </button>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default TokenDetailPage;
