import { defaultChain } from "@/constant";
import { getDefaultConfig } from "@tomo-inc/tomo-evm-kit";
import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
  storage: undefined,
});

export const tomoConfig = getDefaultConfig({
  clientId: 'QWgZD5ZzrFvhEwc3WrBfFkTmutDvuzECoKzBTvYxAp5RT9uk0OCxB5VW4eUMOQWo7OctEhOddBy5tomz9WhmGXPm',
  appName: 'Doge AI',
  projectId: '212ec4050c4a6b0ab930de39e5e31839', 
  chains: [defaultChain],
  ssr: false,
});

