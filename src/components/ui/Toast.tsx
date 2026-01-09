// Toast component - provides feedback notifications
import { useEffect } from "react";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({
  message,
  type = "info",
  duration = 1800,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className={`toast toast-${type}`}
      role="status"
      aria-live="polite"
      style={{ "--toast-duration": `${duration}ms` } as React.CSSProperties}
    >
      <div className="toast-content">
        {type === "success" && (
          <span className="toast-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="toast-icon-svg">
              <path
                d="M5 12l4 4L19 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
            </svg>
          </span>
        )}
        {type === "error" && (
          <span className="toast-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="toast-icon-svg">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="butt"
              />
            </svg>
          </span>
        )}
        {type === "info" && (
          <span className="toast-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="toast-icon-svg">
              <path
                d="M12 7h.01M11 10h2v7h-2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="butt"
                strokeLinejoin="miter"
              />
            </svg>
          </span>
        )}
        <span className="toast-message">{message}</span>
      </div>
    </div>,
    document.body
  );
}
