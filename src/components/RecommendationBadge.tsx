import { cn } from "@/lib/utils";
import { Recommendation } from "@/data/mockData";

const config: Record<Recommendation, { label: string; className: string; dotClass: string }> = {
  scale: { label: "Scale", className: "bg-scale/10 text-scale", dotClass: "bg-scale" },
  optimise: { label: "Optimise", className: "bg-optimise/10 text-optimise", dotClass: "bg-optimise" },
  pause: { label: "Pause", className: "bg-pause/10 text-pause", dotClass: "bg-pause" },
  review: { label: "Review", className: "bg-review/10 text-review", dotClass: "bg-review" },
  exclude: { label: "Exclude", className: "bg-exclude/10 text-exclude", dotClass: "bg-exclude" },
};

export function RecommendationBadge({ value }: { value: Recommendation }) {
  const c = config[value];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-[11px] font-medium", c.className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dotClass)} />
      {c.label}
    </span>
  );
}
