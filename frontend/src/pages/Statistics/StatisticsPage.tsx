import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import CountUp from "../../components/ui/CountUp";
import { useEffect, useState } from "react";

const monthlyData = [
  { month: "Jan", raised: 3200, resolved: 1800 },
  { month: "Feb", raised: 2800, resolved: 2000 },
  { month: "Mar", raised: 3500, resolved: 2200 },
  { month: "Apr", raised: 3000, resolved: 2100 },
  { month: "May", raised: 3300, resolved: 2400 },
  { month: "Jun", raised: 2700, resolved: 2300 },
  { month: "Jul", raised: 3600, resolved: 2500 },
  { month: "Aug", raised: 3900, resolved: 2800 },
];

const departments = [
  { name: "Local Government", pct: 27.94, barColor: "#FDE68A" },
  { name: "Roads & Infrastructure", pct: 25.69, barColor: "#F59E0B" },
  { name: "Education", pct: 20.24, barColor: "#F59E0B" },
  { name: "Utilities & Power", pct: 13.94, barColor: "#FACC15" },
  { name: "Healthcare", pct: 12.21, barColor: "#FDBA74" },
];

const pieColors = ["#F97316", "#FB923C", "#FDE68A", "#F59E0B", "#FDBA74"]; // orange/yellow hues

function TrendingStatCard({
  imageUrl,
  title,
  description,
  votes,
}: {
  imageUrl: string;
  title: string;
  description: string;
  votes: number;
}) {
  return (
    <div className="relative h-72 rounded-2xl overflow-hidden group">
      <img
        src={imageUrl}
        alt="Trending item"
        className="absolute inset-0 w-full h-full object-cover md:group-hover:scale-125 md:duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />

      <div className="absolute top-3 left-3">
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-2xl border border-white/50 text-white text-xs backdrop-blur-sm">
          <span className="inline-block h-3 w-3 rounded-sm bg-white/80" />
          <span>{votes}</span>
        </div>
      </div>

      <div className="absolute left-3 right-3 bottom-3">
        <div className="text-white text-lg font-semibold leading-snug">
          {title}
        </div>
        <p className="mt-1 text-gray-200 text-sm leading-tight tracking-tight line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function StatisticsPage() {
  const [animateBars, setAnimateBars] = useState(false);
  const [showChart, setShowChart] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setAnimateBars(true), 150);
    const c = setTimeout(() => setShowChart(true), 80);
    return () => {
      clearTimeout(t);
      clearTimeout(c);
    };
  }, []);

  return (
    <div className="pb-24 md:ml-[14rem] px-10 md:px-0 md:pl-[5rem] md:pr-[15rem]">
      {/* Header */}
      <div className="px-8">
        <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
        <p className="mt-1 text-gray-600 text-base leading-tight tracking-tight">
          Real-time data on public issues raised, resolved, and departments
          needing more attention.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-8">
          {/* Overview */}
          <section className="px-8 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-900">Overview</h2>
            <div className="pl-4 pr-8 py-8 bg-gray-50 rounded-2xl ring-1 ring-gray-200 flex flex-col gap-8">
              {[
                {
                  label: "Total issues reported:",
                  value: 3452,
                  dot: "bg-gray-500",
                },
                { label: "Resolved:", value: 1278, dot: "bg-green-300" },
                { label: "In progress:", value: 865, dot: "bg-blue-500" },
                { label: "Pending review:", value: 1309, dot: "bg-yellow-400" },
              ].map((row, idx) => (
                <div className="flex items-center gap-2" key={row.label}>
                  <div className="flex-1 flex items-center">
                    <span className="h-6 w-6 inline-flex items-center justify-center">
                      <span className={`h-2 w-2 ${row.dot} rounded-sm`} />
                    </span>
                    <span className="text-base text-gray-600">{row.label}</span>
                  </div>
                  <div className="flex-1 max-w-20 text-right text-xl font-bold text-gray-900">
                    <CountUp end={row.value} delayMs={idx * 100} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Departments with most unresolved issues */}
          <section className="px-8 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-900">
              Departments with most unresolved issues
            </h2>
            <div className="p-8 bg-gray-50 rounded-2xl ring-1 ring-gray-200 flex flex-col items-center gap-7">
              {/* Donut pie chart */}
              <div className="relative h-52 w-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departments}
                      dataKey="pct"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      strokeWidth={0}
                    >
                      {departments.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={pieColors[index % pieColors.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-xs font-bold text-gray-500">Total</div>
                  <div className="text-2xl font-bold text-gray-900">
                    <CountUp end={3452} />
                  </div>
                </div>
              </div>

              <div className="w-full p-4 flex flex-col gap-4">
                {departments.map((d, i) => (
                  <div key={d.name} className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <div className="flex-1 text-base text-gray-900">
                        {d.name}
                      </div>
                      <div className="text-base font-bold text-gray-600">
                        <CountUp
                          end={d.pct}
                          decimals={2}
                          suffix="%"
                          delayMs={150 + i * 80}
                        />
                      </div>
                    </div>
                    <div className="h-1 w-full bg-gray-200 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg"
                        style={{
                          width: animateBars ? `${d.pct}%` : "0%",
                          backgroundColor: d.barColor,
                          transition: "width 800ms ease-out",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-8">
          {/* Monthly issue trends */}
          <section className="px-8 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-900">
              Monthly issue trends
            </h2>
            <div className="px-8 pt-4 pb-8 rounded-2xl ring-1 ring-gray-200 flex flex-col gap-4">
              <div className="w-full h-64">
                {showChart ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={monthlyData}
                      margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="raised" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="5%"
                            stopColor="#f59e0b"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#f59e0b"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="resolved"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#059669"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#059669"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#e5e7eb" vertical={false} />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        tickLine={false}
                        axisLine={false}
                        width={28}
                      />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Area
                        type="monotone"
                        dataKey="raised"
                        stroke="#f59e0b"
                        fill="url(#raised)"
                        isAnimationActive
                        animationBegin={150}
                        animationDuration={900}
                        animationEasing="ease-out"
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stroke="#059669"
                        fill="url(#resolved)"
                        isAnimationActive
                        animationBegin={200}
                        animationDuration={900}
                        animationEasing="ease-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-b from-gray-50 to-gray-100" />
                )}
              </div>
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <span className="w-4 py-2">
                    <span className="block h-px bg-yellow-500" />
                  </span>
                  <span className="text-xs font-bold text-gray-600">
                    Raised Issues
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 py-2">
                    <span className="block h-px bg-emerald-700" />
                  </span>
                  <span className="text-xs font-bold text-gray-600">
                    Resolved Issues
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span className="inline-block h-4 w-4">
                  <span className="block h-3 w-3 bg-gray-500 rounded-sm" />
                </span>
                Last updated: 3 hours ago
              </div>
              <div className="py-2">
                <div className="h-px bg-gray-200" />
              </div>
              <div className="text-xs font-bold text-gray-900">Last month</div>
              <div className="flex gap-2 text-base text-gray-900">
                <div className="flex-1">
                  Resolved: <CountUp end={37} suffix="%" />
                </div>
                <div className="flex-1">
                  Unresolved: <CountUp end={63} suffix="%" />
                </div>
              </div>
              <div className="text-xs text-gray-600">
                A steady rise in resolved issues since last month.
              </div>
            </div>
          </section>

          {/* Trending today (two stacked cards) */}
          <section className="px-8 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <h2 className="flex-1 text-xl font-bold text-gray-900">
                Trending today
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              <TrendingStatCard
                imageUrl="/post/post1.jpg"
                title="Trains delayed on several lines"
                description="The main access road leading into Matugama town from the southern expressway has been severely damaged for over six months. Multiple large potholes, broken tarmac, and poor drainage have made the road nearly unusable during heavy rains. Local residents and daily commuters report frequent accidents and vehicle breakdowns."
                votes={386}
              />
              <TrendingStatCard
                imageUrl="/post/post2.jpg"
                title="A drinking water crisis in Welikanda"
                description="The main access road leading into Matugama town from the southern expressway has been severely damaged for over six months. Multiple large potholes, broken tarmac, and poor drainage have made the road nearly unusable during heavy rains. Local residents and daily commuters report frequent accidents and vehicle breakdowns."
                votes={386}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
