export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  framework?: string;
  language?: string;
  status: "draft" | "building" | "ready" | "deployed";
}

export interface ProjectPreview {
  projectId: string;
  html: string;
  css: string;
  js: string;
}

export interface ProjectAdapterConfig {
  backendUrl?: string;
  timeout?: number;
}

export interface ProjectResponse {
  project?: Project;
  error?: string;
}

export interface PreviewResponse {
  preview?: ProjectPreview;
  error?: string;
}

/**
 * Load current project.
 * Returns undefined if no project exists (show demo).
 */
export async function loadProject(
  projectId?: string,
  config?: ProjectAdapterConfig
): Promise<ProjectResponse> {
  if (!projectId || !config?.backendUrl) {
    return {};
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/projects/${projectId}`
    );

    if (response.status === 404) {
      return {}; // No project, use demo preview
    }

    if (!response.ok) {
      return {
        error: `Failed to load project (${response.status})`,
      };
    }

    const project = await response.json();
    return { project };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to load project",
    };
  }
}

/**
 * Create a new project.
 */
export async function createProject(
  name: string,
  description: string,
  config?: ProjectAdapterConfig
): Promise<ProjectResponse> {
  if (!config?.backendUrl) {
    // Mock: create local project
    const project: Project = {
      id: `project_${Date.now()}`,
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "draft",
    };

    try {
      localStorage.setItem(`project_${project.id}`, JSON.stringify(project));
      return { project };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Failed to create project",
      };
    }
  }

  try {
    const response = await fetch(`${config.backendUrl}/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
      return {
        error: `Project creation failed (${response.status})`,
      };
    }

    const project = await response.json();
    return { project };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Project creation failed",
    };
  }
}

/**
 * Get preview HTML/CSS/JS for a project.
 * Falls back to demo preview if no project.
 */
export async function getProjectPreview(
  projectId?: string,
  config?: ProjectAdapterConfig
): Promise<PreviewResponse> {
  // If no project, return demo preview
  if (!projectId || !config?.backendUrl) {
    return {
      preview: {
        projectId: "demo",
        html: `
          <div style="padding: 20px; font-family: system-ui;">
            <h1>Demo App</h1>
            <p>This is the Lotus App Builder preview.</p>
            <p>Wire real projects from Geek Starter Kit to see live preview here.</p>
          </div>
        `,
        css: "body { background: #faf9f7; }",
        js: "",
      },
    };
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/projects/${projectId}/preview`
    );

    if (!response.ok) {
      // Fallback to demo
      return {
        preview: {
          projectId: "demo",
          html: `
            <div style="padding: 20px; font-family: system-ui;">
              <h1>Demo App</h1>
              <p>Failed to load project preview. Showing demo instead.</p>
            </div>
          `,
          css: "body { background: #faf9f7; }",
          js: "",
        },
      };
    }

    const preview = await response.json();
    return { preview };
  } catch (error) {
    console.warn("Failed to load project preview, using demo:", error);
    return {
      preview: {
        projectId: "demo",
        html: `
          <div style="padding: 20px; font-family: system-ui;">
            <h1>Demo App</h1>
            <p>Preview unavailable. Showing demo instead.</p>
          </div>
        `,
        css: "body { background: #faf9f7; }",
        js: "",
      },
    };
  }
}

/**
 * Update project metadata.
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Project>,
  config?: ProjectAdapterConfig
): Promise<ProjectResponse> {
  if (!config?.backendUrl) {
    try {
      const stored = localStorage.getItem(`project_${projectId}`);
      if (!stored) return { error: "Project not found" };

      const project = JSON.parse(stored);
      const updated = {
        ...project,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      localStorage.setItem(`project_${projectId}`, JSON.stringify(updated));
      return { project: updated };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Update failed",
      };
    }
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/projects/${projectId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      }
    );

    if (!response.ok) {
      return {
        error: `Update failed (${response.status})`,
      };
    }

    const project = await response.json();
    return { project };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Update failed",
    };
  }
}

/**
 * Delete a project.
 */
export async function deleteProject(
  projectId: string,
  config?: ProjectAdapterConfig
): Promise<boolean> {
  if (!config?.backendUrl) {
    try {
      localStorage.removeItem(`project_${projectId}`);
      return true;
    } catch {
      return false;
    }
  }

  try {
    const response = await fetch(
      `${config.backendUrl}/api/projects/${projectId}`,
      {
        method: "DELETE",
      }
    );

    return response.ok;
  } catch (error) {
    console.warn("Failed to delete project:", error);
    return false;
  }
}
