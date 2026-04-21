"use client"

import React, { useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Wifi,
  Settings,
  Users,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useToast } from "@/shared/components/ui/use-toast";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { cn } from "@/lib/utils";

interface BiometricDevice {
  id: string;
  deviceId: string;
  name: string;
  type: "Fingerprint" | "Face" | "RFID" | "Iris";
  location: string;
  ipAddress: string;
  status: "Online" | "Offline" | "Error";
  lastSync: string;
  employeesEnrolled: number;
  syncInterval: number;
  recordsSyncedToday: number;
  syncErrors: number;
}

interface PunchLog {
  id: string;
  deviceId: string;
  deviceName: string;
  employeeName: string;
  employeeId: string;
  timestamp: string;
  type: "IN" | "OUT";
  method: string;
  status: "Success" | "Failed";
}

interface EnrollmentRecord {
  employeeName: string;
  employeeId: string;
  devices: string[];
  enrollDate: string;
  status: "Enrolled" | "Partial" | "Not Enrolled";
}

const mockDevices: BiometricDevice[] = [
  { id: "BD001", deviceId: "BIO-FP-001", name: "Main Entrance FP", type: "Fingerprint", location: "HQ - Lobby", ipAddress: "192.168.1.101", status: "Online", lastSync: "2 min ago", employeesEnrolled: 120, syncInterval: 5, recordsSyncedToday: 245, syncErrors: 0 },
  { id: "BD002", deviceId: "BIO-FC-001", name: "HQ Face Scanner", type: "Face", location: "HQ - Main Gate", ipAddress: "192.168.1.102", status: "Online", lastSync: "5 min ago", employeesEnrolled: 115, syncInterval: 5, recordsSyncedToday: 230, syncErrors: 1 },
  { id: "BD003", deviceId: "BIO-RF-001", name: "Parking RFID", type: "RFID", location: "HQ - Parking", ipAddress: "192.168.1.103", status: "Online", lastSync: "1 min ago", employeesEnrolled: 85, syncInterval: 10, recordsSyncedToday: 170, syncErrors: 0 },
  { id: "BD004", deviceId: "BIO-FP-002", name: "Tech Park FP", type: "Fingerprint", location: "Tech Park - Floor 3", ipAddress: "192.168.2.101", status: "Offline", lastSync: "2 hrs ago", employeesEnrolled: 45, syncInterval: 5, recordsSyncedToday: 32, syncErrors: 5 },
  { id: "BD005", deviceId: "BIO-IR-001", name: "Server Room Iris", type: "Iris", location: "HQ - Server Room", ipAddress: "192.168.1.104", status: "Online", lastSync: "3 min ago", employeesEnrolled: 12, syncInterval: 2, recordsSyncedToday: 18, syncErrors: 0 },
  { id: "BD006", deviceId: "BIO-FC-002", name: "Cafeteria Face", type: "Face", location: "HQ - Cafeteria", ipAddress: "192.168.1.105", status: "Error", lastSync: "45 min ago", employeesEnrolled: 100, syncInterval: 10, recordsSyncedToday: 89, syncErrors: 12 },
];

const mockPunchLogs: PunchLog[] = [
  { id: "PL001", deviceId: "BIO-FP-001", deviceName: "Main Entrance FP", employeeName: "Aarav Sharma", employeeId: "E001", timestamp: "09:02:15 AM", type: "IN", method: "Fingerprint", status: "Success" },
  { id: "PL002", deviceId: "BIO-FC-001", deviceName: "HQ Face Scanner", employeeName: "Priya Patel", employeeId: "E002", timestamp: "09:05:32 AM", type: "IN", method: "Face", status: "Success" },
  { id: "PL003", deviceId: "BIO-RF-001", deviceName: "Parking RFID", employeeName: "Rahul Verma", employeeId: "E003", timestamp: "09:10:48 AM", type: "IN", method: "RFID", status: "Success" },
  { id: "PL004", deviceId: "BIO-FP-001", deviceName: "Main Entrance FP", employeeName: "Unknown", employeeId: "-", timestamp: "09:12:05 AM", type: "IN", method: "Fingerprint", status: "Failed" },
  { id: "PL005", deviceId: "BIO-FC-002", deviceName: "Cafeteria Face", employeeName: "Sneha Gupta", employeeId: "E004", timestamp: "09:15:22 AM", type: "IN", method: "Face", status: "Failed" },
  { id: "PL006", deviceId: "BIO-FP-001", deviceName: "Main Entrance FP", employeeName: "Vikram Singh", employeeId: "E005", timestamp: "09:18:40 AM", type: "IN", method: "Fingerprint", status: "Success" },
  { id: "PL007", deviceId: "BIO-IR-001", deviceName: "Server Room Iris", employeeName: "Ananya Reddy", employeeId: "E006", timestamp: "09:25:11 AM", type: "IN", method: "Iris", status: "Success" },
  { id: "PL008", deviceId: "BIO-FP-001", deviceName: "Main Entrance FP", employeeName: "Aarav Sharma", employeeId: "E001", timestamp: "06:05:30 PM", type: "OUT", method: "Fingerprint", status: "Success" },
];

const mockEnrollments: EnrollmentRecord[] = [
  { employeeName: "Aarav Sharma", employeeId: "E001", devices: ["BIO-FP-001", "BIO-FC-001", "BIO-RF-001"], enrollDate: "2025-01-15", status: "Enrolled" },
  { employeeName: "Priya Patel", employeeId: "E002", devices: ["BIO-FC-001", "BIO-RF-001"], enrollDate: "2025-01-15", status: "Enrolled" },
  { employeeName: "Rahul Verma", employeeId: "E003", devices: ["BIO-RF-001"], enrollDate: "2025-02-01", status: "Partial" },
  { employeeName: "Sneha Gupta", employeeId: "E004", devices: ["BIO-FP-001"], enrollDate: "2025-02-10", status: "Partial" },
  { employeeName: "Vikram Singh", employeeId: "E005", devices: ["BIO-FP-001", "BIO-FC-001"], enrollDate: "2025-01-20", status: "Enrolled" },
  { employeeName: "Ananya Reddy", employeeId: "E006", devices: ["BIO-IR-001", "BIO-FP-001", "BIO-FC-001"], enrollDate: "2025-01-18", status: "Enrolled" },
  { employeeName: "Karan Mehta", employeeId: "E007", devices: [], enrollDate: "-", status: "Not Enrolled" },
];

const BiometricPanel = () => {
  const { toast } = useToast();
  const [devices, setDevices] = useState<BiometricDevice[]>(mockDevices);
  const [activeTab, setActiveTab] = useState("devices");
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [newDevice, setNewDevice] = useState({ deviceId: "", name: "", type: "Fingerprint" as BiometricDevice["type"], location: "", ipAddress: "", syncInterval: 5 });
  const [settings, setSettings] = useState({ syncFrequency: 5, retryAttempts: 3, dataFormat: "JSON" });

  const statusIcon = (status: string) => {
    if (status === "Online") return <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />;
    if (status === "Offline") return <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />;
    return <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />;
  };

  const typeIcon: Record<string, string> = { Fingerprint: "FP", Face: "FC", RFID: "RF", Iris: "IR" };

  const totalSynced = devices.reduce((s, d) => s + d.recordsSyncedToday, 0);
  const totalErrors = devices.reduce((s, d) => s + d.syncErrors, 0);
  const onlineCount = devices.filter((d) => d.status === "Online").length;

  const handleAddDevice = () => {
    if (!newDevice.deviceId || !newDevice.name) {
      toast({ title: "Error", description: "Device ID and Name are required.", variant: "destructive" });
      return;
    }
    const device: BiometricDevice = {
      id: `BD${String(devices.length + 1).padStart(3, "0")}`,
      ...newDevice,
      status: "Offline",
      lastSync: "Never",
      employeesEnrolled: 0,
      recordsSyncedToday: 0,
      syncErrors: 0,
    };
    setDevices([...devices, device]);
    setAddDeviceOpen(false);
    setNewDevice({ deviceId: "", name: "", type: "Fingerprint", location: "", ipAddress: "", syncInterval: 5 });
    toast({ title: "Device Added", description: `${device.name} has been registered.` });
  };

  const handleManualSync = (deviceId: string) => {
    toast({ title: "Sync Triggered", description: `Manual sync initiated for device ${deviceId}.` });
  };

  const handleSyncAll = () => {
    toast({ title: "Sync All", description: "Manual sync triggered for all online devices." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Biometric Integration</h2>
          <p className="text-slate-500 text-xs mt-1">Manage biometric devices and attendance sync</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSettingsOpen(true)} className="gap-2"><Settings className="w-4 h-4" /> Settings</Button>
          <Button variant="outline" onClick={handleSyncAll} className="gap-2"><RefreshCw className="w-4 h-4" /> Sync All</Button>
          <Button onClick={() => setAddDeviceOpen(true)} className="gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white"><Plus className="w-4 h-4" /> Add Device</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Devices Online", value: `${onlineCount}/${devices.length}`, icon: Wifi, color: "text-slate-800", bg: "bg-white/30", cardBg: "bg-[#CB9DF0]" },
          { label: "Records Synced Today", value: totalSynced, icon: Activity, color: "text-slate-800", bg: "bg-white/30", cardBg: "bg-[#F0C1E1]" },
          { label: "Sync Errors", value: totalErrors, icon: AlertTriangle, color: "text-slate-800", bg: "bg-white/30", cardBg: totalErrors > 0 ? "bg-[#FDDBBB]" : "bg-[#FFF9BF]" },
          { label: "Total Enrolled", value: mockEnrollments.filter((e) => e.status !== "Not Enrolled").length, icon: Users, color: "text-slate-800", bg: "bg-white/30", cardBg: "bg-[#FFF9BF]" },
        ].map((s) => (
          <Card key={s.label} className={cn("rounded-none border-none shadow-sm", s.cardBg)}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center", s.bg)}>
                <s.icon className={cn("w-5 h-5", s.color)} />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-600 mb-1">{s.label}</div>
                <div className="text-2xl font-bold text-slate-800">{s.value}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="devices">Connected Devices</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="logs">Punch Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Device</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Type</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Location</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Status</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Last Sync</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Enrolled</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Today</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Errors</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {devices.map((d) => (
                      <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] text-xs font-bold">{typeIcon[d.type]}</div>
                            <div>
                              <div className="font-medium text-slate-800">{d.name}</div>
                              <div className="text-xs text-slate-400">{d.deviceId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3"><Badge variant="outline" className="text-xs">{d.type}</Badge></td>
                        <td className="py-3 px-3 text-slate-600 text-xs">{d.location}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {statusIcon(d.status)}
                            <span className={cn("text-xs font-medium", d.status === "Online" ? "text-green-600" : d.status === "Error" ? "text-red-600" : "text-slate-400")}>{d.status}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-500">{d.lastSync}</td>
                        <td className="py-3 px-3 text-center text-slate-700">{d.employeesEnrolled}</td>
                        <td className="py-3 px-3 text-center text-slate-700">{d.recordsSyncedToday}</td>
                        <td className="py-3 px-3 text-center">
                          {d.syncErrors > 0 ? <span className="text-xs font-medium text-red-600">{d.syncErrors}</span> : <span className="text-xs text-slate-400">0</span>}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleManualSync(d.deviceId)} title="Manual Sync">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Device Health Monitor</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {devices.map((d) => (
                    <div key={d.id} className={cn("p-3 rounded-lg border", d.status === "Online" ? "border-green-200 bg-green-50/50" : d.status === "Error" ? "border-red-200 bg-red-50/50" : "border-slate-200 bg-slate-50")}>
                      <div className="flex items-center gap-2 mb-1">
                        {statusIcon(d.status)}
                        <span className="text-xs font-medium text-slate-700">{d.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500">IP: {d.ipAddress}</div>
                      <div className="text-[10px] text-slate-500">Sync: every {d.syncInterval}min | Last: {d.lastSync}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-800">Employee Enrollment Status</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-56" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Employee</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Enrolled Devices</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Enroll Date</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockEnrollments.filter((e) => e.employeeName.toLowerCase().includes(searchTerm.toLowerCase())).map((e) => (
                      <tr key={e.employeeId} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800">{e.employeeName}</div>
                          <div className="text-xs text-slate-400">{e.employeeId}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {e.devices.length > 0 ? e.devices.map((d) => <Badge key={d} variant="outline" className="text-[10px]">{d}</Badge>) : <span className="text-xs text-slate-400">None</span>}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 text-xs">{e.enrollDate}</td>
                        <td className="py-3 px-3 text-center">
                          <Badge className={cn("text-xs border-0", e.status === "Enrolled" ? "bg-green-50 text-green-700" : e.status === "Partial" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700")}>{e.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-base font-semibold text-slate-800 mb-4">Raw Punch Log (Last 50)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Time</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Device</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Employee</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Type</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Method</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockPunchLogs.map((log) => (
                      <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 px-3 text-xs text-slate-600 font-mono">{log.timestamp}</td>
                        <td className="py-3 px-3 text-xs text-slate-600">{log.deviceName}</td>
                        <td className="py-3 px-3">
                          <span className={cn("text-sm", log.employeeName === "Unknown" ? "text-red-500" : "text-slate-800")}>{log.employeeName}</span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <Badge className={cn("text-xs border-0", log.type === "IN" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700")}>{log.type}</Badge>
                        </td>
                        <td className="py-3 px-3 text-center text-xs text-slate-500">{log.method}</td>
                        <td className="py-3 px-3 text-center">
                          {log.status === "Success" ? <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" /> : <XCircle className="w-4 h-4 text-red-500 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={addDeviceOpen} onOpenChange={setAddDeviceOpen}>
        <DialogContent className="sm:max-w-md border-2 border-slate-200">
          <DialogHeader>
            <DialogTitle>Add Biometric Device</DialogTitle>
            <DialogDescription>Register a new biometric device for attendance tracking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Device ID *</Label><Input value={newDevice.deviceId} onChange={(e) => setNewDevice({ ...newDevice, deviceId: e.target.value })} placeholder="BIO-FP-003" /></div>
            <div><Label>Device Name *</Label><Input value={newDevice.name} onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })} /></div>
            <div>
              <Label>Type</Label>
              <Select value={newDevice.type} onValueChange={(v) => setNewDevice({ ...newDevice, type: v as BiometricDevice["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fingerprint">Fingerprint</SelectItem>
                  <SelectItem value="Face">Face Recognition</SelectItem>
                  <SelectItem value="RFID">RFID</SelectItem>
                  <SelectItem value="Iris">Iris Scanner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Location</Label><Input value={newDevice.location} onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })} /></div>
            <div><Label>IP Address</Label><Input value={newDevice.ipAddress} onChange={(e) => setNewDevice({ ...newDevice, ipAddress: e.target.value })} placeholder="192.168.1.xxx" /></div>
            <div>
              <Label>Sync Interval (minutes)</Label>
              <Select value={String(newDevice.syncInterval)} onValueChange={(v) => setNewDevice({ ...newDevice, syncInterval: parseInt(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 min</SelectItem>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="10">10 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDeviceOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDevice} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Add Device</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-md border-2 border-slate-200">
          <DialogHeader>
            <DialogTitle>Integration Settings</DialogTitle>
            <DialogDescription>Configure sync and data format settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Default Sync Frequency</Label>
              <Select value={String(settings.syncFrequency)} onValueChange={(v) => setSettings({ ...settings, syncFrequency: parseInt(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Every 2 min</SelectItem>
                  <SelectItem value="5">Every 5 min</SelectItem>
                  <SelectItem value="10">Every 10 min</SelectItem>
                  <SelectItem value="15">Every 15 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Retry Attempts on Failure</Label>
              <Select value={String(settings.retryAttempts)} onValueChange={(v) => setSettings({ ...settings, retryAttempts: parseInt(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 attempt</SelectItem>
                  <SelectItem value="3">3 attempts</SelectItem>
                  <SelectItem value="5">5 attempts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data Format</Label>
              <Select value={settings.dataFormat} onValueChange={(v) => setSettings({ ...settings, dataFormat: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="JSON">JSON</SelectItem>
                  <SelectItem value="XML">XML</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button onClick={() => { setSettingsOpen(false); toast({ title: "Settings Saved" }); }} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BiometricPanel;
