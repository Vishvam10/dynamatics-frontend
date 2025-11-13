import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  // AreaChart,
  // Area,
  ScatterChart,
  Scatter,
  // BarChart,
  // Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

// function mulberry32(seed: number) {
//   return function () {
//     let t = (seed += 0x6d2b79f5);
//     t = Math.imul(t ^ (t >>> 15), t | 1);
//     t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
//     return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
//   };
// }
// const seed = 12345;
// const random = mulberry32(seed);

// Generate mock data for demonstrations
const generateTimeSeriesData = () => {
  const data = [];
  const baseValue = 100;
  let value = baseValue;

  for (let i = 0; i < 30; i++) {
    value += (0.37 - 0.5) * 10;
    const isAnomaly = 0.37 > 0.85;
    data.push({
      day: i + 1,
      value: isAnomaly ? value * 1.4 : value,
      forecast: null,
      isAnomaly,
      upper: value * 1.15,
      lower: value * 0.85,
    });
  }

  // Add forecast data
  for (let i = 30; i < 40; i++) {
    value += (0.37 - 0.5) * 8;
    data.push({
      day: i + 1,
      value: null,
      forecast: value,
      isAnomaly: false,
      upper: value * 1.2,
      lower: value * 0.8,
    });
  }

  return data;
};

const generateOutlierData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    const isOutlier = 0.37 > 0.92;
    data.push({
      index: i,
      value: isOutlier ? 0.37 * 100 + 150 : 0.37 * 50 + 50,
      isOutlier,
    });
  }
  return data;
};

const generateTrendData = () => {
  return [
    { month: "Jan", revenue: 45000, trend: 42000, growth: 7.1 },
    { month: "Feb", revenue: 52000, trend: 48000, growth: 15.6 },
    { month: "Mar", revenue: 48000, trend: 50000, growth: -7.7 },
    { month: "Apr", revenue: 61000, trend: 55000, growth: 27.1 },
    { month: "May", revenue: 58000, trend: 58000, growth: -4.9 },
    { month: "Jun", revenue: 67000, trend: 62000, growth: 15.5 },
    { month: "Jul", revenue: 72000, trend: 68000, growth: 7.5 },
    { month: "Aug", revenue: 69000, trend: 71000, growth: -4.2 },
    { month: "Sep", revenue: 78000, trend: 75000, growth: 13.0 },
    { month: "Oct", revenue: 82000, trend: 80000, growth: 5.1 },
    { month: "Nov", revenue: 85000, trend: 84000, growth: 3.7 },
    { month: "Dec", revenue: 91000, trend: 88000, growth: 7.1 },
  ];
};

// const generateDistributionData = () => {
//   const data = [];
//   for (let i = 0; i < 100; i++) {
//     const value = 0.89 * 100;
//     data.push({
//       bin: Math.floor(value / 10) * 10,
//       count: 1,
//     });
//   }

//   // Aggregate counts
//   const aggregated = data.reduce((acc: any, item) => {
//     const existing = acc.find((a: any) => a.bin === item.bin);
//     if (existing) {
//       existing.count += 1;
//     } else {
//       acc.push({ bin: item.bin, count: 1 });
//     }
//     return acc;
//   }, []);

//   return aggregated.sort((a: any, b: any) => a.bin - b.bin);
// };

export function AnalyticsDashboard() {
  const timeSeriesData = generateTimeSeriesData();
  const outlierData = generateOutlierData();
  const trendData = generateTrendData();
  // const distributionData = generateDistributionData();

  const anomalyCount = 12;
  const outlierCount = 32;
  const avgGrowth = (
    trendData.reduce((sum, d) => sum + d.growth, 0) / trendData.length
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Advanced Analytics
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Real-time insights with anomaly detection, forecasting, and trend
          analysis
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-violet-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Anomalies Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-violet-600">
              {anomalyCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-violet-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Outliers Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-violet-600">
              {outlierCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">In current dataset</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-violet-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Avg Growth Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-violet-600">
              +{avgGrowth}%
            </p>
            <p className="text-xs text-gray-400 mt-1">Year over year</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-violet-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Forecast Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-violet-600">94.2%</p>
            <p className="text-xs text-gray-400 mt-1">Prediction confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Anomaly Detection Chart */}
        <Card className="bg-white border-violet-100">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              Anomaly Detection
            </CardTitle>
            <p className="text-xs text-gray-400">
              Identifies unusual patterns in time series data
            </p>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ChartContainer
                config={{
                  value: { label: "Value", color: "#8b5cf6" },
                  forecast: { label: "Forecast", color: "#c4b5fd" },
                }}
                className="w-full h-full"
              >
                <LineChart width={500} height={240} data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="day"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", r: 3 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#c4b5fd"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#c4b5fd", r: 3 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-600"></div>
                <span className="text-gray-500">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-300"></div>
                <span className="text-gray-500">Forecast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-400"></div>
                <span className="text-gray-500">Anomaly</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outlier Detection */}
        <Card className="bg-white border-violet-100">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              Outlier Detection
            </CardTitle>
            <p className="text-xs text-gray-400">
              Statistical outliers beyond 2σ threshold
            </p>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ChartContainer
                config={{ value: { label: "Value", color: "#8b5cf6" } }}
                className="w-full h-full"
              >
                <ScatterChart width={500} height={240} data={outlierData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="index"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ReferenceLine
                    y={150}
                    stroke="#ddd6fe"
                    strokeDasharray="3 3"
                    label={{
                      value: "Upper Bound",
                      fontSize: 10,
                      fill: "#a78bfa",
                    }}
                  />
                  <ReferenceLine
                    y={50}
                    stroke="#ddd6fe"
                    strokeDasharray="3 3"
                    label={{
                      value: "Lower Bound",
                      fontSize: 10,
                      fill: "#a78bfa",
                    }}
                  />
                  <Scatter
                    data={outlierData.filter((d) => !d.isOutlier)}
                    fill="#8b5cf6"
                  />
                  <Scatter
                    data={outlierData.filter((d) => d.isOutlier)}
                    fill="#a78bfa"
                  />
                </ScatterChart>
              </ChartContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-600"></div>
                <span className="text-gray-500">Normal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-400"></div>
                <span className="text-gray-500">Outlier</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trend & Forecast */}
        {/* <Card className="bg-white border-violet-100">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              Revenue Trend & Growth
            </CardTitle>
            <p className="text-xs text-gray-400">
              Monthly performance with trend line analysis
            </p>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ChartContainer
                config={{
                  revenue: { label: "Revenue", color: "#8b5cf6" },
                  trend: { label: "Trend", color: "#c4b5fd" },
                }}
                className="w-full h-full"
              >
                <AreaChart width={500} height={240} data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="trend"
                    stroke="#c4b5fd"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-600"></div>
                <span className="text-gray-500">Actual Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-violet-300"></div>
                <span className="text-gray-500">Trend Line</span>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Data Distribution */}
        {/* <Card className="bg-white border-violet-100">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-gray-800">
              Data Distribution
            </CardTitle>
            <p className="text-xs text-gray-400">
              Histogram showing value frequency distribution
            </p>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ChartContainer
                config={{ count: { label: "Frequency", color: "#8b5cf6" } }}
                className="w-full h-full"
              >
                <BarChart width={500} height={240} data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="bin"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickLine={false}
                  />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="mt-3 text-xs text-gray-400">
              <p>Normal distribution detected with mean: 50.2, σ: 28.5</p>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
