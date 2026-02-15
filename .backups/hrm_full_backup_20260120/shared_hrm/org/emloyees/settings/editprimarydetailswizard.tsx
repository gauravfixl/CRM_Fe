"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FieldConfig {
  id: number;
  name: string;
  type: string;
  required: boolean;
}

interface EditPrimaryDetailsWizardProps {
  isOpen: boolean;
  onClose: () => void;
  fields: Record<string, string>; // from parent (primaryDetails)
  onSave: (updated: Record<string, string>) => void;
}

export default function EditPrimaryDetailsWizard({
  isOpen,
  onClose,
  fields,
  onSave,
}: EditPrimaryDetailsWizardProps) {
  const [localFields, setLocalFields] = useState<FieldConfig[]>([]);
  const [selectedField, setSelectedField] = useState<FieldConfig | null>(null);

  // initialize local state when opened
  useEffect(() => {
    if (isOpen) {
      const fieldArray = Object.keys(fields).map((key, index) => ({
        id: index + 1,
        name: key,
        type: "Text",
        required: false,
      }));
      setLocalFields(fieldArray);
      setSelectedField(fieldArray[0]);
    }
  }, [fields, isOpen]);

  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      name: "",
      type: "Text",
      required: false,
    };
    setLocalFields([...localFields, newField]);
    setSelectedField(newField);
  };

  const handleRemoveField = (id: number) => {
    const updated = localFields.filter((f) => f.id !== id);
    setLocalFields(updated);
    if (selectedField?.id === id) setSelectedField(null);
  };

  const handleChange = (key: keyof FieldConfig, value: any) => {
    if (!selectedField) return;
    const updatedField = { ...selectedField, [key]: value };
    setSelectedField(updatedField);
    setLocalFields(localFields.map((f) => (f.id === updatedField.id ? updatedField : f)));
  };

  const handleSave = () => {
    const updated: Record<string, string> = {};
    localFields.forEach((f) => {
      if (f.name.trim()) updated[f.name] = fields[f.name] || "XXXXXXXXX";
    });
    onSave(updated);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-end z-50 ">
      <div className="w-[50%] bg-white h-full shadow-lg flex flex-col text-xs">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="font-semibold text-gray-700 text-sm">
            Edit Card – Primary Details
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Side List */}
          <div className="w-1/2 border-r overflow-y-auto p-2 space-y-1">
            {localFields.map((field) => (
              <div
                key={field.id}
                onClick={() => setSelectedField(field)}
                className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer ${
                  selectedField?.id === field.id
                    ? "bg-blue-50 border border-blue-300"
                    : "hover:bg-gray-50"
                }`}
              >
                <span className="truncate text-[11px] text-gray-700">
                  {field.name || "Untitled Field"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveField(field.id);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={10} />
                </button>
              </div>
            ))}

            <button
              onClick={handleAddField}
              className="flex items-center gap-1 text-blue-600 text-[11px] hover:underline mt-2"
            >
              + Add Field
            </button>
          </div>

          {/* Right Side Settings */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {selectedField ? (
              <>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={selectedField.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-[11px]"
                    placeholder="Enter field name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">
                    Field Type
                  </label>
                  <select
                    value={selectedField.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full border rounded px-2 py-1 text-[11px]"
                  >
                    <option>Text</option>
                    <option>Date</option>
                    <option>Dropdown</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={selectedField.required}
                    onChange={(e) => handleChange("required", e.target.checked)}
                    className="scale-90"
                  />
                  <span className="text-[11px] text-gray-700">
                    Required Field
                  </span>
                </div>
              </>
            ) : (
              <p className="text-[11px] text-gray-500">
                Select a field to configure
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-2 border-t flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-6 px-3"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="text-xs h-6 px-3 bg-blue-600 text-white"
            onClick={handleSave}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
