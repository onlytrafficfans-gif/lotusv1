import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ipc } from "@/ipc/types";
import { useSettings } from "@/hooks/useSettings";
import { CommunityCodeConsentDialog } from "./CommunityCodeConsentDialog";
import type { Template } from "@/shared/templates";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { showWarning } from "@/lib/toast";

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
  onCreateApp: () => void;
}

function formatLotusTemplateText(value: string) {
  return value.replace(/\bDyad\b/g, "Lotus").replace(/\bdyad\b/g, "lotus");
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onCreateApp,
}) => {
  const { settings, updateSettings } = useSettings();
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const displayTitle = formatLotusTemplateText(template.title);
  const displayDescription = formatLotusTemplateText(template.description);

  const handleCardClick = () => {
    // If it's a community template and user hasn't accepted community code yet, show dialog
    if (!template.isOfficial && !settings?.acceptedCommunityCode) {
      setShowConsentDialog(true);
      return;
    }

    if (template.requiresNeon && !settings?.neon?.accessToken) {
      showWarning("Please connect your Neon account to use this template.");
      return;
    }

    // Otherwise, proceed with selection
    onSelect(template.id);
  };

  const handleConsentAccept = () => {
    // Update settings to accept community code
    updateSettings({ acceptedCommunityCode: true });

    // Select the template
    onSelect(template.id);

    // Close dialog
    setShowConsentDialog(false);
  };

  const handleConsentCancel = () => {
    // Just close dialog, don't update settings or select template
    setShowConsentDialog(false);
  };

  const handleGithubClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (template.githubUrl) {
      ipc.system.openExternalUrl(template.githubUrl);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`
          overflow-hidden rounded-2xl border border-[color:var(--lotus-border)] bg-[color:var(--lotus-panel)] shadow-sm
          transform transition-all duration-300 ease-in-out 
          cursor-pointer group relative
          ${
            isSelected
              ? "ring-2 ring-[color:var(--lotus-gold)] shadow-xl"
              : "hover:shadow-lg hover:-translate-y-1"
          }
        `}
      >
        <div className="relative">
          <img
            src={template.imageUrl}
            alt={displayTitle}
            className={`w-full h-52 object-cover transition-opacity duration-300 group-hover:opacity-80 ${
              isSelected ? "opacity-75" : ""
            }`}
          />
          {isSelected && (
            <span className="absolute top-3 right-3 rounded-md bg-[color:var(--lotus-gold)] px-3 py-1.5 text-xs font-bold text-[color:var(--lotus-panel)] shadow-lg">
              Selected
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-center mb-1.5">
            <h2
              className={`text-lg font-semibold ${
                isSelected
                  ? "text-[color:var(--lotus-gold-dark)]"
                  : "text-[color:var(--lotus-text)]"
              }`}
            >
              {displayTitle}
            </h2>
            {template.isOfficial && !template.isExperimental && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-[color:var(--lotus-blush)] text-[color:var(--lotus-gold-dark)]"
                    : "bg-[color:var(--lotus-blush)]/60 text-[color:var(--lotus-gold-dark)]"
                }`}
              >
                Lotus
              </span>
            )}
            {template.isExperimental && (
              <span className="rounded-full bg-[color:var(--lotus-gold)]/15 px-2 py-0.5 text-xs font-semibold text-[color:var(--lotus-gold-dark)]">
                Experimental
              </span>
            )}
          </div>
          <p className="mb-3 h-10 overflow-y-auto text-sm text-[color:var(--lotus-muted)]">
            {displayDescription}
          </p>
          {template.githubUrl && (
            <a
              className={`inline-flex items-center text-sm font-medium transition-colors duration-200 ${
                isSelected
                  ? "text-[color:var(--lotus-gold-dark)] hover:text-[color:var(--lotus-text)]"
                  : "text-[color:var(--lotus-gold-dark)] hover:text-[color:var(--lotus-text)]"
              }`}
              onClick={handleGithubClick}
            >
              View on GitHub{" "}
              <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
            </a>
          )}

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onCreateApp();
            }}
            size="sm"
            className={cn(
              "mt-2 w-full bg-[color:var(--lotus-gold)] font-semibold text-[color:var(--lotus-panel)] hover:bg-[color:var(--lotus-gold-dark)]",
              settings?.selectedTemplateId !== template.id && "invisible",
            )}
          >
            Create App
          </Button>
        </div>
      </div>

      <CommunityCodeConsentDialog
        isOpen={showConsentDialog}
        onAccept={handleConsentAccept}
        onCancel={handleConsentCancel}
      />
    </>
  );
};
