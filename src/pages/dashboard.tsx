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
import { TrendingUp, Database, BarChart3, Share2 } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flows, setFlows] = useState<{ flow_uid: string; flow_name: string }[]>(
    []
  );

  const createFlowId = () => crypto.randomUUID();

  const fetchFlows = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/flows`);
      const json = await res.json();
      console.log(json);

      const mappedFlows = (json.data || []).map((flow: any) => ({
        flow_uid: flow.flow_uid,
        flow_name: flow.flow_name || flow.name,
      }));

      setFlows(mappedFlows);
    } catch (err) {
      console.error("Failed to fetch flows:", err);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const handleCreateFlow = async () => {
    navigate("/builder");
  };

  const analyticsData = [
    {
      title: "Active Flows",
      value: flows.length,
      change: "+8%",
      icon: TrendingUp,
    },
    { title: "Data Sources", value: 6, change: "+2%", icon: Database },
    { title: "Exports", value: 4, change: "Stable", icon: Share2 },
    { title: "Visualizations", value: 9, change: "+3%", icon: BarChart3 },
  ];

  return (
    <div className="flex h-full">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track, analyze, and visualize your saved flows.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {analyticsData.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card
                key={i}
                className="bg-white dark:bg-gray-900 border-violet-100 dark:border-gray-800"
              >
                <CardHeader className="flex justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-violet-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {item.value}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.change} this week
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Your Flows
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {flows.map((flow) => (
              <Card
                key={flow.flow_uid}
                className="p-3 flex flex-col items-center justify-center text-center border-violet-100 dark:border-gray-800 hover:shadow-md hover:border-violet-400 transition cursor-pointer"
                onClick={() => navigate(`/builder/${flow.flow_uid}`)}
              >
                <div className="h-12 w-12 rounded-lg bg-violet-500 flex items-center justify-center text-white text-lg font-bold mb-2">
                  {flow.flow_name?.[0] || "F"}
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
                  {flow.flow_name || "Unnamed Flow"}
                </p>
              </Card>
            ))}

            {/* Create Flow */}
            <Card className="border-dashed border-2 border-violet-300 dark:border-violet-700 flex flex-col items-center justify-center py-6 text-center hover:border-violet-500 transition">
              <div className="text-3xl text-violet-600 mb-1">+</div>
              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mb-2">
                Create or Import Flow
              </p>
              <div className="flex gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size={"sm"}
                      className="bg-violet-600 text-white hover:bg-violet-700"
                    >
                      New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
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
                  size={"sm"}
                  onClick={() => navigate(`/builder/${createFlowId()}`)}
                >
                  Use Existing
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
