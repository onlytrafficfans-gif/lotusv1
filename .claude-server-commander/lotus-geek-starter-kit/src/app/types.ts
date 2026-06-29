export type DeviceMode = "phone" | "tablet" | "desktop";
export type BuildView = "preview" | "code" | "deployed";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: Date;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: "file" | "image";
  mime: string;
}

export interface ToggleItem {
  id: string;
  name: string;
  desc: string;
  on: boolean;
}

export interface Connector {
  id: string;
  name: string;
  desc: string;
  connected: boolean;
}

export interface Capability {
  id: string;
  name: string;
  desc: string;
  category: string;
  active: boolean;
}

export type ModelRouter = string;

export interface MockFile {
  name: string;
  lang: string;
  code: string;
}

export interface PlusMenuItem {
  icon: React.ReactNode;
  label: string;
}

export interface AppInitialData {
  models?: ModelRouter[];
  connectors?: Connector[];
  skills?: ToggleItem[];
  agents?: ToggleItem[];
  capabilities?: Capability[];
  messages?: ChatMessage[];
  files?: MockFile[];
  plusMenuItems?: PlusMenuItem[];
}

export interface DeviceConfig {
  width: number;
  height: number;
  bezels: {
    outer: string;
    inner: string;
    shine: string;
    button?: string;
  };
}
