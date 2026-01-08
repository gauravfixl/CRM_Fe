"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AssignmentRuleModal({ open, onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // 👇 different selectable options for each group
  const groupOptions = {
    Department: ["HR", "Finance", "Engineering", "Sales", "Support"],
    Location: ["Hyderabad", "Delhi", "Bangalore", "Mumbai"],
    "Worker type": ["Full-time", "Contract", "Intern", "Consultant"],
    "Job title": ["Manager", "Developer", "Designer", "Analyst"],
    "Business unit": ["Keka Tech", "Keka HR", "Keka Payroll"],
    "Probation status": ["On Probation", "Confirmed", "Internship"],
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSave = () => {
    onSave({
      group: selectedGroup,
      include: selectedItems,
    });
    onClose();
    setStep(1);
    setSelectedGroup(null);
    setSelectedItems([]);
  };

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    setSelectedItems([]);
    handleNext();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 18 }}
            className="bg-white rounded-lg shadow-lg w-[420px] h-[500px] flex flex-col overflow-hidden text-xs"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b px-4 py-2">
              <h2 className="text-sm font-medium">Configure assignment rule</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            {/* Step 1: Select group */}
            {step === 1 && (
              <div className="p-4 flex-1 overflow-y-auto">
                <p className="mb-3 text-gray-600 text-xs">Select by group</p>
                {Object.keys(groupOptions).map((group) => (
                  <button
                    key={group}
                    onClick={() => handleGroupSelect(group)}
                    className="w-full text-left px-3 py-2 border rounded-md mb-2 hover:bg-gray-50"
                  >
                    {group}
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Select items for chosen group */}
            {step === 2 && (
              <div className="p-4 flex-1 overflow-y-auto">
                <p className="font-medium mb-2">Select {selectedGroup}</p>
                <div className="space-y-1">
                  {groupOptions[selectedGroup]?.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(opt)}
                        onChange={() =>
                          setSelectedItems((prev) =>
                            prev.includes(opt)
                              ? prev.filter((x) => x !== opt)
                              : [...prev, opt]
                          )
                        }
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  disabled={selectedItems.length === 0}
                  className="mt-4 w-full bg-blue-600 text-white py-1 rounded-md disabled:bg-gray-300"
                >
                  Add selected
                </button>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="p-4 flex-1 overflow-y-auto">
                <p className="font-medium mb-3">Review selections</p>
                <p className="text-gray-500 text-[11px] mb-2">Include:</p>
                <ul className="list-disc ml-5 space-y-1">
                  {selectedItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between items-center border-t px-4 py-2 text-xs">
              <div>
                {step > 1 && (
                  <button
                    onClick={handleBack}
                    className="text-gray-600 px-2 py-1 hover:underline"
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                {step === 3 && (
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
