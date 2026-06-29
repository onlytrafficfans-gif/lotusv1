import { useState } from "react";
import { Connector, ToggleItem, Capability } from "../types";

export function useConnectorToggle(initialConnectors: Connector[]) {
  const [connectors, setConnectors] = useState<Connector[]>(initialConnectors);

  const toggle = (id: string) => {
    setConnectors((p) =>
      p.map((c) => (c.id === id ? { ...c, connected: !c.connected } : c))
    );
  };

  return { connectors, toggle };
}

export function useSkillToggle(initialSkills: ToggleItem[]) {
  const [skills, setSkills] = useState<ToggleItem[]>(initialSkills);

  const toggle = (id: string) => {
    setSkills((p) =>
      p.map((s) => (s.id === id ? { ...s, on: !s.on } : s))
    );
  };

  return { skills, toggle };
}

export function useAgentToggle(initialAgents: ToggleItem[]) {
  const [agents, setAgents] = useState<ToggleItem[]>(initialAgents);

  const toggle = (id: string) => {
    setAgents((p) =>
      p.map((a) => (a.id === id ? { ...a, on: !a.on } : a))
    );
  };

  return { agents, toggle };
}

export function useCapabilityToggle(initialCaps: Capability[]) {
  const [capabilities, setCapabilities] = useState<Capability[]>(initialCaps);

  const toggle = (id: string) => {
    setCapabilities((p) =>
      p.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  return { capabilities, toggle };
}
