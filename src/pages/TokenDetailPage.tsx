// import { useParams } from "react-router-dom";
import Container from "@/components/container";
import { TokenMarketInfo, TokenSwapAndChat } from "@/components/TokenDetail";

const TokenDetailPage = () => {
  // const { address } = useParams();
  return (
    <main className="min-h-screen bg-dayBg3 font-Switzer leading-[140%]">
      <Container>
        <div className="flex gap-8">
          <section className="w-[680px] rounded-lg gap-6 flex-shrink-0">
            <TokenMarketInfo />
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
