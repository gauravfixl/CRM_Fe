import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AddAutoAssignmentShiftWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const AddAutoAssignmentShiftWizard: React.FC<AddAutoAssignmentShiftWizardProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [shiftName, setShiftName] = useState("");
  const [shiftCode, setShiftCode] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState([
    { firstClockInFrom: "", firstClockInTo: "", duration: "00:00", shiftName: "" },
  ]);
  const [advancedSettings, setAdvancedSettings] = useState(false);

  const handleAddRow = () => {
    setRules([
      ...rules,
      { firstClockInFrom: "", firstClockInTo: "", duration: "00:00", shiftName: "" },
    ]);
  };

  const calculateDuration = (from: string, to: string) => {
    if (!from || !to) return "00:00";
    const [fh, fm] = from.split(":").map(Number);
    const [th, tm] = to.split(":").map(Number);
    let totalMinutes = (th * 60 + tm) - (fh * 60 + fm);
    if (totalMinutes < 0) totalMinutes += 24 * 60; // Handle next day wrap
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const handleRuleChange = (index: number, field: string, value: string) => {
    const updated = [...rules];
    const current = { ...updated[index], [field]: value };

    // Auto-calculate duration
    if (field === "firstClockInFrom" || field === "firstClockInTo") {
      current.duration = calculateDuration(current.firstClockInFrom, current.firstClockInTo);
    }

    updated[index] = current;
    setRules(updated);
  };

  const handleSave = () => {
    const data = {
      shiftName,
      shiftCode,
      description,
      rules,
      advancedSettings,
    };
    onSave(data);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 bg-white shadow-lg z-50 flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-2">
            <h2 className="text-sm font-medium text-primary">Add Auto Assignment Shift</h2>
            <button onClick={onClose}>
              <X className="w-4 h-4 text-gray-500 hover:text-primary" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 p-4 space-y-3 text-xs">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-500 mb-1">Shift Name</label>
                <input
                  type="text"
                  value={shiftName}
                  onChange={(e) => setShiftName(e.target.value)}
                  className="w-full border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Shift Code</label>
                <input
                  type="text"
                  value={shiftCode}
                  onChange={(e) => setShiftCode(e.target.value)}
                  className="w-full border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-500 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            {/* Rules Section */}
            <div>
              <h3 className="font-medium text-primary mb-2">Auto Shift Assignment Rules</h3>
              <div className="space-y-2">
                {rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-4 gap-2 border rounded-md p-2 bg-gray-50"
                  >
                    {/* Clock-In From */}
                    <input
                      type="time"
                      value={rule.firstClockInFrom}
                      onChange={(e) =>
                        handleRuleChange(idx, "firstClockInFrom", e.target.value)
                      }
                      className="border rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary"
                    />

                    {/* Clock-In To */}
                    <input
                      type="time"
                      value={rule.firstClockInTo}
                      onChange={(e) =>
                        handleRuleChange(idx, "firstClockInTo", e.target.value)
                      }
                      className="border rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary"
                    />

                    {/* Duration (Auto-calculated) */}
                    <input
                      type="text"
                      readOnly
                      value={rule.duration}
                      className="border rounded-md px-2 py-1 text-xs bg-gray-100 text-gray-600 cursor-not-allowed"
                    />

                    {/* Shift Name */}
                    <input
                      type="text"
                      placeholder="Shift Name"
                      value={rule.shiftName}
                      onChange={(e) =>
                        handleRuleChange(idx, "shiftName", e.target.value)
                      }
                      className="border rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddRow}
                className="mt-2 text-primary text-xs font-medium hover:underline"
              >
                + Add Row
              </button>
            </div>

            {/* Advanced Settings */}
            <div className="mt-4">
              <label className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={advancedSettings}
                  onChange={(e) => setAdvancedSettings(e.target.checked)}
                />
                <span>Configure advanced auto assigner settings</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end border-t p-3">
            <button
              onClick={onClose}
              className="px-3 py-1 text-xs rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="ml-2 px-3 py-1 text-xs rounded-md bg-primary text-white hover:opacity-90"
            >
              Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddAutoAssignmentShiftWizard;
