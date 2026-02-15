// CandidateDashboard.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DocumentUploadModal from "./documentuploadmodal";
import JourneyTimeline from "./journeyverification";

export default function CandidateDashboard() {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Submit PhotoID - IN", status: "Pending" },
    { id: 2, name: "Submit previous experience letters", status: "Pending" },
  ]);

  const [selectedTask, setSelectedTask] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardContent className="p-6">
          <h6 className="text-xs font-semibold">Welcome Aman Tiwari</h6>
          <p className=" text-muted-foreground text-xs">
            Keka HR helps your teams adapt, evolve, and scale effectively.
            Don’t rest until you give your best.
          </p>
        </CardContent>
      </Card>

      {/* TASKS */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-xs">Tasks</h3>
            <p className="text-sm text-muted-foreground">
              {tasks.filter((t) => t.status === "Completed").length}/{tasks.length} complete
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b text-xs">
                <th className="py-2">Name of the Task</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b">
                  <td className="py-2">{task.name}</td>
                  <td>Due today</td>
                  <td className={task.status === "Completed" ? "text-green-600" : "text-orange-500"}>
                    {task.status}
                  </td>
                  <td className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTaskClick(task)}
                    >
                      ➜
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Journey timeline */}
      <JourneyTimeline tasks={tasks} />

      {/* Modal for document upload */}
      {selectedTask && (
        <DocumentUploadModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
