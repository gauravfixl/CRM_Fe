"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { TaskTable } from "./tasklist";
import { initialTasks } from "@/data/mockTasks";
import CreateTaskModal from "./addtaskmodal";

export default function TaskTemplates() {
  const [tasks, setTasks] = useState(initialTasks);
  const [open, setOpen] = useState(false);

  const handleAddTask = (newTask) => {
    setTasks((prev) => [...prev, { ...newTask, id: prev.length + 1 }]);
    setOpen(false);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Task Templates</h2>
          <p className="text-xs text-muted-foreground">
            List of tasks that will be assigned to candidates during onboarding
          </p>
        </div>
        {/* <Button size="sm" onClick={() => setOpen(true)}>
          + Add Task
        </Button> */}
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates">Task Templates</TabsTrigger>
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="templates">
          <TaskTable tasks={tasks} />
        </TabsContent>

        <TabsContent value="active">
          <p className="text-xs text-muted-foreground p-4">
            No active tasks yet.
          </p>
        </TabsContent>
      </Tabs>

      {/* ✅ Correct modal reference */}
      <CreateTaskModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={handleAddTask}
      />
    </div>
  );
}
