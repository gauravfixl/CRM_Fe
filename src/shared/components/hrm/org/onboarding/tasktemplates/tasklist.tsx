"use client"

import { useState } from "react"
import Checklist from "./checklist"
import TaskTemplateLibrary from "./tasktemplatelibrary"
import CreateTaskModal from "./addtaskmodal"

export  function TaskTable() {
  const [tasks, setTasks] = useState<any[]>([]) // single source of truth for all tasks
  const [openChecklist, setOpenChecklist] = useState<number | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleAddTasksFromLibrary = (newTasks: any[]) => {
    console.log(newTasks, "Tasks from library")
    // Avoid duplicates
    const filtered = newTasks.filter((t) => !tasks.some((task) => task.id === t.id))
    setTasks([...tasks, ...filtered])
  }

  const handleCreateTask = (newTask: any) => {
    setTasks([...tasks, newTask])
  }

  return (
    <div className="p-4">
      {/* Action buttons */}
      <div className="flex space-x-2 mb-3">
        <button
          className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          onClick={() => setShowTemplateModal(true)}
        >
          Pick from Template
        </button>
        <button
          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
          onClick={() => setShowCreateModal(true)}
        >
          Create New Task
        </button>
      </div>

      {/* Task Table */}
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-muted/30 text-left">
            <th className="p-3">Task</th>
            <th className="p-3">Owner</th>
            <th className="p-3">When</th>
            <th className="p-3">Applies To</th>
            <th className="p-3">Checklist</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id} className="border-t hover:bg-muted/20">
              <td className="p-3">{t.name}</td>
             <td className="p-3">{t.owner || t.approver}</td>
<td className="p-3">{t.when || t.due}</td>

              <td className="p-3 space-x-1">
                {(Array.isArray(t.appliesTo) ? t.appliesTo : []).map((tag: string) => (
                  <span key={tag} className="bg-muted text-xs px-2 py-1 rounded-md">{tag}</span>
                ))}
              </td>
              <td className="p-3">
                {t.checklist?.enabled ? (
                  <button
                    className="text-blue-600 text-xs underline"
                    onClick={() => setOpenChecklist(openChecklist === t.id ? null : t.id)}
                  >
                    View
                  </button>
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
          {openChecklist !== null && (
            <tr>
              <td colSpan={5}>
                <Checklist
                  items={tasks.find((t) => t.id === openChecklist)?.checklist?.items || []}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowTemplateModal(false)}
          ></div>
          <div className="relative w-full h-full bg-white rounded-t-lg shadow-lg overflow-hidden animate-slide-up">
            <TaskTemplateLibrary
              onClose={() => setShowTemplateModal(false)}
              onAddTasks={handleAddTasksFromLibrary}
            />
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTask}
      />

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slide-up 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  )
}
