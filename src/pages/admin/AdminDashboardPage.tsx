import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { KpiCard } from '@/components/KpiCard';
import { Building2, Users, Package, Plug, DollarSign, TrendingUp, BarChart3, Clock } from 'lucide-react';
import { mockActivities, brandSpendData, productsOverTime, usersByRole } from '@/data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';

const fmt = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-[18px] font-semibold text-foreground">Admin Overview</h2>
          <p className="text-body text-muted-foreground">Platform-wide metrics and activity</p>
        </div>

        {/* KPI Row 1 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard title="Total Brands" value={3} icon={Building2} />
          <KpiCard title="Total Users" value={12} icon={Users} />
          <KpiCard title="Total Products" value={847} icon={Package} />
          <KpiCard title="Active Integrations" value="9/12" icon={Plug} />
        </div>

        {/* KPI Row 2 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard title="Total Spend" value="$142,350" icon={DollarSign} trend={8.5} />
          <KpiCard title="Total Revenue" value="$389,240" icon={TrendingUp} trend={12.3} />
          <KpiCard title="Average ROAS" value="2.73x" icon={BarChart3} trend={0.2} />
          <KpiCard title="Last Sync" value="5 min ago" icon={Clock} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Spend by Brand */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-body font-semibold text-foreground mb-4">Spend by Brand</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={brandSpendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => fmt(v)} />
                <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Products Over Time */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-body font-semibold text-foreground mb-4">Products Over Time</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={productsOverTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={v => v.slice(5)} />
                <YAxis tick={{ fontSize: 9 }} domain={['dataMin - 10', 'dataMax + 10']} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Users by Role */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-body font-semibold text-foreground mb-4">Users by Role</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={usersByRole} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={2}>
                  {usersByRole.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1">
              {usersByRole.map(r => (
                <div key={r.name} className="flex items-center justify-between text-body">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-muted-foreground">{r.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{r.value}</span>
                </div>
              ))}
            </div>
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
        </div>
      </div>
    </AdminLayout>
  );
}
