"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Props expected by this modal component
interface CreateWorkflowModalProps {
  open: boolean; // Controls visibility of the modal
  onClose: () => void; // Callback when modal should be closed
  onCreate: (data: { name: string; description: string }) => void; // Callback when user clicks "Create"
}

export default function CreateWorkflowModal({
  open,
  onClose,
  onCreate,
}: CreateWorkflowModalProps) {
  // Local state to hold the input values
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Disable "Create" button if name is empty or whitespace
  const isCreateDisabled = name.trim() === "";

  // When "Create" is clicked
  const handleCreate = () => {
    if (isCreateDisabled) return; // prevent if name is invalid

    // Call the onCreate function with trimmed values
    onCreate({
      name: name.trim(),
      description: description.trim(),
    });

    // Clear local input states
    setName("");
    setDescription("");

    // Close the modal
    onClose();
  };

  return (
  <Dialog open={open} onOpenChange={onClose}>
{open &&
      <DialogContent forceMount className="sm:max-w-lg">
   <DialogHeader>
  <DialogTitle>Create a workflow</DialogTitle>
  <DialogDescription>
    A workflow represents your team's process and determines how work moves through its lifecycle.
  </DialogDescription>
</DialogHeader>

        {/* Help text explaining what a workflow is */}
        {/* <p className="text-sm text-muted-foreground">
          A workflow represents your team's process and determines how work moves through its lifecycle.{" "}
          <a
            href="https://support.atlassian.com/jira-software-cloud/docs/what-are-workflows/"
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about workflows
          </a>
        </p> */}

        {/* Input for workflow name */}
        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Give your workflow a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Input for workflow description */}
        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium">Description</label>
          <Textarea
            placeholder="Give your workflow a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Buttons at the bottom */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isCreateDisabled} onClick={handleCreate}>
            Create
          </Button>
        </div>
      </DialogContent>}
    </Dialog>
  );
}
