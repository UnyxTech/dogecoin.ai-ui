import { AgentType } from "@/types";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { Users } from "lucide-react";
import { getTextByAgentType } from "@/utils";

interface Props {
  onChange: (val: string) => void;
  selectType?: string;
  showAll?: boolean;
  className?: string;
  side?: "left" | "right" | "top" | "bottom";
}
const agentTypes = [
  {
    value: AgentType.Productivity,
    icon: "/images/icon_productity.svg",
  },
  {
    value: AgentType.Meme,
    icon: "/images/icon_meme.svg",
  },
  {
    value: AgentType.OnChain,
    icon: "/images/icon_onchain.svg",
  },
];
export const AgentTypeSelect: React.FC<Props> = ({
  showAll,
  selectType,
  onChange,
  className,
  side,
}) => {
  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className={className}>
        <div className="flex items-center">
          {selectType &&
            showAll &&
            (agentTypes.find((type) => type.value === selectType)?.icon ? (
              <img
                className="w-[16px] h-[16px] mr-2"
                src={agentTypes.find((type) => type.value === selectType)?.icon}
                alt=""
              />
            ) : (
              <Users size={16} className="mr-2" />
            ))}
          {selectType ? (
            <div className="whitespace-nowrap mr-2">
              {getTextByAgentType(selectType)}
            </div>
          ) : (
            <span className="text-second">Click to select</span>
          )}
        </div>
      </SelectTrigger>
      <SelectContent alignOffset={0} side={side ?? "bottom"} sideOffset={4}>
        {showAll && (
          <SelectItem value="all">
            <div className="flex items-center gap-3">
              <Users size={16} />
              <span className="whitespace-nowrap">All agent</span>
            </div>
          </SelectItem>
        )}
        {agentTypes.map((type) => (
          <SelectItem key={type.value} value={type.value}>
            <div className="flex items-center gap-3">
              <img className="w-[16px] h-[16px]" src={type.icon} alt="" />
              <span className="whitespace-nowrap">
                {getTextByAgentType(type.value)}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
