import { useState } from "react";
import { copyToClipboard, formatAddress } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { ToastContainer, toast } from "react-toastify";
import { ConnectWalletModal } from "@/components/connectWalletModal";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const { evmAddress } = useAuth();

  const [showModal, setShowModal] = useState(false);

  const handleCopy = (text: string | number) => {
    copyToClipboard(text).then(() => {
      toast.success("Copied to clipboard");
    });
  };

  return (
    <>
      <header className="bg-yellow w-full h-16 flex justify-between items-center">
        <ToastContainer position="top-center" autoClose={1500} />
        <div className="w-full h-full flex justify-between items-center py-4 px-6">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.svg"
              className="w-[32px] h-[32px]"
              alt="logo"
            />
            <img
              src="/images/logo_title.svg"
              className="w-[143px] h-[34px]"
              alt="logo"
            />
          </div>
          <div className="relative">
            <Input className="w-[560px] pl-10" placeholder="Search Agent/CA" />
            <img
              src="/images/icon_search.svg"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              alt="search"
            />
          </div>
          <div className="flex gap-6">
            {evmAddress && (
              <div className="flex gap-2 items-center text-first text-14 font-SwitzerMedium">
                <img
                  src="/images/icon_doge.svg"
                  className="w-[24px] h-[24px]"
                  alt=""
                />
                <span>2,345,444.04 Doge</span>
              </div>
            )}
            <div
              className="p-[6px] border-[1px] border-first rounded-[2px] cursor-pointer text-14 text-first min-w-fit"
              onClick={() => {
                setShowModal(!showModal);
              }}
            >
              {evmAddress ? (
                <div className="flex items-center gap-1 font-SwitzerMedium">
                  <img
                    src="/images/icon_wallet.svg"
                    className="w-[24px] h-[24px]"
                    alt="wallet"
                  />
                  {formatAddress(evmAddress)}
                </div>
              ) : (
                "Connect Wallet"
              )}
            </div>
          </div>
        </div>
      </header>
      {showModal && (
        <ConnectWalletModal
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;
