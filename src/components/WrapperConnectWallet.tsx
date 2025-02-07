import { useConnectWalletModalStore } from "@/store/connectWalletModal";
import { ConnectWalletModal } from "./connectWalletModal";

export const WrapperConnectWallet = () => {
  const { isOpen, close } = useConnectWalletModalStore();
  return <ConnectWalletModal open={isOpen} onClose={close} />;
};
