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
import { createAgent, uploadImg } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import { CreateAgentRes } from "@/api/types";
import { toast } from "@/hooks/use-toast";
import { AgentTypeSelect } from "@/components/agentTypeSelect";

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
    .min(1, "Please enter your agent name"),
  ticker: z
    .string({
      required_error: "Please enter your agent ticker",
    })
    .min(1, "Please enter your agent ticker"),
  description: z
    .string({
      required_error: "Write something about your meme",
    })
    .min(1, "Write something about your meme"),
  agentType: z
    .string({ required_error: "Please select an agent type" })
    .min(1, "Please select an agent type"),
  twitterLink: z.string().optional(),
  tgLink: z.string().optional(),
  discordLink: z.string().optional(),
  youTubeLink: z.string().optional(),
  websiteLink: z.string().optional(),
});
const CreatePage = () => {
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

  useEffect(() => {
    form.reset();
  }, []);

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
        console.log(file);
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

  return (
    <Container>
      <div className="flex flex-col items-center w-[790px] m-auto">
        <div className="flex flex-col gap-8 items-center w-full">
          <img className="w-[120px] h-[120px]" src="/images/logo2.svg" alt="" />
          <img
            className="h-[43px] w-[562px]"
            src="/images/agent_details.svg"
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
              <div className="grid grid-cols-2 gap-6">
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
              <div className="flex items-center gap-4">
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
                            <AiAgent onClick={() => {}} />
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
                          <AiAgent onClick={() => {}} />
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
              <div className="grid grid-cols-2 gap-4">
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
              <Button
                type="submit"
                variant="yellow"
                className="w-full gap-2"
                size="lg"
                loading={createAgentMutation.status === "pending"}
                disabled={!form.formState.isValid}
              >
                <span>🚀</span> Continue
              </Button>
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
    </Container>
  );
};

export default CreatePage;

interface IAiAgent {
  onClick: () => void;
}
const AiAgent: React.FC<IAiAgent> = ({ onClick }) => {
  const [gapTime, setGapTime] = useState<number>(0);
  const [sendInterval, setSendInterval] = useState<any>(undefined);

  const startCountdown = async () => {
    clearInterval(sendInterval);
    setGapTime(120);
    const interval = setInterval(() => {
      setGapTime((prev: number) => {
        if (prev === 0) {
          clearInterval(sendInterval);
          return 0;
        } else {
          return prev - 1;
        }
      });
    }, 1000);
    setSendInterval(interval);
  };

  return (
    <div className="flex gap-[10px] items-center">
      <div
        onClick={() => {
          if (gapTime > 0) return;
          onClick();
          startCountdown();
        }}
        className="py-[2px] px-2 rounded-full bg-white text-second text-14 cursor-pointer"
      >
        {gapTime > 0 ? (
          <span>
            Wait for{" "}
            {`${Math.floor(gapTime / 60)}:${String(gapTime % 60).padStart(
              2,
              "0"
            )}`}
          </span>
        ) : (
          "AI generate"
        )}
      </div>
    </div>
  );
};
