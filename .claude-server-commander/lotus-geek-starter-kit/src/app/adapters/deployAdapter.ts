export type DeploymentProvider =
  | "vercel"
  | "netlify"
  | "cloudflare"
  | "expo"
  | "app-store"
  | "play-store";

export type DeploymentStatus =
  | "not_connected"
  | "connected"
  | "deploying"
  | "deployed"
  | "failed";

export interface Deployment {
  provider: DeploymentProvider;
  status: DeploymentStatus;
  url?: string;
  lastDeployed?: string;
  error?: string;
}

export interface DeployAdapterConfig {
  backendUrl?: string;
  timeout?: number;
}

export interface DeployResponse {
  deployments: Deployment[];
  error?: string;
}

// Mock deployments
const MOCK_DEPLOYMENTS: Deployment[] = [
  {
    provider: "vercel",
    status: "not_connected",
  },
  {
    provider: "netlify",
    status: "not_connected",
  },
  {
    provider: "cloudflare",
    status: "not_connected",
  },
  {
    provider: "expo",
    status: "not_connected",
  },
  {
    provider: "app-store",
    status: "not_connected",
  },
  {
    provider: "play-store",
    status: "not_connected",
  },
];

/**
 * Load deployment status for all providers.
 */
export async function loadDeployments(
  projectId?: string,
  config?: DeployAdapterConfig
): Promise<DeployResponse> {
  if (!config?.backendUrl) {
    return {
      deployments: MOCK_DEPLOYMENTS,
    };
  }

  try {
    const url = new URL(`${config.backendUrl}/api/deployments`);
    if (projectId) {
      url.searchParams.append("projectId", projectId);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.warn(
        `Failed to load deployments (${response.status}), using mock`
      );
      return {
        deployments: MOCK_DEPLOYMENTS,
        error: `Backend returned ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      deployments: Array.isArray(data.deployments)
        ? data.deployments
        : MOCK_DEPLOYMENTS,
    };
  } catch (error) {
    console.warn("Failed to load deployments, using mock:", error);
    return {
      deployments: MOCK_DEPLOYMENTS,
      error: error instanceof Error ? error.message : "Failed to load deployments",
    };
  }
}

/**
 * Connect a deployment provider (e.g., link Vercel account).
 */
export async function connectDeploymentProvider(
  provider: DeploymentProvider,
  config?: DeployAdapterConfig
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!config?.backendUrl) {
    return {
      success: false,
      error: `${provider} connection requires backend setup`,
    };
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/deployments/${provider}/connect`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Connection failed (${response.status})`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      url: data.authUrl, // URL to OAuth flow if needed
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

/**
 * Deploy to a specific provider.
 */
export async function deployToProvider(
  provider: DeploymentProvider,
  projectId: string,
  onProgress?: (message: string) => void,
  config?: DeployAdapterConfig
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!config?.backendUrl) {
    return {
      success: false,
      error: `${provider} deployment requires backend connection`,
    };
  }

  try {
    onProgress?.(`Starting ${provider} deployment...`);

    const response = await fetch(
      `${config.backendUrl}/api/deployments/${provider}/deploy`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Deployment failed (${response.status})`,
      };
    }

    const data = await response.json();
    onProgress?.(`Deployment successful!`);

    return {
      success: true,
      url: data.url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Deployment failed",
    };
  }
}

/**
 * Prepare for App Store or Play Store submission.
 */
export async function prepareAppStoreSubmission(
  provider: "app-store" | "play-store",
  projectId: string,
  config?: DeployAdapterConfig
): Promise<{
  success: boolean;
  checklist?: Record<string, boolean>;
  error?: string;
}> {
  if (!config?.backendUrl) {
    // Mock checklist
    return {
      success: true,
      checklist: {
        "App name set": true,
        "Description written": true,
        "Icons created": false,
        "Screenshots ready": false,
        "Privacy policy": false,
        "Build signed": false,
      },
    };
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/deployments/${provider}/prepare`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Preparation failed (${response.status})`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      checklist: data.checklist,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Preparation failed",
    };
  }
}

/**
 * Disconnect a deployment provider.
 */
export async function disconnectDeploymentProvider(
  provider: DeploymentProvider,
  config?: DeployAdapterConfig
): Promise<boolean> {
  if (!config?.backendUrl) {
    return false;
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/deployments/${provider}/disconnect`,
      {
        method: "POST",
      }
    );

    return response.ok;
  } catch (error) {
    console.warn(`Failed to disconnect ${provider}:`, error);
    return false;
  }
}
