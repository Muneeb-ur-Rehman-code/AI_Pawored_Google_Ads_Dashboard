import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  subtitle?: string;
  trend?: number;
  className?: string;
  valueClassName?: string;
}

export function KpiCard({ title, value, icon: Icon, subtitle, trend, className, valueClassName }: KpiCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-4", className)}>
      <div className="flex items-center justify-between">
        <span className="text-table-header uppercase text-muted-foreground tracking-wider">{title}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <div className={cn("mt-2 text-display font-semibold tabular-nums", valueClassName)}>
        {value}
      </div>
      {(subtitle || trend !== undefined) && (
        <div className="mt-1 flex items-center gap-1 text-small">
          {trend !== undefined && (
            <span className={cn(trend >= 0 ? "text-positive" : "text-negative")}>
              {trend >= 0 ? "+" : ""}{trend.toFixed(1)}%
            </span>
          )}
          {subtitle && <span className="text-muted-foreground">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
