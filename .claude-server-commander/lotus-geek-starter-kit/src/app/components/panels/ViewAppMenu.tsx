import { useState } from "react";
import { Globe, Play, Smartphone } from "lucide-react";
import { Modal } from "./Modal";

interface ViewAppMenuProps {
  onClose: () => void;
}

export function ViewAppMenu({ onClose }: ViewAppMenuProps) {
  const [tab, setTab] = useState<"web" | "apple" | "google">("web");

  const tabs: Array<["web" | "apple" | "google", React.ReactNode, string]> = [
    ["web", <Globe size={12} key="globe" />, "Web App"],
    ["apple", <Play size={12} key="play" />, "App Store"],
    ["google", <Smartphone size={12} key="phone" />, "Play Store"],
  ];

  const field = (label: string, placeholder: string) => (
    <div key={label}>
      <label
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "var(--muted-foreground)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: 4,
        }}
      >
        {label}
      </label>
      <input
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2 outline-none text-xs"
        style={{
          background: "var(--background)",
          border: "1px solid var(--border)",
          color: "var(--foreground)",
          fontFamily: "Outfit,sans-serif",
        }}
      />
    </div>
  );

  return (
    <Modal title="View App" onClose={onClose}>
      <div className="p-4">
        <div
          className="flex gap-1 mb-4 p-1 rounded-xl"
          style={{ background: "var(--muted)" }}
        >
          {tabs.map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-1.5 flex-1 justify-center py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: tab === key ? "var(--card)" : "transparent",
                color: tab === key ? "var(--foreground)" : "var(--muted-foreground)",
                boxShadow:
                  tab === key ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {tab === "web" && (
          <div className="flex flex-col gap-3">
            {field("App URL", "https://myapp.lotus.app")}
            <div className="flex gap-2 mt-1">
              <button
                className="flex-1 py-2 rounded-xl text-xs font-semibold"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                Open Web App
              </button>
              <button
                className="flex-1 py-2 rounded-xl text-xs font-semibold"
                style={{
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}

        {tab === "apple" && (
          <div className="flex flex-col gap-3">
            {field("Apple Bundle ID", "com.yourcompany.app")}
            {field("Apple Team ID", "XXXXXXXXXX")}
            {field("App Store Category", "Health & Fitness")}
            {field("Version", "1.0.0")}
            {field("Build Number", "1")}
            <div
              className="rounded-xl p-3 mt-1"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--foreground)",
                  marginBottom: 6,
                }}
              >
                App Store Prep Checklist
              </p>
              {[
                "App icon (1024×1024)",
                "Screenshots (all sizes)",
                "Privacy policy URL",
                "Support URL",
                "App description",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 py-1">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{
                      background: "var(--muted)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "google" && (
          <div className="flex flex-col gap-3">
            {field("Package Name", "com.yourcompany.app")}
            {field("Version Name", "1.0.0")}
            {field("Version Code", "1")}
            {field("Play Store Category", "Health & Fitness")}
            <div
              className="rounded-xl p-3 mt-1"
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--foreground)",
                  marginBottom: 6,
                }}
              >
                Play Store Prep Checklist
              </p>
              {[
                "Feature graphic (1024×500)",
                "Screenshots (phone & tablet)",
                "Content rating questionnaire",
                "Privacy policy URL",
                "Short description (80 chars)",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 py-1">
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{
                      background: "var(--muted)",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
