import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { CreateAgentModal } from "./createAgentModal";
import { AgentInfo } from "@/types";
import {
  createAgent,
  // postAiAvatarGenerate,
  // postAiDescGenerate,
  uploadImg,
} from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import {
  CreateAgentRes,
  // PostAiDescGenerateResponse,
  // PostAiImageGenerateResponse,
} from "@/api/types";
import { toast } from "@/hooks/use-toast";
import { AgentTypeSelect } from "@/components/agentTypeSelect";
import { useAccount } from "wagmi";
import { ConnectWalletModal } from "@/components/connectWalletModal";
import { useConnectModal } from "@tomo-inc/tomo-evm-kit";
const getByteLength = (str: string) => {
  return new TextEncoder().encode(str).length;
};
const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;
const formSchema = z.object({
  file: z
    .string({
      required_error: "Please upload file",
    })
    .optional(),
  agentName: z
    .string({
      required_error: "Please enter your agent name",
    })
    .min(1, "Please enter your agent name")
    .refine(
      (val) => getByteLength(val) <= 64,
      "Agent name cannot exceed 64 bytes"
    ),
  ticker: z
    .string({
      required_error: "Please enter your agent ticker",
    })
    // .min(1, "Please enter your agent ticker")
    .min(2, "Ticker must be at least 2 characters")
    .max(10, "Ticker cannot exceed 10 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Ticker can only contain letters and numbers"),
  description: z
    .string({
      required_error: "Write something about your meme",
    })
    .min(1, "Write something about your meme"),
  agentType: z
    .string({ required_error: "Please select an agent type" })
    .min(1, "Please select an agent type"),
  twitterLink: z
    .string()
    .regex(/^https?:\/\/(www\.)?(twitter|x)\.com\/[a-zA-Z0-9_]{1,15}\/?$/, {
      message:
        "Invalid URL. Please start with https://twitter.com/ or https://x.com/",
    })
    .optional()
    .or(z.literal("")),
  tgLink: z
    .string()
    .regex(/^https?:\/\/(t\.me|telegram\.me)\/[a-zA-Z0-9_]{5,32}\/?$/, {
      message: "Invalid URL. Please start with https://t.me/",
    })
    .optional()
    .or(z.literal("")),
  discordLink: z
    .string()
    .regex(
      /^https?:\/\/(www\.)?(discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+\/?$/,
      {
        message:
          "Invalid URL. Please start with https://discord.gg/ or https://discord.com/",
      }
    )
    .optional()
    .or(z.literal("")),
  youTubeLink: z
    .string()
    .regex(
      /^https?:\/\/(www\.)?(youtube\.com\/(channel|c|user)\/[a-zA-Z0-9_-]+|youtube\.com\/@[a-zA-Z0-9_-]+|youtu\.be\/[a-zA-Z0-9_-]+)\/?$/,
      {
        message:
          "Invalid URL. Please start with https://youtube.com or https://youtu.be",
      }
    )
    .optional()
    .or(z.literal("")),
  websiteLink: z
    .string()
    .regex(urlRegex, {
      message: "Invalid URL. Please start with http:// or https://",
    })
    .optional()
    .or(z.literal("")),
});
const CreatePage = () => {
  const account = useAccount();
  // const evmAddress = account.address;
  const { openConnectModal } = useConnectModal();
  // const { loginApp, authed, appLoginStatus } = useAuth();
  // const { data: walletClient } = useWalletClient();
  const [image, setImage] = useState<string>("");
  const [agentId, setAgentId] = useState<string>("");
  const [showCreateAgentModal, setShowCreateAgentModal] =
    useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: "",
      agentName: "",
      ticker: "",
      description: "",
      agentType: "",
    },
    mode: "onChange",
  });
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    form.reset();
  }, []);

  // useEffect(() => {
  //     if (evmAddress && !authed && walletClient && appLoginStatus === 'disconnected') {
  //       loginApp(evmAddress);
  //     }
  //   }, [authed, evmAddress, walletClient, appLoginStatus])

  const uploadMutation = useMutation({
    mutationFn: uploadImg,
    onSuccess(data: string) {
      form.setValue("file", data);
    },
  });

  const createAgentMutation = useMutation({
    mutationFn: createAgent,
    onSuccess(data: CreateAgentRes) {
      setAgentId(data.characterId);
      setShowCreateAgentModal(true);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.file) return;
    const params: AgentInfo = {
      name: values.agentName,
      symbol: values.ticker,
      agentType: values.agentType.toLowerCase(),
      description: values.description,
      image: values.file ?? "",
      twitter: values.twitterLink,
      telegram: values.tgLink,
      youtube: values.youTubeLink,
      website: values.websiteLink,
      discord: values.discordLink,
    };
    createAgentMutation.mutate(params);
  }

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (
      file &&
      !["image/png", "image/svg+xml", "image/jpeg"].includes(file.type)
    ) {
      toast({
        title: "Please upload a valid image file (png, svg, jpg).",
        variant: "destructive",
      });
      return;
    }
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      if (file && file.type.startsWith("image/")) {
        const formData = new FormData();
        formData.append("file", file);
        uploadMutation.mutate(formData);
      } else {
        alert("Please upload a valid image file.");
      }
    }
  };

  const handleClick = () => {
    document.getElementById("fileInput")?.click();
  };

  // const aiDescMutation = useMutation({
  //   mutationFn: postAiDescGenerate,
  //   onSuccess: (data: PostAiDescGenerateResponse) => {
  //     form.setValue("description", data.message);
  //   },
  // });

  // const handleAiDescGenerate = () => {
  //   const agentName = form.getValues().agentName;
  //   const ticker = form.getValues().ticker;
  //   const agentType = form.getValues().agentType;
  //   if (agentName && agentType && ticker) {
  //     aiDescMutation.mutate({
  //       ticker: form.getValues().ticker ?? "",
  //       user_id: "0",
  //       agent_id: agentId ?? "",
  //       agent_name: agentName,
  //       agent_type: agentType,
  //       agent_desc: form.getValues().description ?? "",
  //     });
  //   } else {
  //     toast({
  //       title:
  //         "Agent name and ticker and agent type are required to generate description.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // const aiAvatarMutation = useMutation({
  //   mutationFn: postAiAvatarGenerate,
  //   onSuccess: (data: PostAiImageGenerateResponse) => {
  //     setImage(data.image_url);
  //     form.setValue("file", data.image_url);
  //   },
  // });

  // const handleAiAvatarGenerate = () => {
  //   const agentName = form.getValues().agentName;
  //   const ticker = form.getValues().ticker;
  //   const agentType = form.getValues().agentType;
  //   if (agentName && agentType && ticker) {
  //     aiAvatarMutation.mutate({
  //       ticker: form.getValues().ticker ?? "",
  //       user_id: "0",
  //       agent_id: agentId ?? "",
  //       agent_name: agentName,
  //       agent_type: agentType,
  //       agent_desc: form.getValues().description ?? "",
  //     });
  //   } else {
  //     toast({
  //       title:
  //         "Agent name and ticker and agent type are required to generate description.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  return (
    <Container>
      <div className="flex flex-col items-center max-w-[790px] m-auto">
        <div className="flex flex-col gap-8 items-center w-full">
          <img className="w-[120px] h-[120px]" src="/images/logo2.svg" alt="" />
          <img
            className="h-[43px] w-[562px] hidden mdd:block"
            src="/images/agent_details.svg"
            alt=""
          />
          <img
            className="w-[60%]  mdd:hidden block"
            src="/images/agent_details_mobile.svg"
            alt=""
          />

          <div className="border-b-[1px] border-solid border-border w-full"></div>
        </div>
        <div className="py-8 px-[67px] w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-6 py-4 px-1"
            >
              <div className="grid grid-cols-1 mdd:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="agentName"
                  render={({ field }) => (
                    <FormItem className="flex-col">
                      <FormLabel>
                        AI agent name<span className="text-red">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Agent name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ticker"
                  render={({ field }) => (
                    <FormItem className="flex-col">
                      <FormLabel>
                        Ticker<span className="text-red">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="$" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="agentType"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Agent type<span className="text-red">*</span>
                    </FormLabel>
                    <FormControl>
                      <AgentTypeSelect
                        side="right"
                        onChange={(val: string) =>
                          form.setValue("agentType", val)
                        }
                        selectType={form.getValues().agentType}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col mdd:flex-row mdd:items-center gap-4">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <div className="flex items-center gap-[10px]">
                            <div>
                              AI agent description
                              <span className="text-red">*</span>
                            </div>
                            {/* <AiAgent onClick={handleAiDescGenerate} /> */}
                          </div>
                        </FormLabel>
                        <FormControl className="flex flex-col">
                          <textarea
                            placeholder="Write something about your meme"
                            {...field}
                            className="h-[176px] resize-none placeholder:text-second border border-solid p-2 border-[rgb(226, 232, 240)] rounded-md w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="file"
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center gap-[10px]">
                          <div>
                            Logo<span className="text-red">*</span>
                          </div>
                          {/* <AiAgent onClick={handleAiAvatarGenerate} /> */}
                        </div>
                      </FormLabel>
                      <FormControl>
                        <div>
                          <Input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            className="w-[176px] h-[176px] hidden"
                            onChange={handleFileChange}
                          />
                          <div
                            onClick={handleClick}
                            className="w-[176px] h-[176px] bg-white flex flex-col items-center justify-center rounded-[2px] cursor-pointer"
                            style={{
                              backgroundImage: image ? `url(${image})` : "none",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            {!image && (
                              <div className="w-full h-full rounded-[2px] flex flex-col items-center justify-center gap-[2px] border-border border-solid border-[1px]">
                                <img src="/images/placeholder.svg" alt="" />
                                <span className="text-first text-12 underline">
                                  Click to upload
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 mdd:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="twitterLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>X ( Twitter )</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://x.com/username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tgLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram</FormLabel>
                      <FormControl>
                        <Input placeholder="https://t.me/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discordLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discord</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://discord.gg/username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youTubeLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.youtube.com/channel/username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="websiteLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://xxx.example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {account.address ? (
                <Button
                  type="submit"
                  variant="yellow"
                  className="w-full gap-2"
                  size="lg"
                  loading={createAgentMutation.status === "pending"}
                  disabled={!form.formState.isValid || !form.getValues().file}
                >
                  <span>🚀</span> Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="yellow"
                  onClick={() => 
                    //setShowModal(true)
                    openConnectModal && openConnectModal()
                  }
                  className="w-full gap-2"
                  size="lg"
                >
                  Connect Wallet
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>

      {showCreateAgentModal && (
        <CreateAgentModal
          open={showCreateAgentModal}
          agentInfo={
            {
              name: form.getValues().agentName,
              symbol: form.getValues().ticker,
              agentId: agentId,
            } as AgentInfo
          }
          onClose={() => setShowCreateAgentModal(false)}
        />
      )}

      {showModal && (
        <ConnectWalletModal
          open={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </Container>
  );
};

export default CreatePage;

// interface IAiAgent {
//   onClick: () => void;
// }
// const AiAgent: React.FC<IAiAgent> = ({ onClick }) => {
//   const [gapTime, setGapTime] = useState<number>(0);
//   const [sendInterval, setSendInterval] = useState<any>(undefined);

//   const startCountdown = async () => {
//     clearInterval(sendInterval);
//     setGapTime(120);
//     const interval = setInterval(() => {
//       setGapTime((prev: number) => {
//         if (prev === 0) {
//           clearInterval(sendInterval);
//           return 0;
//         } else {
//           return prev - 1;
//         }
//       });
//     }, 1000);
//     setSendInterval(interval);
//   };

//   return (
//     <div className="flex gap-[10px] items-center">
//       <div
//         onClick={() => {
//           if (gapTime > 0) return;
//           onClick();
//           startCountdown();
//         }}
//         className="py-[2px] px-2 rounded-full bg-white text-second text-14 cursor-pointer"
//       >
//         {gapTime > 0 ? (
//           <span>
//             Wait for{" "}
//             {`${Math.floor(gapTime / 60)}:${String(gapTime % 60).padStart(
//               2,
//               "0"
//             )}`}
//           </span>
//         ) : (
//           "AI generate"
//         )}
//       </div>
//     </div>
//   );
// };
