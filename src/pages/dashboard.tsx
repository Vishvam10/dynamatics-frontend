import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function Dashboard() {
  const navigate = useNavigate();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flows, setFlows] = useState<{ flow_uid: string; flow_name: string }[]>(
    []
  );

  const createFlowId = () => crypto.randomUUID();

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

  return (
    <div className="flex h-full">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        {/* Analytics Dashboard */}
        <div className="mb-8">
          <AnalyticsDashboard />
        </div>

        {/* Header */}
        <div className="mb-6 mt-12">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Your Flows
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create, manage, and open your saved flows.
          </p>
        </div>

        {/* Flows Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {flows.map((flow) => (
            <Card
              key={flow.flow_uid}
              className="p-4 flex flex-col items-center justify-center text-center border-violet-100 dark:border-gray-800 hover:shadow-md hover:border-violet-400 transition cursor-pointer"
              onClick={() => navigate(`/builder/${flow.flow_uid}`)}
            >
              <div className="h-12 w-12 rounded-lg bg-violet-500 flex items-center justify-center text-white text-lg font-bold mb-2">
                {flow.flow_name?.[0] || "F"}
              </div>
              <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                {flow.flow_name}
              </p>
            </Card>
          ))}

          {/* Create Flow */}
          <Card className="border-dashed border-2 border-violet-300 dark:border-violet-700 flex flex-col items-center justify-center py-6 text-center hover:border-violet-500 transition">
            <div className="text-3xl text-violet-600 mb-1">+</div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">
              Create a New Flow
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-violet-600 text-white hover:bg-violet-700"
                >
                  New
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/builder/${createFlowId()}`)}
            >
              Use Existing
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
