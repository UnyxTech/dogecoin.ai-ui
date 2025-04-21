import { login } from "@/api/api";
import { LoginReq, LoginRes } from "@/api/types";
import { defaultChain } from "@/constant";
import { useUserStore } from "@/store/address";
import { useLoginStore } from "@/store/login";
import { useLoginStatusStore } from "@/store/LoginStatus";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useEffect } from "react";
import { Address } from "viem";
import { useWalletClient, useDisconnect, useAccount, useSwitchChain } from "wagmi";

export const useAuth = () => {
  const { data: walletClient } = useWalletClient();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { loggining, setLoggining} = useLoginStatusStore();
  const setToken = useLoginStore((state) => state.setToken);
  const evmAddress = useUserStore((state) => state.evmAddress);
  const { address: wagmiEvmAddress } = useAccount();
  const appLoginStatus = useUserStore((state) => state.appLoginStatus); // now it's only used for login process
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
  const setAppLoginStatus = useUserStore((state) => state.setAppLoginStatus);

  // console.log('app evm address:', evmAddress);
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

  const loginApp = async (evmAddress: `0x${string}` | undefined) => {
    // console.log("login");
    if (!walletClient) {
      throw new Error("Wallet client not found");
    }
    // console.log('loggining:', loggining);
    if (loggining) {
      return;
    }
    setLoggining(true);
    try {
      if (evmAddress) {
        const timestamp = Date.now();
        const signature = await walletClient?.signMessage({
          account: evmAddress,
          message: `Dogecoin.AI\nPlease sign this message to log in.\nTimestamp: ${timestamp}`,
        });
        const params: LoginReq = {
          walletAddress: evmAddress,
          timestamp: timestamp,
          signature: signature as Address,
        };
        loginMutation.mutate(params);
        setEvmAddress(evmAddress);
        setAppLoginStatus("authed");
        setTimeout(() => {
          setLoggining(false);
        }, 1000);
      }
    } catch(e) {
      setLoggining(false);
    }
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess(data: LoginRes) {
      setToken(data.token);
      switchChain({ chainId: defaultChain.id as any});
    },
  });

  useEffect(() => {
    if (!wagmiEvmAddress) {
      // console.log('set disconnected');
      setAppLoginStatus("disconnected");
      return;
    }
  }, [wagmiEvmAddress])

  return {
    authed,
    evmAddress,
    ethBalance,
    installWallets,
    currentEvmWallet,
    evmProviderNameState,
    appLoginStatus,
    loginApp,
    disconnectApp: () => {
      disconnect();
      setEvmAddress("");
      setAppLoginStatus("disconnecting");
    },
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
    updateAppLoginStatus(status: "authed" | "disconnecting" | "disconnected") {
      setAppLoginStatus(status);
    }
  };
};
