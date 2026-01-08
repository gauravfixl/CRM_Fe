"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import RightDrawer from "@/components/custom/RightDrawer";
import { Mail, Phone, Edit2 } from "lucide-react";

export default function CandidateSummaryPage() {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  // ✅ Keep tasks in state so we can update them dynamically
  const [tasks, setTasks] = useState([
    { id: "1", name: "Submit PhotoID - IN", status: "Completed", owner: "Aman Tiwari" },
    { id: "2", name: "Submit previous experience letters", status: "Pending", owner: "Aman Tiwari" },
    { id: "3", name: "Upload resume", status: "Pending", owner: "Aman Tiwari" },
  ]);

  const toggleTaskSelection = (id: string, status: string) => {
    if (status === "Completed" || status === "Skipped") return; // Prevent selecting completed/skipped tasks
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const allPendingTasks = tasks.filter((t) => t.status === "Pending");
  const allSelected = selectedTasks.length === allPendingTasks.length;

  const toggleSelectAll = () => {
    setSelectedTasks(allSelected ? [] : allPendingTasks.map((t) => t.id));
  };

  // ✅ When user clicks “Skip”
  const handleSkipTasks = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        selectedTasks.includes(task.id) && task.status !== "Completed"
          ? { ...task, status: "Skipped" }
          : task
      )
    );
    setSelectedTasks([]);
    setOpenDrawer(false);
  };

  return (
    <div className="border rounded-lg p-0 bg-white text-xs">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex justify-between items-start border-b px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-yellow-500 text-white font-semibold text-sm">
            AT
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h2 className="font-medium text-gray-800 text-sm leading-tight">
                Aman Tiwari
              </h2>
              <Edit2 size={12} className="text-gray-400 cursor-pointer" />
            </div>

            <p className="text-[11px] text-gray-500">
              Sourced from Direct Offers by <span className="font-medium">Suhit Inty</span> on May 02, 2024
            </p>

            <div className="flex items-center gap-3 mt-1 text-gray-500">
              <div className="flex items-center gap-1">
                <Phone size={12} /> <span>+91 7981865105</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail size={12} /> <span>t.o.p.g.u.random@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-[10px] bg-orange-50 text-orange-700 rounded-full">
                Offer In Progress
              </span>
              <span className="px-2 py-1 text-[10px] bg-gray-100 text-gray-600 rounded-full">
                Waiting to create offer
              </span>
            </div>
          </div>
          <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
            Change Tasks
          </Button>
        </div>
      </div>

      {/* ================= TABS SECTION ================= */}
      <div className="flex items-center gap-6 border-b px-4 pt-2 pb-1 text-[11px] text-gray-600">
        <p className="cursor-pointer hover:text-blue-600 font-medium text-blue-600 border-b-2 border-blue-600 pb-1">
          Tasks
        </p>
        <p className="cursor-pointer hover:text-blue-600">Profile</p>
        <p className="cursor-pointer hover:text-blue-600">Messages</p>
        <p className="cursor-pointer hover:text-blue-600">Offer</p>
        <p className="cursor-pointer hover:text-blue-600">Documents</p>
        <p className="cursor-pointer hover:text-blue-600">Engagement</p>
        <p className="cursor-pointer hover:text-blue-600">Activity</p>
      </div>

      {/* ================= TASK LIST ================= */}
      <div className="p-4 space-y-4">
        {selectedTasks.length > 0 && (
          <div className="flex gap-2 items-center bg-blue-50 border px-3 py-2 rounded-md">
            <p className="text-xs font-medium">{selectedTasks.length} selected</p>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => setSelectedTasks([])}
            >
              Deselect All
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs bg-blue-600 text-white hover:bg-blue-700"
            >
              Remind
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => setOpenDrawer(true)}
            >
              Skip
            </Button>
          </div>
        )}

        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-3 py-2">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left px-3 py-2 font-medium">NAME OF THE TASK</th>
                <th className="text-left px-3 py-2 font-medium">TASK STATUS</th>
                <th className="text-left px-3 py-2 font-medium">OWNER</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      disabled={task.status === "Completed" || task.status === "Skipped"}
                      onCheckedChange={() => toggleTaskSelection(task.id, task.status)}
                    />
                  </td>
                  <td
                    className={`px-3 py-2 ${
                      task.status === "Completed" || task.status === "Skipped"
                        ? "text-gray-500"
                        : "text-blue-600 cursor-pointer hover:underline"
                    }`}
                  >
                    {task.name}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "Skipped"
                          ? "bg-gray-200 text-gray-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">{task.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= RIGHT DRAWER ================= */}
      <RightDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title="Skip Candidate Tasks"
        footerActions={[
          { label: "Cancel", variant: "outline", onClick: () => setOpenDrawer(false) },
          { label: "Skip", onClick: handleSkipTasks },
        ]}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-semibold">
            AT
          </div>
          <div>
            <p className="font-medium text-xs">Aman Tiwari</p>
            <p className="text-[10px] text-gray-500">Customer Success Management</p>
            <p className="text-[10px] text-gray-500">Hyderabad_2904</p>
          </div>
        </div>

        <table className="w-full text-xs border rounded-md overflow-hidden">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-3 py-2">NAME OF THE TASK</th>
              <th className="text-left px-3 py-2">TASK STATUS</th>
              <th className="text-left px-3 py-2">OWNER</th>
            </tr>
          </thead>
          <tbody>
            {tasks
              .filter((t) => selectedTasks.includes(t.id) && t.status !== "Completed")
              .map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="px-3 py-2">{t.name}</td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-1 rounded-full text-[10px] bg-orange-100 text-orange-700">
                      {t.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">{t.owner}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <p className="text-gray-500 bg-blue-50 border rounded-md text-[11px] p-2 mt-4">
          Tasks will be marked as <span className="font-semibold">"Skipped"</span> and task owner(s) do not need to complete them.
        </p>
      </RightDrawer>
    </div>
  );
}
