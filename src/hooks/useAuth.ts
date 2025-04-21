import { useUserStore } from "@/store/address";
import _ from "lodash";

export const useAuth = () => {
  const evmAddress = useUserStore((state) => state.evmAddress);
  const authed = !!evmAddress;
  const installWallets = useUserStore((state) => state.installWallets);
  const currentEvmWallet = useUserStore((state) => state.currentEvmWallet);
  const evmProviderNameState = useUserStore(
    (state) => state.evmProviderNameState
  );
  const ethBalance = useUserStore((state) => state.ethBalance);
  const setEvmAddress = useUserStore((state) => state.setEvmAddress);
  const setInstallWallets = useUserStore((state) => state.setInstallWallets);

  const setCurrentEvmWallet = useUserStore(
    (state) => state.setCurrentEvmWallet
  );
  const setEvmProviderNameState = useUserStore(
    (state) => state.setEvmProviderNameState
  );
  const setEthBalance = useUserStore((state) => state.setEthBalance);

  const getInstalledWallet = () => {
    const windowObj: any = window;
    if (windowObj.ethereum) {
      let wallets: any = [];
      const getInstalledWallets = (event: any) => {
        const arr = [event.detail];
        wallets = wallets.concat(arr);
        if (wallets) {
          setInstallWallets(wallets);
        } else {
          setInstallWallets([]);
        }
      };

      window.addEventListener("eip6963:announceProvider", getInstalledWallets);
      window.dispatchEvent(new Event("eip6963:requestProvider"));
      window.removeEventListener(
        "eip6963:announceProvider",
        getInstalledWallets
      );
    } else {
      setInstallWallets([]);
    }
  };

  const updateEvmProviderNameState = (name: string | undefined) => {
    setEvmProviderNameState(name);
  };

  return {
    authed,
    evmAddress,
    ethBalance,
    installWallets,
    currentEvmWallet,
    evmProviderNameState,
    disconnectWalletEvm() {
      return new Promise(() => {
        if (!currentEvmWallet) return;
        if (currentEvmWallet === "MetaMask") {
          let metaMaskProvider: any;
          if (!!currentEvmWallet && currentEvmWallet == "MetaMask") {
            const setMmProvider = (event: any) => {
              if (event.detail.info.name === "MetaMask") {
                metaMaskProvider = event.detail.provider;
              }
            };
            window.addEventListener("eip6963:announceProvider", setMmProvider);
            window.dispatchEvent(new Event("eip6963:requestProvider"));
            window.removeEventListener(
              "eip6963:announceProvider",
              setMmProvider
            );
          }
          metaMaskProvider.request({
            method: "wallet_revokePermissions",
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
        } else {
          window.okxwallet.disconnect();
        }
        setEvmAddress("");
        setCurrentEvmWallet("");
      });
    },
    updateEvmAddress(address: string) {
      setEvmAddress(address);
    },
    getInstalledWallet() {
      getInstalledWallet();
    },
    updateCurrentEvmWallet(wallet: string) {
      setCurrentEvmWallet(wallet);
    },
    updateEvmProviderNameState,
    updateEthBalance(balance: string) {
      setEthBalance(balance);
    },
  };
};
