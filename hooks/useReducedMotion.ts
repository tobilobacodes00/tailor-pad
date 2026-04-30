import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

export function useReducedMotion(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (!cancelled) setEnabled(value);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setEnabled
    );
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  return enabled;
}
