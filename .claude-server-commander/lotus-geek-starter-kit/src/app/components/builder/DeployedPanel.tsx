import React, { useEffect } from "react";
import { Zap } from "lucide-react";
import { loadDeployments, deployToProvider, DeploymentProvider } from "../../adapters/deployAdapter";

export function DeployedPanel() {
  const [deployments, setDeployments] = React.useState<Record<DeploymentProvider, boolean>>({
    vercel: false,
    netlify: false,
    cloudflare: false,
    expo: false,
    "app-store": false,
    "play-store": false,
  });
  const [deploying, setDeploying] = React.useState<DeploymentProvider | null>(null);

  useEffect(() => {
    const loadDeps = async () => {
      const response = await loadDeployments();
      if (response.deployments) {
        const statusMap: Record<DeploymentProvider, boolean> = {
          vercel: false,
          netlify: false,
          cloudflare: false,
          expo: false,
          "app-store": false,
          "play-store": false,
        };
        response.deployments.forEach((d) => {
          statusMap[d.provider] = d.status === "connected" || d.status === "deployed";
        });
        setDeployments(statusMap);
      }
    };
    loadDeps();
  }, []);

  const handleDeploy = async (provider: DeploymentProvider) => {
    setDeploying(provider);
    const result = await deployToProvider(provider, "project_current", (msg) => {
      console.log(`Deploy: ${msg}`);
    });
    if (result.success) {
      setDeployments((prev) => ({ ...prev, [provider]: true }));
      alert(`Successfully deployed to ${provider}!\nURL: ${result.url}`);
    } else {
      alert(`Deployment failed: ${result.error}`);
    }
    setDeploying(null);
  };

  const providers: { id: DeploymentProvider; label: string }[] = [
    { id: "vercel", label: "Vercel" },
    { id: "netlify", label: "Netlify" },
    { id: "cloudflare", label: "Cloudflare" },
  ];

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
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => handleDeploy(p.id)}
            disabled={deploying === p.id}
            className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
            style={{
              background: deployments[p.id] ? "rgba(107,203,119,0.2)" : "var(--primary)",
              color: deployments[p.id] ? "#3A8A44" : "var(--primary-foreground)",
              opacity: deploying === p.id ? 0.6 : 1,
            }}
          >
            {deploying === p.id ? "Deploying..." : `${p.label}${deployments[p.id] ? " ✓" : ""}`}
          </button>
        ))}
      </div>
    </div>
  );
}
