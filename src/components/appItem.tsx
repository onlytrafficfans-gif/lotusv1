import { formatDistanceToNow } from "date-fns";
import { Star } from "lucide-react";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppAvatar } from "@/components/AppAvatar";
import type { ListedApp } from "@/ipc/types/app";

type AppItemProps = {
  app: ListedApp;
  handleAppClick: (id: number) => void;
  selectedAppId: number | null;
};

export function AppItem({ app, handleAppClick, selectedAppId }: AppItemProps) {
  return (
    <SidebarMenuItem className="relative mb-1">
      <div className="flex w-[206px] items-center" title={app.name}>
        <Button
          variant="ghost"
          onClick={() => handleAppClick(app.id)}
          className={`flex w-full justify-start gap-2 rounded-xl px-2 py-3 text-left text-[color:var(--lotus-text)] transition-[background-color,box-shadow,color] hover:bg-[color:var(--lotus-panel)] hover:shadow-sm ${
            selectedAppId === app.id
              ? "bg-[color:var(--lotus-panel)] text-[color:var(--lotus-gold-dark)] shadow-sm ring-1 ring-[color:var(--lotus-border)]"
              : ""
          }`}
          data-testid={`app-list-item-${app.name}`}
        >
          <AppAvatar appId={app.id} name={app.name} />
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <div className="flex w-full items-center gap-1">
              <span className="truncate">{app.name}</span>
              {app.isFavorite && (
                <Star
                  size={12}
                  className="flex-shrink-0 fill-[color:var(--lotus-gold)] text-[color:var(--lotus-gold)]"
                />
              )}
            </div>
            <span className="text-xs text-[color:var(--lotus-muted)]">
              {formatDistanceToNow(new Date(app.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </Button>
      </div>
    </SidebarMenuItem>
  );
}
