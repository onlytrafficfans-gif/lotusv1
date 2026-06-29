import { UploadedFile } from "../types";

export interface FileAdapterConfig {
  backendUrl?: string;
  timeout?: number;
  maxFileSize?: number; // bytes
}

export interface FileUploadResponse {
  success: boolean;
  fileId?: string;
  url?: string;
  error?: string;
}

export interface FileListResponse {
  files: UploadedFile[];
  error?: string;
}

// Mock files for fallback
const MOCK_FILES: UploadedFile[] = [
  {
    id: "file_demo_1",
    name: "app-logo.png",
    type: "image",
    mime: "image/png",
  },
  {
    id: "file_demo_2",
    name: "data.json",
    type: "file",
    mime: "application/json",
  },
];

/**
 * Upload a file to the backend.
 * Falls back to local storage if backend unavailable.
 */
export async function uploadFile(
  file: File,
  config?: FileAdapterConfig
): Promise<FileUploadResponse> {
  // Validate file size
  if (config?.maxFileSize && file.size > config.maxFileSize) {
    return {
      success: false,
      error: `File exceeds maximum size of ${config.maxFileSize} bytes`,
    };
  }

  if (!config?.backendUrl) {
    // Mock: store in localStorage
    try {
      const fileId = `file_local_${Date.now()}`;
      const fileType = file.type.startsWith("image") ? "image" : "file";
      const fileData = {
        id: fileId,
        name: file.name,
        type: fileType,
        mime: file.type,
      };

      localStorage.setItem(`file_${fileId}`, JSON.stringify(fileData));
      return {
        success: true,
        fileId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Storage failed",
      };
    }
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      config.timeout || 30000
    );

    const response = await fetch(`${config.backendUrl}/api/files/upload`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: `Upload failed (${response.status})`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      fileId: data.fileId,
      url: data.url,
    };
  } catch (error) {
    console.warn("Failed to upload file, using fallback:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * List all uploaded files for the current project.
 */
export async function listFiles(
  projectId?: string,
  config?: FileAdapterConfig
): Promise<FileListResponse> {
  if (!config?.backendUrl) {
    return {
      files: MOCK_FILES,
    };
  }

  try {
    const url = new URL(`${config.backendUrl}/api/files`);
    if (projectId) {
      url.searchParams.append("projectId", projectId);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      console.warn(`Failed to list files (${response.status}), using mock`);
      return {
        files: MOCK_FILES,
        error: `Backend returned ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      files: Array.isArray(data.files) ? data.files : MOCK_FILES,
    };
  } catch (error) {
    console.warn("Failed to list files, using mock:", error);
    return {
      files: MOCK_FILES,
      error: error instanceof Error ? error.message : "Failed to list files",
    };
  }
}

/**
 * Delete a file.
 */
export async function deleteFile(
  fileId: string,
  config?: FileAdapterConfig
): Promise<boolean> {
  if (!config?.backendUrl) {
    try {
      localStorage.removeItem(`file_${fileId}`);
      return true;
    } catch {
      return false;
    }
  }

  try {
    const response = await fetch(`${config.backendUrl}/api/files/${fileId}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.warn(`Failed to delete file ${fileId}:`, error);
    return false;
  }
}

/**
 * Import files from a GitHub repository.
 */
export async function importGitHubRepo(
  repoUrl: string,
  branch?: string,
  config?: FileAdapterConfig
): Promise<FileUploadResponse> {
  if (!config?.backendUrl) {
    return {
      success: false,
      error: "GitHub import requires backend connection",
    };
  }

  try {
    const response = await fetch(`${config.backendUrl}/api/files/import-github`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl, branch }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Import failed (${response.status})`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      fileId: data.projectId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Import failed",
    };
  }
}
