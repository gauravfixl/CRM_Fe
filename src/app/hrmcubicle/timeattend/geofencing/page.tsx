"use client"

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Plus,
  Search,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  Home,
  Building2,
  Users,
  Clock,
  Edit,
  Trash2,
  Eye,
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

interface GeoZone {
  id: string;
  name: string;
  type: "Office" | "Site" | "Client";
  lat: number;
  lng: number;
  radius: number;
  activeEmployees: number;
  status: "Active" | "Inactive";
  address: string;
}

interface GPSPunch {
  id: string;
  employeeName: string;
  employeeId: string;
  punchTime: string;
  lat: number;
  lng: number;
  zone: string;
  inZone: boolean;
  distance: number;
}

interface PolicyConfig {
  onlyInZone: boolean;
  graceDistance: number;
  requireLocation: boolean;
}

const mockZones: GeoZone[] = [
  { id: "GZ001", name: "HQ Office", type: "Office", lat: 12.9716, lng: 77.5946, radius: 500, activeEmployees: 45, status: "Active", address: "MG Road, Bangalore" },
  { id: "GZ002", name: "Tech Park", type: "Office", lat: 12.9352, lng: 77.6245, radius: 800, activeEmployees: 32, status: "Active", address: "Whitefield, Bangalore" },
  { id: "GZ003", name: "Client - Acme Corp", type: "Client", lat: 19.0760, lng: 72.8777, radius: 300, activeEmployees: 8, status: "Active", address: "BKC, Mumbai" },
  { id: "GZ004", name: "Construction Site A", type: "Site", lat: 13.0827, lng: 80.2707, radius: 1000, activeEmployees: 15, status: "Active", address: "OMR, Chennai" },
  { id: "GZ005", name: "Old Office (Closed)", type: "Office", lat: 12.9500, lng: 77.5700, radius: 400, activeEmployees: 0, status: "Inactive", address: "Koramangala, Bangalore" },
];

const mockPunches: GPSPunch[] = [
  { id: "P001", employeeName: "Aarav Sharma", employeeId: "E001", punchTime: "09:02 AM", lat: 12.9718, lng: 77.5948, zone: "HQ Office", inZone: true, distance: 25 },
  { id: "P002", employeeName: "Priya Patel", employeeId: "E002", punchTime: "09:15 AM", lat: 12.9355, lng: 77.6248, zone: "Tech Park", inZone: true, distance: 40 },
  { id: "P003", employeeName: "Rahul Verma", employeeId: "E003", punchTime: "09:30 AM", lat: 12.9800, lng: 77.6000, zone: "HQ Office", inZone: false, distance: 1200 },
  { id: "P004", employeeName: "Sneha Gupta", employeeId: "E004", punchTime: "09:05 AM", lat: 19.0762, lng: 72.8779, zone: "Client - Acme Corp", inZone: true, distance: 30 },
  { id: "P005", employeeName: "Vikram Singh", employeeId: "E005", punchTime: "09:45 AM", lat: 12.9720, lng: 77.5950, zone: "HQ Office", inZone: true, distance: 50 },
  { id: "P006", employeeName: "Ananya Reddy", employeeId: "E006", punchTime: "10:00 AM", lat: 12.9600, lng: 77.5800, zone: "HQ Office", inZone: false, distance: 1800 },
  { id: "P007", employeeName: "Karan Mehta", employeeId: "E007", punchTime: "09:10 AM", lat: 13.0830, lng: 80.2710, zone: "Construction Site A", inZone: true, distance: 45 },
  { id: "P008", employeeName: "Deepika Nair", employeeId: "E008", punchTime: "09:20 AM", lat: 12.9350, lng: 77.6240, zone: "Tech Park", inZone: true, distance: 55 },
];

const GeoFencingPage = () => {
  const { toast } = useToast();
  const [zones, setZones] = useState<GeoZone[]>(mockZones);
  const [punches] = useState<GPSPunch[]>(mockPunches);
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneDialog, setZoneDialog] = useState(false);
  const [editZone, setEditZone] = useState<GeoZone | null>(null);
  const [policyDialog, setPolicyDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("map");

  const [policy, setPolicy] = useState<PolicyConfig>({ onlyInZone: true, graceDistance: 100, requireLocation: true });

  const [newZone, setNewZone] = useState<Partial<GeoZone>>({
    name: "", type: "Office", lat: 0, lng: 0, radius: 500, status: "Active", address: "",
  });

  const outOfZoneAlerts = punches.filter((p) => !p.inZone);

  const handleSaveZone = () => {
    if (!newZone.name || !newZone.address) {
      toast({ title: "Error", description: "Name and address are required.", variant: "destructive" });
      return;
    }
    if (editZone) {
      setZones((prev) => prev.map((z) => (z.id === editZone.id ? { ...z, ...newZone } as GeoZone : z)));
      toast({ title: "Zone Updated", description: `${newZone.name} has been updated.` });
    } else {
      const zone: GeoZone = {
        id: `GZ${String(zones.length + 1).padStart(3, "0")}`,
        name: newZone.name || "",
        type: (newZone.type as GeoZone["type"]) || "Office",
        lat: newZone.lat || 0,
        lng: newZone.lng || 0,
        radius: newZone.radius || 500,
        activeEmployees: 0,
        status: (newZone.status as GeoZone["status"]) || "Active",
        address: newZone.address || "",
      };
      setZones([...zones, zone]);
      toast({ title: "Zone Created", description: `${zone.name} has been added.` });
    }
    setZoneDialog(false);
    setEditZone(null);
    setNewZone({ name: "", type: "Office", lat: 0, lng: 0, radius: 500, status: "Active", address: "" });
  };

  const handleDeleteZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id));
    toast({ title: "Zone Deleted", description: "Geo-fence zone has been removed." });
  };

  const handleEditZone = (zone: GeoZone) => {
    setEditZone(zone);
    setNewZone(zone);
    setZoneDialog(true);
  };

  const typeIcons: Record<string, React.ElementType> = { Office: Building2, Site: MapPin, Client: Users };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Geo-fencing / GPS Attendance</h1>
          <p className="text-slate-500 text-sm mt-1">Location-based attendance management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPolicyDialog(true)} className="gap-2"><Settings className="w-4 h-4" /> Policy</Button>
          <Button onClick={() => { setEditZone(null); setNewZone({ name: "", type: "Office", lat: 0, lng: 0, radius: 500, status: "Active", address: "" }); setZoneDialog(true); }} className="gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">
            <Plus className="w-4 h-4" /> Add Zone
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
          <TabsTrigger value="punches">GPS Punches</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({outOfZoneAlerts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Geo-fence Zones Map</h2>
              {/* Map placeholder */}
              <div className="relative w-full h-[400px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden"
                style={{ backgroundImage: "linear-gradient(rgba(148,163,184,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.1) 1px, transparent 1px)", backgroundSize: "30px 30px" }}>
                {zones.filter((z) => z.status === "Active").map((zone) => {
                  const x = ((zone.lng - 72) / 10) * 100;
                  const y = ((20 - zone.lat) / 10) * 100;
                  const size = Math.max(40, zone.radius / 15);
                  const Icon = typeIcons[zone.type] || MapPin;
                  return (
                    <div
                      key={zone.id}
                      className="absolute flex flex-col items-center"
                      style={{ left: `${Math.min(90, Math.max(5, x))}%`, top: `${Math.min(85, Math.max(5, y))}%`, transform: "translate(-50%, -50%)" }}
                    >
                      <div
                        className={cn("rounded-full border-2 flex items-center justify-center",
                          zone.type === "Office" ? "border-[#8B5CF6] bg-[#8B5CF6]/10" : zone.type === "Client" ? "border-blue-500 bg-blue-500/10" : "border-amber-500 bg-amber-500/10"
                        )}
                        style={{ width: `${size}px`, height: `${size}px` }}
                      >
                        <Icon className={cn("w-4 h-4", zone.type === "Office" ? "text-[#8B5CF6]" : zone.type === "Client" ? "text-blue-500" : "text-amber-500")} />
                      </div>
                      <span className="text-[10px] font-medium text-slate-600 mt-1 bg-white/80 px-1 rounded">{zone.name}</span>
                      <span className="text-[9px] text-slate-400">{zone.radius}m radius</span>
                    </div>
                  );
                })}
                <div className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-lg border border-slate-200 text-[10px] space-y-1">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-[#8B5CF6]" /><span>Office</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-blue-500" /><span>Client</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border-2 border-amber-500" /><span>Site</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="zones" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Zone Name</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Type</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Coordinates</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Radius</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Employees</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Status</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((zone) => {
                      const Icon = typeIcons[zone.type] || MapPin;
                      return (
                        <tr key={zone.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4 text-slate-400" />
                              <div>
                                <div className="font-medium text-slate-800">{zone.name}</div>
                                <div className="text-xs text-slate-400">{zone.address}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3"><Badge variant="outline" className="text-xs">{zone.type}</Badge></td>
                          <td className="py-3 px-3 text-xs text-slate-500">{zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</td>
                          <td className="py-3 px-3 text-center text-slate-700">{zone.radius}m</td>
                          <td className="py-3 px-3 text-center text-slate-700">{zone.activeEmployees}</td>
                          <td className="py-3 px-3 text-center">
                            <Badge className={cn("text-xs border-0", zone.status === "Active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500")}>{zone.status}</Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => handleEditZone(zone)}><Edit className="w-3.5 h-3.5" /></Button>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500" onClick={() => handleDeleteZone(zone.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="punches" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Today&apos;s GPS Punches</h2>
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
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Punch Time</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Location</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Zone</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Zone Match</th>
                      <th className="text-center py-3 px-3 text-slate-500 font-medium">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {punches.filter((p) => p.employeeName.toLowerCase().includes(searchTerm.toLowerCase())).map((p) => (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-medium text-slate-800">{p.employeeName}</td>
                        <td className="py-3 px-3 text-slate-600"><Clock className="w-3.5 h-3.5 inline mr-1" />{p.punchTime}</td>
                        <td className="py-3 px-3 text-xs text-slate-500">{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</td>
                        <td className="py-3 px-3 text-slate-600">{p.zone}</td>
                        <td className="py-3 px-3 text-center">
                          {p.inZone ? (
                            <Badge className="bg-green-50 text-green-700 border-0 text-xs gap-1"><CheckCircle2 className="w-3 h-3" /> In Zone</Badge>
                          ) : (
                            <Badge className="bg-red-50 text-red-700 border-0 text-xs gap-1"><XCircle className="w-3 h-3" /> Out of Zone</Badge>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={cn("text-xs font-medium", p.distance > 500 ? "text-red-600" : "text-green-600")}>{p.distance}m</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Out-of-Zone Alerts</h2>
              {outOfZoneAlerts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">No out-of-zone alerts today.</div>
              ) : (
                <div className="space-y-3">
                  {outOfZoneAlerts.map((a) => (
                    <div key={a.id} className="flex items-center gap-4 p-4 bg-red-50/50 border border-red-100 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{a.employeeName}</div>
                        <div className="text-xs text-slate-500">Punched at {a.punchTime} - {a.distance}m away from {a.zone}</div>
                      </div>
                      <Badge className="bg-red-100 text-red-700 border-0 text-xs">{a.distance}m away</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* WFH Location Config */}
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm mt-4">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">WFH Location Configuration</h2>
              <p className="text-sm text-slate-500 mb-4">Employees working from home can register their home location for attendance verification.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[{ name: "Aarav Sharma", address: "HSR Layout, Bangalore", status: "Verified" }, { name: "Priya Patel", address: "Indiranagar, Bangalore", status: "Verified" }, { name: "Rahul Verma", address: "Andheri, Mumbai", status: "Pending" }].map((wfh) => (
                  <div key={wfh.name} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <Home className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{wfh.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 ml-6">{wfh.address}</p>
                    <Badge className={cn("text-[10px] mt-1 ml-6 border-0", wfh.status === "Verified" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700")}>{wfh.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Zone Dialog */}
      <Dialog open={zoneDialog} onOpenChange={setZoneDialog}>
        <DialogContent className="sm:max-w-md border-2 border-slate-200">
          <DialogHeader>
            <DialogTitle>{editZone ? "Edit Zone" : "Add Geo-fence Zone"}</DialogTitle>
            <DialogDescription>Configure a new location zone for attendance tracking</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div><Label>Zone Name *</Label><Input value={newZone.name} onChange={(e) => setNewZone({ ...newZone, name: e.target.value })} /></div>
            <div>
              <Label>Type</Label>
              <Select value={newZone.type} onValueChange={(v) => setNewZone({ ...newZone, type: v as GeoZone["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Site">Site</SelectItem>
                  <SelectItem value="Client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Address *</Label><Input value={newZone.address} onChange={(e) => setNewZone({ ...newZone, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Latitude</Label><Input type="number" value={newZone.lat} onChange={(e) => setNewZone({ ...newZone, lat: parseFloat(e.target.value) || 0 })} /></div>
              <div><Label>Longitude</Label><Input type="number" value={newZone.lng} onChange={(e) => setNewZone({ ...newZone, lng: parseFloat(e.target.value) || 0 })} /></div>
            </div>
            <div>
              <Label>Radius: {newZone.radius}m</Label>
              <input type="range" min={100} max={5000} step={100} value={newZone.radius} onChange={(e) => setNewZone({ ...newZone, radius: parseInt(e.target.value) })} className="w-full mt-1 accent-[#8B5CF6]" />
              <div className="flex justify-between text-[10px] text-slate-400"><span>100m</span><span>5000m</span></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Active</span>
              <button
                onClick={() => setNewZone({ ...newZone, status: newZone.status === "Active" ? "Inactive" : "Active" })}
                className={cn("relative w-11 h-6 rounded-full transition-colors", newZone.status === "Active" ? "bg-[#8B5CF6]" : "bg-slate-300")}
              >
                <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow", newZone.status === "Active" && "translate-x-5")} />
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setZoneDialog(false); setEditZone(null); }}>Cancel</Button>
            <Button onClick={handleSaveZone} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">{editZone ? "Update" : "Add Zone"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Policy Dialog */}
      <Dialog open={policyDialog} onOpenChange={setPolicyDialog}>
        <DialogContent className="sm:max-w-md border-2 border-slate-200">
          <DialogHeader>
            <DialogTitle>Attendance Policy Configuration</DialogTitle>
            <DialogDescription>Configure geo-fencing rules for attendance</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-700">Allow only in-zone punches</div>
                <div className="text-xs text-slate-400">Reject punches from outside geo-fence zones</div>
              </div>
              <button
                onClick={() => setPolicy({ ...policy, onlyInZone: !policy.onlyInZone })}
                className={cn("relative w-11 h-6 rounded-full transition-colors", policy.onlyInZone ? "bg-[#8B5CF6]" : "bg-slate-300")}
              >
                <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow", policy.onlyInZone && "translate-x-5")} />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="text-sm font-medium text-slate-700">Require location for all punches</div>
                <div className="text-xs text-slate-400">GPS must be enabled for attendance</div>
              </div>
              <button
                onClick={() => setPolicy({ ...policy, requireLocation: !policy.requireLocation })}
                className={cn("relative w-11 h-6 rounded-full transition-colors", policy.requireLocation ? "bg-[#8B5CF6]" : "bg-slate-300")}
              >
                <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow", policy.requireLocation && "translate-x-5")} />
              </button>
            </div>
            <div>
              <Label>Grace Distance: {policy.graceDistance}m</Label>
              <input type="range" min={0} max={500} step={25} value={policy.graceDistance} onChange={(e) => setPolicy({ ...policy, graceDistance: parseInt(e.target.value) })} className="w-full mt-1 accent-[#8B5CF6]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPolicyDialog(false)}>Cancel</Button>
            <Button onClick={() => { setPolicyDialog(false); toast({ title: "Policy Saved" }); }} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white">Save Policy</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GeoFencingPage;
