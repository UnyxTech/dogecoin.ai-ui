"use client";

import * as React from "react";
import { CustomProgress } from "@/components/ui/custom/CustomProgress";

export function ProgressCard() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-xl font-medium text-dayT1 font-SwitzerMedium">
        Ascension Progress{" "}
        <span className="text-[#DBB623] font-normal">100%</span>
      </h1>
      <CustomProgress value={progress} className="w-full my-3" />
      <p className="text-base text-dayT3">G.A.M.E has graduated to Uniswap</p>
    </div>
  );
}
