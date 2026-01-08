'use client';

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

// ----------------------
// Types and Interfaces
// ----------------------

// Workflow model used in the modal
export interface Workflow {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  imageUrl: string; // workflow diagram image
}

// Props expected by the AddExistingWorkflowModal
export interface AddExistingWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  onFinish: (selectedWorkflow: Workflow, issueTypes: string[]) => void;
}

// ----------------------
// Dummy data
// ----------------------

// Example workflows to select from
const workflows: Workflow[] = [
  {
    id: "1",
    name: "classic default workflow",
    description: "The classic JIRA default workflow",
    lastModified: "16/Apr/25 6:16 PM",
    imageUrl: "/images/classic-workflow.png",
  },
  {
    id: "2",
    name: "Builds Workflow",
    description: "Handles build pipelines",
    lastModified: "10/Apr/25 2:45 PM",
    imageUrl: "/images/builds-workflow.png",
  },
  // Add more workflows here as needed
];

// Issue types available to assign to workflows
const issueTypes = [
  { name: "Bug", icon: "🐞" },
  { name: "Epic", icon: "⚡" },
  { name: "Story", icon: "✅" },
  { name: "Sub-task", icon: "🔗" },
  { name: "Task", icon: "📝" },
];

// ----------------------
// Modal Component
// ----------------------

export default function AddExistingWorkflowModal({
  open,
  onClose,
  onFinish,
}: AddExistingWorkflowModalProps) {
  const [step, setStep] = useState(1); // 1: Select workflow, 2: Assign issue types
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [selectedIssueTypes, setSelectedIssueTypes] = useState<string[]>([]);

  // Toggle selection for an issue type
  const handleCheckboxToggle = (type: string) => {
    setSelectedIssueTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // Move to Step 2 if a workflow is selected
  const handleNext = () => {
    if (selectedWorkflow) setStep(2);
  };

  // Go back to Step 1
  const handleBack = () => setStep(1);

  // Finalize the selection and pass to parent via `onFinish`
  const handleFinish = () => {
    if (selectedWorkflow) {
      onFinish(selectedWorkflow, selectedIssueTypes); // send data to parent
      resetAndClose(); // cleanup
    }
  };

  // Reset modal state and close it
  const resetAndClose = () => {
    setStep(1);
    setSelectedWorkflow(null);
    setSelectedIssueTypes([]);
    onClose(); // call parent's onClose
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-3xl">
        {/* Step 1: Select a workflow */}
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle>Add Existing Workflow</DialogTitle>
            </DialogHeader>

            <div className="flex gap-6">
              {/* Left column: Workflow list */}
              <div className="w-1/2 max-h-80 overflow-auto border-r pr-2">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className={`px-3 py-2 cursor-pointer rounded-md ${
                      selectedWorkflow?.id === workflow.id
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    {workflow.name}
                  </div>
                ))}
              </div>

              {/* Right column: Preview of selected workflow */}
              <div className="w-1/2">
                {selectedWorkflow ? (
                  <>
                    <h2 className="text-lg font-medium mb-2">
                      {selectedWorkflow.name}
                    </h2>
                    <Image
                      src={selectedWorkflow.imageUrl}
                      alt="Workflow"
                      width={300}
                      height={300}
                      className="rounded-md border"
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      <strong>Description:</strong> {selectedWorkflow.description}
                      <br />
                      <strong>Last modified:</strong> {selectedWorkflow.lastModified}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a workflow to preview
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={resetAndClose}>
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={!selectedWorkflow}>
                Next
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Assign issue types */}
        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle>
                Assign Issue Types to "{selectedWorkflow?.name}"
              </DialogTitle>
            </DialogHeader>

            {/* Issue types selection table */}
            <div className="mt-2 max-h-64 overflow-auto">
              <table className="w-full text-sm border">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Issue Type</th>
                    <th className="p-2 text-left">Currently Assigned Workflow</th>
                  </tr>
                </thead>
                <tbody>
                  {issueTypes.map((type) => (
                    <tr key={type.name} className="border-b">
                      <td className="p-2 flex items-center gap-2">
                        <Checkbox
                          checked={selectedIssueTypes.includes(type.name)}
                          onCheckedChange={() => handleCheckboxToggle(type.name)}
                        />
                        <span>{type.icon}</span>
                        {type.name}
                      </td>
                      <td className="p-2">
                        Software Simplified Workflow for Project MP
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button
                onClick={handleFinish}
                disabled={selectedIssueTypes.length === 0}
              >
                Finish
              </Button>
              <Button variant="ghost" onClick={resetAndClose}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
