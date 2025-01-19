import { useState } from "react";
import { formatAddress } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { ConnectWalletModal } from "@/components/connectWalletModal";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Navbar = () => {
  const { evmAddress } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="bg-yellow w-full h-16 flex justify-between items-center">
        <div
          onClick={() => navigate("/home")}
          className="w-full h-full flex justify-between items-center py-4 px-6 cursor-pointer"
        >
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
          <div className="relative flex-1 max-w-[560px] mx-6">
            <Input className="pl-10" placeholder="Search Agent/CA" />
            <Search className="absolute text-second left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
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
