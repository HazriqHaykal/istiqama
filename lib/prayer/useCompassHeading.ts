"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CompassState = "unsupported" | "idle" | "denied" | "active";

interface OrientationEventWithWebkit extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

/** True heading in degrees (0 = North), from whichever DeviceOrientation flavor the browser exposes. */
function readHeading(event: OrientationEventWithWebkit): number | null {
  if (typeof event.webkitCompassHeading === "number") return event.webkitCompassHeading;
  if (event.alpha !== null) return (360 - event.alpha) % 360;
  return null;
}

export function useCompassHeading() {
  const [state, setState] = useState<CompassState>("idle");
  const [heading, setHeading] = useState<number | null>(null);
  const listening = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("unsupported");
    }
  }, []);

  const handleOrientation = useCallback((event: Event) => {
    const value = readHeading(event as OrientationEventWithWebkit);
    if (value !== null) {
      setHeading(value);
      setState("active");
    }
  }, []);

  const enable = useCallback(async () => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setState("unsupported");
      return;
    }

    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    if (typeof DOE.requestPermission === "function") {
      try {
        const result = await DOE.requestPermission();
        if (result !== "granted") {
          setState("denied");
          return;
        }
      } catch {
        setState("denied");
        return;
      }
    }

    if (!listening.current) {
      window.addEventListener("deviceorientation", handleOrientation, true);
      listening.current = true;
    }
  }, [handleOrientation]);

  useEffect(() => {
    return () => {
      if (listening.current) {
        window.removeEventListener("deviceorientation", handleOrientation, true);
        listening.current = false;
      }
    };
  }, [handleOrientation]);

  return { state, heading, enable };
}
