import { useState } from "react";
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

// Import your chart primitives (from ShadCN or your wrapper)
import {
  PieChart,
  LineChart,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  Bar,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { type ColumnDef } from "@tanstack/react-table";

// Dummy chart data (saved visualizations)
const lineData = [
  { day: "Mon", value: 400 },
  { day: "Tue", value: 300 },
  { day: "Wed", value: 500 },
  { day: "Thu", value: 200 },
  { day: "Fri", value: 450 },
];

const barData = [
  { category: "Q1", users: 1200 },
  { category: "Q2", users: 1800 },
  { category: "Q3", users: 800 },
  { category: "Q4", users: 1600 },
];

const pieData = [
  { name: "Marketing", value: 400 },
  { name: "Sales", value: 300 },
  { name: "Operations", value: 200 },
  { name: "Support", value: 100 },
];

const COLORS = ["#7c3aed", "#a78bfa", "#c4b5fd", "#ddd6fe"];

// Dummy table data (dashboard results)
const tableData = [
  { metric: "Leads Captured", value: 1240, change: "+12%" },
  { metric: "Conversion Rate", value: "5.4%", change: "+0.8%" },
  { metric: "Active Users", value: 8320, change: "+6%" },
  { metric: "Revenue", value: "$32,100", change: "+3%" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState("");

  const createFlowId = () => crypto.randomUUID();

  const handleCreateFlow = () => {
    const id = createFlowId();
    localStorage.setItem(`flow-meta-${id}`, JSON.stringify({ name: flowName }));
    navigate(`/builder/${id}`);
  };

  const analyticsData = [
    { title: "Active Flows", value: 12, change: "+8%", icon: TrendingUp },
    { title: "Data Sources", value: 6, change: "+2%", icon: Database },
    { title: "Exports", value: 4, change: "Stable", icon: Share2 },
    { title: "Visualizations", value: 9, change: "+3%", icon: BarChart3 },
  ];

  const flows = [
    { id: "flow-1", name: "Marketing Analytics", lastEdited: "2d ago" },
    { id: "flow-2", name: "Sales Dashboard", lastEdited: "5h ago" },
    { id: "flow-3", name: "Weather Data Flow", lastEdited: "1w ago" },
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#7c3aed"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Users</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#7c3aed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Key Metrics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell>{row.metric}</TableCell>
                    <TableCell>{row.value}</TableCell>
                    <TableCell>{row.change}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {analyticsData.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card
                key={i}
                className="bg-white dark:bg-gray-900 border-violet-100 dark:border-gray-800"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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

        {/* Flows Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Your Flows
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flows.map((flow) => (
              <Card
                key={flow.id}
                className="p-4 flex flex-col items-center justify-center text-center border-violet-100 dark:border-gray-800 hover:shadow-md hover:border-violet-400 transition"
              >
                <div className="h-20 w-20 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-sm">
                  {flow.name[0]}
                </div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {flow.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Last edited {flow.lastEdited}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/builder/${flow.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    className="bg-violet-600 text-white hover:bg-violet-700"
                    onClick={() => navigate(`/builder/${flow.id}`)}
                  >
                    Edit
                  </Button>
                </div>
              </Card>
            ))}

            {/* Create Flow */}
            <Card className="border-dashed border-2 border-violet-300 dark:border-violet-700 flex flex-col items-center justify-center py-10 text-center hover:border-violet-500 transition">
              <div className="text-4xl text-violet-600 mb-2">+</div>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-3">
                Create or Import Flow
              </p>
              <div className="flex gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-violet-600 text-white hover:bg-violet-700"
                    >
                      New Flow
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
                    <DialogFooter className="mt-4">
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
              </div>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
