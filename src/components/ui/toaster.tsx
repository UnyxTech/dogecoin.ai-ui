import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { CircleAlert, CircleCheck, LoaderCircle } from "lucide-react";
import { createPortal } from "react-dom";

export function Toaster() {
  const { toasts } = useToast();
  return createPortal(
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        var icon: React.ReactNode = null;
        if (props.variant === "default") {
          icon = <CircleCheck size={16} className="text-green" />;
        } else if (props.variant === "destructive") {
          icon = <CircleAlert size={16} className="text-yellow" />;
        } else if (props.variant === "loading") {
          icon = (
            <LoaderCircle size={16} className="text-yellow animate-spin" />
          );
        }
        return (
          <Toast key={id} {...props}>
            <div className="flex items-center gap-2 px-10">
              {icon}
              <div className="flex flex-col gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>

            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>,
    document.body
  );
}
