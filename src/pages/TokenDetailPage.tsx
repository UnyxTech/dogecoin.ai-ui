import { useParams } from "react-router-dom";
import Container from "@/components/container";
import { TokenMarketInfo, TokenSwapAndChat } from "@/components/TokenDetail";
import { isAddress } from "viem";

const TokenDetailPage = () => {
  const { address } = useParams();
  if (!address || !isAddress(address)) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-500">Invalid token address</p>
        </div>
      </Container>
    );
  }
  return (
    <main className="min-h-screen bg-dayBg3 font-Switzer leading-[140%]">
      <Container>
        <div className="flex gap-8">
          <section className="w-[680px] rounded-lg gap-6 flex-shrink-0">
            <TokenMarketInfo tokenAddress={address!} />
          </section>
          <section className="w-[390px] gap-6 flex-shrink-0">
            <TokenSwapAndChat />
          </section>
        </div>
      </Container>
    </main>
  );
};

export default TokenDetailPage;
