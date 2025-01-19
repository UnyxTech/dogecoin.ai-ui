import { LoaderCircle } from "lucide-react";

interface IProps {
  loading: boolean;
  size?: number;
  Icon?: React.ReactElement;
}

export const LoadingComp = ({ loading, size, Icon }: IProps) => {
  return loading ? (
    <div className="flex justify-center items-center h-full mr-1 Spin">
      {Icon ?? (
        <div className="animate-spin">
          <LoaderCircle size={size} />
        </div>
      )}
    </div>
  ) : null;
};
