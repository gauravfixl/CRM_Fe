'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { updateWorkflow } from '@/hooks/workflowHooks';

interface UpdateWorkflowModalProps {
  open: boolean;
  onClose: () => void;
  workflowId: string;
  allStates: any[];
  transitions: any[];
  onSave: (updatedTransitions: any[]) => void;
}

// Helper to add order to transitions
const mapTransitionsWithOrder = (transitions: any[], allStates: any[]) => {
  return transitions.map(t => {
    const fromOrder = allStates.find(s => s.key === t.fromKey)?.order ?? 0;
    const toOrder = allStates.find(s => s.key === t.toKey)?.order ?? 0;
    return { ...t, fromOrder, toOrder };
  });
};

const UpdateWorkflowModal: React.FC<UpdateWorkflowModalProps> = ({
  open, onClose, workflowId, allStates, transitions, onSave
}) => {
  const [localTransitions, setLocalTransitions] = useState<any[]>([]);

  // Initialize localTransitions once when modal opens
  useEffect(() => {
    if (open) {
      const withOrder = mapTransitionsWithOrder(transitions, allStates);
      setLocalTransitions(withOrder);
    }
  }, [open, transitions, allStates]);

  const handleAddTransition = (fromKey: string, toKey: string) => {
    const fromStateObj = allStates.find(s => s.key === fromKey);
    const toStateObj = allStates.find(s => s.key === toKey);

    if (!fromStateObj || !toStateObj) {
      console.error("State not found", { fromKey, toKey });
      return;
    }

    const newTransition = {
      fromKey: fromStateObj.key,
      toKey: toStateObj.key,
      fromOrder: fromStateObj.order,
      toOrder: toStateObj.order
    };

    // Prevent duplicate transition
    setLocalTransitions(prev => {
      const exists = prev.some(t => t.fromKey === newTransition.fromKey && t.toKey === newTransition.toKey);
      return exists ? prev : [...prev, newTransition];
    });
  };

  const handleRemove = (idx: number) => {
    setLocalTransitions(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    try {
      const transitionsWithOrder = mapTransitionsWithOrder(localTransitions, allStates);

      const payload = {
        name: "workflow update",
        transitions: transitionsWithOrder
      };

      await updateWorkflow(workflowId, payload);

      onSave(transitionsWithOrder);
      onClose();
    } catch (error) {
      console.error("Failed to update workflow:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Workflow Transitions</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {allStates.map((state) => {
            const stateTransitions = localTransitions.filter(t => t.fromKey === state.key);

            return (
              <div key={state.key} className="border rounded-lg p-3">
                <h3 className="font-semibold">{state.name}</h3>

                {stateTransitions.length > 0 ? (
                  <ul className="list-disc ml-5 mt-2">
                    {stateTransitions.map((t, idx) => (
                      <li key={idx}>
                        {t.fromKey} → {t.toKey}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="ml-2"
                          onClick={() => handleRemove(localTransitions.indexOf(t))}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">No transitions yet.</p>
                )}

                <div className="mt-3">
                  <Select onValueChange={(val) => handleAddTransition(state.key, val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add transition to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allStates
                        .filter(s => s.key !== state.key)
                        .map(s => (
                          <SelectItem key={s.key} value={s.key}>
                            {s.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save All</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateWorkflowModal;