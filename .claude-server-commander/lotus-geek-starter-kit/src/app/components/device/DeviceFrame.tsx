import React from "react";
import { DeviceMode, DeviceConfig } from "../../types";

const DEVICE_SPECS: Record<DeviceMode, DeviceConfig> = {
  phone: {
    width: 234,
    height: 480,
    bezels: {
      outer:
        "linear-gradient(160deg,#282828 0%,#0E0E0E 60%,#1A1A1A 100%)",
      inner:
        "linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 45%,rgba(255,255,255,0.02) 100%)",
      shine: "0 0 0 1px rgba(255,255,255,0.06),0 0 0 2px rgba(0,0,0,0.95),0 32px 80px rgba(0,0,0,0.6)",
      button:
        "linear-gradient(180deg,#383838,#1E1E1E)",
    },
  },
  tablet: {
    width: 500,
    height: 360,
    bezels: {
      outer:
        "linear-gradient(145deg,#F0E8D0,#D4C49A)",
      inner:
        "linear-gradient(145deg,#D4C49A,#B8A070)",
      shine:
        "0 0 0 1.5px rgba(180,140,60,0.22),0 24px 56px rgba(0,0,0,0.16),inset 0 1px 0 rgba(255,255,255,0.5)",
    },
  },
  desktop: {
    width: 580,
    height: 0,
    bezels: {
      outer:
        "linear-gradient(145deg,#EEE4C8,#D0BA8A)",
      inner: "#1A1208",
      shine:
        "0 0 0 1.5px rgba(180,140,60,0.2),0 24px 64px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.5)",
    },
  },
};

interface DeviceFrameProps {
  device: DeviceMode;
  children: React.ReactNode;
}

export function DeviceFrame({ device, children }: DeviceFrameProps) {
  if (device === "phone") {
    return <PhoneFrame>{children}</PhoneFrame>;
  }
  if (device === "tablet") {
    return <TabletFrame>{children}</TabletFrame>;
  }
  return <DesktopFrame>{children}</DesktopFrame>;
}

interface FrameProps {
  children: React.ReactNode;
}

function PhoneFrame({ children }: FrameProps) {
  const spec = DEVICE_SPECS.phone;
  return (
    <div style={{ position: "relative", width: spec.width, height: spec.height, flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "2.6rem",
          background: spec.bezels.outer,
          boxShadow: spec.bezels.shine,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "2.6rem",
          background: spec.bezels.inner,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 6,
          borderRadius: "2.2rem",
          overflow: "hidden",
          background: "#050505",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 9,
            left: "50%",
            transform: "translateX(-50%)",
            width: 84,
            height: 24,
            borderRadius: 12,
            background: "#000",
            zIndex: 10,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px 4px",
            background: "#F0F4EE",
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 700, color: "#2D4A3E" }}>
            9:41
          </span>
          <div style={{ width: 10 }} />
          <div
            style={{
              width: 12,
              height: 7,
              borderRadius: 2,
              background: "#2D4A3E",
              opacity: 0.7,
            }}
          />
        </div>
        <div style={{ height: "calc(100% - 33px)" }}>{children}</div>
      </div>
      {/* Buttons */}
      <div
        style={{
          position: "absolute",
          right: -1.5,
          top: "30%",
          width: 3,
          height: 48,
          borderRadius: "0 2px 2px 0",
          background: spec.bezels.button,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -1.5,
          top: "26%",
          width: 3,
          height: 26,
          borderRadius: "2px 0 0 2px",
          background: spec.bezels.button,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -1.5,
          top: "36%",
          width: 3,
          height: 26,
          borderRadius: "2px 0 0 2px",
          background: spec.bezels.button,
        }}
      />
    </div>
  );
}

function TabletFrame({ children }: FrameProps) {
  const spec = DEVICE_SPECS.tablet;
  return (
    <div
      style={{
        position: "relative",
        width: spec.width,
        height: spec.height,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "1.75rem",
          background: spec.bezels.outer,
          boxShadow: spec.bezels.shine,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 8,
          borderRadius: "1.4rem",
          overflow: "hidden",
          background: "#0A0A0A",
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: spec.bezels.inner,
        }}
      />
    </div>
  );
}

function DesktopFrame({ children }: FrameProps) {
  const spec = DEVICE_SPECS.desktop;
  return (
    <div
      style={{
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: spec.width,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: "0.75rem 0.75rem 0 0",
          background: spec.bezels.outer,
          padding: "8px 8px 0",
          boxShadow: spec.bezels.shine,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 6 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: spec.bezels.inner,
            }}
          />
        </div>
        <div
          style={{
            borderRadius: "0.375rem 0.375rem 0 0",
            overflow: "hidden",
            aspectRatio: "16/9",
          }}
        >
          {children}
        </div>
      </div>
      <div
        style={{
          width: "56%",
          height: 10,
          background:
            "linear-gradient(180deg,#C4B07A,#A89060)",
        }}
      />
      <div
        style={{
          width: "70%",
          height: 6,
          borderRadius: "0 0 0.5rem 0.5rem",
          background:
            "linear-gradient(180deg,#B8A070,#9A8055)",
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}
