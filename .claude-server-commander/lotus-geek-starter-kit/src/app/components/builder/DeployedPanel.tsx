import { Zap } from "lucide-react";

export function DeployedPanel() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{
          background: "rgba(200,146,42,0.12)",
          border: "1px solid rgba(200,146,42,0.2)",
        }}
      >
        <Zap size={20} className="text-accent" />
      </div>
      <div className="text-center">
        <h3
          style={{
            fontFamily: "Fraunces,serif",
            fontSize: 18,
            fontWeight: 500,
            color: "var(--foreground)",
            marginBottom: 6,
          }}
        >
          Ready to deploy
        </h3>
        <p
          style={{
            fontSize: 12,
            color: "var(--muted-foreground)",
            maxWidth: 280,
            lineHeight: 1.6,
          }}
        >
          Your app will be live at a custom subdomain. Connect a domain or
          deploy to a store.
        </p>
      </div>
      <div className="flex gap-2 mt-2">
        {["Web App", "App Store", "Play Store"].map((d) => (
          <button
            key={d}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
