import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { CustomProgress } from "@/components/ui/custom/CustomProgress";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { LoadingComp } from "@/components/loading";
import { useAgentInfo } from "@/hooks/tokenDetial/useAgentInfo";
import { useParams } from "react-router-dom";
import { usePosAiImageGenerate } from "@/hooks/tokenDetial/usePosAiImageGenerate";
import { usePostAiImagePost } from "@/hooks/tokenDetial/usePostAgentPost";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { usePosAiDescGenerate } from "@/hooks/tokenDetial/usePostAiDescGenarate";
import { useAccount } from "wagmi";
import { ConnectWalletModal } from "@/components/connectWalletModal";
const Limit = 20;
export function PostDialog() {
  const queryClient = useQueryClient();
  // init state
  const account = useAccount();
  const [showModal, setShowModal] = useState(false);
  const { characterId } = useParams();
  const { data: agentInfo } = useAgentInfo(characterId!);
  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  // input state
  const [prompt, setPrompt] = useState<string>("");
  const {
    mutateAsync: imageGenerate,
    data: imageGenerateData,
    isPending: imageGeneratePending,
    reset: resetImageGenerate,
  } = usePosAiImageGenerate({
    prompt: prompt,
    agent_desc: agentInfo?.description ?? "",
  });
  const {
    mutateAsync: descGenerate,
    isPending: descGeneratePending,
    reset: resetDescGenerate,
  } = usePosAiDescGenerate({
    ticker: agentInfo?.symbol ?? "",
    user_id: "0",
    agent_id: agentInfo?.characterId ?? "",
    agent_name: agentInfo?.name ?? "",
    agent_type: agentInfo?.agentType ?? "",
    agent_desc: agentInfo?.description + prompt,
  });
  const { mutateAsync: imagePost, isPending: imagePostPending } =
    usePostAiImagePost({
      characterId: characterId!,
      image: imageGenerateData?.image_url ?? "",
    });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowConfirmDialog(true);
    } else {
      setIsOpen(true);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    setPrompt("");
    resetImageGenerate();
    resetDescGenerate();
    setIsOpen(false);
  };

  const handleCancelClose = () => {
    setShowConfirmDialog(false);
  };
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 500) {
      setPrompt(newValue);
    }
  };
  const handleGenerate = async () => {
    if (!account.address) {
      setShowModal(true);
      return;
    }
    await imageGenerate();
  };
  const handlePost = async () => {
    if (!imageGenerateData?.image_url) {
      return toast({ title: "Insufficient Image", variant: "destructive" });
    }
    await imagePost();
    queryClient.invalidateQueries({ queryKey: ["agentsPosts"] });
    setPrompt("");
    resetImageGenerate();
    resetDescGenerate();
    setIsOpen(false);
  };
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            type="submit"
            variant="yellow"
            className="focus:outline-none active:outline-none rounded-sm py-2 px-4 border-[1.5px] border-b-4 border-[#12122A] bg-gradient-to-tr from-[#FCD436] to-[#FFE478]"
          >
            Add Post
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[432px]">
          <DialogHeader>
            <DialogTitle className="text-dayT1 font-SwitzerMedium">
              Post a feed of Doggee
            </DialogTitle>
          </DialogHeader>
          <div>
            <div className="flex gap-4 items-center mt-2 mb-3">
              <div className="flex items-center">
                <span className="font-SwitzerMedium text-dayT1">Prompt</span>
                <span className="text-red ml-0.5">*</span>
              </div>
              <button
                disabled={prompt.length < Limit}
                // disabled={true}
                onClick={async () => {
                  const data = await descGenerate();
                  setPrompt(data.message);
                }}
                className={`text-dayT2 text-sm ${
                  prompt.length > Limit ? "opacity-100" : "opacity-30"
                } hover:opacity-75 hover:outline-none hover:border-none focus:border-none focus:outline-none`}
              >
                AI generate
              </button>
            </div>
            {/* desc */}
            {descGeneratePending ? (
              <div className="bg-dayBg3 w-full scrollbar-hide flex justify-center items-center text-sm h-[110px] focus:outline-none p-3 border resize-none border-gray-300 rounded-md placeholder:text-dayT3 text-black">
                <LoadingComp loading={descGeneratePending} />
              </div>
            ) : (
              <textarea
                value={prompt}
                placeholder={`Set the character and behavior of the agent. \n(min ${Limit} characters)`}
                className="bg-dayBg3 w-full scrollbar-hide text-sm h-[110px] focus:outline-none p-3 border resize-none border-gray-300 rounded-md placeholder:text-dayT3 text-black"
                onChange={handlePromptChange}
                maxLength={500}
              />
            )}

            <div className="flex items-center justify-end">
              <span className="text-dayT2 text-xs">{prompt.length}/500</span>
            </div>
          </div>

          {imageGeneratePending ? (
            <div>
              <div className="mt-2 mb-3">
                <span className="font-SwitzerMedium text-dayT1">Preview</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-dayBg3 w-full h-[200px] e px-3 py-4 border border-gray-300 rounded-md text-dayT3">
                <LoadingComp loading={true} />
              </div>
            </div>
          ) : imageGenerateData?.image_url ? (
            <div>
              <div className="mt-2 mb-3">
                <span className="font-SwitzerMedium text-dayT1">Preview</span>
              </div>

              <div className="w-full h-[200px]">
                <img
                  src={imageGenerateData?.image_url}
                  alt="preview"
                  className="max-h-full"
                />
              </div>
            </div>
          ) : null}
          <div>
            {/* version delete fee */}
            {/* <p className="mb-5 mt-4">Generating fee: 1 $DOGE</p> */}
            {!imageGenerateData?.image_url ? (
              <div>
                {account.address ? (
                  <Button
                    variant="yellow"
                    type="submit"
                    loading={imageGeneratePending}
                    onClick={handleGenerate}
                    disabled={!(prompt.length >= Limit)}
                    className="w-full rounded-sm py-4 focus:outline-none border-[1.5px] border-b-4 border-[#12122A] bg-gradient-to-tr from-[#FCD436] to-[#FFE478]"
                  >
                    Generate
                  </Button>
                ) : (
                  <Button
                    variant="yellow"
                    type="submit"
                    onClick={() => setShowModal(true)}
                    className="w-full rounded-sm py-4 focus:outline-none border-[1.5px] border-b-4 border-[#12122A] bg-gradient-to-tr from-[#FCD436] to-[#FFE478]"
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
            ) : (
              <Button
                variant="yellow"
                type="submit"
                onClick={handlePost}
                loading={imagePostPending}
                disabled={!imageGenerateData?.image_url}
                className="w-full rounded-sm py-4 focus:outline-none border-[1.5px] border-b-4 border-[#12122A] bg-gradient-to-tr from-[#FCD436] to-[#FFE478]"
              >
                Post
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="sm:max-w-[432px]">
          <AlertDialogHeader>
            <AlertDialogDescription className="text-dayT1 font-Switzer text-start">
              Are you sure you want to cancel and discard the image.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex w-full mt-10 gap-2">
            <div className="flex-1">
              <Button
                className=" py-5 border-[1.5px] border-first hover:border-first border-b-[3.5px]"
                onClick={handleCancelClose}
              >
                Cancel
              </Button>
            </div>
            <div className="flex-1">
              <Button
                className="py-5 flex-1 rounded-sm w-1/2"
                variant="yellow"
                onClick={handleConfirmClose}
              >
                Exit
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
      {showModal && (
        <ConnectWalletModal
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
