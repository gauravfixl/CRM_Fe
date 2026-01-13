"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface Field {
  id: number;
  label: string;
}

interface EditCardWizardProps {
  open: boolean;
  onClose: () => void;
  title: string;
  location?: string;
  initialFields: Field[];
  onSave: (updatedFields: Field[]) => void;
}

export default function EditCardWizard({
  open,
  onClose,
  title,
  location = "🇮🇳 India",
  initialFields,
  onSave,
}: EditCardWizardProps) {
  const [fields, setFields] = useState<Field[]>(initialFields);

  const handleAddField = () => {
    const newField = { id: Date.now(), label: "New Field" };
    setFields([...fields, newField]);
  };

  const handleRemoveField = (id: number) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleChangeField = (id: number, label: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, label } : f)));
  };

  const handleSave = () => {
    onSave(fields);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-4 text-xs fixed right-0 top-0 h-full rounded-none shadow-lg border-l overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            Edit Card – {title}
          </DialogTitle>
        </DialogHeader>

        <div className="bg-amber-100 border border-amber-300 text-amber-800 text-[11px] px-3 py-2 rounded mb-2">
          ⚠️ Changes made here will be reflected for everyone in the organisation
          with work location: {location}
        </div>

        {/* Fields list */}
        <div className="space-y-1 border rounded p-2 bg-white">
          <div className="text-[11px] font-semibold text-gray-700 mb-2">
            Fields and Properties
          </div>

          {fields.map((field) => (
            <div
              key={field.id}
              className="flex items-center justify-between gap-2 border rounded px-2 py-1 hover:bg-gray-50"
            >
              <Input
                value={field.label}
                onChange={(e) =>
                  handleChangeField(field.id, e.target.value)
                }
                className="text-[11px] h-6"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveField(field.id)}
                className="h-6 px-1 text-gray-500 hover:text-red-500"
              >
                <X size={12} />
              </Button>
            </div>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddField}
            className="text-blue-600 text-[11px] flex items-center gap-1 h-6 px-2"
          >
            <Plus size={12} /> Add Field
          </Button>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end mt-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-[11px]"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 text-white h-6 text-[11px]"
            onClick={handleSave}
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
