import { useEffect, useState } from "react";
import { ipc } from "@/ipc/types";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { DEMO_MODE } from "@/lib/demo";

interface OpenRouterBalance {
  creditsRemaining: number | null;
  monthlyUsage: number | null;
  monthlyLimit: number | null;
  lastUpdated: number;
}

export const OpenRouterBalance = () => {
  const [balance, setBalance] = useState<OpenRouterBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBalance();
    const interval = setInterval(
      loadBalance,
      DEMO_MODE ? 30_000 : 5 * 60 * 1000,
    );
    return () => clearInterval(interval);
  }, []);

  const loadBalance = async () => {
    try {
      const result = await ipc.misc.getOpenRouterBalance();
      setBalance(result);
      setError(null);
    } catch (err) {
      // Silently fail - OpenRouter key may not be configured
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const result = await ipc.misc.refreshOpenRouterBalance();
      setBalance(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  if (!balance || balance.creditsRemaining === null) {
    return null;
  }

  const creditsRemaining = balance.creditsRemaining;
  const monthlyUsage = balance.monthlyUsage ?? 0;
  const monthlyLimit = balance.monthlyLimit ?? 0;

  // Determine color based on balance
  let colorClass = "text-green-600 dark:text-green-400"; // Good
  if (creditsRemaining < 1.0) {
    colorClass = "text-red-600 dark:text-red-400"; // Critical
  } else if (creditsRemaining < 5.0) {
    colorClass = "text-yellow-600 dark:text-yellow-400"; // Low
  }

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className={`no-app-region-drag h-7 px-2.5 gap-1.5 flex items-center rounded-lg text-xs font-medium ${colorClass} hover:bg-[color:var(--lotus-panel)] transition-colors`}
            onClick={handleRefresh}
            disabled={loading}
          >
            <span>💳</span>
            <span>{formatCurrency(creditsRemaining)}</span>
            <RotateCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          </Button>
        }
      />
      <TooltipContent className="text-xs">
        <div className="space-y-1">
          <div>
            <strong>OpenRouter Balance</strong>
          </div>
          <div>Available: {formatCurrency(creditsRemaining)}</div>
          {monthlyLimit > 0 && (
            <>
              <div>
                Monthly: {formatCurrency(monthlyUsage)} /{" "}
                {formatCurrency(monthlyLimit)}
              </div>
              <div className="w-32 h-1 bg-gray-300 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${Math.min((monthlyUsage / monthlyLimit) * 100, 100)}%`,
                  }}
                />
              </div>
            </>
          )}
          <div className="text-xs text-gray-400 mt-2">Click to refresh</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
