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
import { Trash } from "lucide-react";

import {
  LineChart,
  BarChart,
  AreaChart,
  PieChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Bar,
  Area,
  Pie,
  Tooltip,
} from "recharts";
import { DataTable } from "@/components/ui/data-table";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export default function Dashboard() {
  const navigate = useNavigate();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flows, setFlows] = useState<
    {
      flow_uid: string;
      flow_name: string;
      render_in_dashboard?: boolean;
      vis_node_id?: string;
      vis_node_type?: string;
    }[]
  >([]);

  const [dashboardData, setDashboardData] = useState<
    {
      flow_uid: string;
      flow_name: string;
      vis_node_id: string;
      vis_node_type: string;
      data: any;
    }[]
  >([]);

  console.log("dashboardData : ", dashboardData);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch all flows
  const fetchFlows = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/flows`);
      const json = await res.json();

      // Deduplicate flows by flow_uid for flow list
      const uniqueFlowsMap = new Map<string, any>();
      (json.data || []).forEach((flow: any) => {
        if (!uniqueFlowsMap.has(flow.flow_uid)) {
          uniqueFlowsMap.set(flow.flow_uid, {
            flow_uid: flow.flow_uid,
            flow_name: flow.flow_name || "Unnamed Flow",
            vis_node_id: flow.vis_node_id || "",
            vis_node_type: flow.vis_node_type || "",
            render_in_dashboard: flow.render_in_dashboard,
          });
        }
      });
      const mappedFlows = Array.from(uniqueFlowsMap.values());
      setFlows(mappedFlows);

      // Only fetch data for flows with render_in_dashboard
      const dashboardFlows = mappedFlows.filter((f) => f.render_in_dashboard);
      fetchDashboardData(dashboardFlows);
    } catch (err) {
      console.error("Failed to fetch flows:", err);
    }
  };

  const fetchDashboardData = async (flowsToRender: typeof flows) => {
    const results: typeof dashboardData = [];

    for (const flow of flowsToRender) {
      try {
        const res = await fetch(
          `${apiUrl}/api/flows/execute/${flow.flow_uid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
        const json = await res.json();

        // Filter by vis_node_id to get the specific node's output
        (json.data || []).forEach((node: any) => {
          // Only process the node that matches vis_node_id
          if (flow.vis_node_id && node.node_id === flow.vis_node_id) {
            results.push({
              flow_uid: flow.flow_uid,
              flow_name: flow.flow_name,
              vis_node_id: node.node_id,
              vis_node_type: flow.vis_node_type || "data-table",
              data: node.output || [],
            });
          }
        });
      } catch (err) {
        console.error(`Failed to fetch data for flow ${flow.flow_uid}:`, err);
      }
    }

    setDashboardData(results);
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  const handleCreateFlow = () => navigate("/builder");

  const handleDeleteFlow = async (flow_uid: string) => {
    if (!confirm("Are you sure you want to delete this flow?")) return;

    try {
      const res = await fetch(`${apiUrl}/api/flows/${flow_uid}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete flow");

      setFlows((prev) => prev.filter((f) => f.flow_uid !== flow_uid));
      setDashboardData((prev) => prev.filter((d) => d.flow_uid !== flow_uid));
    } catch (err) {
      console.error("Failed to delete flow:", err);
      alert("Failed to delete flow");
    }
  };

  console.log("dashboardData : ", dashboardData);

  return (
    <div className="flex h-full">
      <DashboardSidebar />
      <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-950 overflow-y-auto">
        {/* Dashboard Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          Flow Outputs
          {dashboardData.map((d) => {
            let chartElement: React.ReactElement | null = null;

            const mappedChartData = (() => {
              if (!d.data || !Array.isArray(d.data)) return [];
              const values = d.data.map((row: any) => row.value ?? 0);
              const total = values.reduce((acc, v) => acc + v, 0);

              const mapped = values.map((v: number, i: number) => ({
                name: rowName(d.data[i], i),
                value: total ? (v / total) * 100 : v,
              }));

              return mapped;

              function rowName(row: any, i: number) {
                return row.name ?? `Item ${i + 1}`;
              }
            })();

            switch (d.vis_node_type) {
              case "line-chart":
                chartElement = (
                  <LineChart width={300} height={150} data={mappedChartData}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#9f7aea"
                      strokeWidth={2}
                      dot={{ r: 2 }}
                    />
                  </LineChart>
                );
                break;
              case "bar-chart":
                chartElement = (
                  <BarChart width={300} height={150} data={mappedChartData}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                    <Bar dataKey="value" fill="#9f7aea" />
                  </BarChart>
                );
                break;
              case "area-chart":
                chartElement = (
                  <AreaChart width={300} height={150} data={mappedChartData}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#9f7aea"
                      fill="#e9d5ff"
                    />
                  </AreaChart>
                );
                break;
              case "pie-chart":
                chartElement = (
                  <PieChart width={300} height={150}>
                    <Pie
                      data={mappedChartData}
                      dataKey="value"
                      nameKey="name"
                      fill="#9f7aea"
                      label={(entry) => `${entry.value.toFixed(1)}%`}
                    />
                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                  </PieChart>
                );
                break;
              case "data-table":
                chartElement = <DataTable data={d.data} />;
                break;
              default:
                chartElement = null;
            }

            if (!chartElement) return null;

            return (
              <Card
                key={d.vis_node_id}
                className="p-4 border-violet-100 dark:border-gray-800 hover:shadow-md transition"
              >
                <h2 className="font-medium text-gray-800 dark:text-gray-100 mb-2 text-sm truncate">
                  {d.flow_name}:{d.vis_node_type}
                </h2>

                <ChartContainer
                  config={{ value: { label: "Value (%)", color: "#9f7aea" } }}
                  className="w-full h-48"
                >
                  {chartElement}
                </ChartContainer>
              </Card>
            );
          })}
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

        {/* Flows List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteFlow(flow.flow_uid)}
              >
                <Trash className="h-5 w-5 text-purple-500" />
              </Button>
            </Card>
          ))}

          {/* Create Flow Card */}
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
