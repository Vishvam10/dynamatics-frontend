import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Workflow, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToNewFlow = () => {
    const flowId = crypto.randomUUID();
    navigate(`/builder/${flowId}`);
  };

  const navItems = [
    { name: "Overview", icon: Home, path: "/dashboard" },
    { name: "Flows", icon: Workflow, action: goToNewFlow },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col">
      <div className="text-xl font-bold text-violet-600 dark:text-violet-400 mb-6">
        Dynamatics
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = item.path && location.pathname.startsWith(item.path);
          const Icon = item.icon;

          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "justify-start",
                isActive
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-200"
                  : "text-gray-700 dark:text-gray-300"
              )}
              onClick={() =>
                item.action ? item.action() : navigate(item.path)
              }
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.name}
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto text-xs text-gray-400 dark:text-gray-500 text-center">
        © 2025 Dynamatics
      </div>
    </aside>
  );
}
