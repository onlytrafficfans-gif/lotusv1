import { useState } from "react";
import { AnimatePresence } from "motion/react";
import SignScreen from "./screens/SignScreen";
import CustomWorkflow from "./screens/CustomWorkflow";
import AfterScreen from "./screens/AfterScreen";

type AppScreen = "sign" | "workflow" | "after";

export default function AppOrchestrator() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("sign");

  return (
    <div className="size-full overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === "sign" && (
          <SignScreen onContinue={() => setCurrentScreen("workflow")} />
        )}
        {currentScreen === "workflow" && (
          <CustomWorkflow onComplete={() => setCurrentScreen("after")} />
        )}
        {currentScreen === "after" && (
          <AfterScreen onNewProject={() => setCurrentScreen("sign")} />
        )}
      </AnimatePresence>
    </div>
  );
}
