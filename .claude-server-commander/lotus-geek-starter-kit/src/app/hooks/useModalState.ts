import { useState } from "react";

export function useModalState() {
  const [showPlus, setShowPlus] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [showConnector, setShowConnector] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const [showFunctions, setShowFunctions] = useState(false);
  const [showViewApp, setShowViewApp] = useState(false);

  const closeAll = () => {
    setShowPlus(false);
    setShowModel(false);
  };

  return {
    showPlus,
    setShowPlus,
    showModel,
    setShowModel,
    showConnector,
    setShowConnector,
    showSkills,
    setShowSkills,
    showAgents,
    setShowAgents,
    showFunctions,
    setShowFunctions,
    showViewApp,
    setShowViewApp,
    closeAll,
  };
}
