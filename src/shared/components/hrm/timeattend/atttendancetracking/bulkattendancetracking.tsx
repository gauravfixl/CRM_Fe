"use client";

import { useState } from "react";
import { ChevronDown, MoreVertical, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Employee {
  id: number;
  name: string;
  role: string;
  date: string;
  status: "Penalised" | "Regularised";
  location: string;
  department: string;
  discrepancy: string;
}

export default function BulkPenaltyManagement() {
  const [employees] = useState<Employee[]>([
    {
      id: 31,
      name: "Manik Basha",
      role: "Software Engineer",
      date: "13 Aug 2025",
      status: "Penalised",
      location: "UTC-8 test",
      department: "DEV",
      discrepancy: "No attendance",
    },
    {
      id: 32,
      name: "Manik Basha",
      role: "Software Engineer",
      date: "14 Aug 2025",
      status: "Penalised",
      location: "UTC-8 test",
      department: "DEV",
      discrepancy: "No attendance",
    },
  ]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [statusFilter, setStatusFilter] = useState("Penalised");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === employees.length) setSelectedIds([]);
    else setSelectedIds(employees.map((e) => e.id));
  };

  const handleRegularizeClick = () => {
    if (selectedIds.length > 0) setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    alert(`${selectedIds.length} employee(s) regularised successfully`);
  };

  return (
    <div className="p-3 text-xs space-y-3">
      {/* Header */}
      <h2 className="text-sm font-medium text-gray-800">Bulk regularization</h2>
      <p className="bg-blue-50 text-blue-700 border border-blue-100 text-[11px] px-3 py-1.5 rounded">
        Employees who are already regularised or have pending regularisation requests will not be shown.
      </p>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white border rounded-md p-2">
        {/* Date Range */}
        <div className="flex flex-col">
          <label className="text-[10px] text-gray-500">DATE RANGE</label>
          <input
            type="text"
            value="09 Aug 2025 - 07 Sep 2025"
            readOnly
            className="border rounded px-2 py-[3px] w-[180px] text-xs text-gray-700 focus:outline-none"
          />
        </div>

        {/* Status */}
        <div className="relative flex flex-col">
          <label className="text-[10px] text-gray-500">STATUS</label>
          <button
            onClick={() => setShowStatusDropdown((s) => !s)}
            className="flex items-center justify-between border rounded px-2 py-[3px] w-[120px] text-gray-700"
          >
            {statusFilter}
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
          {showStatusDropdown && (
            <div className="absolute z-10 mt-[40px] bg-white border rounded shadow-md w-[120px]">
              {["Penalised", "Regularised"].map((status) => (
                <div
                  key={status}
                  className={cn(
                    "px-2 py-1 cursor-pointer hover:bg-gray-100",
                    status === statusFilter && "bg-blue-50 text-blue-600"
                  )}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowStatusDropdown(false);
                  }}
                >
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1"></div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            className="text-[11px] bg-blue-600 hover:bg-blue-700 text-white px-3 py-1"
            disabled={selectedIds.length === 0}
            onClick={handleRegularizeClick}
          >
            Regularize
          </Button>
          <Button
            variant="outline"
            className="text-[11px] border-gray-300 px-3 py-1 hover:bg-gray-50"
            disabled={selectedIds.length === 0}
          >
            Cancel Penalty
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md bg-white">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b text-gray-600">
            <tr>
              <th className="p-2 text-left w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === employees.length}
                  onChange={selectAll}
                />
              </th>
              <th className="p-2 text-left">EMPLOYEE ID</th>
              <th className="p-2 text-left">EMPLOYEE NAME</th>
              <th className="p-2 text-left">DATE</th>
              <th className="p-2 text-left">STATUS</th>
              <th className="p-2 text-left">LOCATION</th>
              <th className="p-2 text-left">DEPARTMENT</th>
              <th className="p-2 text-left">ATTENDANCE DISCREPANCY</th>
              <th className="p-2 text-left">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="border-b hover:bg-gray-50 text-gray-700"
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(emp.id)}
                    onChange={() => toggleSelect(emp.id)}
                  />
                </td>
                <td className="p-2">{emp.id}</td>
                <td className="p-2">
                  <div>
                    <p className="font-medium text-xs">{emp.name}</p>
                    <p className="text-gray-500 text-[11px]">{emp.role}</p>
                  </div>
                </td>
                <td className="p-2">{emp.date}</td>
                <td
                  className={cn(
                    "p-2 font-medium",
                    emp.status === "Penalised" ? "text-red-500" : "text-green-600"
                  )}
                >
                  {emp.status}
                </td>
                <td className="p-2">{emp.location}</td>
                <td className="p-2">{emp.department}</td>
                <td className="p-2 text-blue-600 underline cursor-pointer">
                  {emp.discrepancy}
                </td>
                <td className="p-2">
                  <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-[11px] text-gray-600">
        Total: {employees.length} |{" "}
        <span className="font-medium text-gray-800">
          {selectedIds.length} Employees selected
        </span>
      </div>

      {/* ✅ Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-[380px] shadow-lg p-5 text-xs">
            <div className="flex items-start gap-2 mb-3">
              <div className="mt-[2px]">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              <div className="items-center">
                <p className="font-medium text-gray-800 mb-1 text-xs">
                  Attendance regularisation for {selectedIds.length} employee
                  {selectedIds.length > 1 ? "s" : ""}
                </p>
                <ul className="list-disc ml-5 text-gray-600 space-y-1">
                  <li>This will skip the approval chain for regularisation.</li>
                  <li>
                    Regularised employees will have attendance status as "R" in
                    reports.
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="text-[11px] px-3 py-1 bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="text-[11px] px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
