import { DeviceMode } from "../../types";

interface MockPreviewProps {
  device: DeviceMode;
}

export function MockPreview({ device }: MockPreviewProps) {
  const ph = device === "phone";
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: "#F0F4EE", fontFamily: "Outfit,sans-serif" }}
    >
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 py-3"
        style={{
          background: "#fff",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <span
          style={{
            fontSize: ph ? 14 : 15,
            fontWeight: 600,
            color: "#2D4A3E",
          }}
        >
          Wellness
        </span>
        {!ph && (
          <div className="flex gap-1">
            {["Mood", "Sleep", "Journal"].map((t) => (
              <button
                key={t}
                style={{
                  padding: "2px 10px",
                  borderRadius: 999,
                  fontSize: 11,
                  background: t === "Mood" ? "#2D4A3E" : "transparent",
                  color: t === "Mood" ? "#fff" : "#6B8C7E",
                  fontWeight: 500,
                }}
              >
                {t}
              </button>
            ))}
          </div>
        )}
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 999,
            background: "#C8E6C9",
          }}
        />
      </div>
      <div className="flex-1 overflow-auto p-3 flex flex-col gap-3">
        {[
          {
            label: "How are you feeling?",
            content: (
              <div className="flex justify-center gap-3 py-2">
                {["😔", "😐", "🙂", "😊", "🌟"].map((e, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: ph ? 18 : 22,
                      opacity: i === 3 ? 1 : 0.4,
                      transform: i === 3 ? "scale(1.2)" : "scale(1)",
                      display: "inline-block",
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            ),
          },
          {
            label: "Sleep log · 7h 22m avg",
            content: (
              <div className="flex items-end gap-1 h-10">
                {[6.5, 7, 8, 6, 7.5, 8.5, 7.3].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${(h / 9) * 100}%`,
                      background: i === 6 ? "#2D4A3E" : "#C8E6C9",
                    }}
                  />
                ))}
              </div>
            ),
          },
          {
            label: "Gratitude journal",
            content: (
              <p
                style={{
                  fontSize: ph ? 11 : 12,
                  color: "#3D6B5A",
                  lineHeight: 1.6,
                }}
              >
                "Grateful for the quiet morning light and a team that
                genuinely cares…"
              </p>
            ),
          },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 14,
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <p
              style={{
                fontSize: 9,
                color: "#9EB8AE",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {card.label}
            </p>
            {card.content}
          </div>
        ))}
      </div>
      {ph && (
        <div
          className="flex justify-around py-2 flex-shrink-0"
          style={{
            background: "#fff",
            borderTop: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {["Mood", "Sleep", "Journal"].map((t, i) => (
            <div
              key={t}
              className="flex flex-col items-center gap-0.5"
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: i === 0 ? "#2D4A3E" : "#D0E8DA",
                }}
              />
              <span
                style={{
                  fontSize: 8,
                  color: i === 0 ? "#2D4A3E" : "#9EB8AE",
                  fontWeight: 500,
                }}
              >
                {t}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
