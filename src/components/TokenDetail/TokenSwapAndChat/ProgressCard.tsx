import { CustomProgress } from "@/components/ui/custom/CustomProgress";
import { useAgentInfoStore } from "@/store/tokenDetail";

export function ProgressCard() {
  const tokenInfo = useAgentInfoStore((state) => state.agent);

  return (
    <div className="w-full">
      <h1 className="text-xl font-medium text-dayT1 font-SwitzerMedium">
        Ascension Progress&nbsp;
        <span className="text-[#DBB623] font-normal">
          {tokenInfo?.graduatedPercent ?? "0"}%
        </span>
      </h1>
      <CustomProgress
        value={tokenInfo?.graduatedPercent ?? 0}
        className="w-full my-3"
      />
      {tokenInfo?.graduated ? (
        <p className="text-base text-dayT3">
          {tokenInfo?.symbol} has graduated to Uniswap
        </p>
      ) : (
        <p>
          An additional {tokenInfo?.graduatedNeedAmount ?? "0"} DogeCion are
          required before all the liquidity from the bonding curve will be
          deposited into Uniswap and burnt. Progression increases as the price
          goes up.
        </p>
      )}
    </div>
  );
}
