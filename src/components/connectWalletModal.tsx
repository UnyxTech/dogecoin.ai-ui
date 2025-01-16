import { useAuth } from "@/hooks/useAuth";
import { evmWalletList } from "@/lib/wallet/walletList";
import { WalletItem } from "@/types/wallet";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import useWalletService from "@/hooks/useWalletService";
import { defaultChain } from "@/constant";

interface ConnectWalletModalProps {
  open: boolean;
  onClose: () => void;
  nestStep?: () => void;
}

export const ConnectWalletModal = ({
  open,
  onClose,
  nestStep,
}: ConnectWalletModalProps) => {
  const wallets = evmWalletList;
  const {
    getInstalledWallet,
    installWallets,
    updateEvmAddress,
    updateCurrentEvmWallet,
    currentEvmWallet,
  } = useAuth();
  const { switchChain } = useWalletService();
  useEffect(() => {
    getInstalledWallet();
  }, []);
  const connectWallet = async (wallet: WalletItem) => {
    try {
      const walletInstalled = installWallets.find(
        (item: any) => item.info.rdns === wallet.rdns
      );
      if (!walletInstalled) {
        throw new Error("Wallet not installed.");
      }
      if (!walletInstalled.provider) {
        throw new Error("Provider is undefined or null.");
      }
      const provider = walletInstalled.provider;
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });
      switchChain(defaultChain);
      if (!!accounts) {
        updateEvmAddress(accounts[0]);
        updateCurrentEvmWallet(wallet.rdns);
      }
      // const evmWallet = createWalletClient({
      //   transport: custom(provider),
      // });
      nestStep && nestStep();
      onClose();
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  useEffect(() => {
    if (!currentEvmWallet || !installWallets) {
      return;
    }
    const walletInstalled = installWallets.find(
      (item: any) => item.info.rdns === currentEvmWallet
    );
    if (!walletInstalled) {
      return;
    }
    walletInstalled.provider?.on("accountsChanged", handleEvmAccountsChanged);
  }, [currentEvmWallet, installWallets]);

  const handleEvmAccountsChanged = (accounts: any) => {
    if (!currentEvmWallet) {
      updateCurrentEvmWallet("");
      return;
    } else {
      if (accounts.length > 0) {
        updateEvmAddress(accounts[0]);
        updateCurrentEvmWallet(currentEvmWallet);
      } else {
        updateEvmAddress("");
        updateCurrentEvmWallet("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[400px] p-5 bg-gray rounded-md shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-22 font-SwitzerBold text-first">
            Connect Wallet
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {wallets.map((wallet: WalletItem) => (
            <div
              key={`wallet${wallet.name}`}
              onClick={() => connectWallet(wallet)}
              className="px-4 py-3 bg-white rounded-[8px] cursor-pointer"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-6">
                  <img src={wallet.img} className="w-8 h-8" alt={wallet.name} />
                  <div className="text-lg text-first text-16 font-SwitzerMedium">
                    {wallet.name}
                  </div>
                </div>
                {!installWallets
                  ?.map((w: any) => w.info)
                  ?.map((i: any) => i.rdns)
                  .includes(wallet.rdns) && (
                  <span
                    onClick={() => window.open(wallet.chrome_store)}
                    className="rounded-[20px] bg-[#F2F2F2] px-6 py-2 text-center text-sm font-bold"
                  >
                    Install
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
