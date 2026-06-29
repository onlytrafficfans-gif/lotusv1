import { useState } from "react";
import { DeviceMode } from "../types";

export function useDeviceSelection(initialDevice: DeviceMode = "phone") {
  const [device, setDevice] = useState<DeviceMode>(initialDevice);
  const [dragKey, setDragKey] = useState(0);

  const resetPosition = () => {
    setDragKey((k) => k + 1);
  };

  return {
    device,
    setDevice,
    dragKey,
    resetPosition,
  };
}
