"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import WorkflowDiagram from "./WorkFlowDiagram";
import EditTransitionModal from "./EditTransitionModal";

// Define the shape of a Workflow
type Workflow = {
  id: string;
  name: string;
  description: string;
  lastModified: string;
  imageUrl: string;
};

type WorkflowModalProps = {
  open: boolean;
  onClose: () => void;
  initialView?: "text" | "image";
  workflow: Workflow | null;
  editable?: boolean; // <-- add this!
};

// Shared state & transition data


export default function WorkflowModal({
  open,
  onClose,
  initialView = "text",
  workflow,
  editable
}: WorkflowModalProps) {

  const [view, setView] = useState<"text" | "image">(initialView);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null); //editing the workflow  and showing modal
  const [editModalOpen, setEditModalOpen] = useState(false);//state to handle edit modal opening and closing
  const [editingFromKey, setEditingFromKey] = useState<string | null>(null);
  const [states, setStates] = useState([
    { key: "todo", name: "TO DO", category: "todo", color: "#FFD54F", order: 0 },
    { key: "in_review", name: "In Review", category: "in_review", color: "#BA68C8", order: 1 },
    { key: "in_progress", name: "In Progress", category: "in_progress", color: "#4FC3F7", order: 2 },
    { key: "done", name: "Done", category: "done", color: "#81C784", order: 3 },
  ]);

  const [transitions, setTransitions] = useState([
    { fromKey: "todo", toKey: "in_review" },
    { fromKey: "todo", toKey: "in_progress" },
    { fromKey: "todo", toKey: "done" },
    { fromKey: "in_review", toKey: "todo" },
    { fromKey: "in_review", toKey: "in_progress" },
    { fromKey: "in_review", toKey: "done" },
    { fromKey: "in_progress", toKey: "todo" },
    { fromKey: "in_progress", toKey: "in_review" },
    { fromKey: "in_progress", toKey: "done" },
    { fromKey: "done", toKey: "todo" },
    { fromKey: "done", toKey: "in_review" },
    { fromKey: "done", toKey: "in_progress" },
  ]);

  useEffect(() => {
    console.log("editable in modal to pass to diag", editable)
    setView(initialView);

  }, [initialView, open]);
  const handleNodeClick = (nodeId: string) => {
    console.log(editable, "editable in handlee node click")
    if (!editable) return;
    console.log("called node click");
    console.log("Clicked node:", nodeId);
    setSelectedNodeId(nodeId); // show side modal
    // show panel logic here
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {workflow?.name ? `Workflow: ${workflow.name}` : "Software Simplified Workflow"}
          </DialogTitle>
        </DialogHeader>

        {/* View Switcher */}
        <div className="flex justify-end mb-2 space-x-2">
          <Button variant={view === "text" ? "default" : "outline"} onClick={() => setView("text")}>
            Text View
          </Button>
          <Button
            variant={view === "image" ? "default" : "outline"}
            onClick={() => setView("image")}
          >
            Diagram View
          </Button>
        </div>

        {/* Conditional View */}
        {view === "text" ? (
          <div className="border rounded-lg">
            {/* Table Header */}
            <div className="grid grid-cols-3 font-semibold border-b p-2">
              <div>From</div>
              <div>Transition</div>
              <div>To</div>
            </div>


            {(() => {
              const stateKeys = states.map((s) => s.key);
              const grouped: Record<string, string[]> = {};

              // Group transitions by fromKey
              transitions.forEach(({ fromKey, toKey }) => {
                if (!grouped[fromKey]) grouped[fromKey] = [];
                grouped[fromKey].push(toKey);
              });

              return Object.entries(grouped).map(([fromKey, toKeys], i) => {
                const from = states.find((s) => s.key === fromKey);

                const mapsToAll =
                  toKeys.length === stateKeys.length - 1 &&
                  stateKeys.every((k) => k === fromKey || toKeys.includes(k));

                return mapsToAll ? (
                  <div key={i} className="grid grid-cols-3 border-b p-2 text-sm">
                    <div>
                      <span
                        className={`px-2 py-1 rounded ${from?.category === "todo"
                          ? "bg-gray-200 text-gray-700"
                          : from?.category === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                          }`}
                      >
                        {from?.name}
                      </span>
                    </div>
                    <div>→</div>
                    <div>
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800">All</span>
                    </div>
                  </div>
                ) : (
                  toKeys.map((toKey, j) => {
                    const to = states.find((s) => s.key === toKey);
                    return (
                      <div key={`${i}-${j}`} className="grid grid-cols-3 border-b p-2 text-sm">
                        <div>
                          <span
                            className={`px-2 py-1 rounded ${from?.category === "todo"
                              ? "bg-gray-200 text-gray-700"
                              : from?.category === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                              }`}
                          >
                            {from?.name}
                          </span>
                        </div>
                        <div>→</div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded ${to?.category === "todo"
                              ? "bg-gray-200 text-gray-700"
                              : to?.category === "in_progress"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                              }`}
                          >
                            {to?.name}
                          </span>
                        </div>
                      </div>
                    );
                  })
                );
              });
            })()}

          </div>
        ) : (
          <div className="relative w-full h-[400px] mt-4">
            <WorkflowDiagram
              states={states}
              transitions={transitions}

              onNodeClick={editable ? handleNodeClick : undefined}
            />
            {selectedNodeId && (
              <>
                <div className="absolute top-0 right-0 bg-white border-l w-64 h-[40%] shadow-lg p-3 z-10 flex flex-col justify-between text-sm">
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg"
                    onClick={() => setSelectedNodeId(null)}
                    aria-label="Close panel"
                  >
                    ✖
                  </button>

                  <div className="space-y-2 pr-2">
                    <div className="font-medium text-base truncate">
                      {states.find((s) => s.key === selectedNodeId)?.name || "Selected Node"}
                    </div>

                    <div className="text-gray-600">
                      Category: <strong>{states.find((s) => s.key === selectedNodeId)?.category}</strong>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full h-8 text-sm"
                      onClick={() => setEditModalOpen(true)}
                    >
                      ✏️ Edit
                    </Button>

                    <Button
                      variant="destructive"
                      className="w-full h-8 text-sm"
                      onClick={() => alert("Remove logic here for: " + selectedNodeId)}
                    >
                      🗑 Remove Status
                    </Button>
                  </div>
                </div>

                <EditTransitionModal
                  open={editModalOpen}
                  // Controls the visibility of the modal
                  onClose={() => setEditModalOpen(false)}

                  // Passes the selected node (fromKey) whose transitions are being edited
                  fromKey={selectedNodeId}

                  // All states are passed so that the modal can render checkboxes for them
                  states={states}

                  // This runs when the user clicks "Save" in the modal
                  onSave={(newToKeys) => {
                    // Remove all existing transitions *from* this node (we will recreate them)
                    const updated = transitions.filter(t => t.fromKey !== selectedNodeId);

                    // Create new transitions from the selected node to each chosen target node
                    const newTransitions = newToKeys.map((toKey) => ({
                      fromKey: selectedNodeId!, // `!` asserts it is not null
                      toKey,
                    }));

                    // Update transitions list: remove old ones from this node, add new ones
                    setTransitions([...updated, ...newTransitions]);

                    // Close the modal
                    setEditModalOpen(false);
                  }}

                  // NEW ✅: Pre-fill checkboxes in the modal by sending already connected nodes
                  existingTransitions={
                    transitions
                      .filter(t => t.fromKey === selectedNodeId) // Get all transitions *from* this node
                      .map(t => t.toKey)                         // Extract their target nodes
                  }
                />



              </>
            )}

            {/*edit workflow modal added to workflow diagram*/}

          </div>
        )}

        <DialogFooter className="mt-4">
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
