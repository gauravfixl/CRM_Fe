"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarIcon, Pencil } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function PenalizationPolicyAllocation({
  employees,
  policies,
  onUpdateSchemes,
}: {
  employees: any[];
  policies: any[];
  onUpdateSchemes: (updatedEmployees: any[], updatedPolicies: any[]) => void;
}) {
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);

  const [effectiveFrom, setEffectiveFrom] = useState<Date | undefined>(
    new Date()
  );
  const [effectiveTo, setEffectiveTo] = useState<Date | undefined>();
  const [noEndDate, setNoEndDate] = useState(false);
  const [policy, setPolicy] = useState<string>("");

  // Filters
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [policyFilter, setPolicyFilter] = useState("");
  const [search, setSearch] = useState("");

  // Filtered list
  const filteredEmployees = employees.filter((e) => {
    return (
      (!department || e.department === department) &&
      (!location || e.location === location) &&
      (!policyFilter || e.penalizationPolicy === policyFilter) &&
      (search === "" || e.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const toggleEmployee = (id: number) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const openModal = (employee?: any) => {
    if (employee) {
      setEditingEmployee(employee);
      setPolicy(employee.penalizationPolicy || "");
    } else {
      setEditingEmployee(null);
      setPolicy("");
    }
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    if (!policy) {
      alert("Please select a penalization policy.");
      return;
    }

    if (!noEndDate && effectiveTo && effectiveFrom && effectiveTo <= effectiveFrom) {
      alert("End date must be after the start date.");
      return;
    }

    let updatedEmployees = employees.map((emp) =>
      editingEmployee
        ? emp.id === editingEmployee.id
          ? { ...emp, penalizationPolicy: policy }
          : emp
        : selectedEmployees.includes(emp.id)
        ? { ...emp, penalizationPolicy: policy }
        : emp
    );

    const updatedPolicies = policies.map((p) => ({
      ...p,
      employees: updatedEmployees.filter(
        (emp) => emp.penalizationPolicy === p.name
      ).length,
      employeeList: updatedEmployees.filter(
        (emp) => emp.penalizationPolicy === p.name
      ),
    }));

    // ✅ Call parent callback
    if (typeof onUpdateSchemes === "function") {
      onUpdateSchemes(updatedEmployees, updatedPolicies);
    } else {
      console.warn("onUpdateSchemes not passed to PenalizationPolicyAllocation");
    }

    alert(
      editingEmployee
        ? `Updated policy for ${editingEmployee.name}`
        : `Updated policy for ${selectedEmployees.length} employee(s)`
    );

    // Reset
    setIsModalOpen(false);
    setSelectedEmployees([]);
    setPolicy("");
    setEffectiveTo(undefined);
    setNoEndDate(false);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[140px] text-xs">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(employees.map((e) => e.department))].map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-[120px] text-xs">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            {[...new Set(employees.map((e) => e.location))].map((loc) => (
              <SelectItem key={loc} value={loc}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={policyFilter} onValueChange={setPolicyFilter}>
          <SelectTrigger className="w-[160px] text-xs">
            <SelectValue placeholder="Penalization Policy" />
          </SelectTrigger>
          <SelectContent>
            {policies.map((p) => (
              <SelectItem key={p.name} value={p.name}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[160px] text-xs"
        />

        <Button
          size="sm"
          className="bg-primary text-white text-xs"
          disabled={selectedEmployees.length === 0}
          onClick={() => openModal()}
        >
          Update Penalization Policy
        </Button>
      </div>

      {/* Employee Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left">
              <th className="p-2">
                <Checkbox
                  checked={
                    selectedEmployees.length === filteredEmployees.length &&
                    filteredEmployees.length > 0
                  }
                  onCheckedChange={(v) =>
                    setSelectedEmployees(
                      v ? filteredEmployees.map((e) => e.id) : []
                    )
                  }
                />
              </th>
              <th className="p-2">Employee Name</th>
              <th className="p-2">Emp No</th>
              <th className="p-2">Department</th>
              <th className="p-2">Location</th>
              <th className="p-2">Manager</th>
              <th className="p-2">Penalization Policy</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <Checkbox
                    checked={selectedEmployees.includes(emp.id)}
                    onCheckedChange={() => toggleEmployee(emp.id)}
                  />
                </td>
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.empNo}</td>
                <td className="p-2">{emp.department}</td>
                <td className="p-2">{emp.location}</td>
                <td className="p-2">{emp.manager}</td>
                <td className="p-2 text-primary">
                  {emp.penalizationPolicy || "—"}
                </td>
                <td className="p-2 text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openModal(emp)}
                  >
                    <Pencil className="h-3.5 w-3.5 text-primary" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-gray-700">
              Update Penalization Policy
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Penalization Policy
              </label>
              <Select value={policy} onValueChange={setPolicy}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  {policies.map((p) => (
                    <SelectItem key={p.name} value={p.name}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="noPart" />
              <label htmlFor="noPart" className="text-xs text-gray-700">
                Employee no longer part of this policy
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Effective From
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-[140px] justify-start text-left text-xs font-normal"
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {effectiveFrom
                      ? format(effectiveFrom, "dd MMM yyyy")
                      : "Choose start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={effectiveFrom}
                    onSelect={(date) => {
                      if (date) setEffectiveFrom(date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Effective Up To
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[140px] justify-start text-left text-xs font-normal",
                      noEndDate && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={noEndDate}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {effectiveTo
                      ? format(effectiveTo, "dd MMM yyyy")
                      : "Choose end date"}
                  </Button>
                </PopoverTrigger>
                {!noEndDate && (
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={effectiveTo}
                      onSelect={(date) => {
                        if (date && effectiveFrom && date <= effectiveFrom) {
                          alert("End date must be after start date");
                          return;
                        }
                        setEffectiveTo(date ?? undefined);
                      }}
                      disabled={(date) =>
                        !!effectiveFrom && date <= effectiveFrom
                      }
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
              <div className="flex items-center gap-2 mt-1">
                <Checkbox
                  checked={noEndDate}
                  onCheckedChange={(v) => {
                    const value = !!v;
                    setNoEndDate(value);
                    if (value) setEffectiveTo(undefined);
                  }}
                  id="noEnd"
                />
                <label htmlFor="noEnd" className="text-xs text-gray-700">
                  No end date yet
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={handleUpdate}
              className="bg-primary text-white text-xs"
            >
              Update Penalization Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
