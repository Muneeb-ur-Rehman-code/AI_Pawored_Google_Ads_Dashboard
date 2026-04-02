import { AppLayout } from "@/components/AppLayout";
import { KpiCard } from "@/components/KpiCard";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { kpiData, mockDailyPerformance, mockProducts, mockRoasTrend, mockActivities, Recommendation } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Package, DollarSign, ShoppingCart, TrendingUp, Percent,
  ArrowUpCircle, Settings2, PauseCircle, Search, XCircle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n.toFixed(0)}`;
const fmtFull = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const categoryRevenue = Object.entries(
  mockProducts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.revenue;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value);

const recBreakdown: { name: string; value: number; color: string; rec: Recommendation }[] = [
  { name: "Scale", value: kpiData.scaleCount, color: "hsl(160, 84%, 39%)", rec: "scale" },
  { name: "Optimise", value: kpiData.optimiseCount, color: "hsl(38, 92%, 50%)", rec: "optimise" },
  { name: "Pause", value: kpiData.pauseCount, color: "hsl(0, 84%, 60%)", rec: "pause" },
  { name: "Review", value: kpiData.reviewCount, color: "hsl(239, 84%, 67%)", rec: "review" },
  { name: "Exclude", value: kpiData.excludeCount, color: "hsl(240, 4%, 46%)", rec: "exclude" },
];

const wastedSpend = [...mockProducts]
  .filter(p => p.contributionMargin < 0)
  .sort((a, b) => a.contributionMargin - b.contributionMargin)
  .slice(0, 5);

// Margin distribution
const marginBands = [
  { band: '0-20%', count: mockProducts.filter(p => p.grossMarginPct <= 20).length },
  { band: '20-40%', count: mockProducts.filter(p => p.grossMarginPct > 20 && p.grossMarginPct <= 40).length },
  { band: '40-60%', count: mockProducts.filter(p => p.grossMarginPct > 40 && p.grossMarginPct <= 60).length },
  { band: '60-80%', count: mockProducts.filter(p => p.grossMarginPct > 60 && p.grossMarginPct <= 80).length },
  { band: '80-100%', count: mockProducts.filter(p => p.grossMarginPct > 80).length },
];

// Top 5 by revenue
const topRevenue = [...mockProducts].sort((a, b) => b.revenue - a.revenue).slice(0, 5).map(p => ({
  name: p.title.length > 20 ? p.title.slice(0, 20) + '…' : p.title,
  revenue: Math.round(p.revenue),
  roas: p.roas,
}));

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-foreground">Overview</h2>
            <p className="text-body text-muted-foreground">Performance summary across all products</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="h-7 w-[160px] text-body"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="acme">Acme Footwear</SelectItem>
                <SelectItem value="summit">Summit Outdoor</SelectItem>
                <SelectItem value="urban">Urban Lifestyle</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="30d">
              <SelectTrigger className="h-7 w-[120px] text-body"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="14d">Last 14 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KpiCard title="Total Products" value={kpiData.totalProducts} icon={Package} trend={4.2} subtitle="+12" />
          <KpiCard title="Total Spend" value={fmtFull(kpiData.totalSpend)} icon={DollarSign} trend={8.5} />
          <KpiCard title="Total Revenue" value={fmtFull(kpiData.totalRevenue)} icon={ShoppingCart} trend={12.3} />
          <KpiCard title="Avg ROAS" value={`${kpiData.avgRoas.toFixed(2)}x`} icon={TrendingUp} trend={0.2} />
          <KpiCard title="Avg Margin" value={`${kpiData.avgGrossMargin.toFixed(1)}%`} icon={Percent} trend={-1.2} />
        </div>

        {/* KPI Row 2 - Recommendation cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <KpiCard title="Scale" value={kpiData.scaleCount} icon={ArrowUpCircle} valueClassName="text-scale" className="border-scale/20" />
          <KpiCard title="Optimise" value={kpiData.optimiseCount} icon={Settings2} valueClassName="text-optimise" className="border-optimise/20" />
          <KpiCard title="Pause" value={kpiData.pauseCount} icon={PauseCircle} valueClassName="text-pause" className="border-pause/20" />
          <KpiCard title="Review" value={kpiData.reviewCount} icon={Search} valueClassName="text-review" className="border-review/20" />
          <KpiCard title="Exclude" value={kpiData.excludeCount} icon={XCircle} valueClassName="text-exclude" className="border-exclude/20" />
        </div>

        {/* Charts 2x3 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Spend vs Revenue */}
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
            <h3 className="text-body font-semibold text-foreground mb-4">Spend vs Revenue</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={mockDailyPerformance}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={v => v.slice(5)} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => fmt(v)} />
                <Tooltip formatter={(v: number) => fmtFull(v)} labelFormatter={l => `Date: ${l}`} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(160, 84%, 39%)" fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="spend" stroke="hsl(0, 84%, 60%)" fill="url(#spendGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendation Donut */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-body font-semibold text-foreground mb-4">Recommendations</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={recBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2}>
                  {recBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {recBreakdown.map(r => (
                <div key={r.name} className="flex items-center justify-between text-body">
                  <RecommendationBadge value={r.rec} />
                  <span className="tabular-nums font-medium text-foreground">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ROAS Trend */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-body font-semibold text-foreground mb-4">ROAS Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockRoasTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip formatter={(v: number) => `${v.toFixed(2)}x`} />
                <Line type="monotone" dataKey="roas" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top 5 by Revenue */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-body font-semibold text-foreground mb-4">Top 5 Products by Revenue</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topRevenue} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={v => fmt(v)} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} />
                <Tooltip formatter={(v: number) => fmtFull(v)} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Margin Distribution */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-body font-semibold text-foreground mb-4">Margin Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={marginBands}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="band" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Wasted Spend */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-body font-semibold text-foreground mb-4">Top Products by Wasted Spend</h3>
            <div className="space-y-0">
              {wastedSpend.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 row-separator">
                  <div className="min-w-0">
                    <p className="text-body font-medium text-foreground truncate">{p.title}</p>
                    <p className="text-small text-muted-foreground font-mono">{p.sku}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-body font-medium text-negative tabular-nums">-${Math.abs(p.contributionMargin).toLocaleString()}</p>
                    <p className="text-small text-muted-foreground tabular-nums">{p.roas.toFixed(2)}x ROAS</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-body font-semibold text-foreground mb-4">Recent Activity</h3>
            <div className="space-y-0">
              {mockActivities.slice(0, 5).map(a => (
                <div key={a.id} className="flex items-start gap-3 py-2.5 row-separator">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-body text-foreground">{a.message}</p>
                    <p className="text-small text-muted-foreground">{a.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-3 text-body text-primary hover:underline">View All Activity</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
