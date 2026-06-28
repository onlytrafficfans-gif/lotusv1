import { useTranslation } from "react-i18next";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAtom, useSetAtom } from "jotai";
import { Blocks, Link2, Rocket, Sparkles } from "lucide-react";
import { homeChatInputValueAtom } from "../atoms/chatAtoms";
import { ipc } from "@/ipc/types";
import { generateCuteAppName } from "@/lib/utils";
import { useLoadApps } from "@/hooks/useLoadApps";
import { useSettings } from "@/hooks/useSettings";
import { SetupBanner } from "@/components/SetupBanner";
import { isPreviewOpenAtom } from "@/atoms/viewAtoms";
import { useState, useEffect, useCallback, useRef } from "react";
import { useStreamChat } from "@/hooks/useStreamChat";
import { HomeChatInput } from "@/components/chat/HomeChatInput";
import { usePostHog } from "posthog-js/react";
import { PrivacyBanner } from "@/components/TelemetryBanner";
import { INSPIRATION_PROMPTS } from "@/prompts/inspiration_prompts";

import { ImportAppButton } from "@/components/ImportAppButton";
import { showError } from "@/lib/toast";
import { invalidateAppQuery } from "@/hooks/useLoadApp";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { useSelectChat } from "@/hooks/useSelectChat";
import { FeaturedAppShowcase } from "@/components/FeaturedAppShowcase";

import type { FileAttachment } from "@/ipc/types";
import type { ListedApp } from "@/ipc/types/app";
import { NEON_TEMPLATE_IDS } from "@/shared/templates";
import { neonTemplateHook } from "@/client_logic/template_hook";
import { ProBanner } from "@/components/ProBanner";
import { hasDyadProKey, getEffectiveDefaultChatMode } from "@/lib/schemas";
import { useFreeAgentQuota } from "@/hooks/useFreeAgentQuota";
import { useInitialChatMode } from "@/hooks/useInitialChatMode";
// @ts-ignore
import lotusMark from "../../assets/lotus-logo.png";

// Adding an export for attachments
export interface HomeSubmitOptions {
  attachments?: FileAttachment[];
  selectedApp?: ListedApp;
}

const LOTUS_STARTER_LABELS = [
  "Recipe Finder & Meal Planner",
  "Mood Journal & Tracker",
  "Sign Up Form",
];

const getLotusStarterPrompts = () =>
  LOTUS_STARTER_LABELS.map((label) => {
    return (
      INSPIRATION_PROMPTS.find((item) => item.label === label) ?? {
        icon: <Sparkles className="h-5 w-5" />,
        label,
      }
    );
  });

export default function HomePage() {
  const { t } = useTranslation("home");
  const [inputValue, setInputValue] = useAtom(homeChatInputValueAtom);
  const navigate = useNavigate();
  const search = useSearch({ from: "/" });
  const { refreshApps } = useLoadApps();
  const { settings, updateSettings, envVars } = useSettings();
  const { isQuotaExceeded, isLoading: isQuotaLoading } = useFreeAgentQuota();
  const initialChatMode = useInitialChatMode();

  const setIsPreviewOpen = useSetAtom(isPreviewOpenAtom);
  const { selectChat } = useSelectChat();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState<"new" | "existing">("new");
  const { streamMessage } = useStreamChat({ hasChatId: false });
  const posthog = usePostHog();
  const queryClient = useQueryClient();

  // Get the appId from search params
  const appId = search.appId ? Number(search.appId) : null;

  // State for random prompts
  const [randomPrompts, setRandomPrompts] = useState<
    typeof INSPIRATION_PROMPTS
  >([]);

  // Function to get random prompts
  const getRandomPrompts = useCallback(() => {
    const shuffled = [...INSPIRATION_PROMPTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  // Initialize random prompts
  useEffect(() => {
    setRandomPrompts(getLotusStarterPrompts());
  }, [getRandomPrompts]);

  // Redirect to app details page if appId is present. Use `replace` so the
  // intermediate `/?appId=…` entry doesn't sit in history and trap the back
  // button on app-details in a redirect loop.
  useEffect(() => {
    if (appId) {
      navigate({ to: "/app-details", search: { appId }, replace: true });
    }
  }, [appId, navigate]);

  // Apply default chat mode when navigating to home page
  // Wait for quota status to load to avoid race condition where we default to Basic Agent
  // before knowing if quota is actually exceeded
  const hasAppliedDefaultChatMode = useRef(false);
  useEffect(() => {
    if (settings && !hasAppliedDefaultChatMode.current && !isQuotaLoading) {
      hasAppliedDefaultChatMode.current = true;
      const effectiveDefaultMode = getEffectiveDefaultChatMode(
        settings,
        envVars,
        !isQuotaExceeded,
      );
      if (settings.selectedChatMode !== effectiveDefaultMode) {
        updateSettings({ selectedChatMode: effectiveDefaultMode });
      }
    }
  }, [settings, updateSettings, isQuotaExceeded, isQuotaLoading, envVars]);

  const handleSubmit = async (options?: HomeSubmitOptions) => {
    const attachments = options?.attachments || [];
    const selectedApp = options?.selectedApp;

    if (!inputValue.trim() && attachments.length === 0) return;

    try {
      setLoadingMode(selectedApp ? "existing" : "new");
      setIsLoading(true);

      let chatId: number;
      let appId: number;
      if (selectedApp) {
        // Existing app flow: create a new chat in the selected app
        chatId = await ipc.chat.createChat({
          appId: selectedApp.id,
          initialChatMode,
        });
        appId = selectedApp.id;
      } else {
        // New app flow (default behavior)
        const result = await ipc.app.createApp({
          name: generateCuteAppName(),
          initialChatMode,
        });
        chatId = result.chatId;
        appId = result.app.id;

        if (
          settings?.selectedTemplateId &&
          NEON_TEMPLATE_IDS.has(settings.selectedTemplateId)
        ) {
          await neonTemplateHook({
            appId: result.app.id,
            appName: result.app.name,
          });
        }

        // Apply selected theme to the new app (if one is set)
        if (settings?.selectedThemeId) {
          await ipc.template.setAppTheme({
            appId: result.app.id,
            themeId: settings.selectedThemeId || null,
          });
        }
      }

      // Stream the message with attachments
      streamMessage({
        prompt: inputValue,
        chatId,
        appId,
        attachments,
        requestedChatMode: initialChatMode,
      });
      await new Promise((resolve) =>
        setTimeout(resolve, settings?.isTestMode ? 0 : 2000),
      );

      setInputValue("");
      setIsPreviewOpen(false);
      await refreshApps();
      await invalidateAppQuery(queryClient, { appId });
      // Invalidate chats so ChatTabs picks up the new chat immediately.
      await queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      posthog.capture("home:chat-submit", { existingApp: !!selectedApp });
      // Select newly created first chat so it appears first in tabs.
      selectChat({ chatId, appId });
    } catch (error) {
      console.error("Failed to create chat:", error);
      showError(
        t(selectedApp ? "failedCreateChat" : "failedCreateApp", {
          error: (error as any).toString(),
        }),
      );
      setIsLoading(false);
    }
  };

  // Loading overlay for app creation
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center max-w-3xl m-auto p-8">
        <div className="w-full flex flex-col items-center">
          {/* Loading Spinner */}
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-t-primary rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
            {loadingMode === "existing" ? t("startingChat") : t("buildingApp")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
            {loadingMode === "existing" ? (
              t("creatingNewChat")
            ) : (
              <>
                {t("settingUp")} <br />
                {t("mightTakeMoment")}
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  // Main Home Page Content
  return (
    <div className="flex min-h-full w-full flex-col bg-[color:var(--lotus-bg)]">
      <div className="flex w-full justify-end px-6 pt-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/library" })}
            className="flex h-10 items-center gap-2 rounded-xl border border-[color:var(--lotus-border)] bg-[color:var(--lotus-panel)] px-4 text-sm font-medium text-[color:var(--lotus-text)] shadow-sm transition-colors hover:border-[color:var(--lotus-gold)] hover:text-[color:var(--lotus-gold-dark)]"
          >
            <Blocks className="h-4 w-4" />
            Components
          </button>
          <button
            type="button"
            onClick={() =>
              setInputValue("Help me plan integrations for this app.")
            }
            className="flex h-10 items-center gap-2 rounded-xl border border-[color:var(--lotus-border)] bg-[color:var(--lotus-panel)] px-4 text-sm font-medium text-[color:var(--lotus-text)] shadow-sm transition-colors hover:border-[color:var(--lotus-gold)] hover:text-[color:var(--lotus-gold-dark)]"
          >
            <Link2 className="h-4 w-4" />
            Integrations
          </button>
          <button
            type="button"
            onClick={() =>
              setInputValue("Help me prepare this app for publishing.")
            }
            className="flex h-10 items-center gap-2 rounded-xl bg-[color:var(--lotus-gold)] px-4 text-sm font-semibold text-[color:var(--lotus-panel)] shadow-sm transition-colors hover:bg-[color:var(--lotus-gold-dark)]"
          >
            <Rocket className="h-4 w-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-8 pb-10 pt-4">
        <div className="w-full max-w-3xl">
          <div className="mx-auto mb-7 flex max-w-xl flex-col items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-[color:var(--lotus-border)] bg-[color:var(--lotus-panel)] shadow-[0_18px_50px_rgba(93,64,38,0.08)]">
              <img
                src={lotusMark}
                alt="Lotus"
                className="h-14 w-14 object-contain"
              />
            </div>
            <h1 className="text-5xl font-semibold tracking-normal text-[color:var(--lotus-text)]">
              Build a new app
            </h1>
            <p className="mt-3 text-base text-[color:var(--lotus-muted)]">
              Describe what you want Lotus to create
            </p>
          </div>

          <SetupBanner />

          <div className="rounded-[2rem] border border-[color:var(--lotus-border)] bg-[color:var(--lotus-panel)]/70 p-4 shadow-[0_24px_80px_rgba(93,64,38,0.07)]">
            <div className="mb-2 flex items-center justify-center">
              <ImportAppButton className="px-0 pb-0 flex-none" />
            </div>
            <HomeChatInput onSubmit={handleSubmit} />

            <div className="flex flex-col gap-4 px-2 pb-2">
              <div className="flex flex-wrap justify-center gap-3">
                {randomPrompts.map((item, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() =>
                      setInputValue(t("buildMeA", { label: item.label }))
                    }
                    className="flex items-center gap-2 rounded-full border border-[color:var(--lotus-border)] bg-[color:var(--lotus-panel)] px-4 py-2 text-sm font-medium text-[color:var(--lotus-text)] shadow-sm transition-all duration-200 hover:border-[color:var(--lotus-gold)] hover:bg-white hover:text-[color:var(--lotus-gold-dark)] active:scale-[0.98]"
                  >
                    <span className="text-[color:var(--lotus-gold-dark)]">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setRandomPrompts(getRandomPrompts())}
                  className="flex items-center gap-2 rounded-full border border-[color:var(--lotus-border)] bg-[color:var(--lotus-panel)] px-4 py-2 text-sm font-medium text-[color:var(--lotus-muted)] shadow-sm transition-all duration-200 hover:border-[color:var(--lotus-gold)] hover:bg-white hover:text-[color:var(--lotus-gold-dark)] active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{t("moreIdeas")}</span>
                </button>
              </div>
            </div>
            <ProBanner />
          </div>
          <PrivacyBanner />
        </div>
      </div>
      <FeaturedAppShowcase />
    </div>
  );
}
