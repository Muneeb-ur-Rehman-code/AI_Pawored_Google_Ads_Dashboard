import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockProducts } from "@/data/mockData";
import { RecommendationBadge } from "@/components/RecommendationBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LayoutList, Columns3 } from "lucide-react";

const actionItems = mockProducts
  .filter(p => p.recommendation === "pause" || p.recommendation === "exclude" || p.contributionMargin < -500)
  .slice(0, 14)
  .map((p, i) => ({
    ...p,
    issue: p.recommendation === "pause" ? "High spend, low return" : p.recommendation === "exclude" ? "Consistently unprofitable" : "Negative contribution margin",
    owner: ["Sarah M.", "James K.", "Alex R.", "Emma C."][i % 4],
    dueDate: `Mar ${15 + (i % 10)}, 2026`,
    actionStatus: ["to-review", "in-progress", "pending-approval", "completed"][i % 4] as string,
    avatar: ["SM", "JK", "AR", "EC"][i % 4],
  }));

const statusLabels: Record<string, string> = {
  "to-review": "To Review",
  "in-progress": "In Progress",
  "pending-approval": "Pending Approval",
  "completed": "Completed",
};

const statusColors: Record<string, string> = {
  "to-review": "bg-muted text-muted-foreground",
  "in-progress": "bg-optimise/10 text-optimise",
  "pending-approval": "bg-review/10 text-review",
  "completed": "bg-scale/10 text-scale",
};

const priorityColors: Record<string, string> = {
  "to-review": "border-l-pause",
  "in-progress": "border-l-optimise",
  "pending-approval": "border-l-review",
  "completed": "border-l-scale",
};

export default function ActionsPage() {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const columns = ['to-review', 'in-progress', 'pending-approval', 'completed'];

  return (
    <AppLayout>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[18px] font-semibold text-foreground">Actions Board</h2>
            <p className="text-body text-muted-foreground">Flagged products requiring attention</p>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
            <Button variant={view === 'table' ? 'secondary' : 'ghost'} size="sm" className="h-7 gap-1.5" onClick={() => setView('table')}>
              <LayoutList className="h-3.5 w-3.5" /> Table
            </Button>
            <Button variant={view === 'kanban' ? 'secondary' : 'ghost'} size="sm" className="h-7 gap-1.5" onClick={() => setView('kanban')}>
              <Columns3 className="h-3.5 w-3.5" /> Kanban
            </Button>
          </div>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && view === 'table' && (
          <div className="flex items-center gap-3 rounded-md bg-muted p-3">
            <span className="text-body font-medium">{selected.size} selected</span>
            <Button size="sm" variant="outline" className="text-body">Assign To</Button>
            <Button size="sm" variant="outline" className="text-body">Change Status</Button>
            <Button size="sm" variant="outline" className="text-body">Set Due Date</Button>
            <Button size="sm" variant="ghost" className="text-body" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        )}

        {view === 'table' ? (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="h-8 w-[120px] text-body"><SelectValue placeholder="Owner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Owners</SelectItem>
                  <SelectItem value="sarah">Sarah M.</SelectItem>
                  <SelectItem value="james">James K.</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 w-[130px] text-body"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {columns.map(c => <SelectItem key={c} value={c}>{statusLabels[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border bg-card overflow-x-auto">
              <table className="w-full text-body">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-3 py-2 w-8"><Checkbox onCheckedChange={c => { if (c) setSelected(new Set(actionItems.map(i => i.id))); else setSelected(new Set()); }} /></th>
                    {["Product", "Issue", "Recommendation", "Owner", "Due Date", "Status"].map(h => (
                      <th key={h} className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {actionItems.map(item => (
                    <tr key={item.id} className="row-separator hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2.5"><Checkbox checked={selected.has(item.id)} onCheckedChange={() => toggleSelect(item.id)} /></td>
                      <td className="px-3 py-2.5">
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-small text-muted-foreground font-mono">{item.sku}</p>
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{item.issue}</td>
                      <td className="px-3 py-2.5"><RecommendationBadge value={item.recommendation} /></td>
                      <td className="px-3 py-2.5 text-foreground">{item.owner}</td>
                      <td className="px-3 py-2.5 tabular-nums text-muted-foreground">{item.dueDate}</td>
                      <td className="px-3 py-2.5">
                        <Badge variant="secondary" className={statusColors[item.actionStatus]}>
                          {statusLabels[item.actionStatus]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {columns.map(col => (
              <div key={col} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-body font-semibold text-foreground">{statusLabels[col]}</h3>
                  <Badge variant="secondary" className="text-[10px]">
                    {actionItems.filter(i => i.actionStatus === col).length}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {actionItems.filter(i => i.actionStatus === col).map(item => (
                    <div key={item.id} className={`rounded-lg border border-border bg-card p-3 border-l-4 ${priorityColors[col]} space-y-2`}>
                      <div className="flex items-start gap-2">
                        <img src={item.imageUrl} alt="" className="h-8 w-8 rounded border border-border" />
                        <div className="min-w-0">
                          <p className="text-body font-medium text-foreground truncate">{item.title}</p>
                          <p className="text-small text-muted-foreground font-mono">{item.sku}</p>
                        </div>
                      </div>
                      <p className="text-small text-muted-foreground">{item.issue}</p>
                      <RecommendationBadge value={item.recommendation} />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-medium text-primary">
                            {item.avatar}
                          </div>
                          <span className="text-small text-muted-foreground">{item.owner}</span>
                        </div>
                        <span className="text-small text-muted-foreground">{item.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
