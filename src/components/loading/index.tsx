import { cn } from "@/lib/utils";

interface IProps {
  loading: boolean;
  size?: number;
  Icon?: React.ReactElement;
  className?: string;
  text?: string;
}

export const LoadingComp = ({
  loading,
  size,
  Icon,
  className,
  text,
}: IProps) => {
  return loading ? (
    <div
      className={cn(
        "flex justify-center items-center gap-2 mr-1 Spin",
        className
      )}
    >
      {Icon ?? (
        <svg
          className="animate-spin"
          width={size ?? 32}
          height={size ?? 32}
          viewBox="0 0 33 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28.5 16C28.5 17.5759 28.1896 19.1363 27.5866 20.5922C26.9835 22.0481 26.0996 23.371 24.9853 24.4853C23.871 25.5996 22.5481 26.4835 21.0922 27.0866C19.6363 27.6896 18.0759 28 16.5 28C14.9241 28 13.3637 27.6896 11.9078 27.0866C10.4519 26.4835 9.12902 25.5996 8.01472 24.4853C6.90041 23.371 6.0165 22.0481 5.41344 20.5922C4.81039 19.1363 4.5 17.5759 4.5 16C4.5 14.4241 4.81039 12.8637 5.41345 11.4078C6.0165 9.95189 6.90042 8.62902 8.01472 7.51472C9.12903 6.40041 10.4519 5.5165 11.9078 4.91344C13.3637 4.31039 14.9241 4 16.5 4C18.0759 4 19.6363 4.31039 21.0922 4.91345C22.5481 5.51651 23.871 6.40042 24.9853 7.51472C26.0996 8.62903 26.9835 9.9519 27.5866 11.4078C28.1896 12.8637 28.5 14.4241 28.5 16L28.5 16Z"
            stroke="#EBEBF4"
            strokeWidth="3.42857"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 4C18.0759 4 19.6363 4.31039 21.0922 4.91345C22.5481 5.5165 23.871 6.40042 24.9853 7.51472C26.0996 8.62902 26.9835 9.95189 27.5866 11.4078C28.1896 12.8637 28.5 14.4241 28.5 16"
            stroke="#12122A"
            strokeWidth="3.42857"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {text && <span className="text-14 text-first">{text}</span>}
    </div>
  ) : null;
};
