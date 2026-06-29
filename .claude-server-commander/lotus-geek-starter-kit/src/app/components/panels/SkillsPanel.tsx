import { ToggleItem } from "../../types";
import { Modal } from "./Modal";

interface SkillsPanelProps {
  skills: ToggleItem[];
  onToggle: (id: string) => void;
  onClose: () => void;
}

export function SkillsPanel({
  skills,
  onToggle,
  onClose,
}: SkillsPanelProps) {
  return (
    <Modal title="Skills" onClose={onClose}>
      <div className="p-4 flex flex-col gap-2">
        {skills.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: "var(--background)" }}
          >
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--foreground)",
                }}
              >
                {s.name}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--muted-foreground)",
                  marginTop: 1,
                }}
              >
                {s.desc}
              </p>
            </div>
            <button
              onClick={() => onToggle(s.id)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
              style={{
                background: s.on ? "var(--accent)" : "var(--muted)",
                color: s.on
                  ? "var(--accent-foreground)"
                  : "var(--muted-foreground)",
              }}
            >
              {s.on ? "On" : "Off"}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
