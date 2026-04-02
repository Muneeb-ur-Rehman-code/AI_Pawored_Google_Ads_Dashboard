import { useState } from 'react';
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { mockUploadHistory } from "@/data/mockData";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, Eye, RefreshCw, Unplug } from "lucide-react";
import { toast } from 'sonner';

export default function UploadsPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-[18px] font-semibold text-foreground">Uploads & Data Management</h2>
          <p className="text-body text-muted-foreground">Import COGS, margin data, and manage data connections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CSV Upload */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-body font-semibold text-foreground">CSV Upload</h3>
                <p className="text-small text-muted-foreground">Upload COGS and margin data</p>
              </div>
            </div>
            <div className="rounded-md border-2 border-dashed border-border p-10 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-body text-muted-foreground">Drag & drop file here, or</p>
              <Button variant="outline" size="sm" className="mt-2 text-body">Browse Files</Button>
              <p className="text-small text-muted-foreground mt-2">Supported: CSV, XLSX, Google Sheet URL</p>
            </div>
            <Button variant="outline" size="sm" className="text-body gap-1.5">
              <Download className="h-3.5 w-3.5" /> Download Template
            </Button>
          </div>

          {/* Google Sheets */}
          <div className="rounded-lg border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-body font-semibold text-foreground">Google Sheets Import</h3>
                <p className="text-small text-muted-foreground">Connected to live margin data</p>
              </div>
            </div>
            <div className="space-y-2 text-small text-muted-foreground">
              <p>Currently Connected: <span className="font-medium text-foreground">Margin-Master-Data-2026</span></p>
              <p>Sheet URL: <a href="#" className="text-primary hover:underline">docs.google.com/spreadsheets/d/...</a></p>
              <div className="flex items-center gap-2">
                <span>Sync Frequency:</span>
                <Select defaultValue="hourly">
                  <SelectTrigger className="h-7 w-[100px] text-body"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p>Last Sync: 2h ago</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-body gap-1.5" onClick={() => { toast.loading('Syncing...'); setTimeout(() => { toast.dismiss(); toast.success('Sync complete'); }, 2000); }}>
                <RefreshCw className="h-3.5 w-3.5" /> Sync Now
              </Button>
              <Button variant="outline" size="sm" className="text-body text-destructive gap-1.5">
                <Unplug className="h-3.5 w-3.5" /> Disconnect
              </Button>
            </div>
          </div>
        </div>

        {/* Data Quality */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-3">
          <h3 className="text-body font-semibold text-foreground">Data Quality</h3>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-small text-muted-foreground">Overall Health Score:</span>
            <Progress value={87} className="flex-1 max-w-[200px]" />
            <span className="text-body font-medium text-foreground">87%</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: 'Products with Missing COGS', count: 23, icon: AlertCircle },
              { label: 'Products with Missing Margin', count: 12, icon: AlertCircle },
              { label: 'Products with Invalid SKUs', count: 5, icon: AlertCircle },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between rounded-md border border-border p-3">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-optimise" />
                  <div>
                    <p className="text-body text-foreground">{item.label}</p>
                    <p className="text-small text-muted-foreground">{item.count} products</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-body h-7">Fix</Button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload History */}
        <div className="rounded-lg border border-border bg-card p-5 space-y-3">
          <h3 className="text-body font-semibold text-foreground">Upload History</h3>
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-body">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Timestamp', 'File Name', 'Type', 'Processed', 'Failed', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-table-header uppercase text-muted-foreground px-3 py-2 text-left whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockUploadHistory.map(u => (
                  <tr key={u.id} className="row-separator hover:bg-muted/30">
                    <td className="px-3 py-2 text-small text-muted-foreground">{u.timestamp}</td>
                    <td className="px-3 py-2 font-medium">{u.fileName}</td>
                    <td className="px-3 py-2 text-muted-foreground">{u.type}</td>
                    <td className="px-3 py-2 tabular-nums text-positive">{u.processed}</td>
                    <td className="px-3 py-2 tabular-nums text-negative">{u.failed}</td>
                    <td className="px-3 py-2">
                      <Badge variant="secondary" className={
                        u.status === 'Success' ? 'bg-scale/10 text-scale border-0' :
                        u.status === 'Partial' ? 'bg-optimise/10 text-optimise border-0' :
                        'bg-pause/10 text-pause border-0'
                      }>{u.status}</Badge>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Download className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><Eye className="h-3 w-3" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
