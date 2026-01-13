"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

type State = {
  key: string;
  name: string;
  category: string;
};
type Props = {
  open: boolean;
  onClose: () => void;
  fromKey: string;
  states: State[];
  onSave: (toKeys: string[]) => void;
  existingTransitions: string[]; // ✅ props to show existing transiton
};


export default function EditTransitionModal({ open, onClose, fromKey, states ,onSave,existingTransitions}: Props) {
  const fromState = states.find((s) => s.key === fromKey);
  const filteredStates = states.filter((s) => s.key !== fromKey);

  const [selectedToKeys, setSelectedToKeys] = useState<string[]>([]);
 

  // handle toggle
  const toggleToKey = (key: string) => {
    if (selectedToKeys.includes(key)) {
      setSelectedToKeys((prev) => prev.filter((k) => k !== key));
    } else {
      setSelectedToKeys((prev) => [...prev, key]);
    }
  };

  // handle "All" checkbox
  const toggleAll = () => {
    if (selectedToKeys.length === filteredStates.length) {
      setSelectedToKeys([]);
    } else {
      setSelectedToKeys(filteredStates.map((s) => s.key));
    }
  };

 const handleSubmit = () => {
  console.log("Transition from:", fromKey, "to:", selectedToKeys);
  onSave(selectedToKeys); // <-- call parent's update function
};

  const isAllSelected = selectedToKeys.length === filteredStates.length;

useEffect(() => {
  if (open) {
    setSelectedToKeys(existingTransitions); // ✅ Pre-select the exisiting transition
  }
}, [open, existingTransitions]);


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transition</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* From Field */}
          <div>
            <label className="text-sm font-medium">From</label>
            <Input disabled value={fromState?.name || ""} />
          </div>

          {/* To Field with Multi-Checkbox */}
          <div>
            <label className="text-sm font-medium">To (select one or more)</label>
            <div className="border rounded p-2 max-h-48 overflow-y-auto space-y-2">
              {/* All option */}
              <div className="flex items-center space-x-2">
                <Checkbox id="all" checked={isAllSelected} onCheckedChange={toggleAll} />
                <label htmlFor="all" className="text-sm">All</label>
              </div>

              {/* Individual options */}
              {filteredStates.map((s) => (
                <div key={s.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={s.key}
                    checked={selectedToKeys.includes(s.key)}
                    onCheckedChange={() => toggleToKey(s.key)}
                  />
                  <label htmlFor={s.key} className="text-sm">{s.name}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
