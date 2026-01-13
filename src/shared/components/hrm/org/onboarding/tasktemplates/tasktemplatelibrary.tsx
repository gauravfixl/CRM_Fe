import React, { useState } from "react";
import { Check, User, Plus, X } from "lucide-react";

interface Task {
  id: number;
  name: string;
  assigned: string;
  due: string;
  approver: string;
}

interface TaskTemplateLibraryProps {
  onClose: () => void; // close modal
  onAddTasks: (tasks: Task[]) => void; // add selected tasks
}

export default function TaskTemplateLibrary({ onClose, onAddTasks }: TaskTemplateLibraryProps) {
  const categories = [
    { id: "payroll", label: "Payroll Tasks (5)" },
    { id: "hr", label: "HR Tasks (10)" },
    { id: "admin", label: "Admin Tasks (3)" },
    { id: "manager", label: "Manager Tasks (2)" },
  ];

  const initialTasks: Record<string, Task[]> = {
    payroll: [
      { id: 1, name: "Submit IT Declaration", assigned: "Employee", due: "7d upon joining", approver: "Payroll Admin" },
      { id: 2, name: "Collect bank account details from employee", assigned: "Payroll Admin", due: "3d upon joining", approver: "NA" },
      { id: 3, name: "Enroll employee in benefit plans", assigned: "Payroll Admin", due: "2d upon joining", approver: "NA" },
      { id: 4, name: "Submit previous employment earnings details", assigned: "Employee", due: "7d upon joining", approver: "Payroll Admin" },
      { id: 5, name: "Create bank account for employee", assigned: "Payroll Admin", due: "7d upon joining", approver: "NA" },
    ],
    hr: Array.from({ length: 10 }).map((_, i) => ({ id: 100 + i, name: `HR Task ${i + 1}`, assigned: "HR Executive", due: `${i + 1}d upon joining`, approver: "NA" })),
    admin: [
      { id: 201, name: "Provision email ID", assigned: "Asset Manager", due: "1d upon joining", approver: "NA" },
      { id: 202, name: "Provide access to software accounts & tools", assigned: "Asset Manager", due: "1d upon joining", approver: "NA" },
      { id: 203, name: "Provide bio-metric access", assigned: "Asset Manager", due: "1d upon joining", approver: "NA" },
    ],
    manager: [
      { id: 301, name: "Assign a work buddy or mentor", assigned: "Reporting Manager", due: "1d upon joining", approver: "NA" },
      { id: 302, name: "Add new employee in team's email groups", assigned: "Reporting Manager", due: "1d upon joining", approver: "NA" },
    ],
  };

  const [selectedCategory, setSelectedCategory] = useState("payroll");
  const [selectedTasks, setSelectedTasks] = useState(new Set<number>());

  const tasks = initialTasks[selectedCategory];

  function toggleTask(id: number) {
    const s = new Set(selectedTasks);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelectedTasks(s);
  }

  function toggleAll() {
    if (selectedTasks.size === tasks.length) setSelectedTasks(new Set());
    else setSelectedTasks(new Set(tasks.map((t) => t.id)));
  }

  function handleAddTasks() {
    const selected = tasks.filter((t) => selectedTasks.has(t.id));
    onAddTasks(selected); // send selected tasks to parent
    onClose(); // close modal
  }

  return (
    <div className="w-full h-full bg-white text-gray-800">
      <div className="flex border border-transparent rounded shadow-sm overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r text-xs">
          <div className="px-4 py-4 font-semibold text-sm">Template Library</div>
          <nav className="px-3 pb-6 space-y-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelectedCategory(c.id); setSelectedTasks(new Set()); }}
                className={`w-full text-left rounded-md px-3 py-2 flex items-center justify-start gap-2 ${selectedCategory === c.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <span className="text-xs text-muted-foreground">{c.label}</span>
                <span className="ml-auto text-[11px] text-muted-foreground">›</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 text-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold">{categories.find(c => c.id === selectedCategory)?.label.split('(')[0].trim()}</h2>
              <div className="text-[11px] text-muted-foreground">{categories.find(c => c.id === selectedCategory)?.label}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-[11px] text-muted-foreground">{selectedTasks.size} Selected</div>
              <button
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs"
                onClick={handleAddTasks}
              >
                <Plus size={14} /> Add tasks
              </button>
              <button
                className="p-1 rounded-md hover:bg-gray-100"
                onClick={onClose}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Table header */}
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-[48px_1fr_180px_160px_48px] items-center bg-gray-50 px-3 py-2 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center">
                <input type="checkbox" className="w-3 h-3" checked={selectedTasks.size === tasks.length} onChange={toggleAll} />
              </div>
              <div>NAME OF TASK</div>
              <div>ASSIGNED TO</div>
              <div>DUE ON</div>
              <div>APPROVER</div>
            </div>

            <div className="divide-y">
              {tasks.map((t) => (
                <div key={t.id} className="grid grid-cols-[48px_1fr_180px_160px_48px] items-center px-3 py-3 text-xs">
                  <div className="flex items-center">
                    <input type="checkbox" className="w-3 h-3" checked={selectedTasks.has(t.id)} onChange={() => toggleTask(t.id)} />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-xs">{t.name}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px]"><User size={12} /></div>
                    <div className="text-[11px]">{t.assigned}</div>
                  </div>

                  <div className="text-[11px]">{t.due}</div>

                  <div className="flex items-center justify-between">
                    <div className="text-[11px]">{t.approver}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
