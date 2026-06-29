import {
  getInitialModels,
  getInitialConnectors,
  getInitialSkills,
  getInitialAgents,
  getInitialCapabilities,
  getInitialFiles,
} from "./adapters/mockData";
import { AppInitialData } from "./types";
import { LotusAppBuilder } from "./components/LotusAppBuilder";

interface AppProps {
  initialData?: AppInitialData;
}

export default function App({ initialData }: AppProps) {
  const data: AppInitialData = {
    models: initialData?.models || getInitialModels(),
    connectors: initialData?.connectors || getInitialConnectors(),
    skills: initialData?.skills || getInitialSkills(),
    agents: initialData?.agents || getInitialAgents(),
    capabilities: initialData?.capabilities || getInitialCapabilities(),
    messages: initialData?.messages || [], // Start with blank chat
    files: initialData?.files || getInitialFiles(),
  };

  return <LotusAppBuilder initialData={data} />;
}
