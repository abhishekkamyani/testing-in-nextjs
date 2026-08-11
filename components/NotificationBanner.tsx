// @/components/NotificationBanner.tsx
import { useState, useEffect } from "react";
import { trackEvent } from "@/utils/analytics";
import { HeavyBadge } from "@/components/HeavyBadge";

export interface NotificationBannerProps {
  message: string;
  autoDismissMs?: number;
  onDismiss?: () => void;
}

export function NotificationBanner({
  message,
  autoDismissMs = 5000,
  onDismiss,
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    trackEvent("banner_rendered");

    const timer = setTimeout(() => {
      handleClose("auto");
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [autoDismissMs]);

  const handleClose = (reason: "auto" | "manual") => {
    setIsVisible(false);
    trackEvent(`banner_closed_${reason}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (onDismiss) onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div role="region" aria-label="Notification Banner">
      <HeavyBadge label="NEW" />
      <p>{message}</p>
      <button onClick={() => handleClose("manual")}>Close</button>
    </div>
  );
}