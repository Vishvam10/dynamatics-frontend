import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AnalyticsDashboard } from "@/components/analytics-dashboard";
import { Trash } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flows, setFlows] = useState<{ flow_uid: string; flow_name: string }[]>(
    []
  );

  // Fetch all flows
  const fetchFlows = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/flows`);
      const json = await res.json();
      const mappedFlows = (json.data || []).map((flow: any) => ({
        flow_uid: flow.flow_uid,
        flow_name: flow.flow_name || "Unnamed Flow",
      }));
      setFlows(mappedFlows);
    } catch (err) {
      console.error("Failed to fetch flows:", err);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const handleCreateFlow = () => navigate("/builder");

  const handleDeleteFlow = async (flow_uid: string) => {
    if (!confirm("Are you sure you want to delete this flow?")) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/flows/${flow_uid}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete flow");

      // Remove from UI
      setFlows((prev) => prev.filter((f) => f.flow_uid !== flow_uid));
    } catch (err) {
      console.error("Failed to delete flow:", err);
      alert("Failed to delete flow");
    }
  };

  return (
    <div className="flex h-full">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        {/* Analytics Dashboard */}
        <div className="mb-12">
          <AnalyticsDashboard />
        </div>

        {/* Header */}
        <div className="mt-2 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Your Flows
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create, manage, and open your saved flows.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Existing flows */}
          {flows.map((flow) => (
            <Card
              key={flow.flow_uid}
              className="flex flex-row items-center justify-between p-4 border-violet-100 dark:border-gray-800 hover:shadow-md hover:border-violet-400 transition cursor-pointer"
            >
              <div
                className="flex items-center gap-3 flex-1"
                onClick={() => navigate(`/builder/${flow.flow_uid}`)}
              >
                <div className="h-12 w-12 rounded-lg bg-violet-500 flex items-center justify-center text-white text-lg font-bold shrink-0">
                  {flow.flow_name?.[0] || "F"}
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                  {flow.flow_name}
                </p>
              </div>

              {/* Trash icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteFlow(flow.flow_uid)}
              >
                <Trash className="h-5 w-5 text-purple-500" />
              </Button>
            </Card>
          ))}

          {/* Create Flow card */}
          <Card className="flex flex-row items-center gap-3 text-left p-4 border-dashed border-2 border-violet-300 dark:border-violet-700 hover:border-violet-500 transition cursor-pointer">
            <div className="flex flex-1 flex-col gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-violet-600 text-white hover:bg-violet-700 w-full"
                  >
                    + New Flow
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Name Your Flow</DialogTitle>
                  </DialogHeader>
                  <Input
                    placeholder="Enter flow name..."
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    className="mt-3"
                  />
                  <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-violet-600 text-white hover:bg-violet-700"
                      onClick={() => {
                        setDialogOpen(false);
                        handleCreateFlow();
                      }}
                      disabled={!flowName.trim()}
                    >
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
